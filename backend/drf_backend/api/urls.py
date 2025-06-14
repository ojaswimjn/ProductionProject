from django.urls import path, include
from api.views import WasteCategoryViewSet
from rest_framework import routers
from api.views import UserRegistrationView, UserLoginView, UserProfileView, PickupRequestViewSet,UserChangePasswordView, ImageUploadView, WasteItemPredictionView, AvailableDateView, SendOTPView, VerifyOTPAndResetPasswordView, VerifyOTPView, RewardViewSet, SaveExpoTokenView, WasteItemViewSet, ScheduledWasteSummaryView, MarkPickupCompletedView, FutureWastePredictionView, UserUpdateProfileView, OptimizedWasteCollectionRoute
from django.conf import settings
from django.conf.urls.static import static
from api.views import SendTestNotification

router = routers.DefaultRouter()
router.register(r'wastecategory', WasteCategoryViewSet, basename='wastecategory')
# router.register(r'manuscripts', ManuscriptViewSet.as_view(), name='manuscripts')
router.register(r'pickuprequest', PickupRequestViewSet, basename='pickuprequest')
router.register(r'reward', RewardViewSet, basename='reward')
router.register(r'wasteitem', WasteItemViewSet, basename='wasteitem')





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

    path('save-token/', SaveExpoTokenView.as_view()),
    path('send-test-push/', SendTestNotification.as_view(), name='send_test_push'),

    path('scheduled-waste-summary/', ScheduledWasteSummaryView.as_view(), name='scheduled-waste-summary'),
    path('pickuprequest/<int:pk>/complete/', MarkPickupCompletedView.as_view(), name='mark-pickup-completed'),

    path('future-waste-predict/', FutureWastePredictionView.as_view(), name='future-waste-predict' ),
    path('update-profile/', UserUpdateProfileView.as_view(), name='update-profile'),
    path('optimized-route/<str:date>/', OptimizedWasteCollectionRoute.as_view(), name='optimized-route'),









] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

