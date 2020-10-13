from django.conf.urls import url
from rest_framework import routers
from django.urls import include, path
from rest_framework.authtoken import views as authtoken_views

from rdt import views


router = routers.DefaultRouter()
router.register(r'test_session', views.TestSessionViewSet)
router.register(r'test_result', views.TestResultViewSet)


urlpatterns = [
  path('api/', include(router.urls)),
  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

  # The obtain_auth_token view will return a JSON response
  # when valid username and password fields are POSTed to the view using form data or JSON:
  # { 'token' : '9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b' }
  path('api-token-auth/', authtoken_views.obtain_auth_token),

  url(r'^$', views.FrontEndRenderer.as_view()),
  url(r'^a/', views.FrontEndRenderer.as_view()),
]
