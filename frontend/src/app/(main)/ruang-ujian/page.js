'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { QRCodeCanvas } from 'qrcode.react';

// ===== MODAL =====
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/35 z-[300] flex items-center justify-center p-5">
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl w-full max-w-[460px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-[15px] text-gray-900">{title}</span>
                    <button onClick={onClose} className="bg-transparent border-none text-[22px] text-gray-400 hover:text-gray-600 cursor-pointer leading-none transition-colors">×</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// ===== QR MODAL =====
function QRModal({ token, onClose, qrRef }) {
    if (!token) return null;
    const download = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;
        const a = document.createElement('a');
        a.href = canvas.toDataURL().replace('image/png', 'image/octet-stream');
        a.download = `${token}.png`;
        a.click();
    };
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black/35 z-[300] flex items-center justify-center">
            <div onClick={e => e.stopPropagation()} className="bg-white rounded-[20px] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] min-w-[320px]">
                <div className="flex justify-between items-center mb-5">
                    <span className="font-bold text-base text-gray-900">QR Code Ujian</span>
                    <button onClick={onClose} className="bg-transparent border-none text-[22px] text-gray-400 hover:text-gray-600 cursor-pointer leading-none transition-colors">×</button>
                </div>
                <div className="inline-block p-4 border-2 border-gray-100 rounded-2xl mb-4" ref={qrRef}>
                    <QRCodeCanvas value={token} size={190} level="H" />
                </div>
                <div className="mb-4.5">
                    <span className="font-mono bg-blue-50 text-blue-600 border border-blue-200 rounded-lg py-1.5 px-3.5 text-base font-bold tracking-widest">
                        {token}
                    </span>
                </div>
                <button onClick={download} className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl font-bold text-sm cursor-pointer transition-colors shadow-[0_4px_14px_rgba(29,111,212,0.3)]">
                    ⬇ Download PNG
                </button>
            </div>
        </div>
    );
}

