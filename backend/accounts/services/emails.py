import logging
import os

from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def send_registration_email(user):
    """
    Sends a welcome email after successful user registration
    """

    subject = "Вітаємо на Adaptive Travel Guide!"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    context = {
        "username": user.username,
        "site_name": "Adaptive Travel Guide",
        "support_email": "support@test.com",
    }

    template_path = os.path.join(
        settings.BASE_DIR, "templates", "emails", "welcome_email.html"
    )

    html_content = render_to_string(template_path, context)

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"
    try:
        email.send()

    except Exception:
        logger.exception(
            "Failed to send registration email to %s",
            user.email,
        )


def send_password_reset_email(user, reset_url):
    """
    Sends a password reset link to the user
    """

    subject = "Зміна пароля"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    context = {
        "username": user.username,
        "reset_url": reset_url,
        "site_name": "Adaptive Travel Guide",
    }

    template_path = os.path.join(
        settings.BASE_DIR, "templates", "emails", "reset_password_email.html"
    )

    html_content = render_to_string(template_path, context)

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"
    try:
        email.send()

    except Exception:
        logger.exception(
            "Failed to send password reset email to %s",
            user.email,
        )


def send_confirm_change_password_email(user):
    """
    Sends a notification confirming a successful password change
    """

    subject = "Зміна пароля"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    context = {
        "username": user.username,
        "site_name": "Adaptive Travel Guide",
    }

    template_path = os.path.join(
        settings.BASE_DIR, "templates", "emails", "confirm_password_email.html"
    )

    html_content = render_to_string(template_path, context)

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"
    try:
        email.send()

    except Exception:
        logger.exception(
            "Failed to send password confirmation email to %s",
            user.email,
        )
