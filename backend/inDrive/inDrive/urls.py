from django.contrib import admin
from django.urls import path
from cleanControl import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),  # главная страница
]
