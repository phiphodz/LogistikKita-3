# backend/logistics/models.py (KOREKSI FINAL CUSTOMER & CACHE)

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from decimal import Decimal 
import uuid 

# =================================================================
# 1. KONFIGURASI & PILIHAN
# =================================================================

FLEET_TYPE_CHOICES = (
    ('ECONOMY', 'Ekonomi (MPV / Blind Van)'),
    ('PICKUP', 'Pickup (Bak / Box)'),
    ('ENGKEL', 'Engkel CDE (4 Roda)'),
    ('DOUBLE', 'Double CDD (6 Roda)'),
    ('FUSO', 'Fuso / Truk Besar'),
    ('TRONTON', 'Tronton / Wingbox'),
    ('TRAILER', 'Trailer / Container'),
)

CAPACITY_CHOICES = (
    ('ECO_MPV', 'Ekonomi MPV (1.7m x 1m x 0.8m) - Max 350 Kg'),
    ('BLIND_VAN', 'Blind Van (GranMax) (2.1m x 1.5m x 1.2m) - Max 0.7 Ton / 4 m³'),
    ('PICKUP_BAK', 'Pickup Bak (2.4m x 1.6m x 1.2m) - Max 800 Kg / 5 m³'),
    ('PICKUP_BOX', 'Pickup Box (2.4m x 1.6m x 1.2m) - Max 1 Ton / 5 m³'),
    ('L300_BAK', 'Pickup L300 Bak (2.4m x 1.6m x 1.2m) - Max 1 Ton / 6 m³'),
    ('CDE_BAK', 'Engkel (CDE) Bak (3.1m x 1.6m x 1.6m) - Max 2.5 Ton / 9 m³'),
    ('CDE_BOX', 'Engkel (CDE) Box (3.1m x 1.7m x 1.7m) - Max 2.2 Ton / 9 m³'),
    ('CDD_BAK', 'Double (CDD) Bak (4.2m x 1.9m x 2m) - Max 5 Ton / 16 m³'),
    ('CDD_BOX', 'Double (CDD) Box (4.2m x 2m x 2m) - Max 5 Ton / 17 m³'),
    ('CDD_LONG', 'CDD Long Box (5.3m x 2m x 2.2m) - Max 5.5 Ton / 24 m³'),
    ('FUSO_BAK', 'Fuso Ringan Bak (5.7m x 2.3m x 2.3m) - Max 8 Ton / 30 m³'),
    ('FUSO_BOX', 'Fuso Ringan Box (5.7m x 2.3m x 2.3m) - Max 8 Ton / 30 m³'),
    ('FUSO_BERAT', 'Fuso Berat (Hino Ranger) (7m x 2.4m x 2.3m) - Max 15 Ton / 40 m³'),
    ('TRONTON_BAK', 'Tronton Bak (9.5m x 2.4m x 2.3m) - Max 18 Ton / 50 m³'),
    ('WINGBOX', 'Tronton Wingbox (9.4m x 2.4m x 2.4m) - Max 18 Ton / 55 m³'),
    ('TRAILER_20', 'Trailer 20 Feet (6m x 2.4m x 2.4m) - Max 20 Ton / 33 m³'),
    ('TRAILER_40', 'Trailer 40 Feet (12m x 2.4m x 2.4m) - Max 28 Ton / 67 m³'),
)

RISK_STATUS_CHOICES = (
    ('SAFE', '🟢 Aman / Verified'),
    ('CAUTION', '🟡 Waspada (Perlu Review)'),
    ('BLACKLIST', '🔴 Blacklist (Dilarang)'),
)

# =================================================================
# 2. MASTER DATA (ARMADA & PRICING RULES)
# =================================================================

class Fleet(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nama Armada")
    fleet_type = models.CharField(max_length=20, choices=FLEET_TYPE_CHOICES, default='PICKUP')
    capacity = models.CharField(max_length=50, choices=CAPACITY_CHOICES, default='CDE_BAK')
    
    # KONFIGURASI TOMTOM
    tomtom_travel_mode = models.CharField(
        max_length=10, 
        default='truck', 
        choices=[('truck', 'Truk Besar'), ('car', 'Mobil/Van')],
        help_text="Mode routing API TomTom"
    )
    max_weight_kg_limit = models.IntegerField(default=1000, verbose_name="Batas Berat Standar (Kg)")
    max_volume_cbm_limit = models.FloatField(default=5.0, verbose_name="Batas Volume Standar (m3)")
    
    # SURCHARGE (DENDA)
    surcharge_weight_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal('0.00'), 
        help_text="Biaya tambahan per Kg jika over weight"
    )
    surcharge_volume_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=Decimal('0.00'), 
        help_text="Biaya tambahan per m3 jika over volume"
    )

    dimension = models.CharField(max_length=100, blank=True, null=True, verbose_name="Dimensi Custom")
    volume = models.CharField(max_length=50, blank=True, null=True, verbose_name="Volume Custom")
    
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='fleets/', blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = "0. Master Data Jenis Armada"

    def __str__(self):
        return f"{self.name} | {self.get_capacity_display()}"

