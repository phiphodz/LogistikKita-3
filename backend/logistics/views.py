# /backend/logistics/views.py (UPDATED WITH JWT TOKEN)

from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.throttling import AnonRateThrottle 
from rest_framework_simplejwt.tokens import RefreshToken  # ← TAMBAH IMPORT INI
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.contrib.auth.models import User
from django.db import transaction
from django.core.mail import send_mail 
from django.template.loader import render_to_string 
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.db.models import Q
from decimal import Decimal
import requests
import math
import logging
import os 
import uuid 

# 🚨 PERBAIKAN IMPORT: Aktifkan import model CustomerProfile
from .models import (
    Fleet, MasterPricingRule, MitraArmada,
    Order, OrderCharge, Promo, CachedDistance,
    CustomerProfile  # <--- SUDAH DIAKTIFKAN
)

# Import Serializers (Tetap sama)
from .serializers import (
    FleetSerializer, MitraArmadaSerializer,
    OrderSerializer, OrderCreateSerializer,
    OrderChargeSerializer, PromoSerializer
)

logger = logging.getLogger(__name__)

# ===========================================================
# 0. FUNGSI UTILITAS: TOMTOM & PRICING (Kode ini tetap sama)
# ===========================================================
def get_tomtom_route(lat1, lon1, lat2, lon2, travel_mode='truck'):
    """
    Mengambil jarak & waktu via TomTom API.
    """
    api_key = getattr(settings, 'TOMTOM_API_KEY', None) or os.getenv('TOMTOM_API_KEY')
    if not api_key:
        logger.error("TOMTOM_API_KEY tidak ditemukan!")
        return None

    url = f"https://api.tomtom.com/routing/1/calculateRoute/{lat1},{lon1}:{lat2},{lon2}/json"
    params = {
        'key': api_key,
        'travelMode': travel_mode,
        'traffic': 'true',
        'routeType': 'fastest'
    }

    if travel_mode == 'truck':
        params.update({
            'vehicleWeight': 12000, 
            'vehicleLength': 12,    
            'vehicleWidth': 2.5
        })

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        summary = data['routes'][0]['summary']
        
        return {
            "distance_km": round(summary['lengthInMeters'] / 1000, 2),
            "duration_minutes": round(summary['travelTimeInSeconds'] / 60),
            "toll_fee_idr": 0 
        }
    except Exception as e:
        logger.error(f"TomTom API Error: {e}")
        return None


def calculate_shipping_cost(distance_km, fleet_id, service_type="STANDARD", is_corporate=False):
    """
    Logic hitung harga cadangan untuk OrderViewSet.
    """
    try:
        fleet = Fleet.objects.get(id=fleet_id)
        rule = MasterPricingRule.objects.get(fleet_type=fleet.fleet_type)
    except Exception:
        return Decimal(0), Decimal(0), "ERROR_NO_RULE"
    
    base_fare = rule.base_fare or Decimal(0)
    base_rate_per_km = rule.base_rate_per_km or Decimal(0)
    min_price_lumpsum = rule.min_price_lumpsum or Decimal(0)

    distance_cost = Decimal(distance_km) * base_rate_per_km
    raw_hpp = base_fare + distance_cost
    final_hpp = max(raw_hpp, min_price_lumpsum)
    selling_price = final_hpp / (1 - Decimal("0.20"))

    if service_type == "EXPRESS":
        selling_price *= (rule.sla_express_multiplier or Decimal('1.5'))

    if is_corporate:
        selling_price = selling_price / (1 - Decimal("0.02"))

    return round(selling_price, -3), final_hpp, "OK"


