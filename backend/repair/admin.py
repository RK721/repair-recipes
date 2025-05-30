from django.contrib import admin
from .models import Vehicle, Tool, Part, Tutorial, Step

admin.site.register(Vehicle)
admin.site.register(Tool)
admin.site.register(Part)
admin.site.register(Tutorial)
admin.site.register(Step)
