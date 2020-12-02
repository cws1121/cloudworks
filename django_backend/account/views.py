from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import RegisterSerializer, RequestPasswordSerializer, UserSerializer, ResetPasswordSerializer
from account.models import User
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator


class RegisterAccount(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully.  Now perform Login to get your token",
        })


class RequestPassword(generics.GenericAPIView):
    serializer_class = RequestPasswordSerializer
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        form = PasswordResetForm(request.data)
        if form.is_valid():
            opts = {
                'use_https': request.is_secure(),
                'token_generator': default_token_generator,
                'from_email': None,
                'request': request,
                'html_email_template_name': 'emails/password_reset_email.html',
                'email_template_name': 'emails/password_reset_email.html',
            }
            form.save(**opts)

        return Response('Success!', status=status.HTTP_200_OK)


class ResetPassword(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    authentication_classes = []
    model = User

    def get_object(self, email=None, token=None):
        try:
            user = User.objects.filter(email=email).first()
        except User.DoesNotExist:
            user = None
        if user is not None and default_token_generator.check_token(user, token):
            return user
        return None

    def post(self, request, *args, **kwargs):
        self.object = self.get_object(*request.data.get('token').split(':', 1))
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not serializer.data.get("confirmPassword") == serializer.data.get("password"):
            return Response({"confirmPassword": ["Password does not match the confirm password."]}, status=status.HTTP_400_BAD_REQUEST)

        self.object.set_password(serializer.data.get("password"))
        self.object.save()
        response = {
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Password updated successfully'
        }

        return Response(response)


class UpdatePassword(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    authentication_classes = []
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not self.object.check_password(serializer.data.get("old_password")):
            return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
        self.object.set_password(serializer.data.get("new_password"))
        self.object.save()
        response = {
            'status': 'success',
            'code': status.HTTP_200_OK,
            'message': 'Password updated successfully'
        }

        return Response(response)
