from django.shortcuts import render
from rest_framework import viewsets
from .models import WMS_User, Store, Product, PickupOrder, Reward, Image
from .serializers import UserSerializer, StoreSerializer, ProductSerializer, PickupOrderSerializer, RewardSerializer, ImageSerializer



# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = WMS_User.objects.all()
    serializer_class = UserSerializer

# Store ViewSet
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

# Product ViewSet
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# Pickup Order ViewSet
class PickupOrderViewSet(viewsets.ModelViewSet):
    queryset = PickupOrder.objects.all()
    serializer_class = PickupOrderSerializer

# Reward ViewSet
class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer

# Image ViewSet
class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer
