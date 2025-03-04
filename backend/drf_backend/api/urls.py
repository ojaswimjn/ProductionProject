from django.urls import path
# from api.views import UserViewSet
# from rest_framework import routers
from api.views import UserRegistrationView, UserLoginView, UserProfileView, UserChangePasswordView, ImageUploadView

# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [
    # path('',include(router.urls))
    #path('api-auth/', include('rest_framework.urls'))
    path('register/', UserRegistrationView.as_view(), name= 'register'),
    path('login/', UserLoginView.as_view(), name= 'login'),
    path('profile/', UserProfileView.as_view(), name= 'profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name= 'changepassword'),
    path('uploadimage/', ImageUploadView.as_view(), name='uploadimage'),


]
