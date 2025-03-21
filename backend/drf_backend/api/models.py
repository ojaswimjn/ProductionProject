from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.conf import settings
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, tc,full_name, user_role="customer", date_of_birth=None, password=None, password2=None ):
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
            date_of_birth = date_of_birth
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, tc, full_name, user_role, date_of_birth=None,  password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            tc=tc,
            full_name=full_name,
            date_of_birth=date_of_birth,
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
    date_of_birth = models.DateField(null=True, blank=True)  # Allow user input
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    full_name = models.CharField(max_length=100)
    tc =models.BooleanField()
    user_role = models.CharField(max_length=40, default="customer")
    created_date = models.DateTimeField(auto_now_add=True)  # Set on creation
    updated_date = models.DateTimeField(auto_now=True)  # Set on update
    password =models.CharField(max_length=100)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['tc', 'full_name', 'user_role','date_of_birth']

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

# lets us explicitly set upload path and filename
def upload_to(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.user_id.id}_{timezone.now().strftime('%Y%m%d%H%M%S')}.{ext}"
    return 'images/{filename}'.format(filename=filename)

# Image Model
class Image(models.Model):
    image_id = models.AutoField(primary_key=True)
    created_date = models.DateField(auto_now_add=True)
    # image_type = models.CharField(max_length=50)
    image_file_url = models.ImageField(upload_to=upload_to, blank=True, null=True)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    def __str__(self):
        return f"Image {self.image_id}"

#Waste Category
class WasteCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_name = models.CharField(max_length=50)
    description = models.CharField(max_length=10000,  null=True)

    def __str__(self):
        return self.category_name

# WasteItem Model
class WasteItem(models.Model):
    waste_item_id = models.AutoField(primary_key=True)
    accuracy_score = models.FloatField(null=True, blank=True)
    identified_date = models.DateTimeField(default=now)
    category_id = models.ForeignKey(WasteCategory, on_delete=models.CASCADE)
    image_id = models.ForeignKey(Image, on_delete=models.CASCADE)

    def __str__(self):
        return self.waste_item_id


# Pickup Order Model
class PickupRequest(models.Model):
    pickup_request_id = models.AutoField(primary_key=True)
    request_date = models.DateField()
    request_status= models.CharField(max_length=50)
    weight = models.FloatField()
    weight_metric = models.CharField(max_length=10, default="kg")  # Set a default value
    waste_type = models.CharField(max_length=20)
    latitude= models.FloatField()
    longitude = models.FloatField()
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Pickup Order {self.pickup_request_id}"

    @classmethod
    def is_date_fully_booked(cls, check_date):
        # Example logic: check if the date is fully booked
        booked_requests = cls.objects.filter(request_date=check_date)
        total_weight = sum(request.weight for request in booked_requests)
        
        max_weight = 50  # Example: max capacity for a date
        return total_weight >= max_weight

#PickUp Collection Slot Model
class PickUpSlot(models.Model):
    slot_id = models.AutoField(primary_key=True)
    slot_date = models.DateField()
    slot_time = models.TimeField()
    status = models.CharField(max_length=50)
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pickup_request_id = models.ForeignKey(PickupRequest, on_delete=models.CASCADE)


    def __str__(self):
        return f"Pickup Slot {self.slot_id}"

# Reward Model
class Reward(models.Model):
    reward_id = models.AutoField(primary_key=True)
    request_date = models.DateField()
    reward_status = models.CharField(max_length=50)
    expiry_date = models.DateTimeField()
    description = models.CharField(max_length=250, null=True)
    # user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"Reward {self.reward_id}"


#Reedemption Model
class Reedemption(models.Model):
    reedemption_id = models.AutoField(primary_key=True)
    reedemption_date = models.DateField()
    points_reedemed= models.FloatField()
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    reward_id = models.ForeignKey(Reward, on_delete=models.CASCADE)

    def __str__(self):
        return f"Reedemption {self.reedemption_id}"


# Store Model
class Store(models.Model):
    store_id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"Store {self.store_id}"



