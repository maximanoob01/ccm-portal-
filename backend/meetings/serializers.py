from rest_framework import serializers
from .models import Meeting, FacultyMember, ClassRepresentative, MeetingMinute

class FacultyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyMember
        fields = ['id', 'name', 'order']

class ClassRepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRepresentative
        fields = ['id', 'name', 'roll_number', 'order']

class MinuteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingMinute
        fields = ['id', 'point', 'order']

class MeetingSerializer(serializers.ModelSerializer):
    faculty_members = FacultyMemberSerializer(many=True, required=False)
    class_reps = ClassRepSerializer(many=True, required=False)
    minutes = MinuteSerializer(many=True, required=False)
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Meeting
        fields = '__all__'
        read_only_fields = ['ref_number', 'created_by', 'status']

    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name()

    def create(self, validated_data):
        faculty_data = validated_data.pop('faculty_members', [])
        reps_data = validated_data.pop('class_reps', [])
        minutes_data = validated_data.pop('minutes', [])
        meeting = Meeting.objects.create(**validated_data)
        for f in faculty_data:
            FacultyMember.objects.create(meeting=meeting, **f)
        for r in reps_data:
            ClassRepresentative.objects.create(meeting=meeting, **r)
        for m in minutes_data:
            MeetingMinute.objects.create(meeting=meeting, **m)
        return meeting