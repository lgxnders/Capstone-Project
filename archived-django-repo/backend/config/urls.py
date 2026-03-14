from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
	path("", lambda r: JsonResponse({"status": "ok"})), # debug
    path('admin/', admin.site.urls),
    path('api/', include('apps.api.urls')),
]