
from django.urls import path
from .views import register_faculty, current_user

urlpatterns = [
    path('register/', register_faculty),
    path('user/', current_user),
]