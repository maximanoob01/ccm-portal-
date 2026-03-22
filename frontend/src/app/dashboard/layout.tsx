'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// --- Icons (Inline SVGs for a premium look without dependencies) ---
const Icons = {
    Home: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
    Clipboard: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" /></svg>,
    Plus: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    CheckBadge: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>,
    Building: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>,
    Logout: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></svg>,
    Menu: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
    Bell: () => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg>,
    GitHub: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>,
    LinkedIn: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
};

const FACULTY_NAV = [
    { href: '/dashboard', label: 'Dashboard', icon: Icons.Home },
    { href: '/dashboard/meetings', label: 'My Meetings', icon: Icons.Clipboard },
    { href: '/dashboard/new-meeting', label: 'New Meeting', icon: Icons.Plus },
];

const ADMIN_NAV = [
    { href: '/dashboard', label: 'Dashboard', icon: Icons.Home },
    { href: '/dashboard/meetings', label: 'All Meetings', icon: Icons.Clipboard },
    { href: '/dashboard/new-meeting', label: 'New Meeting', icon: Icons.Plus },
    { href: '/dashboard/approvals', label: 'Approvals', icon: Icons.CheckBadge },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [role, setRole] = useState<string>('faculty');
    const [username, setUsername] = useState<string>('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) { router.push('/login'); return; }

        const savedRole = localStorage.getItem('role') || 'faculty';
        setRole(savedRole);

        // Set current date for the header
        setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));

        // Fetch user details from Django
        fetch('http://localhost:8000/api/accounts/user/', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.json())
            .then(data => {
                setUsername(data.full_name || data.username || savedRole);
            })
            .catch(() => setUsername(savedRole));
    }, []);

    const logout = () => {
        localStorage.clear();
        router.push('/login');
    };

    const isAdmin = role === 'admin';
    const NAV = isAdmin ? ADMIN_NAV : FACULTY_NAV;

    // Sidebar states with improved styling
    const sidebarBase = "fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0f172a] flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out border-r border-slate-800 shadow-2xl md:shadow-none";
    const sidebarOpen = `${sidebarBase} translate-x-0`;
    const sidebarClosed = `${sidebarBase} -translate-x-full md:translate-x-0`;

    // Link states
    const activeLink = 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white shadow-inner border border-white/5';
    const inactiveLink = 'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all';

    const initials = username
        ? username.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : isAdmin ? 'A' : 'F';

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── SIDEBAR ── */}
            <aside className={mobileOpen ? sidebarOpen : sidebarClosed}>

                {/* Logo Section */}
                <div className="p-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Circular Logo Container */}
                        <div className="relative w-11 h-11 rounded-full bg-white shadow-lg shadow-teal-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-white/10 p-[2px]">
                            <img
                                src="/coer.jpg.jpg"
                                alt="COER Logo"
                                className="w-full h-full object-contain rounded-full"
                                onError={(e: any) => {
                                    // Fallback UI if the image isn't found in your public folder
                                    e.target.style.display = 'none';
                                    const parent = e.target.parentElement;
                                    parent.classList.remove('bg-white', 'p-[2px]');
                                    parent.classList.add('bg-gradient-to-br', 'from-teal-400', 'to-teal-600');
                                    parent.innerHTML = '<span class="text-white text-xl">🎓</span>';
                                }}
                            />
                        </div>
                        <div>
                            <div className="text-white font-extrabold text-base tracking-wide leading-tight">CCM Portal</div>
                            <div className="text-slate-400 font-medium text-xs mt-0.5 tracking-wider uppercase">COER University</div>
                        </div>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="mx-4 mt-2 mb-6 p-3 bg-white/5 border border-white/10 rounded-2xl flex-shrink-0 flex items-center gap-3 shadow-inner">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0 ${isAdmin ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-gradient-to-br from-teal-500 to-teal-700'}`}>
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-slate-200 text-sm font-bold truncate">
                            {username || 'Loading...'}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-indigo-400' : 'bg-teal-400'}`}></span>
                            <div className="text-slate-400 text-xs font-medium capitalize truncate">{role} Account</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={pathname === item.href ? activeLink : inactiveLink}
                        >
                            <item.icon />
                            {item.label}
                        </Link>
                    ))}

                    {/* Admin Specific */}
                    {isAdmin && (
                        <div className="pt-6 mt-4 border-t border-slate-800/50">
                            <p className="text-slate-500 text-xs px-4 mb-3 uppercase tracking-widest font-bold">
                                Administration
                            </p>
                            <Link
                                href="/dashboard/pvc"
                                onClick={() => setMobileOpen(false)}
                                className={pathname === '/dashboard/pvc' ? activeLink : inactiveLink}
                            >
                                <Icons.Building />
                                PVC Overview
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Footer Section */}
                <div className="p-4 border-t border-slate-800 flex-shrink-0 space-y-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <Icons.Logout />
                        Sign Out
                    </button>

                    <div className="px-2 pt-2 text-center flex flex-col items-center">
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">Designed & Built By</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-slate-300 text-xs font-medium">Shourya Gupta</span>
                            <div className="w-px h-3 bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Icons.GitHub />
                                </a>
                                <a href="https://www.linkedin.com/in/shourya-gupta" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0a66c2] transition-colors">
                                    <Icons.LinkedIn />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT AREA ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">

                {/* Top Header */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center gap-4 flex-shrink-0 shadow-sm">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="md:hidden text-slate-600 hover:text-slate-900 transition-colors p-1"
                    >
                        <Icons.Menu />
                    </button>

                    <div className="flex-1 hidden md:block">
                        <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <span>{currentDate}</span>
                        </div>
                    </div>

                    <div className="flex-1 md:hidden"></div> {/* Spacer for mobile */}

                    <div className="flex items-center gap-4">
                        <button className="relative text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                            <Icons.Bell />
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75"></span>
                        </button>

                        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className={`w-9 h-9 rounded-full shadow-sm flex items-center justify-center text-white text-xs font-bold ${isAdmin ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' : 'bg-gradient-to-br from-teal-500 to-teal-700'}`}>
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
                    {/* Optional: Add a subtle decorative background blob for visual interest */}
                    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none -z-10" />

                    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
} 