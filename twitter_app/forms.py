
from django.forms import ModelForm 
from django.conf import settings 
from django.contrib.auth.models import User 
class UserForm(ModelForm): 
    class Meta: 
        model = User
        fields = ['username','first_name','last_name', 'email','password']
    