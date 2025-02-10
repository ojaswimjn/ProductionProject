from django.db import models
from django.utils.timezone import now


# Create your models here.
#Creating Company Model

# class User(models.Model):
#     Full_name = models.CharField(max_length=100)
#     location = models.CharField(max_length=100)
#     user_role = models.CharField(max_length=100, choices=(
#         ('admin', 'Admin'),
#         ('user', 'User'),
#         ('company', 'Company'),
#     ))
#     active = models.BooleanField(default=False)

# User Model
class WMS_User(models.Model):
    user_id = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=100)
    user_role = models.CharField(max_length=40)
    email = models.EmailField(unique=True, max_length=100, default="example@example.com")
    contact_no = models.CharField(max_length=50, blank=True, null=True)
    created_date = models.DateField(default=now)
    updated_date = models.DateField(default=now)
    date_of_birth = models.DateTimeField(blank=True, null=True)
    status = models.BooleanField(default=True)
    username = models.CharField(max_length=50, unique=True)
    user_photo = models.CharField(max_length=100, blank=True, null=True)
    verification_code = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username

# Store Model
class Store(models.Model):
    store_id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"Store {self.store_id}"

# Product Model
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=30)
    product_description = models.TextField(max_length=200)

    def __str__(self):
        return self.product_name

# Pickup Order Model
class PickupOrder(models.Model):
    pickup_order_id = models.AutoField(primary_key=True)
    request_date = models.DateField()
    request_status= models.CharField(max_length=50)
    pickup_date = models.DateTimeField()
    weight = models.CharField(max_length=20)
    waste_type = models.CharField(max_length=20)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)

    def __str__(self):
        return f"Pickup Order {self.pickup_order_id}"

# Reward Model
class Reward(models.Model):
    reward_id = models.AutoField(primary_key=True)
    request_date = models.DateField()
    request_status = models.CharField(max_length=50)
    pickup_date = models.DateTimeField()
    user = models.ForeignKey(WMS_User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Reward {self.reward_id}"

# Image Model
class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    created_date = models.DateField(auto_now_add=True)
    image_type = models.CharField(max_length=50)
    user = models.ForeignKey(WMS_User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"Image {self.image_id} of Product {self.product.product_name}"

