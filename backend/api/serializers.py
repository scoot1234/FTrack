from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Allowance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username', 'password', 'email']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class AllowanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Allowance
        fields = ['id', 'allowance', 'type', 'recommended', 'networth', 'created_at', 'author', 'monthlyspent']
        extra_kwargs = {'author': {'read_only':True}}