from django.db import models
from django.contrib.auth.models import User

class Vehicle(models.Model):
    year = models.IntegerField()
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    engine = models.CharField(max_length=100, blank=True, null=True)
    trim = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

class Tool(models.Model):
    name = models.CharField(max_length=100)
    affiliate_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class Part(models.Model):
    name = models.CharField(max_length=100)
    part_number = models.CharField(max_length=100)
    affiliate_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.part_number})"

class Tutorial(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    estimated_time = models.CharField(max_length=50)
    difficulty = models.CharField(max_length=50)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    tools = models.ManyToManyField(Tool, blank=True)
    parts = models.ManyToManyField(Part, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Step(models.Model):
    tutorial = models.ForeignKey(Tutorial, related_name='steps', on_delete=models.CASCADE)
    step_number = models.IntegerField()
    instruction = models.TextField()
    image = models.ImageField(upload_to='steps/', blank=True, null=True)

    def __str__(self):
        return f"Step {self.step_number} of {self.tutorial.title}"