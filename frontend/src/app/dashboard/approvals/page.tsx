'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { useMeetingSocket } from '@/hooks/useMeetingSocket';

const Icons = {
    Upload: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>,
    Cap: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>,
    Scale: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" /></svg>,
    Building: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>,
    Check: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    Clock: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    CheckCircle: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    Undo: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>,
    List: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0z" /></svg>,
    ChevronDown: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
    ChevronUp: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>,
    User: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    Calendar: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>,
    Book: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>,
    Spinner: () => <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
    Party: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M11.412 15.655 9.75 21.75l3.745-4.012M9.257 13.5H3.75l2.659-2.849m2.048-2.194L14.25 2.25 12 10.5h8.25l-4.707 5.043M8.457 8.457L3 3m5.457 5.457l7.086 7.086m0 0L21 21" /></svg>
};

// ── UPDATED: 3-level approval flow (no Chairperson, no PVC step) ──
const STATUS_FLOW: any = {
    submitted: { next: 'pending_hod', action: 'Approve & Send to HOD' },
    pending_hod: { next: 'pending_dean', action: 'Approve & Send to Dean' },
    pending_dean: { next: 'approved', action: 'Final Approve' },
};

const STATUS_COLORS: any = {
    submitted: { bg: '#ede9fe', text: '#6d28d9', dot: '#7c3aed' },
    pending_hod: { bg: '#fef3c7', text: '#92400e', dot: '#d97706' },
    pending_dean: { bg: '#ffedd5', text: '#9a3412', dot: '#ea580c' },
    approved: { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
    draft: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
    changes_requested: { bg: '#fee2e2', text: '#991b1b', dot: '#dc2626' },
};

// ── UPDATED: 4 steps (Submitted → HOD → Dean → Approved) ──
const PIPELINE = [
    { key: 'submitted', label: 'Submitted', icon: '📤' },
    { key: 'pending_hod', label: 'HOD', icon: '🎓' },
    { key: 'pending_dean', label: 'Dean', icon: '⚖️' },
    { key: 'approved', label: 'Approved', icon: '✅' },
];

export default function ApprovalsPage() {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [comments, setComments] = useState<{ [id: number]: string }>({});
    const [expanded, setExpanded] = useState<number | null>(null);
    const [tab, setTab] = useState<'pending' | 'all'>('pending');
    const [doneMap, setDoneMap] = useState<{ [id: number]: 'approved' | 'rejected' }>({});
    const [connected, setConnected] = useState(false);

    useMeetingSocket(useCallback((update) => {
        setConnected(true);
        const { id, status } = update.data;
        
        setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        
        setDoneMap(prev => {
            const nextMap = { ...prev };
            delete nextMap[id];
            return nextMap;
        });
    }, []));

    useEffect(() => {
        api.get('/meetings/')
            .then(({ data }) => setMeetings(data))
            .finally(() => setLoading(false));
    }, []);

    // ── UPDATED: removed pending_pvc ──
    const canAct = (status: string) =>
        ['submitted', 'pending_hod', 'pending_dean'].includes(status);

    const pending = meetings.filter(m => canAct(m.status));
    const displayed = tab === 'pending' ? pending : meetings;

    // ── UPDATED: 4-step index map ──
    const getPipelineIdx = (status: string) => {
        const map: any = {
            submitted: 0,
            pending_hod: 1,
            pending_dean: 2,
            approved: 3,
        };
        return map[status] ?? -1;
    };

    const handleApprove = async (m: any) => {
        setActionLoading(m.id);
        try {
            await api.post(`/meetings/${m.id}/approve/`, { comment: comments[m.id] || '' });
            const nextStatus = STATUS_FLOW[m.status]?.next || m.status;
            setMeetings(prev => prev.map(x => x.id === m.id ? { ...x, status: nextStatus } : x));
            setDoneMap(prev => ({ ...prev, [m.id]: 'approved' }));
            setExpanded(null);
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (m: any) => {
        setActionLoading(m.id);
        try {
            await api.post(`/meetings/${m.id}/approve/`, { comment: comments[m.id] || 'Changes requested.' });
            setMeetings(prev => prev.map(x => x.id === m.id ? { ...x, status: 'changes_requested' } : x));
            setDoneMap(prev => ({ ...prev, [m.id]: 'rejected' }));
            setExpanded(null);
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const StatCard = ({ label, value, icon, bg, text }: any) => (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${bg} ${text}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <div className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate mb-0.5">{label}</div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-none">
                    {loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none px-2">0</span> : value}
                </div>
            </div>
        </div>
    );

    const Badge = ({ status }: { status: string }) => {
        const c = STATUS_COLORS[status] || STATUS_COLORS.draft;
        return (
            <span style={{ background: c.bg, color: c.text, borderColor: c.dot }} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border border-opacity-20">
                <span style={{ background: c.dot }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" />
                {status.replace(/_/g, ' ')}
            </span>
        );
    };

    const Pipeline = ({ status }: { status: string }) => {
        const currentIdx = getPipelineIdx(status);
        return (
            <div className="flex items-center px-2 py-4 mt-2">
                {PIPELINE.map((step, i) => {
                    const done = i < currentIdx || status === 'approved';
                    const current = i === currentIdx && status !== 'approved';
                    return (
                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-2 flex-shrink-0 w-14">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${done ? 'bg-teal-500 text-white shadow-md' :
                                        current ? 'bg-white border-2 border-teal-500 text-teal-600 shadow-sm' :
                                            'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}>
                                    {done ? <Icons.Check /> : step.icon}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${current ? 'text-teal-700' : done ? 'text-slate-600' : 'text-slate-400'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>
                            {i < PIPELINE.length - 1 && (
                                <div className="flex-1 px-2 mb-5">
                                    <div className={`h-1 rounded-full w-full transition-colors duration-300 ${done ? 'bg-teal-400' : 'bg-slate-100'}`} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="animate-in fade-in duration-500 p-6">

            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Approvals</h1>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {connected ? 'Live' : 'Connecting...'}
                    </div>
                </div>
                <p className="text-slate-500 text-sm mt-1.5 font-medium">Review, comment, and process meeting submissions.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard label="Pending Action" value={pending.length} icon={<Icons.Clock />} bg="bg-amber-50" text="text-amber-600" />
                <StatCard label="Approved" value={meetings.filter(m => m.status === 'approved').length} icon={<Icons.CheckCircle />} bg="bg-emerald-50" text="text-emerald-600" />
                <StatCard label="Changes Req." value={meetings.filter(m => m.status === 'changes_requested').length} icon={<Icons.Undo />} bg="bg-rose-50" text="text-rose-600" />
                <StatCard label="Total Meetings" value={meetings.length} icon={<Icons.List />} bg="bg-indigo-50" text="text-indigo-600" />
            </div>

            {/* Tabs */}
            <div className="flex mb-6">
                <div className="bg-slate-200/50 p-1.5 rounded-xl flex gap-1 w-full md:w-auto shadow-inner">
                    <button onClick={() => setTab('pending')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        Action Required <span className="ml-1.5 px-2 py-0.5 bg-slate-100 rounded-full text-xs">{pending.length}</span>
                    </button>
                    <button onClick={() => setTab('all')} className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        All History <span className="ml-1.5 px-2 py-0.5 bg-slate-100 rounded-full text-xs">{meetings.length}</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="w-32 h-5 bg-slate-200 rounded mb-3" />
                                    <div className="w-48 h-4 bg-slate-100 rounded mb-2" />
                                    <div className="w-40 h-3 bg-slate-100 rounded" />
                                </div>
                                <div className="w-20 h-8 bg-slate-100 rounded-lg" />
                            </div>
                            <div className="w-full h-8 bg-slate-50 rounded mt-4" />
                        </div>
                    ))}
                </div>
            ) : displayed.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="text-teal-500 mb-6 opacity-80"><Icons.Party /></div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">All caught up!</h3>
                    <p className="text-slate-500 text-sm max-w-sm">
                        {tab === 'pending' ? "No meetings waiting for approval right now." : "No meetings recorded yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-5">
                    {displayed.map((m: any) => {
                        const isExpanded = expanded === m.id;
                        const isDone = doneMap[m.id];
                        const actable = canAct(m.status) && !isDone;

                        return (
                            <div key={m.id} className={`bg-white border transition-all duration-300 rounded-2xl overflow-hidden ${isExpanded ? 'border-teal-300 shadow-md ring-4 ring-teal-50' : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'}`}>

                                {/* Card Header */}
                                <div className="p-5 md:p-6 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : m.id)}>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2.5 flex-wrap">
                                                <span className="font-mono text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md font-bold text-xs border border-slate-200">
                                                    {m.ref_number || 'DRAFT'}
                                                </span>
                                                <Badge status={m.status} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-1.5 truncate">{m.department}</h3>
                                            <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs font-medium">
                                                <span className="flex items-center gap-1.5"><Icons.Book /> {m.class_name}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="flex items-center gap-1.5"><Icons.Calendar /> {m.meeting_date}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                <span className="flex items-center gap-1.5"><Icons.User /> {m.created_by_name || 'System'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0 mt-2 md:mt-0">
                                            {isDone ? (
                                                <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${isDone === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                                    {isDone === 'approved' ? '✓ Approved' : '↩ Returned'}
                                                </span>
                                            ) : (
                                                <button onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : m.id); }}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isExpanded ? 'bg-slate-100 text-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                    {isExpanded ? 'Hide Details' : 'Review'}
                                                    {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50" onClick={e => e.stopPropagation()}>
                                        <Pipeline status={m.status} />
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="border-t border-slate-100 bg-slate-50/50">
                                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Meeting Particulars</div>
                                                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                                                    {[
                                                        { l: 'Chairperson', v: m.chairperson },
                                                        { l: 'Member Secretary', v: m.member_secretary },
                                                        { l: 'Venue', v: m.venue },
                                                        { l: 'Academic Year', v: m.academic_year },
                                                    ].map(row => (
                                                        <div key={row.l} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-slate-50 last:border-0">
                                                            <span className="text-slate-500 text-xs font-medium mb-1 sm:mb-0">{row.l}</span>
                                                            <span className="text-slate-800 text-sm font-semibold">{row.v || '—'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recorded Minutes</div>
                                                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">{m.minutes?.length || 0} ITEMS</span>
                                                </div>
                                                {m.minutes?.length > 0 ? (
                                                    <div className="bg-white border border-slate-200 rounded-xl p-4 max-h-[200px] overflow-y-auto space-y-3">
                                                        {m.minutes.map((min: any, i: number) => (
                                                            <div key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                                                                <span className="text-teal-500 font-extrabold flex-shrink-0 mt-0.5">{i + 1}.</span>
                                                                <span>{min.point}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="bg-white border border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-400">
                                                        No minutes recorded.
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {actable && (
                                            <div className="bg-slate-100/80 p-6 border-t border-slate-200">
                                                <div className="max-w-3xl">
                                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">Approval Decision</label>
                                                    <textarea
                                                        value={comments[m.id] || ''}
                                                        onChange={e => setComments(prev => ({ ...prev, [m.id]: e.target.value }))}
                                                        placeholder="Add an optional comment or state required changes..."
                                                        rows={2}
                                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none bg-white shadow-sm mb-4 transition-all"
                                                    />
                                                    <div className="flex flex-wrap gap-3">
                                                        <button onClick={() => handleApprove(m)} disabled={actionLoading === m.id}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all disabled:opacity-70">
                                                            {actionLoading === m.id ? <Icons.Spinner /> : <Icons.Check />}
                                                            {actionLoading === m.id ? 'Processing...' : (STATUS_FLOW[m.status]?.action || 'Approve')}
                                                        </button>
                                                        <button onClick={() => handleReject(m)} disabled={actionLoading === m.id}
                                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all disabled:opacity-50">
                                                            {actionLoading === m.id ? <Icons.Spinner /> : <Icons.Undo />}
                                                            Request Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}