from django.core.management.base import BaseCommand

from billing import state as state_api


class Command(BaseCommand):
    help = 'Seed the database with default business/centres/services/customer data.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force', action='store_true',
            help='Overwrite existing data with the defaults.',
        )

    def handle(self, *args, **options):
        seeded = state_api.seed_defaults(force=options['force'])
        if seeded:
            self.stdout.write(self.style.SUCCESS('Seeded default data.'))
        else:
            self.stdout.write('Database already has data — nothing to seed '
                              '(use --force to overwrite).')
