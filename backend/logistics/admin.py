from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Fleet, MasterPricingRule, 
    CustomerProfile, MitraArmada, ArmadaKendaraan, 
    Order, OrderCharge, Promo
)

# =================================================================
# 1. KONFIGURASI TAMPILAN WARNA (HELPER)
# =================================================================
def get_risk_color_html(risk_status, display_text):
    """Helper untuk menampilkan label warna berdasarkan resiko"""
    colors = {
        'SAFE': 'green',
        'CAUTION': '#FFC107', # Kuning Emas
        'BLACKLIST': 'red',
    }
    color = colors.get(risk_status, 'black')
    weight = 'bold' if risk_status == 'BLACKLIST' else 'normal'
    return format_html(
        '<span style="color: {}; font-weight: {};">{}</span>',
        color, weight, display_text
    )

# =================================================================
# 2. MASTER DATA & PRICING
# =================================================================

@admin.register(Fleet)
class FleetAdmin(admin.ModelAdmin):
    list_display = ('name', 'fleet_type', 'capacity', 'order')
    list_editable = ('order',) 
    list_filter = ('fleet_type',)

@admin.register(MasterPricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    list_display = ('fleet_type', 'base_rate_per_km', 'sla_express_multiplier', 'doc_return_fee')
    list_editable = ('base_rate_per_km', 'sla_express_multiplier') 
    list_filter = ('fleet_type',)
    help_text = "HPP Driver & Multiplier Harga"

# =================================================================
# 3. MANAJEMEN RISIKO USER (SOLUSI ERROR E122)
# =================================================================

@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    # SOLUSI E122: risk_status wajib ada di list_display agar bisa di list_editable
    list_display = ('user_info', 'phone_number', 'company_name', 'risk_status', 'risk_label')
    list_editable = ('risk_status',) 
    list_filter = ('risk_status',)
    search_fields = ('user__username', 'user__first_name', 'phone_number', 'company_name')

    def user_info(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name} ({obj.user.username})"
    user_info.short_description = "Nama User"

    def risk_label(self, obj):
        return get_risk_color_html(obj.risk_status, obj.get_risk_status_display())
    risk_label.short_description = "Status Resiko"


class ArmadaInline(admin.StackedInline):
    model = ArmadaKendaraan
    extra = 0
    can_delete = False

@admin.register(MitraArmada)
class MitraArmadaAdmin(admin.ModelAdmin):
    # SOLUSI E122: risk_status wajib ada di list_display agar bisa di list_editable
    list_display = ('full_name_ktp', 'phone_number', 'mitra_type', 'risk_status', 'risk_label', 'document_status')
    list_filter = ('risk_status', 'document_status', 'mitra_type')
    search_fields = ('full_name_ktp', 'phone_number')
    list_editable = ('risk_status', 'document_status') # Sekarang aman
    
    inlines = [ArmadaInline]

    def risk_label(self, obj):
        return get_risk_color_html(obj.risk_status, obj.get_risk_status_display())
    risk_label.short_description = "Risk Status"

# =================================================================
# 4. OPERASIONAL ORDER & KEUANGAN
# =================================================================

class OrderChargeInline(admin.TabularInline):
    model = OrderCharge
    extra = 0
    fields = ('category', 'charge_name', 'amount', 'proof_image', 'is_verified')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id_short', 'customer', 'driver', 'rute_perjalanan', 'final_total_price', 'status_colored')
    list_filter = ('status', 'service_type', 'created_at')
    search_fields = ('id', 'origin_city', 'dest_city')
    readonly_fields = ('final_total_price', 'total_distance_km')
    
    inlines = [OrderChargeInline]

    def id_short(self, obj):
        return str(obj.id)[:8]
    id_short.short_description = "Order ID"

    def rute_perjalanan(self, obj):
        return f"{obj.origin_city} ➝ {obj.dest_city}"
    
    def status_colored(self, obj):
        color = 'green' if obj.status == 'COMPLETED' else 'orange' if 'PENDING' in obj.status else 'black'
        return format_html('<span style="color: {};">{}</span>', color, obj.get_status_display())
    status_colored.short_description = "Status"

@admin.register(OrderCharge)
class OrderChargeAdmin(admin.ModelAdmin):
    list_display = ('charge_name', 'amount', 'order', 'is_verified')
    list_editable = ('is_verified',)
    list_filter = ('is_verified', 'category')

@admin.register(Promo)
class PromoAdmin(admin.ModelAdmin):
    list_display = ('title', 'promo_code', 'valid_until', 'is_active')
    list_filter = ('is_active',)
