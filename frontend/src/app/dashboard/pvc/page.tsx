'use client';
import { JSX, useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// --- Inline SVGs for a polished look ---
const Icons = {
    Building: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>,
    ClipboardList: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>,
    CheckCircle: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    Clock: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    Office: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
    DocumentEdit: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
    Search: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
    Filter: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" /></svg>,
    Download: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>,
    Pdf: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    EmptyBox: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
};

const MONTHLY_DATA = [
    { month: 'Sep', meetings: 3 },
    { month: 'Oct', meetings: 8 },
    { month: 'Nov', meetings: 12 },
    { month: 'Dec', meetings: 5 },
    { month: 'Jan', meetings: 14 },
    { month: 'Feb', meetings: 18 },
    { month: 'Mar', meetings: 9 },
];

const STATUS_COLORS: Record<string, string> = {
    approved: '#0d9488',
    draft: '#94a3b8',
    submitted: '#8b5cf6',
    pending_hod: '#f59e0b',
    pending_dean: '#f97316',
    pending_pvc: '#3b82f6',
    changes_requested: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
    approved: 'Approved',
    draft: 'Draft',
    submitted: 'Submitted',
    pending_hod: 'Pending HOD',
    pending_dean: 'Pending Dean',
    pending_pvc: 'Pending PVC',
    changes_requested: 'Changes Requested',
};

const DEPT_COLORS = ['#0d9488', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

interface Meeting {
    id: number;
    ref_number: string;
    department: string;
    class_name: string;
    semester: string;
    meeting_date: string;
    status: string;
    created_by_name: string;
}

interface Analytics {
    total: number;
    approved: number;
    pending: number;
    by_department: { department: string; count: number }[];
}

interface StatCardProps {
    label: string;
    value: number | string | JSX.Element;
    icon: JSX.Element;
    colorClass: string;
    bgClass: string;
    sub?: string;
}

function StatCard({ label, value, icon, colorClass, bgClass, sub }: StatCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} ${colorClass}`}>
                    {icon}
                </div>
                {sub && (
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-1 rounded-full uppercase tracking-wider border border-teal-100">
                        {sub}
                    </span>
                )}
            </div>
            <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</div>
                <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</div>
            </div>
        </div>
    );
}

export default function PVCDashboard() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deptFilter, setDeptFilter] = useState('all');

    useEffect(() => {
        Promise.all([
            api.get('/meetings/'),
            api.get('/meetings/analytics/'),
        ]).then(([m, a]) => {
            setMeetings(m.data);
            setAnalytics(a.data);
        }).finally(() => setLoading(false));
    }, []);

    // Dept chart data
    const deptMap: Record<string, number> = {};
    meetings.forEach(m => {
        const key = m.department || 'Unknown';
        deptMap[key] = (deptMap[key] || 0) + 1;
    });
    const deptData = Object.entries(deptMap).map(([dept, count], i) => ({
        dept: dept.split(' ').slice(-2).join(' '),
        fullDept: dept,
        count,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
    }));

    // Pie data
    const statusMap: Record<string, number> = {};
    meetings.forEach(m => {
        statusMap[m.status] = (statusMap[m.status] || 0) + 1;
    });
    const pieData = Object.entries(statusMap).map(([status, value]) => ({
        name: STATUS_LABELS[status] || status,
        value,
        color: STATUS_COLORS[status] || '#94a3b8',
    }));

    const depts = [...new Set(meetings.map(m => m.department))];

    const notApprovedOrDraft = (m: Meeting) =>
        m.status !== 'approved' && m.status !== 'draft';

    const filtered = meetings.filter(m => {
        const q = search.toLowerCase();
        const matchSearch =
            !search ||
            m.ref_number?.toLowerCase().includes(q) ||
            m.department?.toLowerCase().includes(q) ||
            m.class_name?.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'all' || m.status === statusFilter;
        const matchDept = deptFilter === 'all' || m.department === deptFilter;
        return matchSearch && matchStatus && matchDept;
    });

    // Custom Tooltip style for Recharts
    const tooltipStyle = {
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        fontSize: '13px',
        fontWeight: 600,
        color: '#0f172a'
    };

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md">
                            <Icons.Building />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PVC Overview</h1>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">
                        Monitor academic meetings and compliance across COER University.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                <StatCard
                    label="Total Meetings"
                    value={loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none">00</span> : (analytics?.total ?? meetings.length)}
                    icon={<Icons.ClipboardList />}
                    bgClass="bg-teal-50"
                    colorClass="text-teal-600"
                    sub="+9 this month"
                />
                <StatCard
                    label="Approved"
                    value={loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none">00</span> : (analytics?.approved ?? meetings.filter(m => m.status === 'approved').length)}
                    icon={<Icons.CheckCircle />}
                    bgClass="bg-emerald-50"
                    colorClass="text-emerald-600"
                />
                <StatCard
                    label="Pending Approval"
                    value={loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none">00</span> : (analytics?.pending ?? meetings.filter(notApprovedOrDraft).length)}
                    icon={<Icons.Clock />}
                    bgClass="bg-amber-50"
                    colorClass="text-amber-600"
                />
                <StatCard
                    label="Departments"
                    value={loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none">00</span> : depts.length}
                    icon={<Icons.Office />}
                    bgClass="bg-indigo-50"
                    colorClass="text-indigo-600"
                />
                <StatCard
                    label="Drafts"
                    value={loading ? <span className="text-transparent bg-slate-200 rounded animate-pulse select-none">00</span> : meetings.filter(m => m.status === 'draft').length}
                    icon={<Icons.DocumentEdit />}
                    bgClass="bg-slate-100"
                    colorClass="text-slate-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <div className="mb-6 flex justify-between items-end">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Meetings Trend</h2>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Academic Year 2025-26</p>
                        </div>
                    </div>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                                <Line
                                    type="monotone"
                                    dataKey="meetings"
                                    name="Meetings"
                                    stroke="#0d9488"
                                    strokeWidth={3}
                                    dot={{ fill: '#ffffff', stroke: '#0d9488', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col">
                    <div className="mb-2">
                        <h2 className="text-lg font-bold text-slate-800">Status Distribution</h2>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Current breakdown</p>
                    </div>

                    {pieData.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
                            No data available
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="h-[180px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, i) => (
                                                <Cell key={`cell-${i}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 600 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Custom Legend */}
                            <div className="w-full mt-4 grid grid-cols-2 gap-x-2 gap-y-2">
                                {pieData.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: s.color }} />
                                        <span className="text-xs text-slate-600 font-medium truncate" title={s.name}>{s.name}</span>
                                        <span className="text-xs font-bold text-slate-800 ml-auto">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Department Bar Chart */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 mb-8">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">Department Compliance</h2>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Meetings conducted per department</p>
                </div>
                {deptData.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-slate-400 text-sm font-medium">
                        No department data yet
                    </div>
                ) : (
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" name="Meetings" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                    {deptData.map((entry, i) => (
                                        <Cell key={`cell-${i}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* Meeting Explorer Table */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col min-h-[400px]">

                {/* Explorer Header & Filters */}
                <div className="p-5 border-b border-slate-100 bg-white">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Meeting Explorer</h2>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <div className="flex-1 relative group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
                                <Icons.Search />
                            </span>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by reference, department..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all focus:bg-white"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[180px] group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none">
                                <Icons.Filter />
                            </span>
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all focus:bg-white appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Dept Filter */}
                        <div className="relative min-w-[200px] group">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none">
                                <Icons.Building />
                            </span>
                            <select
                                value={deptFilter}
                                onChange={e => setDeptFilter(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all focus:bg-white appearance-none cursor-pointer"
                            >
                                <option value="all">All Departments</option>
                                {depts.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Export Button */}
                        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm hover:shadow-md md:w-auto w-full">
                            <Icons.Download /> Export
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                {loading ? (
                    // Skeleton
                    <div className="divide-y divide-slate-100 flex-1 p-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="px-6 py-4 flex items-center justify-between animate-pulse">
                                <div className="flex items-center gap-6 w-full">
                                    <div className="w-24 h-5 bg-slate-100 rounded"></div>
                                    <div className="w-1/4 h-4 bg-slate-100 rounded"></div>
                                    <div className="w-1/6 h-4 bg-slate-100 rounded hidden md:block"></div>
                                    <div className="flex-1"></div>
                                    <div className="w-20 h-6 bg-slate-100 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    // Empty State
                    <div className="flex-1 p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                            <Icons.EmptyBox />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No matching records</h3>
                        <p className="text-slate-500 text-sm max-w-sm">Adjust your search or filter parameters to find what you're looking for.</p>
                        {(search || statusFilter !== 'all' || deptFilter !== 'all') && (
                            <button
                                onClick={() => { setSearch(''); setStatusFilter('all'); setDeptFilter('all'); }}
                                className="mt-4 text-teal-600 font-semibold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    // Populated Table
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                                <tr>
                                    {['Ref No.', 'Department', 'Class', 'Sem', 'Date', 'Status', 'Faculty', 'Actions'].map((h, i) => (
                                        <th key={h} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${i === 7 ? 'text-right' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map(m => {
                                    const c = STATUS_COLORS[m.status] || '#94a3b8';
                                    return (
                                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2.5 py-1.5 rounded-md text-xs border border-slate-200/60">
                                                    {m.ref_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-800 font-semibold max-w-[200px] truncate">
                                                {m.department}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">
                                                {m.class_name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-semibold">
                                                {m.semester}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                                                {m.meeting_date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-black/5"
                                                    style={{ background: `${c}18`, color: c }}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
                                                    {STATUS_LABELS[m.status] || m.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {m.created_by_name || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/dashboard/meetings/${m.id}`}
                                                        className="text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <button className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg transition-colors" title="Download PDF">
                                                        <Icons.Pdf />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Table Footer */}
                {!loading && filtered.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">
                            Showing <span className="text-slate-800">{filtered.length}</span> of <span className="text-slate-800">{meetings.length}</span> total meetings
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            COER University CCM Portal
                        </span>
                    </div>
                )}
            </div>

        </div>
    );
}