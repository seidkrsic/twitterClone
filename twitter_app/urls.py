
from django.urls import path 
from twitter_app import views 

urlpatterns = [ 

    path('', views.index),
    path('login/', views.login_view),

]