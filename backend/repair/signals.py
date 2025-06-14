from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.dispatch import receiver

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, **kwargs):
    email_message = f"Use this link to reset your password: http://localhost:5173/reset-password?token={reset_password_token.key}"
    send_mail(
        "Password Reset for Write2Repair",
        email_message,
        "noreply@write2repair.net",
        [reset_password_token.user.email],
    )