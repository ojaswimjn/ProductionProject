from django.shortcuts import render
from rest_framework import viewsets, status
from .models import  Store, WasteItem, WasteCategory, PickUpSlot, Reward, Image, PickupRequest, Reedemption, ExpoPushToken  
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, UserChangePasswordSerializer ,WasteItemSerializer,  WasteCategorySerializer, StoreSerializer, PickUpSlotSerializer, RewardSerializer, ImageSerializer, PickUpRequestSerializer, ReedemptionSerializer, WasteItemDetailSerializer, ExpoTokenSerializer
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
from django.contrib.auth import get_user_model
import random
from django.core.cache import cache  # ✅ Import cache to store OTP
from django.http import QueryDict
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from django.db.models import Count, Sum
from django.db.models import OuterRef, Subquery
from rest_framework.permissions import IsAdminUser
from django.utils.dateformat import DateFormat



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

            # Create the Reward for the newly registered user with 0 points
            Reward.objects.create(
                points=0,  # Default points
                created_date=timezone.now().date(),
                reward_status="Pending",  # Set your desired default status
                updated_date=timezone.now(),
                description="Initial reward for registration",
                user_id=user,
            )
            
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

User = get_user_model()  # ✅ Define User model
#send reset password mail
class SendOTPView(APIView):
    def post(self,request):
        email = request.data.get('email') 
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

        otp = random.randint(100000, 999999)  # Generate a 6-digit OTP
        cache.set(f'otp_{email}', otp, timeout=300)  # ✅ Store OTP in cache (valid for 5 minutes)
        cached_otp = cache.get(f'otp_{email}')  # Retrieve OTP from cache
        print(f'Stored OTP: {cached_otp}')  # This should print the correct OTP
        message = f"""
    Dear {user.full_name.split(" ")[0]},
    We received a request to reset the password for your account associated with this email. 
    To proceed with resetting your password, please use the following One-Time Password (OTP):
        
    **Your OTP:** {otp}

    This OTP is valid for the next 5 minutes. If you did not request this change, please ignore this email. 
    Your account security is important to us, and no changes will be made without entering this OTP.

    Best regards,  
    Mero Bhoomi Support Team  
    """

        send_mail(
            'Password Reset Request ',
            message,
            'merobhoomi@gmail.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'success': 'OTP sent to email'}, status=status.HTTP_200_OK)

#reset password view
class VerifyOTPAndResetPasswordView(APIView):
    def post (self, request):
        email = request.data.get('email')  # ✅ Correct
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
        cached_otp = cache.get(f'otp_{email}')  # Retrieve OTP from cache
        if not cached_otp or str(cached_otp) != str(otp):
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        # Reset password
        user.set_password(new_password)
        user.save()

        return Response({'success': 'Password has been reset successfully'}, status=status.HTTP_200_OK)


#reset password view
class VerifyOTPView(APIView):
    def post (self, request):
        email = request.data.get('email')  # ✅ Correct
        otp = request.data.get('otp')

        if not email or not otp :
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check OTP
        cached_otp = cache.get(f'otp_{email}')  # Retrieve OTP from cache
        if not cached_otp or str(cached_otp) != str(otp):
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'success': 'OTP has been verified successfully'}, status=status.HTTP_200_OK)

