from django.conf.urls import url, include
from rdt.api import views

urlpatterns = [
    url(r'^ingest/(?P<dsn>[0-9A-Za-z_\-]+)/test_session/(?P<guid>[0-9A-Za-z_\-]+)/media/(?P<media_id>[0-9A-Za-z_\-]+)/',
        views.IngestMedia.as_view(), name='ingest_media'),
    url(r'^ingest/(?P<dsn>[0-9A-Za-z_\-]+)/test_session/(?P<guid>[0-9A-Za-z_\-]+)/logs/', views.IngestLogs.as_view(),
        name='ingest_logs'),
    url(r'^ingest/(?P<dsn>[0-9A-Za-z_\-]+)/test_session/(?P<guid>[0-9A-Za-z_\-]+)/', views.IngestTestSession.as_view(),
        name='ingest_test_session'),
]
