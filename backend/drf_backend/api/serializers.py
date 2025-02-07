from rest_framework import serializers
from api.models import User

#Create serializers here
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = "__all__"