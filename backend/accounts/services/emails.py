from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
import os


def send_registration_email(request, user):
    subject = "Вітаємо на Adaptive Travel Guide!"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    context = {
        "username": user.username,
        "site_name": "Adaptive Travel Guide",
        "support_email": "support@test.com",
    }

    template_path = os.path.join(
        settings.BASE_DIR, 'templates', 'emails', 'welcome_email.html')

    html_content = render_to_string(template_path, context)

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"
    email.send()


def send_password_reset_email(request, user, reset_url):
    subject = "Зміна пароля"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    context = {
        "username": user.username,
        "reset_url": reset_url,
        "site_name": "Adaptive Travel Guide",
    }

    template_path = os.path.join(
        settings.BASE_DIR, 'templates', 'emails', 'reset_password_email.html')

    html_content = render_to_string(template_path, context)

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"
    email.send()


def send_confirm_change_password_email(request, user):
    subject = "Зміна пароля"
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [user.email]

    context = {
        "username": user.username,
        "site_name": "Adaptive Travel Guide",
    }

    template_path = os.path.join(
        settings.BASE_DIR, 'templates', 'emails', 'confirm_password_email.html')

    html_content = render_to_string(template_path, context)

    email = EmailMessage(
        subject=subject,
        body=html_content,
        from_email=from_email,
        to=recipient_list,
    )
    email.content_subtype = "html"
    email.send()
