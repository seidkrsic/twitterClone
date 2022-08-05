

from django.db.models.signals import post_delete, post_save
from twitter_app.models import Profile 
from django.contrib.auth.models import User 
from rest_framework.authtoken.models import Token


def createProfile(sender,instance,created,**kwargs): 
    if created: 
        user = instance 
        Token.objects.create(user=user)
        profile = Profile.objects.create( 
            user = user,
            email = user.email,
            first_name = user.first_name, 
            last_name = user.last_name,
            
        )


def updateProfile(sender,instance, created, **kwargs): 
    if not created: 
        user = instance
        profile = user.profile
        profile.email = user.email
        profile.first_name = user.first_name 
        profile.last_name = user.last_name
        profile.save()

def deleteUser(sender,instance,**kwargs): 
        try: 
            profile = instance 
            user = profile.user 
            user.delete()
        except:
            pass 
post_save.connect(updateProfile, sender=User)
post_save.connect(createProfile, sender=User)
post_delete.connect(deleteUser, sender=Profile)