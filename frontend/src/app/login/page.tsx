'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Screen = 'select' | 'faculty-login' | 'faculty-signup' | 'admin-login';

const DEPARTMENTS = [
    'Computer Science & Engineering',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Applied Sciences',
];

export default function LoginPage() {
    const router = useRouter();
    const [screen, setScreen] = useState<Screen>('select');
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [signupForm, setSignupForm] = useState({ name: '', department: '', password: '', confirm: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState<{ username: string } | null>(null);

    const reset = (s: Screen) => {
        setScreen(s);
        setError('');
        setLoginForm({ username: '', password: '' });
        setSignupForm({ name: '', department: '', password: '', confirm: '' });
        setSignupSuccess(null);
        setShowPass(false);
        setShowConfirm(false);
    };

    const handleLogin = async (e: React.FormEvent, role: string) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('http://localhost:8000/api/auth/token/', loginForm);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('role', role);
            router.push('/dashboard');
        } catch {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (signupForm.password !== signupForm.confirm) {
            setError('Passwords do not match.'); return;
        }
        if (signupForm.password.length < 6) {
            setError('Password must be at least 6 characters.'); return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post('http://localhost:8000/api/accounts/register/', {
                name: signupForm.name,
                department: signupForm.department,
                password: signupForm.password,
            });
            setSignupSuccess({ username: data.username });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = screen === 'admin-login';
    const accentColor = isAdmin ? '#6366f1' : '#0d9488';
    const accentGradient = isAdmin
        ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
        : 'linear-gradient(135deg,#0d9488,#0891b2)';

    const inputStyle = (accent: string) => ({
        width: '100%',
        background: '#1e293b',
        border: '1.5px solid #334155',
        borderRadius: 12,
        padding: '14px 16px',
        color: '#fff',
        fontSize: 14,
        fontFamily: 'inherit',
        transition: 'border .2s',
    });

    const labelStyle = {
        display: 'block' as const,
        color: '#94a3b8',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.07em',
        textTransform: 'uppercase' as const,
        marginBottom: 8,
    };

    return (
        /* Outer Background Wrapper */
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: '#132949ff',
            fontFamily: "'DM Sans',sans-serif",
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder,select::placeholder { color: #475569; }
        select option { background: #1e293b; color: #fff; }
        @keyframes hoverfloat { 0%,100%{transform:translateY(0) rotate(-1deg);} 50%{transform:translateY(-14px) rotate(-1deg);} }
        @keyframes b1 { 0%,100%{transform:translateY(0) rotate(2deg);} 50%{transform:translateY(-8px) rotate(2deg);} }
        @keyframes b2 { 0%,100%{transform:translateY(0) rotate(-2deg);} 50%{transform:translateY(-6px) rotate(-2deg);} }
        @keyframes b3 { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }
        .card-float { animation: hoverfloat 4s ease-in-out infinite; }
        .b1 { animation: b1 3s ease-in-out infinite; }
        .b2 { animation: b2 3.5s ease-in-out infinite .4s; }
        .b3 { animation: b3 2.8s ease-in-out infinite .2s; }
        .role-btn { transition: transform .18s ease; }
        .role-btn:hover { transform: translateY(-3px); }
        .link-btn { background:none; border:none; cursor:pointer; font-family:inherit; }
        input:focus, select:focus { outline: none; }
        
        /* MOBILE RESPONSIVENESS */
        @media (max-width:900px) { 
            .main-card { 
                flex-direction: column !important; 
                height: auto !important; 
                min-height: auto !important;
                max-height: none !important;
                border-radius: 20px !important; 
            }
            .rp { display: none !important; } 
            .lp { 
                width: 100% !important; 
                border-radius: 20px !important; 
                padding: 32px 24px !important; 
            }
            /* Text & Spacing Reductions */
            .title-text { font-size: 24px !important; margin-bottom: 6px !important; }
            .sub-text { font-size: 13px !important; margin-bottom: 28px !important; }
            .role-btn { padding: 16px 20px !important; gap: 14px !important; }
            .role-btn-icon { width: 44px !important; height: 44px !important; font-size: 22px !important; }
            .role-btn-title { font-size: 15px !important; }
            .role-btn-sub { font-size: 11px !important; }
            .form-label { font-size: 10px !important; margin-bottom: 6px !important; }
            .form-input { padding: 12px 14px !important; font-size: 13px !important; }
            .submit-btn { padding: 12px !important; font-size: 14px !important; }
            .back-btn { font-size: 12px !important; margin-bottom: 24px !important; }
            .logo-wrap { margin-bottom: 32px !important; }
        }
      `}</style>

            {/* Main Floating Card Container */}
            <div className="main-card" style={{
                display: 'flex',
                width: '100%',
                maxWidth: '1100px',
                height: '80vh',
                minHeight: '650px',
                maxHeight: '800px',
                background: '#0f172a',
                borderRadius: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                overflow: 'hidden',
                position: 'relative'
            }}>

                {/* Top Right Header Text */}
                <div style={{ position: 'absolute', top: 32, right: 40, zIndex: 20, textAlign: 'right', pointerEvents: 'none' }} className="rp">
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '0.1em' }}>CCM PORTAL</div>
                    <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em', marginTop: 2 }}>COER UNIVERSITY</div>
                </div>

                {/* ── LEFT PANEL ── */}
                <div className="lp" style={{
                    width: '44%', background: '#0f172a',
                    display: 'flex', flexDirection: 'column',
                    padding: '40px 48px', overflowY: 'auto',
                }}>

                    {/* Mobile-Ready Logo Header */}
                    <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44, flexShrink: 0 }}>
                        <div style={{
                            width: 40, height: 40, background: '#fff',
                            borderRadius: 10, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                        }}>
                            <img src="/coer.jpg.jpg" alt="COER" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={(e: any) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.style.background = 'linear-gradient(135deg,#0d9488,#0891b2)';
                                    e.target.parentElement.innerHTML = '<span style="font-size:18px;color:#fff">🎓</span>';
                                }}
                            />
                        </div>
                        <div>
                            <div style={{ color: '#fff', fontSize: 14, fontWeight: 700, lineHeight: 1 }}>CCM Portal</div>
                            <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>COER University, Roorkee</div>
                        </div>
                    </div>

                    {/* ── SELECT SCREEN ── */}
                    {screen === 'select' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h1 className="title-text" style={{ color: '#fff', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Login into CCM Portal</h1>
                            <p className="sub-text" style={{ color: '#64748b', fontSize: 14, marginBottom: 40, lineHeight: 1.6 }}>
                                Choose how you want to access<br />the CCM management system.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                {/* Faculty */}
                                <button className="role-btn" onClick={() => reset('faculty-login')} style={{
                                    background: 'linear-gradient(135deg,#0d9488,#0891b2)',
                                    border: 'none', borderRadius: 18, padding: '22px 24px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, textAlign: 'left',
                                }}>
                                    <div className="role-btn-icon" style={{ width: 52, height: 52, flexShrink: 0, background: 'rgba(255,255,255,.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>👨‍🏫</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="role-btn-title" style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 3 }}>Faculty</div>
                                        <div className="role-btn-sub" style={{ color: 'rgba(255,255,255,.65)', fontSize: 12 }}>Create meetings, record minutes & submit</div>
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 20 }}>→</span>
                                </button>

                                {/* Admin */}
                                <button className="role-btn" onClick={() => reset('admin-login')} style={{
                                    background: '#1e293b', border: '1.5px solid #334155',
                                    borderRadius: 18, padding: '22px 24px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18, textAlign: 'left',
                                }}>
                                    <div className="role-btn-icon" style={{ width: 52, height: 52, flexShrink: 0, background: 'rgba(99,102,241,.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🏛️</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="role-btn-title" style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16, marginBottom: 3 }}>Administration</div>
                                        <div className="role-btn-sub" style={{ color: '#afc4e2ff', fontSize: 12 }}>HOD, Dean, PVC & Chairperson portal</div>
                                    </div>
                                    <span style={{ color: '#334155', fontSize: 20 }}>→</span>
                                </button>
                            </div>
                            <p style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 6, color: '#334155', fontSize: 11, justifyContent: 'center' }}>
                                <span>🔒</span> Secured with JWT authentication
                            </p>
                        </div>
                    )}

                    {/* ── FACULTY LOGIN ── */}
                    {screen === 'faculty-login' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <button onClick={() => reset('select')} className="link-btn back-btn" style={{ color: '#d6dae0ff', fontSize: 12, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                                ← Back
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                                <div style={{ width: 50, height: 50, flexShrink: 0, background: 'linear-gradient(135deg,#0d9488,#0891b2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>👨‍🏫</div>
                                <div>
                                    <div className="title-text" style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>Faculty Login</div>
                                    <div className="role-btn-sub" style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Sign in to your account</div>
                                </div>
                            </div>

                            {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 18 }}>⚠️ {error}</div>}

                            <form onSubmit={e => handleLogin(e, 'faculty')}>
                                <div style={{ marginBottom: 16 }}>
                                    <label className="form-label" style={labelStyle}>Username</label>
                                    <input className="form-input" type="text" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                                        placeholder="e.g. dr.priya" required style={inputStyle('#0d9488')}
                                        onFocus={e => e.target.style.borderColor = '#0d9488'}
                                        onBlur={e => e.target.style.borderColor = '#334155'} />
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <label className="form-label" style={labelStyle}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className="form-input" type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                                            placeholder="Enter your password" required style={{ ...inputStyle('#0d9488'), paddingRight: 46 }}
                                            onFocus={e => e.target.style.borderColor = '#0d9488'}
                                            onBlur={e => e.target.style.borderColor = '#334155'} />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="link-btn" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 16 }}>
                                            {showPass ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                                    <a href="#" style={{ color: '#0d9488', fontSize: 12, textDecoration: 'none' }}>Forgot Password?</a>
                                </div>
                                <button className="submit-btn" type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#0d9488,#0891b2)', border: 'none', borderRadius: 12, padding: '15px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? .7 : 1, fontFamily: 'inherit' }}>
                                    {loading ? 'Signing in…' : 'Login →'}
                                </button>
                            </form>

                            {/* Create account link */}
                            <div style={{ marginTop: 24, textAlign: 'center', padding: '16px', background: '#1e293b', borderRadius: 14, border: '1px solid #334155' }}>
                                <span style={{ color: '#64748b', fontSize: 13 }}>Don't have an account? </span>
                                <button onClick={() => reset('faculty-signup')} className="link-btn" style={{ color: '#0d9488', fontSize: 13, fontWeight: 700 }}>
                                    Create Account →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── FACULTY SIGNUP ── */}
                    {screen === 'faculty-signup' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <button onClick={() => reset('faculty-login')} className="link-btn back-btn" style={{ color: '#d7dde4ff', fontSize: 13, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                                ← Back to Login
                            </button>

                            {/* Success state */}
                            {signupSuccess ? (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: 64, height: 64, background: 'rgba(13,148,136,.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>✅</div>
                                    <div className="title-text" style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Account Created!</div>
                                    <div className="role-btn-sub" style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Your account is ready. Use the credentials below to sign in.</div>
                                    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 14, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
                                        <div style={{ color: '#64748b', fontSize: 11, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.06em' }}>Your username</div>
                                        <div style={{ color: '#0d9488', fontFamily: 'monospace', fontSize: 18, fontWeight: 700 }}>{signupSuccess.username}</div>
                                        <div style={{ color: '#475569', fontSize: 11, marginTop: 6 }}>Save this — you'll need it to log in</div>
                                    </div>
                                    <button className="submit-btn" onClick={() => reset('faculty-login')} style={{ width: '100%', background: 'linear-gradient(135deg,#0d9488,#0891b2)', border: 'none', borderRadius: 12, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Go to Login →
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div style={{ marginBottom: 28 }}>
                                        <div className="title-text" style={{ color: '#fff', fontWeight: 800, fontSize: 22, marginBottom: 4 }}>Create Account</div>
                                        <div className="role-btn-sub" style={{ color: '#64748b', fontSize: 13 }}>Fill in your details to get started</div>
                                    </div>

                                    {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 18 }}>⚠️ {error}</div>}

                                    <form onSubmit={handleSignup}>
                                        <div style={{ marginBottom: 16 }}>
                                            <label className="form-label" style={labelStyle}>Full Name</label>
                                            <input className="form-input" type="text" value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                                                placeholder="e.g. Dr. Priya Sharma" required style={inputStyle('#0d9488')}
                                                onFocus={e => e.target.style.borderColor = '#0d9488'}
                                                onBlur={e => e.target.style.borderColor = '#334155'} />
                                        </div>

                                        <div style={{ marginBottom: 16 }}>
                                            <label className="form-label" style={labelStyle}>Department</label>
                                            <select className="form-input" value={signupForm.department} onChange={e => setSignupForm({ ...signupForm, department: e.target.value })}
                                                required style={{ ...inputStyle('#0d9488'), appearance: 'none' as const, cursor: 'pointer' }}
                                                onFocus={e => e.target.style.borderColor = '#0d9488'}
                                                onBlur={e => e.target.style.borderColor = '#334155'}>
                                                <option value="">Select your department…</option>
                                                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>

                                        <div style={{ marginBottom: 16 }}>
                                            <label className="form-label" style={labelStyle}>Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input className="form-input" type={showPass ? 'text' : 'password'} value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                                                    placeholder="Min. 6 characters" required style={{ ...inputStyle('#0d9488'), paddingRight: 46 }}
                                                    onFocus={e => e.target.style.borderColor = '#0d9488'}
                                                    onBlur={e => e.target.style.borderColor = '#334155'} />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="link-btn" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 16 }}>
                                                    {showPass ? '🙈' : '👁️'}
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 24 }}>
                                            <label className="form-label" style={labelStyle}>Confirm Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input className="form-input" type={showConfirm ? 'text' : 'password'} value={signupForm.confirm} onChange={e => setSignupForm({ ...signupForm, confirm: e.target.value })}
                                                    placeholder="Repeat your password" required style={{ ...inputStyle('#0d9488'), paddingRight: 46 }}
                                                    onFocus={e => e.target.style.borderColor = '#0d9488'}
                                                    onBlur={e => e.target.style.borderColor = '#334155'} />
                                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="link-btn" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 16 }}>
                                                    {showConfirm ? '🙈' : '👁️'}
                                                </button>
                                            </div>
                                        </div>

                                        <button className="submit-btn" type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#0d9488,#0891b2)', border: 'none', borderRadius: 12, padding: '15px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? .7 : 1, fontFamily: 'inherit' }}>
                                            {loading ? 'Creating account…' : 'Create Account →'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── ADMIN LOGIN ── */}
                    {screen === 'admin-login' && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <button onClick={() => reset('select')} className="link-btn back-btn" style={{ color: '#dadfe7ff', fontSize: 15, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                                ← Back
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                                <div style={{ width: 50, height: 50, flexShrink: 0, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏛️</div>
                                <div>
                                    <div className="title-text" style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>Admin Login</div>
                                    <div className="role-btn-sub" style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Administration portal</div>
                                </div>
                            </div>

                            {error && <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 18 }}>⚠️ {error}</div>}

                            <form onSubmit={e => handleLogin(e, 'admin')}>
                                <div style={{ marginBottom: 16 }}>
                                    <label className="form-label" style={labelStyle}>Username</label>
                                    <input className="form-input" type="text" value={loginForm.username} onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                                        placeholder="Enter admin username" required style={inputStyle('#6366f1')}
                                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                                        onBlur={e => e.target.style.borderColor = '#334155'} />
                                </div>
                                <div style={{ marginBottom: 10 }}>
                                    <label className="form-label" style={labelStyle}>Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <input className="form-input" type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                                            placeholder="Enter your password" required style={{ ...inputStyle('#6366f1'), paddingRight: 46 }}
                                            onFocus={e => e.target.style.borderColor = '#6366f1'}
                                            onBlur={e => e.target.style.borderColor = '#334155'} />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="link-btn" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: 16 }}>
                                            {showPass ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right', marginBottom: 24 }}>
                                    <a href="#" style={{ color: '#6366f1', fontSize: 12, textDecoration: 'none' }}>Forgot Password?</a>
                                </div>
                                <button className="submit-btn" type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12, padding: '15px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', opacity: loading ? .7 : 1, fontFamily: 'inherit' }}>
                                    {loading ? 'Signing in…' : 'Login →'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ paddingTop: 20, color: '#87888bff', fontSize: 13, textAlign: 'center' }}>
                        Developed by{' '}
                        <a href="https://www.linkedin.com/in/shourya-gupta" target="_blank" rel="noopener noreferrer" style={{ color: '#fbfdffff', textDecoration: 'none' }}>
                            Shourya Gupta
                        </a>
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="rp" style={{
                    flex: 1,
                    background: 'linear-gradient(150deg,#0f172a 0%,#0f2744 50%,#0f172a 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '48px', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(13,148,136,.18) 0%,transparent 70%)', pointerEvents: 'none' }} />

                    {/* Floating card */}
                    <div className="card-float" style={{
                        width: 340, background: 'linear-gradient(160deg,#1e293b,#162032)',
                        borderRadius: 28, border: '1px solid rgba(255,255,255,.08)',
                        padding: '32px 28px', position: 'relative', zIndex: 2,
                        boxShadow: '0 30px 80px rgba(0,0,0,.4)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                            <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyItems: 'center', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,.3)', padding: 2 }}>
                                <img src="/coer.jpg.jpg" width={44} height={44} style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                    onError={(e: any) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <div>
                                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>COER University</div>
                                <div style={{ color: '#64748b', fontSize: 11, marginTop: 3 }}>Roorkee, Uttarakhand</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 5 }}>CCM Management System</div>
                            <div style={{ color: '#fff', fontSize: 19, fontWeight: 800, lineHeight: 1.3 }}>Class Committee<br />Meeting Portal</div>
                        </div>

                        {[
                            { ref: 'CCM-2526-001', dept: 'CSE', status: 'Approved', color: '#0d9488' },
                            { ref: 'CCM-2526-002', dept: 'ECE', status: 'Pending', color: '#f59e0b' },
                            { ref: 'CCM-2526-003', dept: 'ME', status: 'Draft', color: '#64748b' },
                        ].map((row, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 6, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.05)' }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: row.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📋</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 600, fontFamily: 'monospace' }}>{row.ref}</div>
                                    <div style={{ color: '#64748b', fontSize: 10, marginTop: 1 }}>{row.dept} Dept.</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, background: row.color + '18' }}>
                                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: row.color }} />
                                    <span style={{ color: row.color, fontSize: 10, fontWeight: 600 }}>{row.status}</span>
                                </div>
                            </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.07)' }}>
                            {[{ v: '49', l: 'Meetings' }, { v: '5', l: 'Depts' }, { v: '4', l: 'Approvals' }].map(s => (
                                <div key={s.l} style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>{s.v}</div>
                                    <div style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>{s.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="b1" style={{ position: 'absolute', top: '16%', right: '9%', background: 'linear-gradient(135deg,#0d9488,#0891b2)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 12px 32px rgba(13,148,136,.35)' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: .8 }} />
                        <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Meeting Approved ✓</span>
                    </div>

                    <div className="b2" style={{ position: 'absolute', bottom: '18%', left: '7%', background: '#1e293b', border: '1px solid rgba(255,255,255,.1)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 12px 32px rgba(0,0,0,.3)' }}>
                        <span style={{ fontSize: 16 }}>🏛️</span>
                        <div>
                            <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>PVC Dashboard</div>
                            <div style={{ color: '#64748b', fontSize: 10 }}>University overview</div>
                        </div>
                    </div>

                    <div className="b3" style={{ position: 'absolute', bottom: '28%', right: '7%', background: '#1e293b', border: '1px solid rgba(99,102,241,.3)', borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 12px 32px rgba(0,0,0,.25)' }}>
                        <span style={{ fontSize: 16 }}>📄</span>
                        <div>
                            <div style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>PDF Generated</div>
                            <div style={{ color: '#64748b', fontSize: 10 }}>Auto export ready</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}