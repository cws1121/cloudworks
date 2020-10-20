SECRET_KEY = 'django_secret_key'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'cloudworks',
        'USER': 'postgres',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '',
    }
}

CORS_ORIGIN_ALLOW_ALL = True
DEBUG = True
