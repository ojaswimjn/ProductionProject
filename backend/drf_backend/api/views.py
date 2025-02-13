from django.shortcuts import render
from rest_framework import viewsets, status
from .models import WMS_User, Store, Product, PickupOrder, Reward, Image
from .serializers import UserRegistrationSerializer, UserLoginSerializer, WMSUserSerializer, StoreSerializer, ProductSerializer, PickupOrderSerializer, RewardSerializer, ImageSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate


class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data = request.data)
        if serializer.is_valid(raise_exception =True):
            user = serializer.save()
            return Response({'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data= request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password =serializer.data.get('password')
            user = authenticate(email=email, password=password)
            if user is not None:
                return Response({'sucess':'Login Successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors': ['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        


# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = WMS_User.objects.all()
    serializer_class = WMSUserSerializer

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
