from django.db import models
# Create your models here.
from django.conf import settings
from django.contrib.auth.models import User 

from django.utils import timezone

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    email = models.CharField(max_length=20,null=True, blank=True )
    first_name = models.CharField(max_length=20,null=True, blank=True) 
    last_name = models.CharField(max_length=20,null=True, blank=True) 
    num_followers = models.IntegerField(default=0)
    num_following = models.IntegerField(default=0)
    followers = models.ManyToManyField('self', blank=True)
    following = models.ManyToManyField('self', blank=True)
    

    @property
    def update_followers(self): 
        self.num_followers = len(self.followers.all()) 

    @property
    def update_following(self): 
        self.num_following = len(self.following.all()) 

    def __str__(self): 
        return str(self.user)

class Comment(models.Model): 
    creator = models.ForeignKey(Profile, on_delete=models.SET_NULL,null=True, blank=True)
    content = models.CharField(max_length=264)
    timestamp = models.DateTimeField(default=timezone.now)



class Post(models.Model):
    creator = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, related_name='posts')
    content = models.TextField(max_length=999)
    comments = models.ForeignKey(Comment, on_delete=models.CASCADE, blank=True, null=True)
    num_likes = models.IntegerField(default=0)
    liked = models.ManyToManyField(User, blank=True)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta: 
        ordering = ['-timestamp']
    
    def __str__(self): 
        return str(self.creator)

    @property
    def update_likes(self): 
        self.num_likes = len(self.liked.all())
        


