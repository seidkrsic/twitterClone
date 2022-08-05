
from django.urls import path 


from api import views 
from .views import CustomAuthToken, registration_view, logout_view

urlpatterns = [ 
    path('posts/', views.postsView),
    path('profile/<str:id>/',views.profileView),
    path('create/', views.postCreate),
    path('like/<str:id>/', views.likeView), 
    path('logged_user_posts/', views.loggedUserPosts),
    path('user_posts/<str:id>/', views.UserPosts),
    path('follow/<str:id>/', views.followView),
    path('following_post/<str:username>/', views.FollowingPostView),


    path('login/', CustomAuthToken.as_view()),
    path('registration/', registration_view),
    path('logout/',logout_view),
   

]