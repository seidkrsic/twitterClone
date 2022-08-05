from django.contrib import admin

from twitter_app.models import Profile, Post, Comment 

# Register your models here.
admin.site.register(Profile)
admin.site.register(Comment)
admin.site.register(Post)
