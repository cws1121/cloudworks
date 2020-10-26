from django.conf.urls import url, include
from rdt.api import views

urlpatterns = [
    url(r'^ingest/(?P<dsn>\w{1,50})/test_session/(?P<guid>\w{1,50})/media/(?P<media_id>\w{1,50})/', views.IngestMedia.as_view()),
    url(r'^ingest/(?P<dsn>\w{1,50})/test_session/(?P<guid>\w{1,50})/', views.IngestTestSession.as_view()),
]
