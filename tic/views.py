from django.http import Http404
from django.shortcuts import render, redirect
from django.views import View

from tic.forms import TicForm
from tic.models import Player


def index(request):
    if request.method == 'POST':
        form = TicForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('game')
    else:
        form = TicForm()
    context = {'form': form}
    return render(request, "index.html", context=context)


def game(request):
    name = request.POST.get('name')

    return render(request, "game.html", {'name': name})
