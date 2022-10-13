from django.db import models


class Player(models.Model):
    player = models.CharField(max_length=150, verbose_name='Назва гравця', default='a')

    def __str__(self):
        return self.player
