from django.contrib import admin

from tic.models import Player


class GameAdmin(admin.ModelAdmin):
    list_display = ('player',)


admin.site.register(Player, GameAdmin)
