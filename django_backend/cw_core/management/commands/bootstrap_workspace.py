"""
Management utility to create workspaces.
"""
import sys

from django.core import exceptions
from django.core.management.base import BaseCommand, CommandError
from django.db import DEFAULT_DB_ALIAS
from django.utils.text import capfirst
from domain.models import Domain
from domain.models import Token
from cw_core.management.commands.utils import (str2bool, get_input_data, get_input_message)


class Command(BaseCommand):
    help = 'Used to create a workspace.'
    requires_migrations_checks = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name_field = Domain._meta.get_field('name')
        self.description_field = Domain._meta.get_field('description')

    def add_arguments(self, parser):
        parser.add_argument(
            '--name',
            help='Specifies the name for the workspace.',
        )

        parser.add_argument(
            '--description',
            help='Specifies the description for the workspace.',
        )

        parser.add_argument(
            '--is_active',
            type=str2bool,
            nargs='?',
            const=True,
            default=True,
            help='Specifies whether the workspace is active or not.',
        )

        parser.add_argument(
            '--generate_token',
            type=str2bool,
            nargs='?',
            const=True,
            default=False,
            help='Specifies whether a new DSN token should be generated or not.',
        )

        parser.add_argument(
            '--database',
            default=DEFAULT_DB_ALIAS,
            help='Specifies the database to use. Default is "default".',
        )

    def execute(self, *args, **options):
        return super().execute(*args, **options)

    def handle(self, *args, **options):
        name = options['name']
        description = options['description']
        is_active = options['is_active']
        generate_token = options['generate_token']
        database = options['database']

        verbose_field_name = self.name_field.verbose_name
        default_workspace_name = 'Test'

        try:
            if name:
                error_msg = self._validate_domain_name(name, verbose_field_name, database)
                if error_msg:
                    self.stderr.write(error_msg)
                    name = None
            elif name == '':
                raise CommandError('%s cannot be blank.' % capfirst(verbose_field_name))

            while name is None:
                message = get_input_message(self.name_field, default_workspace_name)
                name = get_input_data(self.stderr, self.name_field, message, default_workspace_name)
                if name:
                    error_msg = self._validate_domain_name(name, verbose_field_name, database)
                    if error_msg:
                        self.stderr.write(error_msg)
                        name = None
                        continue

            if not description:
                message = get_input_message(self.description_field, '')
                description = get_input_data(self.stderr, self.description_field, message, '')

            workspace_data = {
                'name': name,
                'description': description,
                'is_active': is_active
            }
            workspace = Domain._default_manager.db_manager(database).create(**workspace_data)
            self.stdout.write("Workspace %s created successfully." % workspace.name)
            self.stdout.write("Workspace ID is: %s" % workspace.id)

            if generate_token:
                token = Token._default_manager.db_manager(database).create(domain=workspace)
                self.stdout.write("DSN token is: %s" % token.key)

        except KeyboardInterrupt:
            self.stderr.write('\nOperation cancelled.')
            sys.exit(1)
        except exceptions.ValidationError as e:
            raise CommandError('; '.join(e.messages))

    def _validate_domain_name(self, name, verbose_field_name, database):
        if self.name_field.unique:
            try:
                Domain._default_manager.db_manager(database).get(name=name)
            except Domain.DoesNotExist:
                pass
            else:
                return 'Error: That %s is already taken.' % verbose_field_name
        if not name:
            return '%s cannot be blank.' % capfirst(verbose_field_name)
        try:
            self.name_field.clean(name, None)
        except exceptions.ValidationError as e:
            return '; '.join(e.messages)
