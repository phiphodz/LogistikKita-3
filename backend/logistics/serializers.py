from rest_framework import serializers
from django.db import transaction 
from .models import (
    Fleet, MasterPricingRule, MitraArmada, ArmadaKendaraan,
    Order, OrderCharge, Promo, CustomerProfile
)

# =================================================================
# 1. MASTER DATA (FLEET & PROMO)
# =================================================================

class FleetSerializer(serializers.ModelSerializer):
    """
    Serializer untuk menampilkan jenis armada di Homepage.
    """
    capacity_display = serializers.CharField(source='get_capacity_display', read_only=True)
    class Meta:
        model = Fleet
        fields = [
            'id', 'name', 'fleet_type', 
            'capacity', 'capacity_display', 
            'dimension', 'volume', 'description', 
            'image', 'order'
        ]

class PromoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promo
        fields = '__all__'

# =================================================================
# 2. MITRA REGISTRATION (LOGIKA SUPER)
# =================================================================
# Saya pertahankan logika 'Atomic Transaction' kamu karena itu bagus.
# Saya hanya sesuaikan sedikit import dan nama variabelnya.

class ArmadaKendaraanSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArmadaKendaraan
        fields = '__all__'
        read_only_fields = ['mitra', 'created_at']

class MitraArmadaSerializer(serializers.ModelSerializer):
    # --- WRITE ONLY FIELDS (Input dari Form) ---
    nopol = serializers.CharField(write_only=True)
    merk_tahun = serializers.CharField(write_only=True)
    jenis_armada_id = serializers.CharField(write_only=True) # ID Armada (bukan code lagi)
    panjang_bak = serializers.DecimalField(max_digits=4, decimal_places=1, write_only=True)
    lebar_bak = serializers.DecimalField(max_digits=4, decimal_places=1, write_only=True)
    tinggi_bak = serializers.DecimalField(max_digits=4, decimal_places=1, write_only=True)
    
    # Foto Kendaraan
    foto_depan = serializers.ImageField(write_only=True)
    foto_samping = serializers.ImageField(write_only=True)
    foto_belakang = serializers.ImageField(write_only=True)
    stnk_photo = serializers.ImageField(write_only=True)

    class Meta:
        model = MitraArmada
        fields = '__all__'
        read_only_fields = ['user', 'document_status', 'risk_status', 'rating_avg', 'admin_notes', 'joined_at']

    def create(self, validated_data):
        # 1. Pisahkan Data Kendaraan
        vehicle_fields = [
            'nopol', 'merk_tahun', 'jenis_armada_id', 'panjang_bak', 'lebar_bak', 
            'tinggi_bak', 'foto_depan', 'foto_samping', 'foto_belakang', 'stnk_photo'
        ]
        vehicle_data = {key: validated_data.pop(key) for key in vehicle_fields if key in validated_data}
        
        with transaction.atomic():
            # 2. Simpan Data Mitra
            mitra_instance = MitraArmada.objects.create(**validated_data)

            # 3. Cari Jenis Armada (Fleet)
            try:
                jenis_armada_id = vehicle_data.pop('jenis_armada_id')
                jenis_armada_obj = Fleet.objects.get(id=jenis_armada_id) # Cari by ID
            except (Fleet.DoesNotExist, ValueError):
                jenis_armada_obj = Fleet.objects.first() # Fallback

            # 4. Simpan Data Truk
            ArmadaKendaraan.objects.create(
                mitra=mitra_instance,
                jenis_armada=jenis_armada_obj,
                is_available=True,
                **vehicle_data
            )

        return mitra_instance

# =================================================================
# 3. ORDER & CHARGES (CORE LOGIC BARU)
# =================================================================

class OrderChargeSerializer(serializers.ModelSerializer):
    """
    Serializer untuk Reimbursement (Tol/Parkir).
    """
    class Meta:
        model = OrderCharge
        fields = ['id', 'order', 'category', 'charge_name', 'amount', 'proof_image', 'is_verified', 'admin_notes', 'created_at']
        read_only_fields = ['is_verified', 'admin_notes'] # Driver tidak bisa verifikasi sendiri

class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer LENGKAP untuk Detail Order (Customer View).
    Menampilkan status, driver info, dan total biaya.
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    driver_name = serializers.CharField(source='driver.full_name_ktp', read_only=True)
    driver_phone = serializers.CharField(source='driver.phone_number', read_only=True)
    vehicle_nopol = serializers.CharField(source='vehicle.nopol', read_only=True)
    vehicle_photo = serializers.ImageField(source='vehicle.foto_samping', read_only=True)
    
    charges = OrderChargeSerializer(many=True, read_only=True) # Nested list biaya tambahan

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'status_display', 'service_type',
            'origin_city', 'origin_address', 'dest_city', 'dest_address',
            'total_distance_km', 'item_description',
            
            # Info Driver
            'driver_name', 'driver_phone', 'vehicle_nopol', 'vehicle_photo',
            
            # Dokumen
            'is_doc_return', 'is_labor_needed',
            'factory_do_photo', 'pod_photo', 'pod_signature',
            
            # Keuangan
            'base_price', 'addons_price', 'reimbursement_total', 'final_total_price',
            'charges', # List Detail Tol/Parkir
            
            'created_at', 'updated_at'
        ]

class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer KHUSUS untuk Membuat Order Baru (Input User).
    Lebih ringkas, hanya field yang perlu diinput user.
    """
    vehicle_type_id = serializers.IntegerField(write_only=True) # Input ID Armada dari Frontend

    class Meta:
        model = Order
        fields = [
            'id', 
            'origin_city', 'origin_address', 'origin_lat', 'origin_lng',
            'dest_city', 'dest_address', 'dest_lat', 'dest_lng',
            'total_distance_km', 
            'vehicle_type_id', # Input
            'service_type', 'item_description', 
            'is_doc_return', 'is_labor_needed',
            'factory_do_photo'
        ]
        read_only_fields = ['id', 'status']

