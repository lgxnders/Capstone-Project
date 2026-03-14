from django.contrib import admin
from .models import (
    Chatbot,
    Message,
    ResourceDb,
    Source,
    Category,
    Tag,
    Resource,
)

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ("sender", "content", "timestamp")

# Admin model registrations
# Note: User model is already registered by Django automatically,
# so we don't import or register it here

@admin.register(Chatbot)
class ChatbotAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "last_interaction")
    search_fields = ("user__username",)  # Changed: Django's User has 'username', not 'session_id'
    list_filter = ("created_at", "last_interaction")
    inlines = [MessageInline]


@admin.register(ResourceDb)
class ResourceDbAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "query_text", "result_count", "via_chatbot", "created_at")
    search_fields = ("query_text", "user__username")  # Changed: Django's User has 'username', not 'session_id'
    list_filter = ("via_chatbot", "created_at")


@admin.register(Source)
class SourceAdmin(admin.ModelAdmin):
    list_display = ("name", "website")
    search_fields = ("name", "website")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "resource_type",
        "urgency_level",
        "verification_status",
        "country",
        "province_state",
        "city",
        "created_at",
        "last_verified",
    )
    list_filter = (
        "resource_type",
        "urgency_level",
        "verification_status",
        "country",
        "province_state",
        "category",
        "tags",
        "source",
    )
    search_fields = (
        "title",
        "description",
        "organization_name",
        "url",
        "city",
        "province_state",
        "country",
    )
    filter_horizontal = ("tags",)
    ordering = ("title",)