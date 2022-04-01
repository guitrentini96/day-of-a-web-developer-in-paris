from django.db import models

# Create your models here.


class Reminder(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    priority = models.BooleanField(default=False)

    def __str__(self):
        return self.title
