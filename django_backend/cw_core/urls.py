import os
from pathlib import Path
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.views.static import serve
from cw_core import views
from .router import router

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    url(r'^', include('rdt.urls'))
]

urlpatterns += [
    url(r'^$', views.FrontEndRenderer.as_view()),
    url(r'^a/', views.FrontEndRenderer.as_view()),
    url(r'^(?P<path>.*)$', serve, {'document_root': os.path.join(Path(__file__).resolve().parent, 'static')})
]
