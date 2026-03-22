'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useMeetingSocket } from '@/hooks/useMeetingSocket';

const Icons = {
    Plus: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
    Search: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
    Filter: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>,
    Wifi: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" /></svg>,
    EmptyBox: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    SearchOff: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" /></svg>
};

const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-slate-100 text-slate-700 border-slate-200',
    submitted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pending_hod: 'bg-amber-50 text-amber-700 border-amber-200',
    pending_dean: 'bg-orange-50 text-orange-700 border-orange-200',
    pending_pvc: 'bg-blue-50 text-blue-700 border-blue-200',
    changes_requested: 'bg-red-50 text-red-700 border-red-200',
};

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [connected, setConnected] = useState(false);
    const [flashId, setFlashId] = useState<number | null>(null);

    const fetchMeetings = useCallback(() => {
        api.get('/meetings/').then(({ data }) => setMeetings(data));
    }, []);

    useEffect(() => {
        api.get('/meetings/')
            .then(({ data }) => setMeetings(data))
            .finally(() => setLoading(false));
    }, []);

    // ── WebSocket: live status updates ──
    useMeetingSocket(useCallback((update) => {
        setConnected(true);
        const { id, status } = update.data;

        // Update status in place — no full reload needed
        setMeetings(prev => {
            const exists = prev.find(m => m.id === id);
            if (exists) {
                // Flash the updated row
                setFlashId(id);
                setTimeout(() => setFlashId(null), 2000);
                return prev.map(m => m.id === id ? { ...m, status } : m);
            }
            // New meeting added — do a full refresh
            fetchMeetings();
            return prev;
        });
    }, [fetchMeetings]));

    const filtered = meetings.filter(m => {
        const matchSearch = !search ||
            m.ref_number?.toLowerCase().includes(search.toLowerCase()) ||
            m.department?.toLowerCase().includes(search.toLowerCase()) ||
            m.class_name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || m.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const isFiltering = search !== '' || statusFilter !== 'all';

    return (
        <div className="animate-in fade-in duration-500 p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Meeting Directory</h1>
                        {/* Live indicator */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${connected
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            {connected ? 'Live' : 'Connecting...'}
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        {loading ? 'Loading records...' : `Showing ${filtered.length} of ${meetings.length} total records`}
                    </p>
                </div>
                <Link
                    href="/dashboard/new-meeting"
                    className="flex items-center gap-2 bg-teal-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full md:w-auto justify-center"
                >
                    <Icons.Plus />
                    New Meeting
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                        <Icons.Search />
                    </span>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by reference, department, class..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all focus:bg-white"
                    />
                </div>
                <div className="relative min-w-[200px] group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Icons.Filter />
                    </span>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all focus:bg-white appearance-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="pending_hod">Pending HOD</option>
                        <option value="pending_dean">Pending Dean</option>
                        <option value="pending_pvc">Pending PVC</option>
                        <option value="approved">Approved</option>
                        <option value="changes_requested">Changes Requested</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
                {loading ? (
                    <div className="divide-y divide-slate-100 flex-1 p-2">
                        <div className="px-6 py-4 flex gap-4 border-b border-slate-100">
                            {[16, 24, 20].map((w, i) => (
                                <div key={i} className={`w-${w} h-4 bg-slate-100 rounded`} />
                            ))}
                        </div>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="w-24 h-5 bg-slate-100 rounded" />
                                    <div className="w-1/4 h-4 bg-slate-100 rounded" />
                                    <div className="w-1/5 h-4 bg-slate-100 rounded hidden md:block" />
                                    <div className="flex-1" />
                                    <div className="w-20 h-6 bg-slate-100 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                            {isFiltering ? <Icons.SearchOff /> : <Icons.EmptyBox />}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                            {isFiltering ? 'No matching results' : 'No meetings found'}
                        </h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-sm">
                            {isFiltering
                                ? "No meetings match your current search or filter."
                                : "You don't have any meetings recorded yet."}
                        </p>
                        {isFiltering ? (
                            <button
                                onClick={() => { setSearch(''); setStatusFilter('all'); }}
                                className="text-teal-600 font-semibold text-sm hover:text-teal-700 hover:underline"
                            >
                                Clear all filters
                            </button>
                        ) : (
                            <Link
                                href="/dashboard/new-meeting"
                                className="bg-teal-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-teal-700 transition-all shadow-sm flex items-center gap-2"
                            >
                                <Icons.Plus /> Create First Meeting
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                                <tr>
                                    {['Ref No.', 'Department', 'Class', 'Semester', 'Date', 'Status', 'Actions'].map((h, i) => (
                                        <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider ${i === 6 ? 'text-right' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((m: any) => (
                                    <tr
                                        key={m.id}
                                        className={`transition-all group ${flashId === m.id
                                                ? 'bg-teal-50 border-l-4 border-teal-400'
                                                : 'hover:bg-slate-50/80'
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2.5 py-1.5 rounded-md text-xs border border-slate-200/60">
                                                    {m.ref_number || 'DRAFT'}
                                                </span>
                                                {flashId === m.id && (
                                                    <span className="flex items-center gap-1 text-teal-600 text-[10px] font-bold animate-pulse">
                                                        <Icons.Wifi /> Updated
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-medium">{m.department || '—'}</td>
                                        <td className="px-6 py-4 text-slate-600">{m.class_name || '—'}</td>
                                        <td className="px-6 py-4 text-slate-600">{m.semester ? `Sem ${m.semester}` : '—'}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">{m.meeting_date || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${STATUS_COLORS[m.status] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                {m.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/dashboard/meetings/${m.id}`}
                                                className="inline-flex items-center text-teal-600 font-bold hover:text-teal-800 transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-teal-50"
                                            >
                                                View
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