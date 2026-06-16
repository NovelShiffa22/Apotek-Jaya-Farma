import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, Package, User, FileText, CheckCircle, Clock, Truck, XCircle, FileImage } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function PharmacistOrderDetail({ order, auth }: any) {
    const [isUpdating, setIsUpdating] = useState(false);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'warning' | 'info' | 'success';
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
        cancelText?: string;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const closeConfirmModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const confirmUpdateStatus = (status: string, title: string, message: string) => {
        setModalConfig({
            isOpen: true,
            type: 'warning',
            title,
            message,
            confirmText: 'Ya, Lanjutkan',
            cancelText: 'Batal',
            onConfirm: () => {
                updateOrderStatus(order.id, status);
                closeConfirmModal();
            }
        });
    };

    const updateOrderStatus = (id: number | string, status: string) => {
        setIsUpdating(true);
        router.put(
            `/pharmacist/orders/${id}/status`,
            { status },
            { 
                preserveScroll: true,
                onFinish: () => setIsUpdating(false)
            }
        );
    };

    const statusConfig: any = {
        menunggu_pembayaran: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', icon: Clock },
        diproses: { bg: 'bg-blue-50', color: 'text-blue-700', border: 'border-blue-200', icon: Package },
        dikirim: { bg: 'bg-indigo-50', color: 'text-indigo-700', border: 'border-indigo-200', icon: Truck },
        selesai: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
        dibatalkan: { bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-200', icon: XCircle },
    };

    const statusLabels: Record<string, string> = {
        menunggu_pembayaran: 'Menunggu Pembayaran',
        diproses: 'Diproses',
        dikirim: 'Dikirim',
        selesai: 'Selesai',
        dibatalkan: 'Dibatalkan',
    };

    const cfg = statusConfig[order.status] || { bg: 'bg-gray-50', color: 'text-gray-600', border: 'border-gray-200', icon: Package };
    const StatusIcon = cfg.icon;

    const totalQty = order.products?.reduce((sum: number, p: any) => sum + (p.pivot?.kuantitas || 1), 0) || 0;
    const hasPrescription = !!order.prescription;
    const prescriptionFileUrl = hasPrescription && order.prescription?.file_foto
        ? (() => {
            const f = order.prescription.file_foto;
            if (f.startsWith('http')) return f;
            if (f.startsWith('storage/') || f.startsWith('/storage/')) {
                return f.startsWith('/') ? f : `/${f}`;
            }
            return `/storage/${f}`;
        })()
        : null;

    const penanggungJawab = (() => {
        if (!order.status_histories || order.status_histories.length === 0) return null;
        const found = [...order.status_histories].reverse().find((h: any) => h.changed_by_user?.name);
        return found?.changed_by_user?.name || null;
    })();

    const isVirtual = order.id.toString().startsWith('vt_');

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Head title={`Detail Pesanan ${order.kode_pesanan} - Apotek Jaya Farma`} />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button & Header */}
                <div className="mb-8">
                    <Link 
                        href="/pharmacist" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0D6A36] transition-colors mb-4 font-['Inter',sans-serif] text-sm font-semibold"
                    >
                        <ChevronLeft size={18} />
                        Kembali ke Dashboard
                    </Link>
                    
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="font-['Roboto_Condensed',sans-serif] text-3xl font-bold text-slate-800">
                                    Pesanan {order.kode_pesanan}
                                </h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                    <StatusIcon size={14} />
                                    {statusLabels[order.status] || order.status}
                                </span>
                            </div>
                            <p className="font-['Inter',sans-serif] text-sm text-slate-500">
                                Dibuat pada: {new Date(order.created_at).toLocaleString('id-ID', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                            </p>
                        </div>
                        
                        <div className="text-left md:text-right">
                            <p className="font-['Inter',sans-serif] text-sm text-slate-500 mb-1">Total Pembayaran</p>
                            <p className="font-['Roboto_Condensed',sans-serif] text-3xl font-bold text-[#0D6A36]">
                                Rp {parseFloat(order.total_biaya || 0).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                <h2 className="font-['Inter',sans-serif] text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Package size={18} className="text-slate-400" />
                                    Daftar Item Obat ({totalQty} barang)
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {order.products?.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-slate-50">
                                            {item.gambar ? (
                                                <img src={item.gambar.startsWith('http') ? item.gambar : `/storage/${item.gambar}`} alt={item.nama_obat} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Package size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-['Inter',sans-serif] text-base font-bold text-slate-800 mb-1 line-clamp-1">{item.nama_obat}</h3>
                                            <div className="flex items-center gap-4 text-sm font-['Inter',sans-serif]">
                                                <span className="text-slate-500">{item.pivot.kuantitas} x Rp {parseFloat(item.pivot.harga_satuan).toLocaleString('id-ID')}</span>
                                            </div>
                                            {order.status === 'diproses' && (
                                                <div className="mt-2 flex flex-col items-start gap-1">
                                                    <span className="text-[11px] font-['Inter',sans-serif] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                                        Stok Gudang: {item.stok !== undefined ? item.stok : '-'}
                                                    </span>
                                                    {item.stok !== undefined && item.stok < item.pivot.kuantitas && (
                                                        <span className="text-[11px] font-bold text-white bg-red-500 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                                            ⚠️ Stok Tidak Mencukupi!
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="font-['Inter',sans-serif] font-bold text-slate-800">
                                                Rp {(item.pivot.kuantitas * parseFloat(item.pivot.harga_satuan)).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Status History */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-['Inter',sans-serif] text-base font-bold text-slate-800 flex items-center gap-2">
                                    <Clock size={18} className="text-slate-400" />
                                    Riwayat Pesanan
                                </h2>
                            </div>
                            <div className="p-6">
                                {order.status_histories && order.status_histories.length > 0 ? (
                                    <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                                        {order.status_histories.map((history: any, idx: number) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${statusConfig[history.status_sesudah]?.bg.replace('bg-', 'bg-').replace('-50', '-500') || 'bg-slate-400'}`} />
                                                <div>
                                                    <p className="font-['Inter',sans-serif] text-sm font-bold text-slate-800">
                                                        {history.status_sebelum
                                                            ? `${statusLabels[history.status_sebelum] || history.status_sebelum} → ${statusLabels[history.status_sesudah] || history.status_sesudah}`
                                                            : statusLabels[history.status_sesudah] || history.status_sesudah
                                                        }
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1 text-xs font-['Inter',sans-serif] text-slate-500">
                                                        <span className="font-medium text-slate-700">{history.changed_by_user?.name || 'Sistem'}</span>
                                                        <span>&bull;</span>
                                                        <span>{new Date(history.created_at).toLocaleString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic font-['Inter',sans-serif]">Belum ada riwayat perubahan status.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Actions */}
                    <div className="space-y-6">
                        {/* Action Panel */}
                        <div className="bg-white rounded-2xl border border-[#0D6A36]/20 shadow-[0_4px_20px_rgba(13,106,63,0.08)] overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-[#F4FDF8]">
                                <h2 className="font-['Inter',sans-serif] text-base font-bold text-[#0D6A36] flex items-center gap-2">
                                    Update Status
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {isVirtual && order.status === 'diproses' && !penanggungJawab ? (
                                    <div className="space-y-3">
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 font-['Inter',sans-serif]">
                                            Pesanan online ini sudah otomatis terbayar. Silakan klaim pesanan ini sebelum menyiapkan obat.
                                        </div>
                                        <button
                                            disabled={isUpdating}
                                            onClick={() => confirmUpdateStatus('diproses', 'Ambil Alih Pesanan?', 'Yakin ingin mengambil alih pesanan ini?')}
                                            className="w-full py-3 rounded-xl bg-red-600 text-white font-['Inter',sans-serif] text-sm font-bold shadow-md hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isUpdating ? 'Memproses...' : 'Ambil Alih Pesanan Ini'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block font-['Inter',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Penanggung Jawab</label>
                                            {penanggungJawab ? (
                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#0D6A36]/10 text-[#0D6A36] flex items-center justify-center font-bold text-xs shrink-0">
                                                        {penanggungJawab.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-['Inter',sans-serif] text-sm font-bold text-slate-800">{penanggungJawab}</span>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-400 font-['Inter',sans-serif] italic">
                                                    Belum ditentukan
                                                </div>
                                            )}
                                        </div>

                                        {order.status !== 'selesai' && order.status !== 'dibatalkan' && (
                                            <div>
                                                <label className="block font-['Inter',sans-serif] text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pilih Status Baru</label>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {order.status === 'menunggu_pembayaran' && !isVirtual && (
                                                        <button onClick={() => confirmUpdateStatus('diproses', 'Tandai Diproses?', 'Yakin ingin menandai pesanan ini sedang diproses?')} disabled={isUpdating} className="w-full text-left px-4 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold text-sm transition-colors">
                                                            Tandai Sedang Diproses
                                                        </button>
                                                    )}
                                                    {order.status === 'diproses' && (
                                                        <button onClick={() => confirmUpdateStatus('dikirim', 'Kirim Pesanan?', 'Yakin ingin mengirim pesanan ini?')} disabled={isUpdating} className="w-full text-left px-4 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold text-sm transition-colors">
                                                            Kirim Pesanan
                                                        </button>
                                                    )}
                                                    {order.status === 'dikirim' && (
                                                        <button onClick={() => confirmUpdateStatus('selesai', 'Selesaikan Pesanan?', 'Yakin ingin menyelesaikan pesanan ini?')} disabled={isUpdating} className="w-full text-left px-4 py-3 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold text-sm transition-colors">
                                                            Selesaikan Pesanan
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {(order.status === 'selesai' || order.status === 'dibatalkan') && (
                                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                                                <span className="font-['Inter',sans-serif] text-sm text-slate-500 font-medium">Pesanan ini sudah ditutup dan tidak dapat diubah lagi.</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                <h2 className="font-['Inter',sans-serif] text-base font-bold text-slate-800 flex items-center gap-2">
                                    <User size={18} className="text-slate-400" />
                                    Informasi Pelanggan
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Pelanggan</p>
                                    <p className="text-sm font-semibold text-slate-800">{order.user?.name || 'Guest'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Metode Pembayaran</p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {order.payment_method === 'Midtrans Payment Gateway' ? 'Virtual Account' : (order.payment_method || '-')}
                                    </p>
                                </div>
                                {order.va_number && (
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nomor Virtual Account</p>
                                        <p className="text-sm font-medium text-slate-800">{order.va_number}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Alamat Pengiriman</p>
                                    <p className="text-sm font-medium text-slate-800">{order.shipping_address || 'Alamat belum diatur'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Prescription Document */}
                        {hasPrescription && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                                    <h2 className="font-['Inter',sans-serif] text-base font-bold text-slate-800 flex items-center gap-2">
                                        <FileText size={18} className="text-slate-400" />
                                        Dokumen Resep
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kode Resep</p>
                                    <p className="text-sm font-semibold text-slate-800 mb-4">{order.prescription.kode_resep}</p>
                                    
                                    {prescriptionFileUrl ? (
                                        <a
                                            href={prescriptionFileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border ${prescriptionFileUrl.toLowerCase().includes('.pdf') ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300' : 'bg-slate-50 text-[#0D6A36] border-[#0D6A36]/20 hover:bg-[#F4FDF8] hover:border-[#0D6A36]'} font-['Inter',sans-serif] text-sm font-bold tracking-wide transition-all`}
                                        >
                                            {prescriptionFileUrl.toLowerCase().includes('.pdf') ? <FileText size={16} /> : <FileImage size={16} />}
                                            {prescriptionFileUrl.toLowerCase().includes('.pdf') ? 'Buka Dokumen PDF' : 'Lihat Foto Resep'}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">File resep tidak tersedia.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
        </div>
    );
}
