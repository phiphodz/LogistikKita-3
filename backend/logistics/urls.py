# /backend/logistics/urls.py (KOREKSI ENDPOINT CUSTOMER)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FleetListAPIView, PublicTrackingView, PromoListView,
    MitraRegistrationView, OrderViewSet, OrderChargeCreateView,
    SimulasiHargaView, GeocodeLocationView, 
    
    # 🚨 PENTING: IMPORT SEMUA VIEW CUSTOMER/AUTH BARU 🚨
    CustomerRegistrationView, 
    CustomerVerificationView,
    CustomerResendVerificationView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
)

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order') 

urlpatterns = [
    # API PUBLIK (Hapus prefix 'api/')
    path('fleets/', FleetListAPIView.as_view(), name='public-fleets'), # Jadi /api/fleets/
    path('promos/', PromoListView.as_view(), name='public-promos'),
    path('simulasi-harga/', SimulasiHargaView.as_view(), name='simulasi-harga'), 
    path('geocode/', GeocodeLocationView.as_view(), name='geocode-autocomplete'), 
    path('tracking/', PublicTrackingView.as_view(), name='public-tracking'),

    # API MITRA & ORDER
    path('mitra/register/', MitraRegistrationView.as_view(), name='mitra-register'),
    path('orders/charges/', OrderChargeCreateView.as_view(), name='upload-charge'),
    
    # 🚨 ENDPOINT CUSTOMER BARU (SOLUSI 404 NOT FOUND)
    path('customer/register/', CustomerRegistrationView.as_view(), name='customer-register'),
    path('customer/verify/', CustomerVerificationView.as_view(), name='customer-verify'),
    path('customer/resend-verification/', CustomerResendVerificationView.as_view(), name='customer-resend-verify'),
    
    # 🚨 ENDPOINT PASSWORD RECOVERY (untuk ForgotPasswordPage & ResetPasswordPage)
    path('password/reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # URL dari Router
    path('', include(router.urls)),
]

