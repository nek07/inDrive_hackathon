from django.db import models

class Car(models.Model):
    client = models.ForeignKey("Client", on_delete=models.CASCADE, related_name="cars")
    plate_number = models.CharField(max_length=20, unique=True)
    make = models.CharField(max_length=100)   # марка (Toyota, BMW, etc.)
    model = models.CharField(max_length=100)  # модель (Camry, X5, etc.)
    year = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.plate_number} ({self.make} {self.model})"

class CarCheckPhoto(models.Model):
    car_check = models.ForeignKey("CarCheck", on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="car_checks/")
    analyzed_result = models.JSONField(null=True, blank=True)  # YOLO/ML output
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Appeal(models.Model):
    car_check = models.ForeignKey("CarCheck", on_delete=models.CASCADE, related_name="appeals")
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=[("open", "Open"), ("resolved", "Resolved")], default="open")
    created_at = models.DateTimeField(auto_now_add=True)
class CarCheck(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("appealed", "Appealed"),
    ]

    CLEANLINESS_CHOICES = [
        ("clean", "Clean"),
        ("dirty", "Dirty"),
        ("very_dirty", "Very Dirty"),
    ]

    DAMAGE_CHOICES = [
        ("none", "No Damage"),
        ("scratched", "Scratched"),
        ("dented", "Dented"),
    ]

    client = models.ForeignKey("Client", on_delete=models.CASCADE, related_name="checks")
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name="checks")

    cleanliness = models.CharField(max_length=20, choices=CLEANLINESS_CHOICES, null=True, blank=True)
    cleanliness_score = models.IntegerField(null=True, blank=True)

    damage = models.CharField(max_length=20, choices=DAMAGE_CHOICES, null=True, blank=True)
    damage_score = models.IntegerField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="created")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.car.plate_number} ({self.status})"

class Client(models.Model):
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.full_name


