from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Meeting, ApprovalLog
from .serializers import MeetingSerializer

APPROVAL_FLOW = {
    'submitted': 'pending_hod',
    'pending_hod': 'pending_dean',
    'pending_dean': 'pending_pvc',
    'pending_pvc': 'approved',
}

class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Meeting.objects.all()
        if user.role == 'faculty':
            qs = qs.filter(created_by=user)
        dept = self.request.query_params.get('dept')
        status_filter = self.request.query_params.get('status')
        if dept:
            qs = qs.filter(department__icontains=dept)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        meeting = self.get_object()
        if meeting.status == 'draft':
            meeting.status = 'submitted'
            meeting.save()
        return Response({'status': meeting.status})

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        meeting = self.get_object()
        next_status = APPROVAL_FLOW.get(meeting.status)
        if next_status:
            meeting.status = next_status
            meeting.save()
            ApprovalLog.objects.create(
                meeting=meeting,
                action_by=request.user,
                action='approved',
                comment=request.data.get('comment', '')
            )
        return Response({'status': meeting.status})

    @action(detail=False, methods=['get'])
    def analytics(self, request):
        total = Meeting.objects.count()
        approved = Meeting.objects.filter(status='approved').count()
        pending = Meeting.objects.exclude(status__in=['draft', 'approved']).count()
        by_dept = list(Meeting.objects.values('department').annotate(count=Count('id')))
        return Response({
            'total': total,
            'approved': approved,
            'pending': pending,
            'by_department': by_dept,
        })