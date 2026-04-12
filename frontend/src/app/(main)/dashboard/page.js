'use client'

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

const StatCard = ({ emoji, title, value, bgColorClass }) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-[52px] h-[52px] rounded-xl flex items-center justify-center text-2xl shrink-0 ${bgColorClass}`}>
            {emoji}
        </div>
        <div>
            <p className="m-0 text-[13px] text-gray-500 font-semibold uppercase tracking-wider">{title}</p>
            <p className="mt-1 mb-0 text-3xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

export default function DashboardPage() {
    const [stats, setStats] = useState({ total: 0, today: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/exam');
                if (res.data.status === 200) {
                    const data = res.data.data;
                    const today = new Date().toDateString();
                    const todayCount = data.filter(e => new Date(e.createAt).toDateString() === today).length;
                    setStats({ total: data.length, today: todayCount });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-full">
            <h1 className="m-0 mb-2 text-3xl font-extrabold text-gray-900 tracking-tight">Dasbor</h1>
            <p className="m-0 mb-8 text-gray-500 text-[15px]">Selamat datang kembali di ExamFlow! 👋</p>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                <StatCard emoji="📋" title="Total Ruang Ujian" value={loading ? '...' : stats.total} bgColorClass="bg-blue-100 text-blue-600" />
                <StatCard emoji="🆕" title="Dibuat Hari Ini" value={loading ? '...' : stats.today} bgColorClass="bg-blue-100 text-blue-600" />
            </div>

            {/* Info Banner */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="m-0 mb-5 text-[17px] font-bold text-gray-900">🚀 Cara Menggunakan ExamFlow</h2>
                <ol className="m-0 pl-5 text-gray-700 text-[15px] space-y-3 leading-relaxed">
                    <li>Buka menu <strong className="font-bold text-gray-900">Ruang Ujian</strong> di sidebar kiri.</li>
                    <li>Klik tombol <strong className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">&ldquo;BUAT RUANG UJIAN&rdquo;</strong> dan masukkan Link Google Form atau link ujianmu.</li>
                    <li>Sistem akan otomatis membuat <strong className="font-bold text-gray-900">Token Unik</strong> dan <strong className="font-bold text-gray-900">QR Code</strong> untuk ujian tersebut.</li>
                    <li>Bagikan <strong className="font-bold text-gray-900">Token</strong> atau <strong className="font-bold text-gray-900">QR Code</strong> kepada peserta ujian.</li>
                    <li>Kelola ujianmu lewat menu Aksi (Edit, Hapus, Lihat QR) di tabel.</li>
                </ol>
            </div>
        </div>
    );
}
