from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


# class User(models.Model):
#     user_id = models.AutoField(primary_key=True)
#     session_id = models.CharField(max_length=255, unique=True, blank=True, null=True)
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"User ID: {self.user_id} | Session: {self.session_id or 'None'}"





class Chatbot(models.Model):
    """
    Model representing a chatbot instance associated with a user.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="chatbots",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    last_interaction = models.DateTimeField(auto_now=True)
    initial_prompt = models.TextField(blank=True)

    def __str__(self):
        return f"Chatbot for User ID: {self.user.user_id if self.user else 'Anonymous'} | Created at: {self.created_at}"


class Message(models.Model):
    """
    Model representing a message exchanged between the user and the chatbot.
    """

    class SenderType(models.TextChoices):
        USER = "user", "User"
        CHATBOT = "chatbot", "Chatbot"

    chatbot = models.ForeignKey(
        Chatbot,
        on_delete=models.CASCADE,
        related_name="messages",
    )
    sender = models.CharField(max_length=10, choices=SenderType.choices)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender} at {self.timestamp}"


class ResourceDb(models.Model):
    """
    Model representing a resource database query made by a chatbot or user.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resource_queries",
    )
    query_text = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    result_count = models.IntegerField(default=0)
    via_chatbot = models.BooleanField(default=False)

    def __str__(self):
        return f"ResourceDb Query: {self.query_text} | Results: {self.result_count}"


class Source(models.Model):
    """
    Origin/source of a resource (for transparency & verification).
    """
    name = models.CharField(max_length=200)
    website = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    """
    High-level category of a resource (e.g., Government, Community, Charity).
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Tag(models.Model):
    """
    Tag for categorizing resources by topic (e.g., youth, depression, anxiety).
    """
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Resource(models.Model):
    """
    Core curated mental health resource.
    """

    class ResourceType(models.TextChoices):
        CRISIS_HOTLINE = "crisis_hotline", "Crisis Hotline"
        COUNSELING_SERVICE = "counseling_service", "Counseling Service"
        SUPPORT_GROUP = "support_group", "Support Group"
        SELF_HELP_MATERIAL = "self_help_material", "Self-help Material"
        HOSPITAL = "hospital", "Hospital"
        ONLINE_RESOURCE = "online_resource", "Online Resource"

    class UrgencyLevel(models.TextChoices):
        LOW = "low", "Low"
        MEDIUM = "medium", "Medium"
        HIGH = "high", "High"
        CRISIS = "crisis", "Crisis"

    class VerificationStatus(models.TextChoices):
        UNVERIFIED = "unverified", "Unverified"
        VERIFIED = "verified", "Verified"
        FLAGGED = "flagged", "Flagged"

    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField(max_length=500, blank=True, null=True)
    organization_name = models.CharField(max_length=200, blank=True, null=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resources",
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="resources",
    )
    source = models.ForeignKey(
        Source,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="resources",
    )

    # Location
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    province_state = models.CharField(max_length=100, blank=True, null=True)

    resource_type = models.CharField(
        max_length=50,
        choices=ResourceType.choices,
        default=ResourceType.ONLINE_RESOURCE,
    )
    urgency_level = models.CharField(
        max_length=20,
        choices=UrgencyLevel.choices,
        default=UrgencyLevel.MEDIUM,
    )
    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.UNVERIFIED,
    )

    last_verified = models.DateTimeField(default=timezone.now)

    # Contact Information
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
