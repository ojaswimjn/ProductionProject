from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, tc,full_name, user_role, password=None, password2=None):
        """
        Creates and saves a User with the given email, tc and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            tc= tc,
            full_name=full_name,
            user_role=user_role,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, tc, full_name, user_role, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            tc=tc,
            full_name=full_name,
            user_role=user_role,
            
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name="email address",
        max_length=255,
        unique=True,
    )
    date_of_birth = models.DateField(default=now)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    full_name = models.CharField(max_length=100)
    tc =models.BooleanField()
    user_role = models.CharField(max_length=40)
    created_date = models.DateField(default=now)
    updated_date = models.DateField(default=now)
    password =models.CharField(max_length=100)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['tc', 'full_name', 'user_role']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


# Image Model
class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    created_date = models.DateField(auto_now_add=True)
    image_type = models.CharField(max_length=50)
    # user = models.ForeignKey(WMS_User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Image {self.image_id}"

        # return f"Image {self.image_id} of Product {self.product.product_name}"


# User Model
class WMS_User(models.Model):
    user_id = models.BigAutoField(primary_key=True)
    # full_name = models.CharField(max_length=100)
    # user_role = models.CharField(max_length=40)
    # email = models.EmailField(unique=True, max_length=100, default="example@example.com")
    # contact_no = models.CharField(max_length=50, blank=True, null=True)
    # created_date = models.DateField(default=now)
    # updated_date = models.DateField(default=now)
    # date_of_birth = models.DateTimeField(blank=True, null=True)
    # status = models.BooleanField(default=True)
    username = models.CharField(max_length=50, unique=True)
    # user_photo = models.CharField(max_length=100, blank=True, null=True)
    # verification_code = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username

# Store Model
class Store(models.Model):
    store_id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"Store {self.store_id}"

#Waste Category
class WasteCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name
        
# Product Model
class WasteItem(models.Model):
    waste_item_image_id = models.AutoField(primary_key=True)
    accuracy_score = models.FloatField()
    identified_date = models.DateTimeField(default=now)
    waste_category = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)

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
    # user = models.ForeignKey(WMS_User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Reward {self.reward_id}"



