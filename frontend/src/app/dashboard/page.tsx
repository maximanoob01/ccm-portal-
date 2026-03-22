'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

// --- Inline SVGs for a polished look ---
const Icons = {
    ClipboardList: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>,
    CheckCircle: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    Clock: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    DocumentEdit: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
    Plus: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    EmptyBox: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
};

export default function Dashboard() {
    const router = useRouter();
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/meetings/')
            .then(({ data }) => setMeetings(data))
            .catch(() => router.push('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const stats = [
        { label: 'Total Meetings', value: meetings.length, bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', text: 'text-indigo-600', icon: <Icons.ClipboardList /> },
        { label: 'Approved', value: meetings.filter(m => m.status === 'approved').length, bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', text: 'text-emerald-600', icon: <Icons.CheckCircle /> },
        { label: 'Pending', value: meetings.filter(m => !['approved', 'draft'].includes(m.status)).length, bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-600', icon: <Icons.Clock /> },
        { label: 'Drafts', value: meetings.filter(m => m.status === 'draft').length, bg: 'bg-slate-50', iconBg: 'bg-slate-200', text: 'text-slate-600', icon: <Icons.DocumentEdit /> },
    ];

    const statusColor: Record<string, string> = {
        approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        draft: 'bg-slate-100 text-slate-700 border-slate-200',
        submitted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        pending_hod: 'bg-amber-50 text-amber-700 border-amber-200',
        pending_dean: 'bg-orange-50 text-orange-700 border-orange-200',
        pending_pvc: 'bg-blue-50 text-blue-700 border-blue-200',
        changes_requested: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-1 font-medium">Academic Year 2025-26 · Even Semester</p>
            </div>

            {/* Quick create banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-indigo-800 rounded-2xl shadow-lg shadow-teal-900/10 mb-6 border border-white/10">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div>
                        <div className="inline-block px-2.5 py-0.5 bg-white/20 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-2">
                            Quick Action
                        </div>
                        <h2 className="text-white font-extrabold text-xl md:text-2xl tracking-tight mb-0.5">Create New CCM Meeting</h2>
                        <p className="text-teal-100 text-xs md:text-sm font-medium opacity-90">Start drafting a new Class Committee Meeting agenda and minutes.</p>
                    </div>
                    <Link
                        href="/dashboard/new-meeting"
                        className="group flex items-center gap-2 bg-white text-teal-800 font-bold px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 flex-shrink-0 text-sm"
                    >
                        <Icons.Plus />
                        New Meeting
                    </Link>
                </div>
            </div>

            {/* Stats Grid (Compact Horizontal Layout) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                {stats.map(s => (
                    <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 cursor-default flex items-center gap-4">
                        {/* Left side: Icon */}
                        <div className={`w-10 h-10 flex-shrink-0 ${s.iconBg} ${s.text} rounded-lg flex items-center justify-center`}>
                            {s.icon}
                        </div>
                        {/* Right side: Text & Number */}
                        <div className="min-w-0">
                            <div className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider truncate mb-0.5">
                                {s.label}
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
                                {loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none px-2">0</span> : s.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Meetings Table Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col min-h-[300px]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
                    <h2 className="text-base font-bold text-slate-800">Recent Meetings</h2>
                    <Link href="/dashboard/meetings" className="text-teal-600 text-sm font-semibold hover:text-teal-700 hover:underline transition-colors flex items-center gap-1">
                        View All <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>

                {loading ? (
                    // Skeleton Loading State
                    <div className="divide-y divide-slate-100 flex-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="px-6 py-3.5 flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-4 bg-slate-200 rounded"></div>
                                    <div className="hidden md:block w-28 h-4 bg-slate-100 rounded"></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-5 bg-slate-100 rounded-full"></div>
                                    <div className="w-8 h-4 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : meetings.length === 0 ? (
                    // Empty State
                    <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                            <Icons.EmptyBox />
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1">No meetings found</h3>
                        <p className="text-slate-500 text-xs mb-5 max-w-xs">You haven't created or participated in any meetings yet.</p>
                        <Link
                            href="/dashboard/new-meeting"
                            className="bg-teal-600 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-teal-700 hover:shadow-md transition-all flex items-center gap-1.5"
                        >
                            <Icons.Plus />
                            Create First Meeting
                        </Link>
                    </div>
                ) : (
                    // Data Table
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 sticky top-0">
                                <tr>
                                    {['Ref No.', 'Department', 'Class', 'Date', 'Status', ''].map((h, i) => (
                                        <th key={h} className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wider ${i === 5 ? 'text-right' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {meetings.slice(0, 6).map((m: any) => (
                                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                        <td className="px-5 py-3">
                                            <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-1 rounded md text-[11px]">{m.ref_number || 'DRAFT'}</span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-700 font-medium text-xs">
                                            {m.department || '—'}
                                        </td>
                                        <td className="px-5 py-3 text-slate-500 text-xs">
                                            {m.class_name || '—'}
                                        </td>
                                        <td className="px-5 py-3 text-slate-500 text-xs">
                                            {m.meeting_date || '—'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor[m.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                {m.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Link
                                                href={`/dashboard/meetings/${m.id}`}
                                                className="inline-flex items-center text-teal-600 font-bold hover:text-teal-800 transition-colors text-xs opacity-0 group-hover:opacity-100 md:opacity-100"
                                            >
                                                View <span className="ml-1" aria-hidden="true">&rarr;</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}