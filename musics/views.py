from django.http import HttpResponse
from django.shortcuts import render
from django.conf import settings

# Create your views here.

def index(request):
    context = {}
    return render(request, 'musics/index.html', context)