class MasterPricingRule(models.Model):
    fleet_type = models.CharField(max_length=20, choices=FLEET_TYPE_CHOICES, unique=True, verbose_name="Kategori Armada")
    
    # Komponen Harga Dasar (Safe Defaults)
    base_fare = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'), null=True, blank=True) 
    base_rate_per_km = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    min_distance_km = models.IntegerField(default=10)
    min_price_lumpsum = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    
    sla_express_multiplier = models.DecimalField(max_digits=3, decimal_places=2, default=Decimal('1.5'))

    loading_unloading_rate = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), null=True, blank=True) 
    doc_return_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'), null=True, blank=True)

    class Meta:
        verbose_name_plural = "0. Master Pricing Rules (HPP)"

    def __str__(self):
        return f"Rule: {self.get_fleet_type_display()} - Rp {self.base_rate_per_km}/km"


# =================================================================
# 3. PROFIL USER & LAINNYA 
# =================================================================

class CustomerProfile(models.Model):
    """
    KOREKSI: Menambahkan field city dan address dari form pendaftaran. 
    Field ini dibuat null=True dan blank=True untuk mengatasi error migrasi awal.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    phone_number = models.CharField(max_length=15, unique=True, verbose_name="Nomor WA (Username)")
    company_name = models.CharField(max_length=100, verbose_name="Nama Perusahaan/Shipper") # Wajib, bukan null
    
    # --- FIELD BARU DARI SIGNUP FORM ---
    city = models.CharField(max_length=100, verbose_name="Kota/Kabupaten Domisili", null=True, blank=True) # KOREKSI DI SINI
    address = models.TextField(verbose_name="Alamat Detail Perusahaan", null=True, blank=True) # KOREKSI DI SINI
    # ----------------------------------
    
    risk_status = models.CharField(max_length=20, choices=RISK_STATUS_CHOICES, default='CAUTION') # Default: CAUTION
    admin_risk_notes = models.TextField(blank=True)
    
    class Meta: 
        verbose_name_plural = "1. Data Customer (Shipper)"
    
    def __str__(self): return f"{self.user.first_name} ({self.company_name})"


class MitraArmada(models.Model):
    MITRA_TYPE_CHOICES = [('OWNER_OPERATOR', 'Pemilik Unit & Supir'), ('DRIVER', 'Supir')]
    DOCUMENT_STATUS_CHOICES = [('PENDING', 'Menunggu'), ('VERIFIED', 'Lolos'), ('REJECTED', 'Ditolak'), ('BLACKLISTED', 'Blacklist')]
    BANK_CHOICES = [('BCA', 'BCA'), ('BRI', 'BRI'), ('MANDIRI', 'Mandiri'), ('BNI', 'BNI'), ('LAINNYA', 'Lainnya')]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='mitra_profile')
    full_name_ktp = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=15, unique=True)
    emergency_name = models.CharField(max_length=100)
    emergency_phone = models.CharField(max_length=15)
    risk_status = models.CharField(max_length=20, choices=RISK_STATUS_CHOICES, default='CAUTION') # Default: CAUTION
    admin_risk_notes = models.TextField(blank=True)
    domicile_city = models.CharField(max_length=100, default="Jakarta")
    domicile_address = models.TextField()
    mitra_type = models.CharField(max_length=20, choices=MITRA_TYPE_CHOICES, default='OWNER_OPERATOR')

    ktp_photo = models.ImageField(upload_to='dokumen/ktp/')
    sim_photo = models.ImageField(upload_to='dokumen/sim/')
    selfie_photo = models.ImageField(upload_to='dokumen/selfie/')
    skck_photo = models.ImageField(upload_to='dokumen/skck/', blank=True, null=True)
    
    bank_name = models.CharField(max_length=20, choices=BANK_CHOICES, default='BCA')
    bank_account_number = models.CharField(max_length=50)
    bank_account_holder = models.CharField(max_length=150)
    
    document_status = models.CharField(max_length=20, choices=DOCUMENT_STATUS_CHOICES, default='PENDING')
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=5.0)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta: verbose_name_plural = "1. Data Mitra (Driver)"
    def __str__(self): return f"{self.full_name_ktp} | {self.get_document_status_display()}"

class ArmadaKendaraan(models.Model):
    mitra = models.ForeignKey(MitraArmada, on_delete=models.CASCADE, related_name='kendaraan_set')
    jenis_armada = models.ForeignKey(Fleet, on_delete=models.PROTECT, verbose_name="Jenis Truk")
    nopol = models.CharField(max_length=15, unique=True)
    merk_tahun = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)
    panjang_bak = models.DecimalField(max_digits=4, decimal_places=1)
    lebar_bak = models.DecimalField(max_digits=4, decimal_places=1)
    tinggi_bak = models.DecimalField(max_digits=4, decimal_places=1)
    stnk_photo = models.ImageField(upload_to='dokumen/stnk/')
    kir_photo = models.ImageField(upload_to='dokumen/kir/', blank=True, null=True)
    foto_depan = models.ImageField(upload_to='armada_fisik/')
    foto_samping = models.ImageField(upload_to='armada_fisik/')
    foto_belakang = models.ImageField(upload_to='armada_fisik/')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: verbose_name_plural = "2. Aset Kendaraan Mitra"
    def __str__(self): return f"{self.nopol} - {self.mitra.full_name_ktp}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Menunggu Konfirmasi'),
        ('SEARCHING_DRIVER', 'Mencari Driver'),
        ('DRIVER_ASSIGNED', 'Driver Menuju Lokasi'),
        ('ARRIVED_PICKUP', 'Sampai di Muat'),
        ('IN_TRANSIT', 'Dalam Perjalanan'),
        ('ARRIVED_DROP', 'Sampai di Tujuan'),
        ('DELIVERED', 'Selesai (POD Uploaded)'),
        ('COMPLETED', 'Order Tutup (Lunas)'),
        ('CANCELLED', 'Dibatalkan'),
    ]
    SERVICE_TYPE_CHOICES = [('STANDARD', 'Standard'), ('EXPRESS', 'Express')]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(User, on_delete=models.PROTECT, related_name='orders')
    driver = models.ForeignKey(MitraArmada, on_delete=models.SET_NULL, null=True, blank=True)
    vehicle = models.ForeignKey(ArmadaKendaraan, on_delete=models.SET_NULL, null=True, blank=True)

    origin_city = models.CharField(max_length=100)
    origin_address = models.TextField()
    origin_lat = models.FloatField(null=True, blank=True)
    origin_lng = models.FloatField(null=True, blank=True)

    dest_city = models.CharField(max_length=100)
    dest_address = models.TextField()
    dest_lat = models.FloatField(null=True, blank=True)
    dest_lng = models.FloatField(null=True, blank=True)
    
    total_distance_km = models.FloatField(default=0, help_text="Jarak Riil Google Maps")
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES, default='STANDARD')
    item_description = models.TextField(verbose_name="Deskripsi Muatan")
    is_doc_return = models.BooleanField(default=False, verbose_name="Butuh Surat Jalan Balik?")
    is_labor_needed = models.BooleanField(default=False, verbose_name="Butuh TKBM?")

    factory_do_photo = models.ImageField(upload_to='orders/do/', null=True, blank=True)
    pod_photo = models.ImageField(upload_to='orders/pod/', null=True, blank=True)
    pod_signature = models.ImageField(upload_to='orders/sig/', null=True, blank=True)
    
    base_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    addons_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reimbursement_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    final_total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    cancellation_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    driver_assigned_at = models.DateTimeField(null=True, blank=True)
    arrived_pickup_at = models.DateTimeField(null=True, blank=True)
    loaded_at = models.DateTimeField(null=True, blank=True)
    arrived_drop_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "3. Transaksi Order (Logistik)"
    
    def save(self, *args, **kwargs):
        self.final_total_price = self.base_price + self.addons_price + self.reimbursement_total
        super().save(*args, **kwargs)

    def __str__(self): return f"ORD-{str(self.id)[:8]} | {self.origin_city} -> {self.dest_city}"

class OrderCharge(models.Model):
    CHARGE_CATEGORY = [('REIMBURSEMENT', 'Reimbursement (Tol/Parkir)'), ('ADDON', 'Addon (Jasa)')]
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='charges')
    category = models.CharField(max_length=20, choices=CHARGE_CATEGORY, default='REIMBURSEMENT')
    charge_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    proof_image = models.ImageField(upload_to='orders/charges/', null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    admin_notes = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: verbose_name_plural = "4. Biaya Tambahan (Charges)"
    def __str__(self): return f"{self.charge_name} - Rp {self.amount}"

class Promo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    promo_code = models.CharField(max_length=20, unique=True)
    image = models.ImageField(upload_to='promos/')
    valid_until = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta: verbose_name_plural = "5. Promo & Voucher"
    def __str__(self): return f"{self.title} ({self.promo_code})"

# =================================================================
# 6. MODEL CACHING JARAK (KOREKSI MAX_DIGITS)
# =================================================================

class CachedDistance(models.Model):
    """
    KOREKSI: Max Digits dinaikkan jadi 12 agar muat Longitude 112.xxxxx
    """
    origin_lat = models.DecimalField(max_digits=12, decimal_places=8) 
    origin_lng = models.DecimalField(max_digits=12, decimal_places=8) 
    dest_lat = models.DecimalField(max_digits=12, decimal_places=8)   
    dest_lng = models.DecimalField(max_digits=12, decimal_places=8)   
    
    distance_km = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.IntegerField()
    toll_fee_idr = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    cached_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('origin_lat', 'origin_lng', 'dest_lat', 'dest_lng')
        verbose_name = "Cached Distance"

    def __str__(self):
        return f"Rute {self.distance_km}km"
