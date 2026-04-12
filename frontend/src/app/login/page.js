'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    useEffect(() => { document.title = 'Masuk | ExamFlow'; }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const res = await api.post('/api/login', form);
            if (res.data.status === 200) {
                localStorage.setItem('token', res.data.data.token);
                router.push('/dashboard');
            } else {
                setErrorMsg(res.data.message || 'Login gagal.');
            }
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Tidak bisa terhubung ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            
            {/* ===== LEFT PANEL (brand) — hidden on mobile ===== */}
            <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400 flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute w-[300px] h-[300px] rounded-full bg-white/5 -top-20 -left-20" />
                <div className="absolute w-[200px] h-[200px] rounded-full bg-white/5 bottom-10 -right-12" />
                <div className="absolute w-[150px] h-[150px] rounded-full bg-white/5 -bottom-8 left-[30%]" />

                {/* Content */}
                <div className="relative text-center text-white">
                    {/* Logo */}
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-6">
                        <Image src="/logo.png" alt="ExamFlow Logo" width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    
                    <h1 className="text-3xl font-black mb-3 tracking-tight">EXAMFLOW</h1>
                    <p className="text-base text-white/85 mb-10 font-normal leading-relaxed">
                        Platform manajemen ujian digital<br />yang cepat, mudah, dan aman.
                    </p>

                    {/* Feature list */}
                    {['Generate token & QR Code otomatis', 'Kelola semua ruang ujian', 'Keamanan berbasis JWT Token'].map((f, i) => (
                        <div key={i} className="flex items-center gap-3 mb-3 justify-start max-w-[280px] mx-auto">
                            <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                            </div>
                            <span className="text-sm text-white/90 text-left">{f}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== RIGHT PANEL (form) ===== */}
            <div className="w-full md:w-[460px] md:min-w-[380px] flex flex-col items-center justify-center p-10 md:p-12 flex-1 md:flex-none">
                <div className="w-full max-w-[360px]">
                    
                    <h2 className="m-0 mb-2 text-2xl font-extrabold text-gray-900">Masuk</h2>
                    <p className="m-0 mb-8 text-sm text-gray-500">Selamat datang kembali! Silakan login.</p>

                    {errorMsg && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
                            ⚠️ {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Username */}
                        <div className="mb-5">
                            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text" name="username" value={form.username} onChange={handleChange} required
                                placeholder="Masukkan username..."
                                className="w-full px-4 py-3 rounded-xl border-1.5 border-gray-200 text-sm text-gray-900 bg-slate-50 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder-gray-400 font-inherit"
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-7">
                            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                                    placeholder="••••••••"
                                    className="w-full pl-4 pr-11 py-3 rounded-xl border-1.5 border-gray-200 text-sm text-gray-900 bg-slate-50 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 placeholder-gray-400 font-inherit"
                                />
                                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 flex hover:text-gray-600 transition-colors">
                                    {showPass ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit" disabled={loading}
                            className={`w-full p-3.5 border-none rounded-xl text-[15px] font-bold text-white cursor-pointer transition-all duration-200 tracking-wide
                                ${loading ? 'bg-blue-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(29,111,212,0.35)]'}`}
                        >
                            {loading ? '⏳ Memproses...' : 'Masuk →'}
                        </button>
                    </form>

                    <p className="text-center mt-7 text-sm text-gray-500">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-blue-600 font-bold no-underline hover:text-blue-700 transition-colors">
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>
            </div>
            
        </div>
    );
}
