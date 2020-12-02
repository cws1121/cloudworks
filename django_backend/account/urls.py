from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
from django.urls import path
from account import views

urlpatterns = [
    path(r'token-auth/', obtain_jwt_token),
    path(r'token-refresh/', refresh_jwt_token),
    path(r'register/', views.RegisterAccount.as_view()),
    path(r'request-pass/', views.RequestPassword.as_view()),
    path(r'reset-pass/', views.ResetPassword.as_view()),
]
