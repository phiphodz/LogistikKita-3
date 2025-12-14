# backend/logistik_core/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static # IMPORT INI UNTUK STATIC & MEDIA

# --- TAMBAHAN: IMPORT UNTUK FITUR LOGIN (JWT) ---
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Akses Admin: /admin/
    path('admin/', admin.site.urls),
    
    # Akses API Logistics: /api/...
    path('api/', include('logistics.urls')), 
    
    # URL Login & Refresh Token: /api/token/
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Konfigurasi STATIC dan Media HANYA saat Development (settings.DEBUG = True)
# Ini memastikan CSS Admin dan gambar Media bisa ditampilkan.
if settings.DEBUG:
    # Melayani STATIC FILES (CSS, JS Admin)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Melayani MEDIA FILES (Gambar yang diupload)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
