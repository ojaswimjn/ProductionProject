from rest_framework import serializers
from api.models import WMS_User, Store, Product, PickupOrder, Reward, Image
from api.models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    
    password2 = serializers.CharField(style={'input_type':'password'},
    write_only=True, required =True)

    class Meta:
        model = User
        fields = ['email', 'tc', 'full_name', 'user_role', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    #validate password
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')

        if password !=password2:
            raise serializers.ValidationError("Password and Confirm Password does not match")
        return attrs

    def create(self,validate_data):
        user = User.objects.create_user(**validate_data)
        return user
    

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

# User Serializer
class WMSUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = WMS_User
        fields = '__all__'

# Store Serializer
class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'

# Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

# Pickup Order Serializer
class PickupOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupOrder
        fields = '__all__'

# Reward Serializer
class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'

# Image Serializer
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'
