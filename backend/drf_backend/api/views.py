from django.shortcuts import render
from rest_framework import viewsets, status
from .models import  Store, WasteItem, WasteCategory, PickUpSlot, Reward, Image, PickupRequest, Reedemption
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePasswordSerializer ,WasteItemSerializer,  WasteCategorySerializer, StoreSerializer, PickUpSlotSerializer, RewardSerializer, ImageSerializer, PickUpRequestSerializer, ReedemptionSerializer, WasteItemDetailSerializer
from .utils import predict_image
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from api.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import date, timedelta  # Ensure this line is present
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator


 

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


#send reset password mail
class SendOTPView(APIView):
    def post(self,request):
        email = request.get.data('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        otp = random.randint(100000, 999999)  # Generate a 6-digit OTP
        user.profile.otp = otp  # Save OTP in user profile (assumes a `profile` model exists)
        user.profile.save() 

        send_mail(
            'Password Reset Request ',
            f'Your OTP for password reset is {otp}.',
            'noreply@merobhoomi.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'sucess','Password reset link sent '}, status=status.HTTP_200_OK)

#reset password view
class VerifyOTPAndResetPasswordView(APIView):
    def post (self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not email or not otp or not new_password or not confirm_password:
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check OTP
        if str(user.profile.otp) != str(otp):  
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password
        user.set_password(new_password)
        user.save()
        user.profile.otp = None  # Clear OTP after successful reset
        user.profile.save()

        return Response({'success': 'Password has been reset successfully'}, status=status.HTTP_200_OK)

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

#Image ViewSet
# class ImageViewSet(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer

class WasteItemPredictionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, image_id, format=None):
        try:
            image = Image.objects.get(image_id=image_id)

            predicted_category_id,accuracy_score = predict_image(image.image_file_url.path)

            
            print(f"Predicted category ID: {predicted_category_id}")


            try:
                waste_category = WasteCategory.objects.get(category_id= predicted_category_id)
            except WasteCategory.DoesNotExist:
                return Response(
                    {'error': f'WasteCategory with ID {predicted_category_id} does not exist'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
             # Get or create the corresponding WasteItem
            waste_item, created = WasteItem.objects.get_or_create(
                image_id=image,
                defaults={
                    'accuracy_score': accuracy_score,
                    'category_id': waste_category
                }
            )

            # If the WasteItem already exists, update its fields
            if not created:
                waste_item.accuracy_score = accuracy_score
                waste_item.category_id = waste_category
                waste_item.save()

            response_data = {
                'image_id': image.image_id,
                'image_url': image.image_file_url.url,
                'category_name': waste_category.category_name,
                'predicted_class_index': waste_category.category_id,
                'accuracy_score': waste_item.accuracy_score
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Image.DoesNotExist:
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        

# WasteItem ViewSet
class WasteCategoryViewSet(viewsets.ModelViewSet):
    queryset = WasteCategory.objects.all()
    serializer_class = WasteCategorySerializer  

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

# WasteItem ViewSet
class WasteItemViewSet(viewsets.ModelViewSet):
    queryset = WasteItem.objects.all()
    serializer_class = WasteItemSerializer

#PickUp Request ViewSet
class PickupRequestViewSet(viewsets.ModelViewSet):
    queryset = PickupRequest.objects.all()
    serializer_class = PickUpRequestSerializer
    permission_classes = [IsAuthenticated]  

class AvailableDateView(APIView):
    def is_date_fully_booked(self, pickup_date):
        """Check if a date is fully booked based on weight or request limit"""
        max_requests = 10  # Example limit of 10 pickups per day
        max_weight = 100  # Example total weight limit per day

        pickups = PickupRequest.objects.filter(request_date=pickup_date)
        total_requests = pickups.count()
        total_weight = sum(p.weight for p in pickups)

        return total_requests >= max_requests or total_weight >= max_weight

    def get(self, request, *args, **kwargs):
        try:
            today = date.today()
            available_dates = []        
            allowed_days = [1, 4]  # 🚀 Only allow pickups on Monday (1) and Thursday (4)


            for i in range(21):  # Check next 3 weeks
                check_date = today + timedelta(days=i)
                if check_date.weekday() in allowed_days:  # ✅ Only include allowed days
                    if not self.is_date_fully_booked(check_date):  # ✅ Now correctly calling the function
                        available_dates.append(str(check_date))

                # Log the check date for debugging
                print(f"Checking availability for date: {check_date}")
                
            print(f"Available dates: {available_dates}")  # Log available dates

            return Response({"available_dates": available_dates}, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log the error if any exception occurs
            print(f"Error in AvailableDateView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

