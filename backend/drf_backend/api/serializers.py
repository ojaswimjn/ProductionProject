from rest_framework import serializers
from api.models import WMS_User, Store, Product, PickupOrder, Reward, Image

# User Serializer
class UserSerializer(serializers.ModelSerializer):
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
