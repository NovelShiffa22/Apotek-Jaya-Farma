import { Link } from '@inertiajs/react';
import { FileText, CheckCircle2, XCircle, Clock, ShoppingCart, Info, AlertTriangle, ZoomIn, User, BriefcaseMedical, UploadCloud, Headset, Pill, Syringe, Tablets } from 'lucide-react';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';

export default function PrescriptionDetail({ id }: { id: string }) {
    const [status, setStatus] = useState<'Verifikasi' | 'Disetujui' | 'Ditolak'>('Verifikasi');
    const [date, setDate] = useState('Oct 24, 2024');

    useEffect(() => {
        const existing = JSON.parse(localStorage.getItem('mock_prescriptions') || '[]');
        const found = existing.find((p: any) => p.id === `#${id}` || p.id === id);
        if (found) {
            setStatus(found.status === 'Pending' ? 'Verifikasi' : found.status);
            setDate(found.date);
        }
    }, [id]);

    const MOCK_DRUGS = [
        { name: 'Paracetamol 500mg', qty: '10 tabs', icon: <Pill size={20} className="text-[#006a3f]" />, instruction: 'Diminum 3x sehari setelah makan', price: 15000 },
        { name: 'Amoxicillin 500mg', qty: '15 tabs', icon: <BriefcaseMedical size={20} className="text-[#006a3f]" />, instruction: 'Diminum 3x sehari, harus dihabiskan', price: 45000 },
        { name: 'Cetirizine 10mg', qty: '10 tabs', icon: <Syringe size={20} className="text-[#006a3f]" />, instruction: 'Diminum 1x sehari sebelum tidur', price: 25000 },
    ];

    const totalHarga = MOCK_DRUGS.reduce((acc, curr) => acc + curr.price, 0);
    const biayaPengiriman = 15000;
    const biayaLayanan = 2000;
    const totalPembayaran = totalHarga + biayaPengiriman + biayaLayanan;

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />

            <main className="mx-auto max-w-6xl px-8 py-10">
                {status !== 'Disetujui' && (
                    <div className="mb-6">
                        <Link href={route('prescriptions.index')} className="text-[#006a3f] hover:underline font-['Poppins',sans-serif] text-[13px] font-medium">
                            &larr; Kembali ke Riwayat Resep
                        </Link>
                    </div>
                )}

                {/* Header Section */}
                {status !== 'Disetujui' ? (
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <h1 className="font-['Poppins',sans-serif] text-[32px] font-bold text-[#171d19] tracking-tight">
                            Detail Resep
                        </h1>
                        
                        <div>
                            {status === 'Verifikasi' && (
                                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-5 py-2 rounded-full font-['Poppins',sans-serif] font-bold text-[14px]">
                                    Menunggu Verifikasi
                                </div>
                            )}
                            {status === 'Ditolak' && (
                                <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-5 py-2 rounded-full font-['Poppins',sans-serif] font-bold text-[14px]">
                                    <XCircle size={18} /> Ditolak
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-4">
                        <h1 className="font-['Poppins',sans-serif] text-[36px] font-bold text-[#171d19] tracking-tight">
                            Detail Resep
                        </h1>
                        <div className="inline-flex items-center gap-2 bg-[#f0f9f4] text-[#006a3f] px-6 py-2 rounded-full font-['Poppins',sans-serif] font-bold text-[15px]">
                            <CheckCircle2 size={20} /> Disetujui
                        </div>
                    </div>
                )}

                {/* Alerts Section (Only for Verifikasi and Ditolak) */}
                {status === 'Ditolak' && (
                    <div className="bg-red-100/50 border border-red-200 p-6 rounded-2xl mb-8 flex items-start gap-3">
                        <AlertTriangle className="text-red-600 mt-0.5 shrink-0" size={24} />
                        <div>
                            <h4 className="font-['Poppins',sans-serif] font-bold text-red-800 text-[16px]">Alasan Penolakan</h4>
                            <p className="font-['Poppins',sans-serif] text-[14px] text-red-700 mt-1 leading-relaxed">
                                Alasan: Foto resep tidak terbaca jelas (buram). Mohon pastikan seluruh bagian resep terlihat jelas dengan pencahayaan yang cukup saat mengunggah kembali.
                            </p>
                        </div>
                    </div>
                )}

                {status === 'Verifikasi' && (
                    <div className="bg-amber-100/50 border border-amber-200 p-6 rounded-2xl mb-8 flex items-start gap-3">
                        <Info className="text-amber-700 mt-0.5 shrink-0" size={24} />
                        <div>
                            <h4 className="font-['Poppins',sans-serif] font-bold text-amber-900 text-[16px]">Status Verifikasi</h4>
                            <p className="font-['Poppins',sans-serif] text-[14px] text-amber-800 mt-1 leading-relaxed">
                                Apoteker kami sedang memverifikasi resep Anda. Mohon tunggu 15-30 menit. Notifikasi akan dikirimkan setelah status berubah.
                            </p>
                        </div>
                    </div>
                )}

                {status !== 'Disetujui' ? (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {/* Left Col: Prescription Preview */}
                        <div className="md:col-span-3 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19]">Pratinjau Resep</h3>
                                    <button className="flex items-center gap-2 text-[#006a3f] font-['Poppins',sans-serif] font-semibold text-[14px] hover:underline">
                                        <ZoomIn size={16} /> Perbesar Foto
                                    </button>
                                </div>
                                
                                <div className="bg-gray-100 rounded-xl h-[400px] relative overflow-hidden border border-gray-200">
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80')] bg-cover bg-center blur-[2px] opacity-60"></div>
                                    
                                    {(status === 'Ditolak' || status === 'Verifikasi') && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg border border-red-100 text-red-600 font-['Poppins',sans-serif] font-bold">
                                                <XCircle size={24} />
                                                Foto Kurang Jelas
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Col: Details & Actions */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-['Poppins',sans-serif] font-bold text-[16px] text-[#171d19]">Detail Pasien</h3>
                                        <p className="font-['Poppins',sans-serif] text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Informasi Penerima</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Nama Lengkap</span>
                                        <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">Budi Santoso</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Tanggal Lahir</span>
                                        <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">12 Mei 1985</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Nomor Telepon</span>
                                        <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">+62 812 3456 7890</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <BriefcaseMedical size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-['Poppins',sans-serif] font-bold text-[16px] text-[#171d19]">Detail Dokter</h3>
                                        <p className="font-['Poppins',sans-serif] text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Pemberi Resep</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Nama Dokter</span>
                                        <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">dr. Aris Munandar, Sp.PD</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Instansi</span>
                                        <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">RS Umum Jaya Sehat</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">SIP</span>
                                        <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">21.04.1.2.000192</span>
                                    </div>
                                </div>
                            </div>

                            {status === 'Ditolak' && (
                                <div className="space-y-4 pt-4">
                                    <Link 
                                        href={route('prescriptions.upload.step1')}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#006a3f] py-4 font-['Poppins',sans-serif] text-[15px] font-bold text-white transition-all hover:bg-[#005632] shadow-lg"
                                    >
                                        <UploadCloud size={20} />
                                        Unggah Ulang Resep
                                    </Link>
                                    <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#006a3f] py-4 font-['Poppins',sans-serif] text-[15px] font-bold text-[#006a3f] transition-all hover:bg-emerald-50 bg-white">
                                        Hubungi Layanan Bantuan
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // New Layout for Disetujui
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Col */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#f0f9f4] rounded-xl flex items-center justify-center text-[#006a3f]">
                                    <FileText size={32} />
                                </div>
                                <span className="font-['Poppins',sans-serif] font-bold text-[16px] text-[#171d19]">resep_obat.png</span>
                            </div>
                            
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19] mb-6">Daftar Obat</h3>
                                <div className="space-y-6 divide-y divide-gray-100">
                                    {MOCK_DRUGS.map((drug, idx) => (
                                        <div key={idx} className={`${idx !== 0 ? 'pt-6' : ''} flex flex-col sm:flex-row sm:items-start justify-between gap-4`}>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                                    {drug.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px]">{drug.name}</h4>
                                                    <p className="font-['Poppins',sans-serif] text-gray-500 text-[13px] mt-1">{drug.qty}</p>
                                                    <p className="font-['Poppins',sans-serif] text-gray-500 text-[12px] font-medium mt-1">{drug.instruction}</p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right ml-14 sm:ml-0 mt-2 sm:mt-0">
                                                <span className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px]">
                                                    Rp {drug.price.toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Col */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19] mb-8">Ringkasan Pembayaran</h3>
                                
                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between text-[14px] font-['Poppins',sans-serif] text-gray-500">
                                        <span>Total Harga (3 produk)</span>
                                        <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-['Poppins',sans-serif] text-gray-500">
                                        <span>Biaya Pengiriman</span>
                                        <span>Rp {biayaPengiriman.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-['Poppins',sans-serif] text-gray-500">
                                        <span>Biaya Layanan</span>
                                        <span>Rp {biayaLayanan.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 flex justify-between items-center mb-8">
                                    <span className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px]">Total Pembayaran</span>
                                    <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f] text-[20px]">
                                        Rp {totalPembayaran.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <Link 
                                    href={route('cart.index')}
                                    className="w-full flex items-center justify-center rounded-xl bg-[#006a3f] py-4 font-['Poppins',sans-serif] text-[15px] font-bold text-white transition-all hover:bg-[#005632] shadow-lg"
                                >
                                    Tambahkan ke Keranjang
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
