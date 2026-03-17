from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserProfile


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    """
    Automatically creates a UserProfile instance whenever a new CustomUser is registered
    """

    if created:
        UserProfile.objects.create(user=instance)
