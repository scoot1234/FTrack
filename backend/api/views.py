from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, AllowanceSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Allowance


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    

class AllowanceListCreate(generics.ListCreateAPIView):
    serializer_class = AllowanceSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Allowance.objects.filter(author = user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class AllowanceDelete(generics.DestroyAPIView):
    serializer_class = AllowanceSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Allowance.objects.filter(author = user)
    
class AllowanceUpdate(generics.UpdateAPIView):
    serializer_class = AllowanceSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Allowance.objects.filter(author = user)
    
    def perform_update(self, serializer):
        return serializer.save()