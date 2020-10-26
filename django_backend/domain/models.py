import binascii
import os
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User


class Domain(models.Model):
    """
        Domain is the highest level of abstraction
        in the system.  Pretty much everything happens at the
        domain-level, including user membership, permission to
        see data, reports, charts, etc.
   """

    name = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Token(models.Model):
    """
    The default authorization token model.
    """
    key = models.CharField(_("Key"), max_length=40, primary_key=True)
    domain = models.OneToOneField(
        Domain, related_name='auth_token',
        on_delete=models.CASCADE, verbose_name=_("Domain")
    )
    created = models.DateTimeField(_("Created"), auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    @classmethod
    def generate_key(cls):
        return binascii.hexlify(os.urandom(20)).decode()

    def __str__(self):
        return self.key


class TokenProxy(Token):
    """
    Proxy mapping pk to domain pk for use in admin.
    """
    @property
    def pk(self):
        return self.domain.pk

    class Meta:
        proxy = True
        verbose_name = "token"
