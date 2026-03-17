from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = [
        ('faculty', 'Faculty'),
        ('chairperson', 'Chairperson'),
        ('hod', 'HOD'),
        ('dean', 'Dean'),
        ('pvc', 'Pro Vice Chancellor'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLES, default='faculty')
    department = models.CharField(max_length=100, blank=True)
    designation = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"