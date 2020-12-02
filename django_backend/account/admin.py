from django.contrib import admin
from account.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'full_name', 'last_login', 'date_joined', 'is_active', 'is_superuser']
    list_filter = ['is_active', 'is_superuser', 'last_login', 'date_joined']

    def get_queryset(self, request):
        qs = super(UserAdmin, self).get_queryset(request)
        return qs

admin.site.register(User, UserAdmin)
