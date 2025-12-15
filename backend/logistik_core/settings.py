# backend/logistik_core/settings.py (KODE LENGKAP - REVISI FINAL PROFESIONAL)

import os
from pathlib import Path
from dotenv import load_dotenv 
import dj_database_url 
from datetime import timedelta 

# ==========================================================
# KONFIGURASI ENVIRONTMENT VARIABLES
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR.parent / '.env'
load_dotenv(dotenv_path=ENV_PATH) 

SECRET_KEY = os.environ.get('SECRET_KEY') 
if not SECRET_KEY:
     # WARNING: Jangan gunakan kunci default ini di Production!
     SECRET_KEY = 'django-insecure-kunci-default-untuk-dev-aman'

DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

# Memastikan akses dari Codespace dan localhost
ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third Party
    'rest_framework',
    'rest_framework_simplejwt', 
    'corsheaders', 
    
    # Local Apps
    'logistics',
    # Tambahkan Customer/Mitra Apps jika sudah dibuat di models.py
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Wajib diletakkan di atas SecurityMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'logistik_core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'logistik_core.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Jakarta'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==========================================================
# KONFIGURASI KEAMANAN KHUSUS & EXTERNAL KEYS
# ==========================================================

CORS_ALLOW_ALL_ORIGINS = False 
CORS_ALLOW_CREDENTIALS = True

# --- KONFIGURASI CORS PROFESIONAL: MENGIZINKAN SEMUA CODESPACE ORIGIN ---
CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://.*\.app\.github\.dev$', # Mengizinkan semua port Codespace (5173, 8001, dll.)
]

CSRF_TRUSTED_ORIGINS = [
    'https://*.app.github.dev',
    'https://*.github.dev',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

TOMTOM_API_KEY = os.environ.get('TOMTOM_API_KEY')


# ==========================================================
# TAMBAHAN 4: KONFIGURASI EMAIL (Verifikasi & Reset Password)
# ==========================================================
# Wajib untuk workflow Customer Signup dan Forgot Password

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' 
# Gunakan console backend di DEV agar email tampil di terminal:
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' 

# Konfigurasi SMTP (Hanya dijalankan jika DEBUG=False)
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = os.environ.get('EMAIL_PORT')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@logistikkita.com')


# ==========================================================
# KONFIGURASI JWT (SISTEM LOGIN)
# ==========================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60), # Access token singkat
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True, 
    'BLACKLIST_AFTER_ROTATION': True, 
    'AUTH_HEADER_TYPES': ('Bearer',),
}
