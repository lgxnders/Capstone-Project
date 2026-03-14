from django.urls import path
from .views import (
    ChatMessageView,
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
)

urlpatterns = [
    path("chat/", ChatMessageView.as_view()),
    
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', UserProfileView.as_view(), name='profile'),
    
]