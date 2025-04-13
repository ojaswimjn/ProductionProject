from django.urls import path, include
from api.views import WasteCategoryViewSet, save_expo_push_token
from rest_framework import routers
from api.views import UserRegistrationView, UserLoginView, UserProfileView, PickupRequestViewSet,UserChangePasswordView, ImageUploadView, WasteItemPredictionView, AvailableDateView, SendOTPView, VerifyOTPAndResetPasswordView, VerifyOTPView, RewardViewSet
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'wastecategory', WasteCategoryViewSet, basename='wastecategory')
# router.register(r'manuscripts', ManuscriptViewSet.as_view(), name='manuscripts')
router.register(r'pickuprequest', PickupRequestViewSet, basename='pickuprequest')
router.register(r'reward', RewardViewSet, basename='reward')




urlpatterns = [
    path('',include(router.urls)),
    #path('api-auth/', include('rest_framework.urls'))
    path('register/', UserRegistrationView.as_view(), name= 'register'),
    path('login/', UserLoginView.as_view(), name= 'login'),
    path('profile/', UserProfileView.as_view(), name= 'profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name= 'changepassword'),
    path('uploadimage/', ImageUploadView.as_view(), name='uploadimage'),
    path('wasteitem/predict/<int:image_id>', WasteItemPredictionView.as_view(), name='wasteitempredict'),

    path('availabledates/', AvailableDateView.as_view(), name='availabledates'),

    path('sendotp/', SendOTPView.as_view(), name='sendotp'),
    path('resetpassword/',VerifyOTPAndResetPasswordView.as_view(), name = 'resetpassword'),
    path('otpverify/',VerifyOTPView.as_view(), name = 'otpverify'),

    # path('reward/updatereward/', RewardViewSet.as_view({'patch': 'update_reward'}), name='updatereward')

    path('save-push-token/', save_expo_push_token),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

