from rest_framework import serializers
from account.models import User


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # {
    #     "email": "string",
    #     "password": "string",
    #     "fullName": "string",
    #     "confirmPassword": "string"
    # }
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password = validated_data['password'],
            # first_name=validated_data['first_name'],
            # last_name=validated_data['last_name']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