// ===== DROPDOWN FIXED =====
function ActionDropdown({ item, onEdit, onDelete, onShowQR, onOpenLink }) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, right: 0 });
    const btnRef = useRef(null);

    const toggle = (e) => {
        e.stopPropagation();
        if (!open) {
            const rect = btnRef.current.getBoundingClientRect();
            setPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
        }
        setOpen(p => !p);
    };

    useEffect(() => {
        if (!open) return;
        const close = () => setOpen(false);
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [open]);

    const menuItems = [
        { icon: '📷', label: 'Tampilkan Kode QR', fn: () => { onShowQR(item.token); setOpen(false); } },
        { icon: '🔗', label: 'Buka Link Form', fn: () => { window.open(item.link_form, '_blank'); setOpen(false); } },
        { icon: '📋', label: 'Salin Token', fn: () => { navigator.clipboard.writeText(item.token); setOpen(false); alert('Token disalin!'); } },
        null,
        { icon: '✏️', label: 'Edit', fn: () => { onEdit(item); setOpen(false); } },
        { icon: '🗑️', label: 'Hapus', fn: () => { setOpen(false); onDelete(item.id_exam); }, danger: true },
    ];

    return (
        <div className="relative inline-block">
            <button ref={btnRef} onClick={toggle} className="w-[34px] h-[34px] bg-white border-2 border-blue-600 rounded-full cursor-pointer inline-flex items-center justify-center text-blue-600 text-xl font-bold leading-none hover:bg-blue-50 transition-colors">
                ⋮
            </button>

            {open && (
                <div onClick={e => e.stopPropagation()} style={{ top: pos.top, right: pos.right }} className="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.14)] min-w-[210px] overflow-hidden py-1">
                    {menuItems.map((a, i) => a === null ? (
                        <div key={i} className="h-px bg-gray-100 my-1" />
                    ) : (
                        <button key={i} onClick={a.fn} className={`w-full flex items-center gap-3 px-4.5 py-2.5 bg-transparent border-none text-left text-sm cursor-pointer font-medium box-border transition-colors ${a.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <span className="w-[18px] text-center text-sm shrink-0">{a.icon}</span>
                            {a.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ===== TOKEN BADGE =====
function TokenBadge({ token }) {
    const [hovered, setHovered] = useState(false);

    const dashIdx = token.indexOf('-');
    const prefix = dashIdx !== -1 ? token.slice(0, dashIdx + 1) : token;
    const suffix = dashIdx !== -1 ? token.slice(dashIdx + 1) : '';
    const censoredSuffix = '•••' + suffix.slice(3);

    return (
        <span
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={token}
            className="font-mono font-bold text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md py-0.5 px-2 tracking-wide cursor-default transition-all duration-200 select-none inline-block min-w-[90px] text-center"
        >
            {hovered ? token : prefix + censoredSuffix}
        </span>
    );
}

// ===== MAIN PAGE =====
export default function RuangUjianPage() {
    const router = useRouter();
    const [list, setList] = useState([]);
    const [fetching, setFetching] = useState(true);

    const [createModal, setCreateModal] = useState(false);
    const [createJudul, setCreateJudul] = useState('');
    const [createLink, setCreateLink] = useState('');
    const [createErr, setCreateErr] = useState('');
    const [creating, setCreating] = useState(false);

    const [editModal, setEditModal] = useState({ open: false, id: null, judul: '', link: '' });
    const [updating, setUpdating] = useState(false);

    const [qrToken, setQrToken] = useState('');
    const qrRef = useRef(null);

    useEffect(() => {
        if (!localStorage.getItem('token')) { router.push('/login'); return; }
        fetchList();
    }, [router]);

    const fetchList = async () => {
        setFetching(true);
        try {
            const res = await api.get('/api/exam');
            if (res.data.status === 200) setList([...res.data.data].sort((a, b) => b.id_exam - a.id_exam));
        } catch (e) {
            if (e.response?.status === 401) { localStorage.removeItem('token'); router.push('/login'); }
        } finally { setFetching(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault(); setCreating(true); setCreateErr('');
        try {
            const res = await api.post('/api/exam', { judul: createJudul, link_form: createLink });
            if (res.data.status === 200) { setCreateModal(false); setCreateJudul(''); setCreateLink(''); fetchList(); setQrToken(res.data.data.token); }
            else setCreateErr(res.data.message || 'Gagal.');
        } catch (e) { setCreateErr(e.response?.data?.message || 'Koneksi bermasalah.'); }
        finally { setCreating(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus ujian ini? Data tidak dapat dikembalikan.')) return;
        try { await api.delete(`/api/exam/${id}`); fetchList(); } catch { alert('Gagal menghapus.'); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault(); setUpdating(true);
        try {
            const res = await api.put(`/api/exam/${editModal.id}`, { judul: editModal.judul, link_form: editModal.link });
            if (res.data.status === 200) { setEditModal({ open: false, id: null, judul: '', link: '' }); fetchList(); }
        } catch { alert('Gagal update.'); }
        finally { setUpdating(false); }
    };

    const fmtDate = (d) => d ? new Date(d).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

    return (
        <div className="bg-white min-h-full">
            {/* Modals */}
            <Modal isOpen={createModal} onClose={() => { setCreateModal(false); setCreateErr(''); setCreateJudul(''); setCreateLink(''); }} title="Buat Ruang Ujian Baru">
                <form onSubmit={handleCreate}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Judul Ujian</label>
                    <input 
                        value={createJudul} onChange={e => setCreateJudul(e.target.value)} required placeholder="Ujian Tengah Semester..." 
                        className="w-full px-3.5 py-2.5 rounded-xl border-1.5 border-gray-200 text-sm text-gray-900 bg-white outline-none transition-colors focus:border-blue-600 mb-3.5 font-inherit" 
                    />
                    
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Link Form / Ujian</label>
                    <textarea 
                        value={createLink} onChange={e => setCreateLink(e.target.value)} required rows={3} placeholder="https://forms.gle/..." 
                        className="w-full px-3.5 py-2.5 rounded-xl border-1.5 border-gray-200 text-sm text-gray-900 bg-white outline-none transition-colors focus:border-blue-600 mb-3.5 font-inherit resize-y" 
                    />
                    
                    {createErr && <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-3.5 py-2.5 text-[13px] mb-3.5">⚠️ {createErr}</div>}
                    
                    <div className="flex gap-2.5 mt-2">
                        <button type="submit" disabled={creating || !createLink || !createJudul} className={`flex-1 p-3 rounded-xl font-bold text-sm text-white border-none transition-colors ${creating || !createLink || !createJudul ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-[0_4px_14px_rgba(29,111,212,0.3)]'}`}>
                            {creating ? '⏳ Memproses...' : '🚀 Generate Token & QR'}
                        </button>
                        <button type="button" onClick={() => setCreateModal(false)} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none rounded-xl font-semibold text-sm cursor-pointer transition-colors">Batal</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, id: null, judul: '', link: '' })} title="Edit Ruang Ujian">
                <form onSubmit={handleUpdate}>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Judul Ujian</label>
                    <input 
                        value={editModal.judul} onChange={e => setEditModal(p => ({ ...p, judul: e.target.value }))} required 
                        className="w-full px-3.5 py-2.5 rounded-xl border-1.5 border-gray-200 text-sm text-gray-900 bg-white outline-none transition-colors focus:border-blue-600 mb-3.5 font-inherit" 
                    />
                    
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Link Form Baru</label>
                    <textarea 
                        value={editModal.link} onChange={e => setEditModal(p => ({ ...p, link: e.target.value }))} required rows={3} 
                        className="w-full px-3.5 py-2.5 rounded-xl border-1.5 border-gray-200 text-sm text-gray-900 bg-white outline-none transition-colors focus:border-blue-600 mb-4 font-inherit resize-y" 
                    />
                    
                    <div className="flex gap-2.5 mt-2">
                        <button type="submit" disabled={updating} className={`flex-1 p-3 rounded-xl font-bold text-sm text-white border-none transition-colors ${updating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.3)]'}`}>
                            {updating ? 'Menyimpan...' : '✅ Simpan Perubahan'}
                        </button>
                        <button type="button" onClick={() => setEditModal({ open: false, id: null, judul: '', link: '' })} className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 border-none rounded-xl font-semibold text-sm cursor-pointer transition-colors">Batal</button>
                    </div>
                </form>
            </Modal>

            <QRModal token={qrToken} onClose={() => setQrToken('')} qrRef={qrRef} />

            {/* Page Header */}
            <div className="flex items-center justify-between mb-7">
                <h1 className="m-0 text-[26px] font-extrabold text-gray-900 tracking-tight">Ruang Ujian</h1>
            </div>

            {/* Table/Card Container */}
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="px-5 py-3.5 flex justify-end border-b border-gray-100 bg-gray-50/50">
                    <button onClick={() => setCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white border-none rounded-full font-bold text-[13px] cursor-pointer shadow-[0_2px_8px_rgba(29,111,212,0.25)] tracking-wide transition-colors">
                        BUAT RUANG UJIAN
                    </button>
                </div>

                <div className="overflow-x-auto w-full">
                    {fetching ? (
                        <div className="p-16 text-center text-gray-400 font-medium">⏳ Memuat data...</div>
                    ) : list.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="text-5xl mb-3">📭</div>
                            <p className="font-bold text-gray-700 m-0 mb-1.5">Belum ada ruang ujian</p>
                            <p className="text-gray-400 text-[13px] m-0">Klik &ldquo;BUAT RUANG UJIAN&rdquo; untuk memulai.</p>
                        </div>
                    ) : (
                        <>
                            {/* ===== MOBILE CARD VIEW ===== */}
                            <div className="md:hidden p-3 flex flex-col gap-3">
                                {list.map((item) => (
                                    <div key={item.id_exam} className="border border-gray-100 rounded-xl p-4 bg-white flex gap-3 items-start shadow-sm">
                                        {/* Left accent */}
                                        <div className="w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400 self-stretch shrink-0 min-h-[56px]" />
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1.5 gap-2">
                                                <span className="text-[15px] font-bold text-gray-900 truncate flex-1 leading-tight">
                                                    {item.judul || '—'}
                                                </span>
                                                <ActionDropdown
                                                    item={item}
                                                    onEdit={(it) => setEditModal({ open: true, id: it.id_exam, judul: it.judul, link: it.link_form })}
                                                    onDelete={handleDelete}
                                                    onShowQR={(token) => setQrToken(token)}
                                                    onOpenLink={(url) => window.open(url, '_blank')}
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <TokenBadge token={item.token} />
                                            </div>
                                            <a href={item.link_form} target="_blank" rel="noopener noreferrer"
                                                className="block text-xs text-gray-500 hover:text-blue-600 no-underline truncate font-mono mb-2 transition-colors"
                                                title={item.link_form}>
                                                🔗 {item.link_form}
                                            </a>
                                            <span className="text-[11px] font-medium text-gray-400">📅 {fmtDate(item.createAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ===== DESKTOP TABLE VIEW ===== */}
                            <table className="hidden md:table w-full border-collapse text-sm text-left">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50/50">
                                        {['NO', 'DETAIL', 'DIBUAT PADA', 'AKSI'].map(h => (
                                            <th key={h} className={`px-4 py-3.5 font-bold text-[11px] text-gray-500 uppercase tracking-widest whitespace-nowrap ${h === 'AKSI' ? 'text-center' : ''}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, idx) => (
                                        <tr key={item.id_exam} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-4 py-4 text-gray-400 font-semibold w-[50px]">{idx + 1}</td>

                                            <td className="px-4 py-3.5">
                                                <div className="flex items-start gap-3 w-full">
                                                    <div className="w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400 self-stretch shrink-0 min-h-[44px]" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                                            <span className="text-[15px] font-bold text-gray-900 truncate max-w-[220px]">
                                                                {item.judul || '—'}
                                                            </span>
                                                            <TokenBadge token={item.token} />
                                                        </div>
                                                        <a href={item.link_form} target="_blank" rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 no-underline truncate max-w-[340px] font-mono transition-colors"
                                                            title={item.link_form}
                                                        >
                                                            🔗 {item.link_form}
                                                        </a>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-gray-500 text-[13px] whitespace-nowrap">{fmtDate(item.createAt)}</td>

                                            <td className="px-4 py-4 text-center align-middle">
                                                <ActionDropdown
                                                    item={item}
                                                    onEdit={(it) => setEditModal({ open: true, id: it.id_exam, judul: it.judul, link: it.link_form })}
                                                    onDelete={handleDelete}
                                                    onShowQR={(token) => setQrToken(token)}
                                                    onOpenLink={(url) => window.open(url, '_blank')}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
