# backend/logistik_core/settings.py

import os
from pathlib import Path
from dotenv import load_dotenv 
import dj_database_url 
from datetime import timedelta 

# ==========================================================
# KONFIGURASI ENVIRONTMENT VARIABLES
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ PERBAIKAN 1: Load .env dari backend/.env (bukan root)
ENV_PATH = BASE_DIR / '.env'  # ← DARI backend/.env
load_dotenv(dotenv_path=ENV_PATH)

print(f"🔧 Loading .env from: {ENV_PATH}")
print(f"🔍 DEBUG from env: {os.environ.get('DEBUG')}")

# ✅ PERBAIKAN 2: Handle boolean dengan benar
DEBUG_STR = os.environ.get('DEBUG', 'True')
DEBUG = DEBUG_STR.lower() in ('true', '1', 'yes', 't')

# ✅ PERBAIKAN 3: SECRET_KEY dengan validation
SECRET_KEY = os.environ.get('SECRET_KEY', '').strip()
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-dev-fallback-key-change-in-production'
        print("⚠️  WARNING: Using development SECRET_KEY")
    else:
        raise ValueError("SECRET_KEY is required in production!")

# ✅ PERBAIKAN 4: Parse ALLOWED_HOSTS dari string ke list
ALLOWED_HOSTS_STR = os.environ.get('ALLOWED_HOSTS', '.app.github.dev,localhost,127.0.0.1')
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_STR.split(',')]

# Warning jika masih pakai default SECRET_KEY
if SECRET_KEY.startswith('django-insecure-buat-string-acak'):
    print("⚠️  ⚠️  ⚠️  WARNING: Please change the default SECRET_KEY in .env file!")
    if not DEBUG:
        raise ValueError("Default SECRET_KEY not allowed in production!")

# ==========================================================
# APPLICATION & MIDDLEWARE (TETAP SAMA)
# ==========================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt', 
    'corsheaders', 
    'logistics',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# WhiteNoise untuk static files di production
if not DEBUG:
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

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

# ==========================================================
# DATABASE
# ==========================================================

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
# STATICFILES_DIRS = [
# BASE_DIR / "static",  # Untuk development
#]

# Untuk production di Codespace
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media Files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==========================================================
# KONFIGURASI CORS & KEAMANAN
# ==========================================================

# ✅ PERBAIKAN 5: Baca CORS_ALLOW_ALL_ORIGINS dari .env
CORS_ALLOW_ALL_ORIGINS_STR = os.environ.get('CORS_ALLOW_ALL_ORIGINS', 'True')
CORS_ALLOW_ALL_ORIGINS = CORS_ALLOW_ALL_ORIGINS_STR.lower() in ('true', '1', 'yes', 't')

CORS_ALLOW_CREDENTIALS = True

# ✅ PERBAIKAN 6: Parse CORS_ALLOWED_ORIGINS dari .env
CORS_ALLOWED_ORIGINS_STR = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if CORS_ALLOWED_ORIGINS_STR:
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in CORS_ALLOWED_ORIGINS_STR.split(',')]
else:
    CORS_ALLOWED_ORIGINS = []

CORS_ALLOWED_ORIGIN_REGEXES = [
    r'^https://.*\.app\.github\.dev$',
]

CSRF_TRUSTED_ORIGINS = [
    'https://*.app.github.dev',
    'https://*.github.dev',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]

TOMTOM_API_KEY = os.environ.get('TOMTOM_API_KEY')  # ← NAMA SESUAI .env

# ==========================================================
# KONFIGURASI EMAIL
# ==========================================================

# Gunakan console backend di DEV agar email tampil di terminal:
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend' 
    print("📧 Email Backend: Console (development)")
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    
    # Konfigurasi SMTP (Hanya dijalankan jika DEBUG=False)
    EMAIL_HOST = os.environ.get('EMAIL_HOST', '').strip()
    EMAIL_PORT = os.environ.get('EMAIL_PORT', '').strip()
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('true', '1', 'yes', 't')
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '').strip()
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '').strip()
    DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'no-reply@logistikkita.com').strip()
    
    # Validasi email config hanya di production
    required_email_vars = ['EMAIL_HOST', 'EMAIL_HOST_USER', 'EMAIL_HOST_PASSWORD']
    missing = [var for var in required_email_vars if not os.environ.get(var)]
    if missing:
        print(f"⚠️  WARNING: Missing email config: {missing}")
        # Fallback ke console
        EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
        print("📧 Email Backend: Fallback to Console (missing config)")
    else:
        print("📧 Email Backend: SMTP (production)")

# ==========================================================
# KONFIGURASI JWT (SISTEM LOGIN)
# ==========================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Untuk development
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True, 
    'BLACKLIST_AFTER_ROTATION': True, 
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# ==========================================================
# LOGGING (Opsional - untuk debugging)
# ==========================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO' if DEBUG else 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ==========================================================
# PRINT CONFIG SUMMARY
# ==========================================================

print(f"✅ DEBUG Mode: {DEBUG}")
print(f"🌐 Allowed Hosts: {ALLOWED_HOSTS}")
print(f"🔗 CORS Allowed Origins: {CORS_ALLOWED_ORIGINS}")
print(f"🔗 CORS Allow All Origins: {CORS_ALLOW_ALL_ORIGINS}")
print(f"🗄️  Database: {DATABASES['default']['ENGINE']}")
print("=" * 50)
print("🚀 Django Settings Loaded Successfully!")
print("=" * 50)
