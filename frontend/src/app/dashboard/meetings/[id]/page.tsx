'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { useMeetingSocket } from '@/hooks/useMeetingSocket';

const Icons = {
    ArrowLeft: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>,
    Upload: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>,
    UserTie: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>,
    Cap: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
    Check: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    Users: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    AcademicCap: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
    Document: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Pdf: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    Spinner: () => <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
    AlertCircle: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    PartyPopper: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655L9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21" /></svg>,
    ClockCircle: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// ── UPDATED: 5 steps — Submitted → HOD → Dean → PVC → Approved ──
const PIPELINE_STEPS = [
    { label: 'Submitted', icon: '📤' },
    { label: 'HOD Review', icon: '🎓' },
    { label: 'Dean Review', icon: '⚖️' },
    { label: 'PVC Review', icon: '🏛️' },
    { label: 'Approved', icon: '✅' },
];

const STATUS_MAP: Record<string, { bg: string, text: string, dot: string, label: string }> = {
    approved: { bg: '#dcfce7', text: '#15803d', dot: '#16a34a', label: 'Approved' },
    draft: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8', label: 'Draft' },
    submitted: { bg: '#ede9fe', text: '#6d28d9', dot: '#7c3aed', label: 'Submitted' },
    pending_hod: { bg: '#fef3c7', text: '#92400e', dot: '#d97706', label: 'Pending HOD' },
    pending_dean: { bg: '#ffedd5', text: '#9a3412', dot: '#ea580c', label: 'Pending Dean' },
    pending_pvc: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6', label: 'Pending PVC' },
    changes_requested: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626', label: 'Changes Requested' },
};

// ── UPDATED: 5-step index map ──
const getPipelineStep = (status: string) => {
    const map: any = {
        submitted: 0,
        pending_hod: 1,
        pending_dean: 2,
        pending_pvc: 3,
        approved: 4,
    };
    return map[status] ?? -1;
};

const getInitials = (name: string) =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

export default function MeetingDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [meeting, setMeeting] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);
    const [role, setRole] = useState('faculty');
    const [realtimeUpdate, setRealtimeUpdate] = useState(false);

    useMeetingSocket(useCallback((update) => {
        if (update.data.id === Number(id)) {
            setMeeting((prev: any) => ({ ...prev, status: update.data.status }));
            setRealtimeUpdate(true);
            setTimeout(() => setRealtimeUpdate(false), 3000);
        }
    }, [id]));

    useEffect(() => {
        const savedRole = localStorage.getItem('role') || 'faculty';
        setRole(savedRole);
        api.get(`/meetings/${id}/`)
            .then(({ data }) => setMeeting(data))
            .catch(() => router.push('/dashboard/meetings'))
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleApprove = async () => {
        setApproving(true);
        try {
            const { data } = await api.post(`/meetings/${id}/approve/`);
            setMeeting((prev: any) => ({ ...prev, status: data.status }));
        } catch {
            alert('Something went wrong.');
        } finally {
            setApproving(false);
        }
    };

    const handleSubmit = async () => {
        setApproving(true);
        try {
            const { data } = await api.post(`/meetings/${id}/submit/`);
            setMeeting((prev: any) => ({ ...prev, status: data.status }));
        } catch {
            alert('Something went wrong.');
        } finally {
            setApproving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 max-w-7xl mx-auto w-full animate-pulse">
                <div className="w-32 h-4 bg-slate-200 rounded mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-slate-100 rounded-2xl h-40" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white border border-slate-100 rounded-2xl h-32" />
                            <div className="bg-white border border-slate-100 rounded-2xl h-32" />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl h-40" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl h-96" />
                </div>
            </div>
        );
    }

    if (!meeting) return null;

    const statusInfo = STATUS_MAP[meeting.status] || STATUS_MAP.draft;
    const pipelineStep = getPipelineStep(meeting.status);
    const isAdmin = role === 'admin';

    // ── UPDATED: includes pending_pvc ──
    const canApprove = isAdmin && ['submitted', 'pending_hod', 'pending_dean', 'pending_pvc'].includes(meeting.status);
    const isAwaitingApproval = !isAdmin && ['submitted', 'pending_hod', 'pending_dean', 'pending_pvc'].includes(meeting.status);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto animate-in fade-in duration-500">

            <Link
                href="/dashboard/meetings"
                className="group inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 text-sm font-semibold mb-4 transition-colors"
            >
                <span className="transform group-hover:-translate-x-1 transition-transform"><Icons.ArrowLeft /></span>
                Back to Directory
            </Link>

            {realtimeUpdate && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Status updated in real time
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">

                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Master Header Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                            <div>
                                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                    Meeting Reference
                                </div>
                                <div className="font-mono text-slate-900 font-extrabold text-2xl tracking-tight">
                                    {meeting.ref_number || 'DRAFT-MODE'}
                                </div>
                            </div>
                            <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border border-black/5"
                                style={{ background: statusInfo.bg, color: statusInfo.text }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.dot }} />
                                {statusInfo.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-3 pt-4 border-t border-slate-100">
                            {[
                                { label: 'Department', value: meeting.department },
                                { label: 'Class', value: meeting.class_name },
                                { label: 'Date', value: meeting.meeting_date },
                                { label: 'Venue', value: meeting.venue },
                                { label: 'Semester', value: `Sem ${meeting.semester}` },
                                { label: 'Academic Yr', value: meeting.academic_year },
                                { label: 'Chairperson', value: meeting.chairperson },
                                { label: 'Member Sec.', value: meeting.member_secretary },
                            ].map(row => (
                                <div key={row.label} className="flex flex-col">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">{row.label}</span>
                                    <span className="text-slate-800 text-xs font-semibold truncate" title={row.value}>{row.value || '—'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* People Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {meeting.faculty_members?.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                        <span className="text-teal-500"><Icons.Users /></span> Faculty Members
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400">{meeting.faculty_members.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {meeting.faculty_members.map((f: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 bg-slate-50/50">
                                            <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                {getInitials(f.name)}
                                            </div>
                                            <span className="text-slate-700 text-xs font-medium truncate">{f.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {meeting.class_reps?.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                        <span className="text-indigo-500"><Icons.AcademicCap /></span> Class Reps
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400">{meeting.class_reps.length}</span>
                                </div>
                                <div className="space-y-2">
                                    {meeting.class_reps.map((r: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-slate-50/50">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                                    {getInitials(r.name)}
                                                </div>
                                                <span className="text-slate-700 text-xs font-medium truncate">{r.name}</span>
                                            </div>
                                            {r.roll_number && <span className="text-slate-400 text-[10px] font-mono ml-2 flex-shrink-0">{r.roll_number}</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Meeting Minutes */}
                    {meeting.minutes?.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <span className="text-amber-500"><Icons.Document /></span> Meeting Minutes
                                </h3>
                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">
                                    {meeting.minutes.length} ITEMS
                                </span>
                            </div>
                            <div className="max-h-[180px] overflow-y-auto pr-2 space-y-2.5">
                                {meeting.minutes.map((m: any, i: number) => (
                                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                                        <span className="w-5 h-5 bg-white border border-slate-200 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 shadow-sm mt-0.5">
                                            {i + 1}
                                        </span>
                                        <p className="text-slate-700 text-xs leading-relaxed pt-0.5">{m.point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="space-y-4 lg:sticky lg:top-24">

                    {/* Approval Pipeline */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-5">Approval Progress</h3>
                        <div className="relative pl-1">
                            {PIPELINE_STEPS.map((step, i) => {
                                const isCompleted = i <= pipelineStep;
                                const isCurrent = i === pipelineStep + 1;
                                const isLast = i === PIPELINE_STEPS.length - 1;
                                return (
                                    <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
                                        {!isLast && (
                                            <div className={`absolute left-3.5 top-7 bottom-[-4px] w-0.5 rounded-full ${isCompleted ? 'bg-teal-400' : 'bg-slate-100'}`} />
                                        )}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shadow-sm
                                                ${isCompleted ? 'bg-teal-500 text-white' :
                                                    isCurrent ? 'bg-white border-2 border-teal-500 text-teal-600' :
                                                        'bg-slate-50 border border-slate-200 text-slate-400'}`}>
                                                {isCompleted ? <Icons.Check /> : step.icon}
                                            </div>
                                        </div>
                                        <div className="pt-1.5 flex flex-col">
                                            <div className={`text-xs font-bold ${isCompleted ? 'text-slate-800' : isCurrent ? 'text-teal-700' : 'text-slate-400'}`}>
                                                {step.label}
                                            </div>
                                            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                                                {isCompleted ? 'Completed' : isCurrent ? 'Pending' : 'Awaiting'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2.5">
                        {meeting.status === 'draft' && (
                            <button onClick={handleSubmit} disabled={approving}
                                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                                {approving ? <Icons.Spinner /> : <Icons.Upload />}
                                {approving ? 'Submitting...' : 'Submit for Approval'}
                            </button>
                        )}

                        {canApprove && (
                            <button onClick={handleApprove} disabled={approving}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                                {approving ? <Icons.Spinner /> : <Icons.Check />}
                                {approving ? 'Processing...' : 'Approve Document'}
                            </button>
                        )}

                        {isAwaitingApproval && (
                            <div className="w-full bg-amber-50 border border-amber-200 text-amber-700 py-2.5 px-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                                <span className="flex-shrink-0"><Icons.ClockCircle /></span>
                                Awaiting admin review.
                            </div>
                        )}

                        {meeting.status === 'approved' && (
                            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 px-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                                <span className="flex-shrink-0"><Icons.PartyPopper /></span>
                                Document fully approved.
                            </div>
                        )}

                        {meeting.status === 'changes_requested' && (
                            <div className="w-full bg-rose-50 border border-rose-200 text-rose-700 py-2.5 px-3 rounded-xl text-xs flex items-center gap-2 font-semibold">
                                <span className="flex-shrink-0"><Icons.AlertCircle /></span>
                                Changes requested.
                            </div>
                        )}

                        <button className="w-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                            <Icons.Pdf />
                            Export to PDF
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
            `}</style>
        </div>
    );
}