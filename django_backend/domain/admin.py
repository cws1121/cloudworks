from django.contrib import admin
from django.contrib.admin.utils import quote
from django.contrib.admin.views.main import ChangeList
from django.core.exceptions import ValidationError
from django.urls import reverse

from domain.models import Domain, Token, TokenProxy


class TokenChangeList(ChangeList):
    """Map to matching Domain id"""
    def url_for_result(self, result):
        pk = result.domain.pk
        return reverse('admin:%s_%s_change' % (self.opts.app_label,
                                               self.opts.model_name),
                       args=(quote(pk),),
                       current_app=self.model_admin.admin_site.name)


class DomainAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'is_active')
    ordering = ('-created_at',)


class TokenAdmin(admin.ModelAdmin):
    list_display = ('key', 'domain', 'created')
    fields = ('domain',)
    ordering = ('-created',)
    actions = None  # Actions not compatible with mapped IDs.

    def get_changelist(self, request, **kwargs):
        return TokenChangeList

    def get_object(self, request, object_id, from_field=None):
        """
        Map from Domain ID to matching Token.
        """
        queryset = self.get_queryset(request)
        field = Domain._meta.pk
        try:
            object_id = field.to_python(object_id)
            domain = Domain.objects.get(**{field.name: object_id})
            return queryset.get(domain=domain)
        except (queryset.model.DoesNotExist, Domain.DoesNotExist, ValidationError, ValueError):
            return None

    def delete_model(self, request, obj):
        # Map back to actual Token, since delete() uses pk.
        token = Token.objects.get(key=obj.key)
        return super().delete_model(request, token)


admin.site.register(Domain, DomainAdmin)
admin.site.register(TokenProxy, TokenAdmin)
