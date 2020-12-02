from rest_framework import serializers
from account.models import User


class RegisterSerializer(serializers.ModelSerializer):
    fullName = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'fullName')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password = validated_data['password'],
            full_name=validated_data['fullName'],
            current_workspace_id=1
        )
        return user


class RequestPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class ResetPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    confirmPassword = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