#Image
class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Ensure MultiPartParser is included

    def post(self, request, format=None):
        # data = request.data.copy()
        data = request.data.dict() if isinstance(request.data, QueryDict) else request.data.copy()

        data['user_id'] = request.user.id  # Ensure user ID is included
        
        serializer = ImageSerializer(data=data)

        if serializer.is_valid():
            image= serializer.save()

            predicted_category_id,accuracy_score = predict_image(image.image_file.path)

            
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
                'image_url': image.image_file.url,
                'category_name': waste_category.category_name,
                'predicted_class_index': waste_category.category_id,
                'accuracy_score': waste_item.accuracy_score
            }

            return Response(response_data, status=status.HTTP_200_OK)
            return Response(
                {'success': 'Image uploaded successfully', 'data': serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    serializer_class = WasteCategorySerializer  

    def get_queryset(self):
        queryset = WasteCategory.objects.all()
        category_name=self.request.query_params.get('category_name',None)
        if category_name:
            queryset = queryset.filter(category_name=category_name)
        return queryset


# WasteItem ViewSet
class WasteItemViewSet(viewsets.ModelViewSet):
    queryset = WasteItem.objects.all()
    serializer_class = WasteItemSerializer

    @action(detail=False, methods=['get'], url_path='user')
    def get_by_user(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required as a query parameter."}, status=400)
        
        items = WasteItem.objects.filter(image_id__user_id=user_id)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


    @action(detail=False, methods=['get'], url_path='leaderboard')
    def leaderboard(self, request):
        reward_points_subquery = Reward.objects.filter(
            user_id=OuterRef('image_id__user_id')
        ).values('user_id').annotate(
            total_points=Sum('points')
        ).values('total_points')


        leaderboard = WasteItem.objects.values('image_id__user_id').annotate(
        total_items=Count('waste_item_id'),
        total_points=Subquery(reward_points_subquery[:1])
        ).order_by('-total_points')

        return Response([
        {
            "user_id": entry["image_id__user_id"],
            "total_items": entry["total_items"],
            "total_points": entry["total_points"] or 0
        }
        for entry in leaderboard
        ])
    
#PickUp Request ViewSet
class PickupRequestViewSet(viewsets.ModelViewSet):
    queryset = PickupRequest.objects.all()
    serializer_class = PickUpRequestSerializer
    permission_classes = [IsAuthenticated]  

    @action(detail=False, methods=['get'], url_path='user/(?P<user_id>[^/.]+)')
    def by_user(self, request, user_id=None):
        if not request.user.is_staff and request.user.id != int(user_id):
            return Response({"detail": "Not authorized."}, status=403)

        requests = PickupRequest.objects.filter(user_id=user_id)
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)

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

    @action(detail=False, methods=['patch'], url_path='updatereward')
    def update_reward(self, request, pk=None):
        user_id=request.data.get('user_id')
        points = request.data.get('points')
        description = request.data.get('description')
        print(points)

        if not user_id:
            return Response({"error":"user id is required, unable to locate"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            #fetch the reward object for thegiven user_id
            reward = Reward.objects.get(user_id=user_id)

            if points is not None:
                reward.points += points
            if description:
                reward.description = description
            
            reward.updated_date=timezone.now().date()
            reward.save()

            return Response(RewardSerializer(reward).data, status=status.HTTP_200_OK)

        except Reward.DoesNotExist:
            return Response({"error": "Reward does not exist"}, status=status.HTTP_404_NOT_FOUND)


    @action(detail=False, methods=['get'], url_path='get-reward')
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            return Reward.objects.filter(user_id=user_id)
        return Reward.objects.all() 



#Reedemption ViewSet
class ReedemptionViewset(viewsets.ModelViewSet):
    queryset = Reedemption.objects.all()
    serializer_class = ReedemptionSerializer

# Store ViewSet
class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class SaveExpoTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received data:", request.data)
        serializer = ExpoTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['expo_token']
        ExpoPushToken.objects.update_or_create(user=request.user, defaults={'token': token})
        return Response({"message": "Token saved."})

from api.utils import notify_user

class SendTestNotification(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        result = notify_user(user, "🚀 Hello from Django!", "This is your test push notification!")

        if result is None:
            return Response({"message": "No push token found for user."}, status=404)
        return Response({"message": "Push sent!", "expo_response": result})

class ScheduledWasteSummaryView(APIView):
    permission_classes = [IsAdminUser]  

    def get(self, request):
        data = (
            PickupRequest.objects
            .values('request_date')
            .annotate(total_weight=Sum('weight'))
            .order_by('request_date')
        )

        formatted_data = [
            {
                "date": DateFormat(item['request_date']).format('Y-m-d'),
                "total_weight": item['total_weight']
            }
            for item in data
        ]

        return Response(formatted_data, status=status.HTTP_200_OK)

class MarkPickupCompletedView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        try:
            pickup = PickupRequest.objects.get(pk=pk)
        except PickupRequest.DoesNotExist:
            return Response({'error': 'Pickup request not found'}, status=status.HTTP_404_NOT_FOUND)

        if pickup.request_status != "Picked up":
            pickup.request_status = "Picked up"
            pickup.save()

            # Calculate points
            points = int(pickup.weight) * 10

            try:
                reward = Reward.objects.get(user_id=pickup.user_id)
                reward.points += points
                reward.description = f"Points updated for pickup completed on {pickup.request_date}"
                reward.reward_status = "Completed"
                reward.updated_date = timezone.now().date()
                reward.save()
            except Reward.DoesNotExist:
                return Response({"error": "Reward record does not exist for this user"}, status=status.HTTP_404_NOT_FOUND)
            except Reward.MultipleObjectsReturned:
                return Response({"error": "Multiple reward entries found for this user. Cannot update reliably."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'message': f'Marked as picked up and {points} points added.'})

        return Response({'message': 'Already picked up.'})