# ===========================================================
# 1. SIMULASI HARGA (PRICING ENGINE UTAMA) (Kode ini tetap sama)
# ===========================================================
class SimulasiHargaView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            o_lat = round(Decimal(request.data.get("origin_lat")), 4)
            o_lng = round(Decimal(request.data.get("origin_lng")), 4)
            d_lat = round(Decimal(request.data.get("dest_lat")), 4)
            d_lng = round(Decimal(request.data.get("dest_lng")), 4)
            fleet_id = request.data.get("fleet_id")
            input_weight = float(request.data.get("weight") or 0) 
            input_volume = float(request.data.get("volume") or 0)
        except (TypeError, ValueError):
            return Response({"error": "Data koordinat/input tidak valid"}, status=400)

        try:
            fleet = Fleet.objects.get(id=fleet_id)
            pricing_rule = MasterPricingRule.objects.get(fleet_type=fleet.fleet_type)
        except Exception:
            return Response({"error": "Data Armada atau Rule Harga tidak ditemukan"}, status=500)

        cache = CachedDistance.objects.filter(
            origin_lat=o_lat, origin_lng=o_lng,
            dest_lat=d_lat, dest_lng=d_lng
        ).first()

        route_data = None
        is_cached = False

        if cache:
            route_data = {
                "distance_km": float(cache.distance_km),
                "duration_minutes": cache.duration_minutes
            }
            is_cached = True
        else:
            route_data = get_tomtom_route(
                o_lat, o_lng, d_lat, d_lng, 
                travel_mode=fleet.tomtom_travel_mode 
            )

            if not route_data:
                return Response({"error": "Gagal menghitung rute (Cek API Key/Jarak)"}, status=500)

            CachedDistance.objects.create(
                origin_lat=o_lat, origin_lng=o_lng,
                dest_lat=d_lat, dest_lng=d_lng,
                distance_km=route_data['distance_km'],
                duration_minutes=route_data['duration_minutes'],
                toll_fee_idr=0
            )

        distance = Decimal(route_data['distance_km'])
        base_fare = pricing_rule.base_fare or Decimal(0)
        base_rate_per_km = pricing_rule.base_rate_per_km or Decimal(0)
        min_price_lumpsum = pricing_rule.min_price_lumpsum or Decimal(0)
        base_cost = (distance * base_rate_per_km) + base_fare
        final_base_price = max(base_cost, min_price_lumpsum)

        surcharge_weight = Decimal(0)
        surcharge_volume = Decimal(0)
        
        if input_weight > fleet.max_weight_kg_limit:
            over_kg = Decimal(input_weight - fleet.max_weight_kg_limit)
            surcharge_weight = over_kg * (fleet.surcharge_weight_price or Decimal(0))

        if input_volume > fleet.max_volume_cbm_limit:
            over_cbm = Decimal(input_volume - fleet.max_volume_cbm_limit)
            surcharge_volume = over_cbm * (fleet.surcharge_volume_price or Decimal(0))

        total_hpp = final_base_price + surcharge_weight + surcharge_volume
        selling_price = total_hpp / Decimal("0.8")

        return Response({
            "estimated_price": math.ceil(selling_price),
            "distance_km": route_data['distance_km'],
            "duration_minutes": route_data['duration_minutes'],
            "duration_text": f"{route_data['duration_minutes'] // 60} jam {route_data['duration_minutes'] % 60} menit",
            "details": {
                "base_price": math.ceil(final_base_price / Decimal("0.8")),
                "surcharge_weight": math.ceil(surcharge_weight / Decimal("0.8")),
                "surcharge_volume": math.ceil(surcharge_volume / Decimal("0.8")),
                "is_cached": is_cached,
                "travel_mode": fleet.tomtom_travel_mode
            }
        })


# ===========================================================
# 2. GEOCODE (AUTOCOMPLETE) (Kode ini tetap sama)
# ===========================================================
class GeocodeLocationView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        query = request.query_params.get("q", "")
        if len(query) < 3: return Response([])

        api_key = getattr(settings, 'TOMTOM_API_KEY', None) or os.getenv('TOMTOM_API_KEY')
        url = f"https://api.tomtom.com/search/2/search/{query}.json"
        
        try:
            r = requests.get(url, params={'key': api_key, 'countrySet': 'ID', 'limit': 5}, timeout=5)
            data = r.json()
            results = []
            for item in data.get('results', []):
                results.append({
                    "label": item['address']['freeformAddress'],
                    "lat": item['position']['lat'],
                    "lng": item['position']['lon']
                })
            return Response(results)
        except Exception: 
            return Response([])


# ===========================================================
# 3. MITRA REGISTRATION (Kode ini tetap sama)
# ===========================================================

class RegistrationThrottle(AnonRateThrottle):
    rate = '5/min'

