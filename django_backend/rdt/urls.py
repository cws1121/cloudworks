from django.conf.urls import url

from rdt import views

urlpatterns = [
  url(r'^$', views.FrontEndRenderer.as_view()),
  url(r'^a/', views.FrontEndRenderer.as_view()),
  url(r'^test_session/$', views.testSessionsApi),
  url(r'^test_session/([0-9]+)$', views.testSessionsApi)
]
