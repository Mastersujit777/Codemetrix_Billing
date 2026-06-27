"""
Django settings for the CodeMetrix Billing project.

This Django layer only persists the app's data in PostgreSQL and serves the
existing static front-end (HTML + JS + assets) unchanged. All billing logic,
GST maths, numbering and rendering still live in the front-end JavaScript;
Django simply replaces the browser's localStorage with a database.
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent


# --- tiny .env loader (no external dependency) ---------------------------------
def _load_dotenv(path):
    if not path.exists():
        return
    for line in path.read_text(encoding='utf-8').splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, _, val = line.partition('=')
        key, val = key.strip(), val.strip().strip('"').strip("'")
        os.environ.setdefault(key, val)


_load_dotenv(BASE_DIR / '.env')


SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'dev-only-codemetrix-billing-secret-change-me',
)

DEBUG = os.environ.get('DJANGO_DEBUG', '1') == '1'

ALLOWED_HOSTS = os.environ.get(
    'DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1,[::1]'
).split(',')


# Our own app + the auth stack (sessions + users) needed to gate access.
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'billing',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': False,
        'OPTIONS': {'context_processors': []},
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'codemetrix_billing'),
        'USER': os.environ.get('DB_USER', 'postgres'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'rocky'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# The front-end posts the whole state (which may include a base64 UPI-QR image),
# so allow a generous request body.
DATA_UPLOAD_MAX_MEMORY_SIZE = 25 * 1024 * 1024  # 25 MB

# --- Authentication ---
LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/login/'
