


from logging import raiseExceptions
from nbformat import read
from rest_framework import serializers 
from twitter_app.models import Post, Profile
from django.contrib.auth.models import User 


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True) 
    class Meta: 
        model = User 
        fields = ['username','email','first_name','last_name','password','password2']
        write_only_fields = ['password']

    def save(self): 
        password = self.validated_data['password']
        password2 = self.validated_data['password2']
        if password != password2: 
            raise serializers.ValidationError({'error' : 'Passwords not matching'})
        
        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError({'error': 'Email already exists!'})

        user = User(username=self.validated_data['username'], 
                    email=self.validated_data['email'],
                    first_name=self.validated_data['first_name'],
                    last_name=self.validated_data['last_name'],
                )
        user.set_password(self.validated_data['password'])
       
      
        user.save()
        return user 




class ProfileSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Profile 
        fields = '__all__'
        depth = 0




class PostSerializer(serializers.ModelSerializer): 
    creator = ProfileSerializer(required=False)
    liked = UserSerializer(many=True, required=False)

    class Meta: 
        model = Post 
        fields = "__all__"
        read_only_fields = ['creator']
       

    
    def update(self, instance, validated_data): 
        #  instance.email = validated_data.get('email', instance.email) example line of code for helping mee
        instance.content  = validated_data.get('content', instance.content)
        instance.save()
        return instance 
   
    def create(self, validated_data):
        return Post.objects.create(**validated_data)


