from django.contrib import admin
from rdt.models import Media


class MediaAdmin(admin.ModelAdmin):
    list_display = ('file', 'name', 'description')


admin.site.register(Media, MediaAdmin)
