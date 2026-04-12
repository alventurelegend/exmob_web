'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const decodeToken = (token) => {
    try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
};

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (!t) { router.push('/login'); return; }
        setUser(decodeToken(t));
    }, [router]);

    useEffect(() => {
        const titles = {
            '/dashboard': 'Dasbor | ExamFlow',
            '/ruang-ujian': 'Ruang Ujian | ExamFlow',
        };
        document.title = titles[pathname] || 'ExamFlow';
    }, [pathname]);

    const logout = () => { localStorage.removeItem('token'); router.push('/login'); };

    const initials = user?.full_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?';

    const navItems = [
        { href: '/dashboard', label: 'Dasbor', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
        )},
        { href: '/ruang-ujian', label: 'Ruang Ujian', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
        )},
    ];

    return (
        <div className="flex min-h-screen bg-white">
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)} 
                    className="fixed inset-0 bg-black/40 z-[199] md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-screen w-[210px] bg-white border-r border-gray-100
                flex flex-col z-[200] transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                md:translate-x-0 md:shadow-none md:sticky md:top-0
            `}>
                {/* Logo */}
                <div className="px-5 pt-4 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="ExamFlow Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-extrabold text-sm text-gray-900 tracking-wide">EXAMFLOW</span>
                    </div>
                    {/* Close btn on mobile */}
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* Nav */}
                <div className="px-3 py-1 flex-1 overflow-y-auto">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
                        MENU NAVIGASI
                    </p>
                    {navItems.map(item => {
                        const active = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className="block no-underline">
                                <div className={`
                                    flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-colors border-r-4
                                    ${active ? 'bg-blue-600 text-white font-semibold border-blue-800' : 'bg-transparent text-gray-600 font-medium border-transparent hover:bg-blue-50'}
                                `}>
                                    {item.icon} {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* User */}
                <div className="p-4 border-t border-gray-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-900 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="m-0 text-[13px] font-semibold text-gray-900 truncate">{user?.full_name || '...'}</p>
                        <p className="m-0 text-[11px] text-gray-400 truncate">{user?.instansi || ''}</p>
                    </div>
                    <button onClick={logout} title="Keluar" className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 h-[58px] flex items-center justify-between px-5 sticky top-0 z-[100] gap-3">
                    {/* Hamburger on mobile */}
                    <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1 text-gray-700 hover:text-gray-900 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                    
                    <span className="md:hidden font-extrabold text-[13px] text-gray-900 tracking-wide flex-1">EXAMFLOW</span>
                    
                    <div className="flex items-center gap-2.5 ml-auto">
                        <span className="hidden md:block text-sm font-medium text-gray-700">{user?.full_name || ''}</span>
                        <div className="w-[34px] h-[34px] bg-gradient-to-br from-purple-600 to-purple-900 rounded-full flex items-center justify-center text-white font-bold text-[13px] shrink-0">
                            {initials}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-5 md:p-8 bg-white">
                    {children}
                </main>
            </div>
        </div>
    );
}
