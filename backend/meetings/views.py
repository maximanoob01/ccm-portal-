from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count
from .models import Meeting, ApprovalLog
from .serializers import MeetingSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def broadcast_meeting_update(meeting, event_type='meeting_updated'):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'meetings',
        {
            'type': 'meeting_update',
            'data': {
                'id': meeting.id,
                'ref_number': meeting.ref_number,
                'status': meeting.status,
                'department': meeting.department,
                'event': event_type,
            }
        }
    )


APPROVAL_FLOW = {
    'submitted':    'pending_hod',
    'pending_hod':  'pending_dean',
    'pending_dean': 'pending_pvc',
    'pending_pvc':  'approved',
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
            broadcast_meeting_update(meeting, 'meeting_submitted')
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
            broadcast_meeting_update(meeting, 'meeting_approved')
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