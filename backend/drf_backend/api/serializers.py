from rest_framework import serializers
from api.models import  Store, PickUpSlot, Reward, Image, WasteItem, WasteCategory, PickupRequest, Reedemption
from api.models import User
from django.contrib.auth.hashers import check_password



class UserRegistrationSerializer(serializers.ModelSerializer):
    
    password2 = serializers.CharField(style={'input_type':'password'},
    write_only=True, required =True)

    class Meta:
        model = User
        fields = ['email', 'tc', 'full_name', 'user_role', 'password', 'password2','date_of_birth']
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
        # validated_data.pop('password2')  # Remove password2 before saving
        user = User.objects.create_user(**validate_data)
        return user
    # def create(self, validated_data):
    #     validated_data['password'] = make_password(validated_data['password'])  # Hash password
    #     return User.objects.create(**validated_data)
    

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['id','email','full_name','user_role','is_active','password']

class UserChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(max_length=255, write_only=True)
    new_password = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    new_password2 = serializers.CharField(max_length=255, style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        fields = ['old_password', 'new_password', 'new_password2']

#validate password
    def validate(self, attrs):
        old_password = attrs.get('old_password')  # Retrieve old_password correctly
        password = attrs.get('new_password')
        password2 = attrs.get('new_password2')
        user = self.context.get('user')
        
        if not check_password(old_password, user.password):
            raise serializers.ValidationError("Old password is incorrect")

        if password !=password2:
            raise serializers.ValidationError("Password and Confirm Password does not match")

        elif password == old_password:
            raise serializers.ValidationError("Old and New Password cannot be same")

        user.set_password(password)
        user.save()

        return attrs

# Image Serializer
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image_id','created_date','image_file_url','user_id']
        read_only_fields = ['image_id','created_date']

#WasteItemDetailSerializer
class WasteItemDetailSerializer(serializers.ModelSerializer):
    waste_category = serializers.CharField(source='WasteCategory.category_name')
    image_file_url = serializers.CharField(source='image_id.image_file_url')

    class Meta:
        model = WasteItem
        fields = ['waste_item_id','accuracy_score','identified_date','waste_category','image_file_url']

# WasteCategory Serializer
class WasteCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteCategory
        fields = '__all__'

# WasteItem Serializer
class WasteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteItem
        fields = '__all__'

# Pickup Order Serializer
class PickUpRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupRequest
        fields = '__all__'

# Pickup Order Serializer
class PickUpSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickUpSlot
        fields = '__all__'

# Reward Serializer
class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'

#Reedemption Serializer
class ReedemptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reedemption
        fields = '__all__'


# Store Serializer
class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = '__all__'
