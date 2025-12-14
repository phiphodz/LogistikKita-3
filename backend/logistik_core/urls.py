# backend/logistik_core/urls.py (KOREKSI PREFIX API)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# --- TAMBAHAN: IMPORT UNTUK FITUR LOGIN (JWT) ---
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # KOREKSI UTAMA: Tambahkan prefix 'api/' di sini
    path('api/', include('logistics.urls')), 
    
    # URL /api/token/ sudah benar di sini
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Konfigurasi Media (Gambar) saat Development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
