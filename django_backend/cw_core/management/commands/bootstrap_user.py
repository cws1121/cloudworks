"""
Management utility to create users.
"""
import getpass
import sys

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core import exceptions
from django.core.management.base import BaseCommand, CommandError
from django.db import DEFAULT_DB_ALIAS
from django.utils.text import capfirst
from cw_core.management.commands.utils import (str2bool, get_input_data, get_input_message)
from domain.models import Domain


PASSWORD_FIELD = 'password'
IS_STAFF_FIELD = 'is_staff'
IS_SUPERUSER = 'is_superuser'
CURRENT_WORKSPACE_ID = 'current_workspace_id'


class Command(BaseCommand):
    help = 'Used to create a superuser.'
    requires_migrations_checks = True

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.UserModel = get_user_model()
        self.username_field = self.UserModel._meta.get_field(self.UserModel.USERNAME_FIELD)
        self.workspace_id_field = self.UserModel._meta.get_field(CURRENT_WORKSPACE_ID)

    def add_arguments(self, parser):
        parser.add_argument(
            '--%s' % self.UserModel.USERNAME_FIELD,
            help='Specifies the login for the superuser.',
        )
        parser.add_argument(
            '--workspace_id',
            help='Specifies the workspace for the superuser.',
        )

        parser.add_argument(
            '--is_superuser',
            type=str2bool,
            nargs='?',
            const=True,
            default=False,
            help='Specifies whether the user should be a superuser.',
        )

        parser.add_argument(
            '--noinput', '--no-input', action='store_false', dest='interactive',
            help=(
                'Tells Django to NOT prompt the user for input of any kind. '
                'You must use --%s with --noinput, along with an option for '
                'any other required field. Superusers created with --noinput will '
                'not be able to log in until they\'re given a valid password.' %
                self.UserModel.USERNAME_FIELD
            ),
        )
        parser.add_argument(
            '--database',
            default=DEFAULT_DB_ALIAS,
            help='Specifies the database to use. Default is "default".',
        )

    def execute(self, *args, **options):
        return super().execute(*args, **options)

    def handle(self, *args, **options):
        username = options[self.UserModel.USERNAME_FIELD]
        database = options['database']
        workspace_id = options['workspace_id']
        is_superuser = options['is_superuser']
        verbose_field_name = self.username_field.verbose_name

        user_data = {
            PASSWORD_FIELD: None,
            IS_STAFF_FIELD: is_superuser,
            IS_SUPERUSER: is_superuser
        }

        try:
            # DEF Username
            if username:
                error_msg = self._validate_username(username, verbose_field_name, database)
                if error_msg:
                    self.stderr.write(error_msg)
                    username = None
            elif username == '':
                raise CommandError('%s cannot be blank.' % capfirst(verbose_field_name))
            # Prompt for username.
            while username is None:
                message = get_input_message(self.username_field)
                username = get_input_data(self.stderr, self.username_field, message)
                if username:
                    error_msg = self._validate_username(username, verbose_field_name, database)
                    if error_msg:
                        self.stderr.write(error_msg)
                        username = None
                        continue

            user_data[self.UserModel.USERNAME_FIELD] = username

            # DEF Password
            while user_data[PASSWORD_FIELD] is None:
                password = getpass.getpass()
                password2 = getpass.getpass('Password (again): ')
                if password != password2:
                    self.stderr.write("Error: Your passwords didn't match.")
                    # Don't validate passwords that don't match.
                    continue
                if password.strip() == '':
                    self.stderr.write("Error: Blank passwords aren't allowed.")
                    # Don't validate blank passwords.
                    continue
                try:
                    validate_password(password2, self.UserModel(**user_data))
                except exceptions.ValidationError as err:
                    self.stderr.write('\n'.join(err.messages))
                    response = input('Bypass password validation and create user anyway? [y/N]: ')
                    if response.lower() != 'y':
                        continue
                user_data[PASSWORD_FIELD] = password

            # DEF Workspace
            if workspace_id:
                error_msg = self._validate_workspace_id(workspace_id, database)
                if error_msg:
                    self.stderr.write(error_msg)
                    workspace_id = None
            elif workspace_id == '':
                raise CommandError('Workspace ID cannot be blank.')

            # Prompt for workspace id.
            while workspace_id is None:
                workspace_id = get_input_data(self.stderr, self.workspace_id_field,
                                              'Workspace ID (leave blank to use default):', skip_validation=True)
                if workspace_id:
                    error_msg = self._validate_workspace_id(workspace_id, database)
                    if error_msg:
                        self.stderr.write(error_msg)
                        workspace_id = None
                        continue
                else:
                    try:
                        workspace = Domain._default_manager.db_manager(database).first()
                        workspace_id = workspace.id
                    except AttributeError:
                        self.stderr.write("Error: Please create a workspace first.")
                        sys.exit(1)

                user_data[CURRENT_WORKSPACE_ID] = workspace_id

            self.UserModel._default_manager.db_manager(database).create_user(**user_data)
            self.stdout.write("User created successfully.")
        except KeyboardInterrupt:
            self.stderr.write('\nOperation cancelled.')
            sys.exit(1)
        except exceptions.ValidationError as e:
            raise CommandError('; '.join(e.messages))

    def _validate_username(self, username, verbose_field_name, database):
        """Validate username. If invalid, return a string error message."""
        if self.username_field.unique:
            try:
                self.UserModel._default_manager.db_manager(database).get_by_natural_key(username)
            except self.UserModel.DoesNotExist:
                pass
            else:
                return 'Error: That %s is already taken.' % verbose_field_name
        if not username:
            return '%s cannot be blank.' % capfirst(verbose_field_name)
        try:
            self.username_field.clean(username, None)
        except exceptions.ValidationError as e:
            return '; '.join(e.messages)
        
    def _validate_workspace_id(self, workspace_id, database):
        """Validate workspace. If it doesn't exist, return a string error message."""
        try:
            Domain._default_manager.db_manager(database).get(id=workspace_id)
        except Domain.DoesNotExist:
            return "Error: That workspace doesn't exist."
        if not workspace_id:
            return 'Workspace ID cannot be blank.'
