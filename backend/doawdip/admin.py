from django.contrib import admin
from .models import Reminder
# Register your models here.


class ReminderAdmin(admin.ModelAdmin):
    list = ('title', 'body', 'completed', 'created_at')


admin.site.register(Reminder, ReminderAdmin)
