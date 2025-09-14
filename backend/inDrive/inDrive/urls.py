from django.contrib import admin
from django.urls import path
from cleanControl import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("check-cars/", views.check_cars, name="check_cars"),
    path('media/damage_cars/<str:filename>/', views.damage_image_view, name='damage_image'),
]

