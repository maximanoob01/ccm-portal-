from django.db import models
from accounts.models import User
import uuid

def generate_ref():
    count = Meeting.objects.count() + 1
    return f"CCM-2526-{str(count).zfill(3)}"

class Meeting(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('pending_hod', 'Pending HOD'),
        ('pending_dean', 'Pending Dean'),
        ('pending_pvc', 'Pending PVC'),
        ('approved', 'Approved'),
        ('changes_requested', 'Changes Requested'),
    ]
    ref_number = models.CharField(max_length=30, unique=True, blank=True)
    department = models.CharField(max_length=100)
    academic_year = models.CharField(max_length=20, default='2025-26')
    class_name = models.CharField(max_length=100)
    semester = models.CharField(max_length=10)
    venue = models.CharField(max_length=100)
    meeting_date = models.DateField()
    chairperson = models.CharField(max_length=100)
    member_secretary = models.CharField(max_length=100)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='draft')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meetings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ref_number:
            count = Meeting.objects.count() + 1
            self.ref_number = f"CCM-2526-{str(count).zfill(3)}"
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.ref_number


class FacultyMember(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='faculty_members')
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)


class ClassRepresentative(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='class_reps')
    name = models.CharField(max_length=100)
    roll_number = models.CharField(max_length=20, blank=True)
    order = models.PositiveIntegerField(default=0)


class MeetingMinute(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='minutes')
    point = models.TextField()
    order = models.PositiveIntegerField(default=0)


class ApprovalLog(models.Model):
    ACTION_CHOICES = [
        ('approved', 'Approved'),
        ('changes_requested', 'Changes Requested'),
    ]
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='approval_logs')
    action_by = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=25, choices=ACTION_CHOICES)
    comment = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)