class MitraRegistrationView(APIView):
    permission_classes = [AllowAny] 
    throttle_classes = [RegistrationThrottle] 

    def post(self, request):
        data = request.data
        phone = data.get('phone_number', '').strip()
        name = data.get('full_name_ktp', '').strip()
        mitra_type = data.get('mitra_type', 'OWNER_OPERATOR')

        if not phone or not name:
            return Response({"error": "Nama dan Nomor WA wajib diisi!"}, status=400)
        if len(name) < 3:
            return Response({"error": "Nama terlalu pendek."}, status=400)
        if not phone.isdigit() or len(phone) < 9:
            return Response({"error": "Nomor WhatsApp tidak valid (harus angka, min 9 digit)."}, status=400)

        if User.objects.filter(username=phone).exists() or MitraArmada.objects.filter(phone_number=phone).exists():
            return Response({"error": "Nomor WhatsApp ini sudah terdaftar."}, status=409) 

        try:
            with transaction.atomic():
                password = data.get('password', 'LogistikUser123!') 
                if not password:
                    return Response({"error": "Password wajib diisi."}, status=400)

                user = User.objects.create_user(username=phone, email=data.get('email', ''), password=password, first_name=name)
                user.is_active = True 

                MitraArmada.objects.create(
                    user=user,
                    full_name_ktp=name,
                    phone_number=phone,
                    mitra_type=mitra_type,
                    emergency_name="-", emergency_phone="-", 
                    domicile_address="-", bank_account_number="-", 
                    bank_account_holder="-", document_status='PENDING'
                )
            
            return Response({"message": "Pendaftaran Mitra Berhasil! Akun non-aktif menunggu verifikasi Admin."}, status=201)

        except Exception as e:
            logger.error(f"Register Error: {e}")
            return Response({"error": f"Gagal mendaftar: {str(e)}"}, status=500)


# ===========================================================
# 4. CUSTOMER AUTHENTICATION (VIEWS FINAL TERINTEGRASI) 🌟
# ===========================================================

# --- FUNGSI UTILITY: KIRIM EMAIL VERIFIKASI ---
def send_verification_email(user, request):
    current_site = request.META.get('HTTP_HOST') 
    
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    verification_link = f"{request.scheme}://{current_site}/verify-account?uid={uid}&token={token}"
    
    mail_subject = 'Aktifkan Akun Shipper Logistik Kita Anda'
    message = render_to_string('logistics/account_verification_email.html', {
        'user': user,
        'verification_link': verification_link,
        'domain': current_site
    })
    
    send_mail(mail_subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
    
# -----------------------------------------------

class CustomerRegistrationView(APIView):
    """
    Endpoint: /api/customer/register/
    Mendaftarkan Customer (Shipper) dengan AUTO AKTIF dan JWT TOKEN.
    """
    permission_classes = [AllowAny]
    throttle_classes = [RegistrationThrottle] 

    def post(self, request):
        data = request.data
        username = data.get('username', '').strip() # No WA
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Data Customer Profile yang diambil dari form
        full_name = data.get('full_name', '').strip()
        company_name = data.get('company_name', '').strip()
        city = data.get('city', '').strip()
        address = data.get('address', '').strip()
        customer_type = data.get('customer_type', 'personal')

        # 1. Validasi Input Dasar
        if not all([username, email, password, full_name, company_name, city, address]) or len(password) < 8:
            return Response({"error": "Semua data pendaftaran wajib diisi lengkap."}, status=400)

        # 2. Cek Duplikat Email/Username (No WA)
        if User.objects.filter(Q(username=username) | Q(email=email)).exists():
            return Response({"error": "Username (No WA) atau Email sudah terdaftar."}, status=409)

        try:
            with transaction.atomic():
                # A. Buat User baru - AUTO AKTIF (is_active=True)
                user = User.objects.create_user(
                    username=username, 
                    email=email, 
                    password=password, 
                    first_name=full_name,
                    is_active=True  # ← AUTO AKTIF UNTUK DEVELOPMENT
                )
                
                # B. Buat CustomerProfile
                CustomerProfile.objects.create(
                    user=user,
                    phone_number=username, 
                    company_name=company_name,
                    city=city,
                    address=address,
                    risk_status='SAFE'  # ← LANGSUNG SAFE KARENA AUTO VERIFY
                )
                
                # C. OPTIONAL: Kirim Email Verifikasi (console saja)
                # send_verification_email(user, request)
            
            # 🚀 GENERATE JWT TOKEN UNTUK AUTO LOGIN
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Pendaftaran berhasil! Akun telah aktif.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "name": user.first_name,
                    "customer_type": customer_type
                }
            }, status=201)

        except Exception as e:
            logger.error(f"Customer Registration Error: {e}")
            return Response({"error": f"Gagal mendaftar: {str(e)}"}, status=500)


