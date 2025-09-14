from django.contrib import admin
from django.urls import path
from cleanControl import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path("check-cars/", views.check_cars, name="check_cars"),
]

