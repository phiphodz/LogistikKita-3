import os

from django.core.wsgi import get_wsgi_application

# Ini harus menunjuk ke file settings yang sudah kita perbaiki
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'logistik_core.settings')

application = get_wsgi_application()

