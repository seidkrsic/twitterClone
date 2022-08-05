from functools import partial
from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
import api
from api import serializers 
from twitter_app.models import Post, Profile, User 
from rest_framework import status
from rest_framework import authentication
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication 
# Create your views here.

from api.serializers import PostSerializer, ProfileSerializer, UserSerializer

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token



# view to see all posts from all user from database 

@api_view(['GET'])
def postsView(request): 
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def FollowingPostView(request, username): 
    user = User.objects.get(username=username)
    following = user.profile.following.all()
    print(following)
    posts = Post.objects.filter(creator__in=following)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)



@api_view(['GET'])
def loggedUserPosts(request):
    try: 
        profile = request.user.profile
        posts = profile.posts
        serializer = PostSerializer(posts,many=True)
        return Response(serializer.data)
    except: 
        return Response({"error": "User not found.."})


@api_view(['GET'])
def UserPosts(request,id):
    try: 
        user = User.objects.get(id=id)
        profile = user.profile
        posts = profile.posts
        serializer = PostSerializer(posts,many=True)
        return Response(serializer.data)
    except: 
        return Response({"error": "User not found.."})
# view to see details about user... 

@api_view(['GET'])
def profileView(request, id):
    try:
        user = User.objects.get(id=id)
        profile = Profile.objects.get(user=user) 
        serializer = ProfileSerializer(profile,many=False)
        return Response(serializer.data)
    except: 
        try: 
            user = User.objects.get(username=id)
            profile = Profile.objects.get(user=user) 
            serializer = ProfileSerializer(profile,many=False)
            return Response(serializer.data)
        except: 
            return Response({"error":"Profile does not exist."})
    


# view to like or unlike post 

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def likeView(request, id):
    try: 
        post = Post.objects.get(id=id)
        print(post.num_likes)
    except: 
        return Response({"error": "Post not found"}) 
    try: 
        if request.user in post.liked.all(): 
            post.liked.remove(request.user)
        else: 
            post.liked.add(request.user) 
        post.save()
        post.update_likes
        # post.num_likes = len(post.liked.all())
        post.save()
        
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)
    except: 
        return Response({"error": "Code is not working..."}) 
    

# view to follow or unfollow user 
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def followView(request, id):
    try: 
        user = User.objects.get(id=id)
       
    except: 
        return Response({"error": "User not found"}) 
    try: 
        if request.user.profile in user.profile.followers.all(): 
            user.profile.followers.remove(request.user.profile)
            request.user.profile.following.remove(user.profile)
            print('First part working')
        else: 
            user.profile.followers.add(request.user.profile) 
            request.user.profile.following.add(user.profile)
            print('Second part working')
        user.profile.save()
        request.user.profile.save()
        user.profile.update_followers
        request.user.profile.update_following
        user.profile.save()
        request.user.profile.save()
        serializer = ProfileSerializer(user.profile, many=False)
        return Response(serializer.data)
    except: 
        return Response({"error": "Code is not working..."}) 


# view that creates post 

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def postCreate(request): 
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(creator=request.user.profile)
        return Response(serializer.data)
    else: 
        return Response(serializer.errors)

@api_view(['POST']) 
def postUpdate(request,id):
    post = Post.objects.get(id=id) 
    serializer = PostSerializer(data=request.data,instance=post, partial=True)
    if serializer.is_valid(): 
        serializer.save()
        return Response(serializer.data)
    else: 
        return Response(serializer.errors)



# this is to return more than just a token about user. 

class CustomAuthToken(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'email': user.email,
            'first_name':user.first_name,
            'last_name' : user.last_name,
            'username' : user.username,
        })



# user registration, log in and logout views 

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def registration_view(request):

    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        
        data = {}
        
        if serializer.is_valid():
            account = serializer.save()
            
            data['response'] = "Registration Successful!"
            data['username'] = account.username
            data['email'] = account.email

            token = Token.objects.get(user=account).key
            data['token'] = token 
       
        else:
            data = serializer.errors
        
        return Response(data, status=status.HTTP_201_CREATED)


@api_view(['POST',])
def logout_view(request):
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)