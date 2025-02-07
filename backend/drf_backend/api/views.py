from django.shortcuts import render
from rest_framework import viewsets
from api.models import User
from api.serializers import UserSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer