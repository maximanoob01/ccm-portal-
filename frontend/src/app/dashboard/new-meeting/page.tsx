'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const STEPS = ['Basic Details', 'Committee Members', 'Meeting Minutes', 'Review & Submit'];

// Moved outside to prevent focus loss re-renders
const InputField = ({ label, value, onChange, placeholder, type = 'text', half = false }: any) => (
    <div className={`w-full ${half ? 'md:flex-1' : ''}`}>
        <label className="block text-slate-600 text-sm font-semibold mb-1.5">{label}</label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all shadow-sm"
        />
    </div>
);

export default function NewMeeting() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [refNumber, setRefNumber] = useState('');
    const [form, setForm] = useState({
        department: '',
        class_name: '',
        semester: '',
        venue: '',
        meeting_date: '',
        chairperson: '',
        member_secretary: '',
        faculty_members: [{ name: '', order: 0 }],
        class_reps: [{ name: '', roll_number: '', order: 0 }],
        minutes: [{ point: '', order: 0 }],
    });

    const update = (field: string, value: any) =>
        setForm((f) => ({ ...f, [field]: value }));

    const updateList = (key: string, index: number, field: string, value: string) => {
        const list = [...(form as any)[key]];
        list[index] = { ...list[index], [field]: value };
        update(key, list);
    };

    const addItem = (key: string, template: object) =>
        update(key, [...(form as any)[key], { ...template, order: (form as any)[key].length }]);

    const removeItem = (key: string, index: number) =>
        update(key, (form as any)[key].filter((_: any, i: number) => i !== index));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                ...form,
                faculty_members: form.faculty_members.filter((f) => f.name.trim()),
                class_reps: form.class_reps.filter((r) => r.name.trim()),
                minutes: form.minutes.filter((m) => m.point.trim()),
            };
            const { data } = await api.post('/meetings/', payload);
            await api.post(`/meetings/${data.id}/submit/`);
            setRefNumber(data.ref_number);
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 max-w-md w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="text-4xl">✅</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Meeting Submitted!</h2>
                    <p className="text-slate-500 mb-2">Your meeting has been sent for approval.</p>
                    <div className="bg-slate-50 py-3 rounded-lg border border-slate-100 mb-8">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Reference No.</p>
                        <p className="text-teal-600 font-mono font-bold text-xl">{refNumber || 'CCM-XXXX-XXXX'}</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-teal-600 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-10 font-sans text-slate-800">
            {/* Top Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                        ←
                    </button>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">New CCM Meeting</h1>
                        <p className="text-slate-500 text-xs font-medium">Academic Year 2025-26 · Even Semester</p>
                    </div>
                </div>
                <div className="hidden md:block text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                    Draft Mode
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 mt-6 md:mt-10">
                {/* Stepper Navigation */}
                <div className="mb-8 overflow-x-auto hide-scrollbar">
                    <div className="flex items-center justify-between min-w-[500px] bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        {STEPS.map((s, i) => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <div
                                    onClick={() => i < step && setStep(i)}
                                    className={`flex items-center gap-3 px-2 py-1 ${i < step ? 'cursor-pointer' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${i < step ? 'bg-teal-600 text-white shadow-md' :
                                        i === step ? 'bg-teal-600 text-white ring-4 ring-teal-100' :
                                            'bg-slate-100 text-slate-400'
                                        }`}>
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-sm font-semibold hidden md:block transition-colors duration-300 ${i === step ? 'text-slate-800' : i < step ? 'text-teal-700' : 'text-slate-400'}`}>
                                        {s}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-[2px] mx-4 rounded-full transition-colors duration-300 ${i < step ? 'bg-teal-500' : 'bg-slate-100'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 md:p-8 mb-6">

                    {/* Step 0 — Basic Details */}
                    {step === 0 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800">Basic Details</h2>
                                <p className="text-slate-500 text-sm mt-1">Provide the foundational information for this meeting.</p>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-teal-50/50 border border-teal-100 rounded-xl text-sm text-teal-800">
                                <span className="text-lg leading-none">📋</span>
                                <p>The reference number will be automatically generated upon final submission by the portal.</p>
                            </div>

                            <div className="space-y-5">
                                <InputField label="Department *" value={form.department} onChange={(v: any) => update('department', v)} placeholder="e.g. Computer Science & Engineering" />

                                <div className="flex flex-col md:flex-row gap-5">
                                    <InputField label="Class *" value={form.class_name} onChange={(v: any) => update('class_name', v)} placeholder="e.g. B.Tech CSE 3rd Year" half />
                                    <InputField label="Semester *" value={form.semester} onChange={(v: any) => update('semester', v)} placeholder="e.g. VI" half />
                                </div>

                                <div className="flex flex-col md:flex-row gap-5">
                                    <InputField label="Meeting Date *" type="date" value={form.meeting_date} onChange={(v: any) => update('meeting_date', v)} half />
                                    <InputField label="Venue *" value={form.venue} onChange={(v: any) => update('venue', v)} placeholder="e.g. Room 301, Block A" half />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Committee Members */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800">Committee Members</h2>
                                <p className="text-slate-500 text-sm mt-1">Add all authorized attendees present at the meeting.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
                                <InputField label="Chairperson *" value={form.chairperson} onChange={(v: any) => update('chairperson', v)} placeholder="Full name & title" half />
                                <InputField label="Member Secretary *" value={form.member_secretary} onChange={(v: any) => update('member_secretary', v)} placeholder="Full name & title" half />
                            </div>

                            {/* Faculty Members */}
                            <div>
                                <div className="flex justify-between items-end mb-3">
                                    <label className="block text-slate-700 text-sm font-bold">Faculty Members</label>
                                    <span className="text-xs font-medium text-slate-400">{form.faculty_members.length}/6 added</span>
                                </div>
                                <div className="space-y-3">
                                    {form.faculty_members.map((f, i) => (
                                        <div key={i} className="flex gap-3 items-center group">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                            <input
                                                value={f.name}
                                                onChange={(e) => updateList('faculty_members', i, 'name', e.target.value)}
                                                placeholder="Faculty name & designation"
                                                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                            />
                                            {form.faculty_members.length > 1 && (
                                                <button onClick={() => removeItem('faculty_members', i)} className="w-10 h-10 rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors shrink-0">
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {form.faculty_members.length < 6 && (
                                        <button onClick={() => addItem('faculty_members', { name: '' })} className="ml-11 mt-2 flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors py-2">
                                            <span className="w-6 h-6 rounded border-2 border-dashed border-teal-300 flex items-center justify-center text-lg leading-none">+</span>
                                            Add Faculty Member
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Class Reps */}
                            <div>
                                <div className="flex justify-between items-end mb-3">
                                    <label className="block text-slate-700 text-sm font-bold">Class Representatives</label>
                                    <span className="text-xs font-medium text-slate-400">{form.class_reps.length}/4 added</span>
                                </div>
                                <div className="space-y-3">
                                    {form.class_reps.map((r, i) => (
                                        <div key={i} className="flex flex-col md:flex-row gap-3 items-start md:items-center group bg-white md:bg-transparent">
                                            <div className="hidden md:flex w-8 h-8 rounded-full bg-slate-100 text-slate-400 items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                                            <div className="flex w-full gap-3">
                                                <input
                                                    value={r.name}
                                                    onChange={(e) => updateList('class_reps', i, 'name', e.target.value)}
                                                    placeholder="Student Full Name"
                                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                                />
                                                <input
                                                    value={r.roll_number}
                                                    onChange={(e) => updateList('class_reps', i, 'roll_number', e.target.value)}
                                                    placeholder="Roll No."
                                                    className="w-1/3 md:w-32 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                                />
                                                {form.class_reps.length > 1 && (
                                                    <button onClick={() => removeItem('class_reps', i)} className="w-10 h-10 rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors shrink-0 mt-1 md:mt-0">
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {form.class_reps.length < 4 && (
                                        <button onClick={() => addItem('class_reps', { name: '', roll_number: '' })} className="md:ml-11 mt-2 flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors py-2">
                                            <span className="w-6 h-6 rounded border-2 border-dashed border-teal-300 flex items-center justify-center text-lg leading-none">+</span>
                                            Add Representative
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Meeting Minutes */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800">Meeting Minutes</h2>
                                    <p className="text-slate-500 text-sm mt-1">Record key discussions, decisions, and action items.</p>
                                </div>
                                <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{form.minutes.length}/8</span>
                            </div>

                            <div className="space-y-4">
                                {form.minutes.map((m, i) => (
                                    <div key={i} className="flex gap-3 items-start relative">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0 mt-1">{i + 1}</div>
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={m.point}
                                                onChange={(e) => updateList('minutes', i, 'point', e.target.value)}
                                                placeholder="Enter discussion point or resolution..."
                                                rows={3}
                                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm resize-none"
                                            />
                                            {form.minutes.length > 1 && (
                                                <button onClick={() => removeItem('minutes', i)} className="absolute top-2 right-2 w-8 h-8 rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {form.minutes.length < 8 && (
                                <button
                                    onClick={() => addItem('minutes', { point: '' })}
                                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-semibold text-sm hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="text-lg leading-none">+</span> Add Another Point
                                </button>
                            )}
                        </div>
                    )}

                    {/* Step 3 — Review */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <h2 className="text-xl font-extrabold text-slate-800">Review & Submit</h2>
                                <p className="text-slate-500 text-sm mt-1">Verify all meeting data before initiating the approval workflow.</p>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 shadow-sm">
                                <span className="text-lg leading-none">⚠️</span>
                                <p>Once submitted, this document will be locked and routed through: <strong>Chairperson → HOD → Dean → PVC</strong> for digital signatures.</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-1 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-slate-200">
                                    {[
                                        { label: 'Department', value: form.department },
                                        { label: 'Class / Semester', value: `${form.class_name} • Sem ${form.semester}` },
                                        { label: 'Meeting Date', value: form.meeting_date },
                                        { label: 'Venue', value: form.venue },
                                        { label: 'Chairperson', value: form.chairperson },
                                        { label: 'Member Secretary', value: form.member_secretary },
                                        { label: 'Faculty Members', value: `${form.faculty_members.filter(f => f.name).length} recorded`, highlight: true },
                                        { label: 'Class Reps', value: `${form.class_reps.filter(r => r.name).length} recorded`, highlight: true },
                                    ].map((row, i) => (
                                        <div key={i} className="flex flex-col bg-white p-4">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{row.label}</span>
                                            <span className={`text-sm ${row.highlight ? 'font-semibold text-teal-700' : 'text-slate-800 font-medium'}`}>
                                                {row.value || <span className="text-slate-300 italic">Not provided</span>}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-white p-4 mt-[1px]">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Meeting Minutes</span>
                                    <ul className="list-disc list-inside space-y-2">
                                        {form.minutes.filter(m => m.point).map((m, i) => (
                                            <li key={i} className="text-sm text-slate-700 leading-relaxed">{m.point}</li>
                                        ))}
                                        {form.minutes.filter(m => m.point).length === 0 && (
                                            <li className="text-sm text-slate-400 italic">No minutes recorded.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Navigation (Sticky on mobile, standard on desktop) */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:static md:bg-transparent md:border-none md:shadow-none md:p-0 z-20">
                    <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
                        <button
                            onClick={() => step > 0 ? setStep(step - 1) : router.push('/dashboard')}
                            className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-all shadow-sm w-full md:w-auto text-center"
                        >
                            {step === 0 ? 'Cancel' : '← Back'}
                        </button>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button className="hidden md:block px-6 py-3.5 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-all">
                                Save Draft
                            </button>
                            {step < 3 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    className="flex-1 md:flex-none px-8 py-3.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Next Step →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 md:flex-none px-8 py-3.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 shadow-md hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : '🚀 Submit for Approval'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}