from rest_framework import serializers
from .models import CustomUser, UserProfile
from django.contrib.auth import get_user_model


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'


class CustomUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'profile']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['email', 'password', 'username']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user