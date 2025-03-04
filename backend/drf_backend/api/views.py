from django.shortcuts import render
from rest_framework import viewsets, status
from .models import  Store, WasteItem, WasteCategory, PickUpSlot, Reward, Image, PickupRequest, Reedemption
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePasswordSerializer ,WasteItemSerializer,  WasteCategorySerializer, StoreSerializer, PickUpSlotSerializer, RewardSerializer, ImageSerializer, PickUpRequestSerializer, ReedemptionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from api.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser


#generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data = request.data)
        if serializer.is_valid(raise_exception =True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token':token, 'success': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data= request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password =serializer.data.get('password')
            user = authenticate(email=email, password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token': token , 'sucess':'Login Successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'errors':{'non_field_errors': ['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        


class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):    
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data = request.data, 
        context = {'user':request.user})
        if serializer.is_valid(raise_exception = True):
            return Response({'success': 'Password changed successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)


#Image
class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    #post
    def post(self, request, format=None):
        data = request.data.copy()  # Create a mutable copy of request data
        data['user_id'] = request.user.id  # Set user ID from token

        serializer = ImageSerializer(data= data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'sucess': 'Image uploaded successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #get
    def get(self, request, format=None):
        images = Image.objects.filter(user_id=request.user)
        serializer = ImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    


    # def post(self, request, format=None):

# Image ViewSet
# class ImageViewSet(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer

# WasteItem ViewSet
class WasteCategoryViewSet(viewsets.ModelViewSet):
    queryset = WasteCategory.objects.all()
    serializer_class = WasteCategorySerializer  

# WasteItem ViewSet
class WasteItemViewSet(viewsets.ModelViewSet):
    queryset = WasteItem.objects.all()
    serializer_class = WasteItemSerializer

#PickUp Request ViewSet
class PickupRequestViewSet(viewsets.ModelViewSet):
    queryset = PickupRequest.objects.all()
    serializer_class = PickUpRequestSerializer

# Pickup Order ViewSet
class PickUpSlotViewSet(viewsets.ModelViewSet):
    queryset = PickUpSlot.objects.all()
    serializer_class = PickUpSlotSerializer

# Reward ViewSet
class RewardViewSet(viewsets.ModelViewSet):
    queryset = Reward.objects.all()
    serializer_class = RewardSerializer

#Reedemption ViewSet
class ReedemptionViewset(viewsets.ModelViewSet):
    queryset = Reedemption.objects.all()
    serializer_class = ReedemptionSerializer

# Store ViewSet
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

