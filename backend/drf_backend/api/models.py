from django.db import models

# Create your models here.
#Creating Company Model

class User(models.Model):
    Full_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    user_role = models.CharField(max_length=100, choices=(
        ('admin', 'Admin'),
        ('user', 'User'),
        ('company', 'Company'),
    ))
    active = models.BooleanField(default=False)