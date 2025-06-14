from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from repair.views import CreateUserView, UserDetailView, ChangePasswordView, DeleteAccountView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("user/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("user/delete/", DeleteAccountView.as_view(), name="delete-account"),
    path("users/<str:username>/", UserDetailView.as_view(), name="user-detail"),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("password_reset/", include("django_rest_passwordreset.urls", namespace="password_reset")),
    path('', include('repair.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
