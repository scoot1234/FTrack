from django.db import models
from django.contrib.auth.models import User

class Allowance(models.Model):
    allowance = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'allowance')
    recommended = models.CharField(max_length=255, default='recommended')
    networth = models.CharField(max_length=255, default='networth')
    monthlyspent = models.CharField(max_length=255, default='month')
    type = models.CharField(max_length=255, default='type')

    def __str__(self):
        return self.allowance