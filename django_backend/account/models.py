from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _

from .managers import UserManager
from domain.models import Domain
from jsonfield.fields import JSONField


class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(_("full name"), max_length=200, null=True)
    current_workspace = models.ForeignKey(Domain, on_delete=models.CASCADE, related_name='users')
    config = JSONField(default=dict, null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
