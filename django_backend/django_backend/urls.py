import os
from pathlib import Path
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include, re_path
from django.views.static import serve
from django_backend import views


urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^', include('rdt.urls'))
]

urlpatterns += [
    url(r'^$', views.FrontEndRenderer.as_view()),
    url(r'^a/', views.FrontEndRenderer.as_view()),
    url(r'^(?P<path>.*)$', serve, {'document_root': os.path.join(Path(__file__).resolve().parent, 'static')})
]
