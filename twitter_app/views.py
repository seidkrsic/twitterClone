from django.shortcuts import render
from twitter_app.forms import UserForm

from twitter_app.models import Post 

# Create your views here.


def login_view(request):

    return render(request,'twitter_app/login.html', { 
        
            })


def index(request): 
    
    return render(request,'twitter_app/index.html', {
            
        })
    