class CustomerVerificationView(APIView):
    """
    Endpoint: /api/customer/verify/
    Mengaktifkan akun Customer menggunakan token dari email.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')

        if not uidb64 or not token:
            return Response({"detail": "Token atau UID tidak ditemukan."}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Tautan verifikasi tidak valid atau user tidak ditemukan."}, status=400)

        # Cek Validitas Token
        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            
            # Update status risk menjadi SAFE setelah verifikasi email
            try:
                profile = user.customer_profile
                profile.risk_status = 'SAFE'
                profile.save()
            except CustomerProfile.DoesNotExist:
                 logger.error(f"CustomerProfile not found for user {user.username} during verification.")
            
            return Response({"message": "Akun berhasil diaktifkan! Anda dapat login sekarang."}, status=200)
        else:
            return Response({"detail": "Token kadaluarsa atau tidak valid. Minta kirim ulang."}, status=400)


class CustomerResendVerificationView(APIView):
    """
    Endpoint: /api/customer/resend-verification/
    Mengirim ulang email verifikasi.
    """
    permission_classes = [AllowAny]
    throttle_classes = [RegistrationThrottle]

    def post(self, request):
        email = request.data.get('email', '').strip()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "Jika email ditemukan, kami telah mengirim ulang verifikasi."}, status=200)

        if user.is_active:
            return Response({"detail": "Akun ini sudah aktif, silakan login."}, status=409)

        try:
            send_verification_email(user, request)
            return Response({"message": "Email verifikasi berhasil dikirim ulang."}, status=200)
        except Exception:
            return Response({"detail": "Gagal mengirim email. Coba lagi nanti."}, status=500)


class PasswordResetRequestView(APIView):
    """
    Endpoint: /api/password/reset/
    Meminta email reset password (langkah 1).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = request.data.get('email') or request.data.get('username')
        
        try:
            user = User.objects.get(Q(email=identifier) | Q(username=identifier))
        except User.DoesNotExist:
            return Response({"message": "Jika akun terdaftar, instruksi reset telah dikirim."}, status=200)
        
        logger.info(f"Simulasi: Email reset password dikirim ke {user.email}")
        return Response({"message": "Jika akun terdaftar, instruksi reset telah dikirim."}, status=200)


class PasswordResetConfirmView(APIView):
    """
    Endpoint: /api/password/reset/confirm/
    Konfirmasi token reset password dan ubah password (langkah 2).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        new_password2 = request.data.get('new_password2')

        if new_password != new_password2:
            return Response({"detail": "Password baru tidak cocok."}, status=400)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Tautan reset tidak valid."}, status=400)
        
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Kata sandi berhasil diubah."}, status=200)
        else:
            return Response({"detail": "Token reset kadaluarsa atau tidak valid."}, status=400)


# ===========================================================
# 5. VIEW STANDAR LAINNYA (Kode ini tetap sama)
# ===========================================================

class FleetListAPIView(generics.ListAPIView):
    queryset = Fleet.objects.all().order_by("order")
    serializer_class = FleetSerializer
    permission_classes = [AllowAny]

class PublicTrackingView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        short_id = request.query_params.get("id")
        if not short_id: return Response({"error": "ID Kosong"}, 400)
        order = Order.objects.filter(id__startswith=short_id).first()
        if not order: return Response({"error": "Resi tidak ditemukan"}, 404)
        return Response({
            "order_id": str(order.id),
            "status": order.get_status_display(),
            "origin": order.origin_city,
            "dest": order.dest_city
        })

class PromoListView(generics.ListAPIView):
    queryset = Promo.objects.filter(is_active=True)
    serializer_class = PromoSerializer
    permission_classes = [AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    def get_serializer_class(self): return OrderCreateSerializer if self.action == "create" else OrderSerializer
    def get_queryset(self): return Order.objects.filter(customer=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        data = serializer.validated_data
        is_corp = False
        if hasattr(self.request.user, "customer_profile"):
            is_corp = self.request.user.customer_profile.risk_status == "SAFE"
        
        price, _, _ = calculate_shipping_cost(
            data["total_distance_km"], 
            self.request.data.get("vehicle_type_id"), 
            data.get("service_type", "STANDARD"), 
            is_corp
        )
        serializer.save(customer=self.request.user, base_price=price, final_total_price=price, status="PENDING")

class OrderChargeCreateView(generics.CreateAPIView):
    queryset = OrderCharge.objects.all()
    serializer_class = OrderChargeSerializer
    permission_classes = [IsAuthenticated]
    def perform_create(self, serializer): serializer.save(is_verified=False)
