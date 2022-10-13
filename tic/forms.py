from django import forms

from tic.models import Player

class TicForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ['player']
        widgets = {
            'player': forms.TextInput(),
        }
