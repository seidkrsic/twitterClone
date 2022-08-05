from django.apps import AppConfig


class TwitterAppConfig(AppConfig):
    name = 'twitter_app'
    default_auto_field = 'django.db.models.BigAutoField' 
    def ready(self): 
        import twitter_app.signals