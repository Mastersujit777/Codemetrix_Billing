"""Create or update the single application login account.

    python manage.py createlogin --username admin --password secret

Defaults come from the LOGIN_USERNAME / LOGIN_PASSWORD env vars (falling back to
admin / codemetrix). Running it again on an existing username resets the
password, so it's an easy way to change credentials.
"""
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or update the application login account.'

    def add_arguments(self, parser):
        parser.add_argument('--username',
                            default=os.environ.get('LOGIN_USERNAME', 'admin'))
        parser.add_argument('--password',
                            default=os.environ.get('LOGIN_PASSWORD', 'codemetrix'))
        parser.add_argument('--superuser', action='store_true',
                            help='Also grant staff/superuser (for Django admin).')

    def handle(self, *args, **options):
        User = get_user_model()
        username = options['username']
        password = options['password']
        is_super = options['superuser']

        user, created = User.objects.get_or_create(username=username)
        user.set_password(password)
        user.is_active = True
        user.is_staff = is_super
        user.is_superuser = is_super
        user.save()

        verb = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(
            f"{verb} login '{username}'."))
