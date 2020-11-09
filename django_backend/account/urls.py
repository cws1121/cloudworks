from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
from django.urls import path
from .views import RegisterAccount

urlpatterns = [
    path(r'token-auth/', obtain_jwt_token),
    path(r'token-refresh/', refresh_jwt_token),
    path(r'register/', RegisterAccount.as_view()),
]
