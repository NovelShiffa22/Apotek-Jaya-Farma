import { Link, router } from '@inertiajs/react';
import { ArrowLeft, FileText, FileImage, User, Calendar, MapPin, Phone, Info, AlertTriangle, CheckCircle2, Copy, Check, Clock, ShoppingCart, ZoomIn, BriefcaseMedical, UploadCloud, Headset, Pill, Syringe, Tablets, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import ConfirmModal from '../../components/ConfirmModal';

export default function PrescriptionDetail({ prescription, user }: { prescription: any, user: any }) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    let status = 'Verifikasi';
    if (prescription.status_validasi === 'disetujui') status = 'Disetujui';
    else if (prescription.status_validasi === 'ditolak') status = 'Ditolak';
    else if (prescription.status_validasi === 'telah_dipesan') status = 'Telah Dipesan';

    const date = new Date(prescription.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });

    const MOCK_DRUGS = [
        { name: 'Paracetamol 500mg', qty: '10 tabs', icon: <Pill size={20} className="text-[#006a3f]" />, instruction: 'Diminum 3x sehari setelah makan', price: 15000 },
        { name: 'Amoxicillin 500mg', qty: '15 tabs', icon: <BriefcaseMedical size={20} className="text-[#006a3f]" />, instruction: 'Diminum 3x sehari, harus dihabiskan', price: 45000 },
        { name: 'Cetirizine 10mg', qty: '10 tabs', icon: <Syringe size={20} className="text-[#006a3f]" />, instruction: 'Diminum 1x sehari sebelum tidur', price: 25000 },
    ];

    const drugs = (prescription.items && prescription.items.length > 0)
        ? prescription.items.map((item: any) => ({
            name: item.product_name || (item.product ? item.product.nama_obat : 'Obat'),
            qty: `${item.kuantitas_ambil ?? item.kuantitas_resep ?? 1} ${item.satuan || 'Pcs'}`,
            icon: <Pill size={20} className="text-[#006a3f]" />,
            instruction: item.signa || 'Diminum sesuai petunjuk dokter',
            price: Number(item.harga_satuan ?? (item.product ? item.product.harga : 0)) * (item.kuantitas_ambil ?? item.kuantitas_resep ?? 1)
        }))
        : MOCK_DRUGS;

    const totalHarga = drugs.reduce((acc: number, curr: any) => acc + curr.price, 0);
    const biayaPengiriman = (prescription.shipping_method === 'kurir' || prescription.shipping_method === 'kurir_toko') ? 12000 : 0;
    const totalPembayaran = totalHarga + biayaPengiriman;

    const activeTransaction = prescription.virtual_transactions?.find(
        (t: any) => ['Pending', 'Belum Bayar', 'menunggu_pembayaran'].includes(t.status)
    );

    const executeProcess = async () => {
        setIsConfirmModalOpen(false);
        setIsProcessing(true);

        try {
            const response = await axios.post(route('checkout.proses'), {
                prescription_id: prescription.id,
                shipping_method: prescription.shipping_method || 'ambil_apotek',
                payment_method: 'midtrans',
                shipping_address: prescription.shipping_address || 'Alamat belum diatur'
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.data && response.data.transaction_id) {
                router.visit(route('order.invoice', { id: response.data.transaction_id }));
            } else {
                alert('Gagal mendapatkan respon dari server.');
                setIsProcessing(false);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />

            <main className="mx-auto max-w-6xl px-8 py-10">
                <div className="mb-6">
                    <Link href="/profile?tab=prescriptions" className="text-[#006a3f] hover:underline font-['Poppins',sans-serif] text-[13px] font-medium">
                        &larr; Kembali ke Riwayat Resep
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-4">
                    <h1 className="font-['Poppins',sans-serif] text-[36px] font-bold text-[#171d19] tracking-tight">
                        Detail Resep
                    </h1>
                    <div className="flex flex-col items-end gap-1">
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
                        {status === 'Disetujui' && (
                            <>
                                <div className="inline-flex items-center gap-2 bg-[#f0f9f4] text-[#006a3f] px-6 py-2 rounded-full font-['Poppins',sans-serif] font-bold text-[15px]">
                                    <CheckCircle2 size={20} /> Disetujui
                                </div>
                                {prescription.verifier_name && (
                                    <p className="font-['Poppins',sans-serif] text-[12px] font-medium text-gray-500 mr-2 mt-1">
                                        Diverifikasi oleh: {prescription.verifier_name}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Alerts Section */}
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
                {status === 'Ditolak' && (
                    <div className="bg-red-100/50 border border-red-200 p-6 rounded-2xl mb-8 flex items-start gap-3">
                        <AlertTriangle className="text-red-600 mt-0.5 shrink-0" size={24} />
                        <div>
                            <h4 className="font-['Poppins',sans-serif] font-bold text-red-800 text-[16px]">Alasan Penolakan</h4>
                            <p className="font-['Poppins',sans-serif] text-[14px] text-red-700 mt-1 leading-relaxed">
                                ❌ Pengajuan Resep Ditolak oleh Apoteker. Alasan: {prescription.rejection_reason || 'Foto resep tidak terbaca jelas atau tidak sesuai ketentuan.'}
                            </p>
                            {prescription.verifier_name && (
                                <p className="font-['Poppins',sans-serif] text-[13px] font-semibold text-red-800 mt-2">
                                    Ditinjau/Ditolak oleh: {prescription.verifier_name}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {/* Left Col: Prescription Preview & Daftar Obat */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Pratinjau Resep */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19]">Pratinjau Resep</h3>
                                <button 
                                    onClick={() => {
                                        const fileUrl = prescription.file_foto.startsWith('http') ? prescription.file_foto : (prescription.file_foto.startsWith('storage/') || prescription.file_foto.startsWith('/storage/') ? (prescription.file_foto.startsWith('/') ? prescription.file_foto : `/${prescription.file_foto}`) : `/storage/${prescription.file_foto}`);
                                        window.open(fileUrl, '_blank');
                                    }}
                                    className="flex items-center gap-2 text-[#006a3f] font-['Poppins',sans-serif] font-semibold text-[14px] hover:underline"
                                >
                                    <ZoomIn size={16} /> Perbesar Foto
                                </button>
                            </div>
                            
                            {(() => {
                                const fileUrl = prescription.file_foto.startsWith('http') ? prescription.file_foto : (prescription.file_foto.startsWith('storage/') || prescription.file_foto.startsWith('/storage/') ? (prescription.file_foto.startsWith('/') ? prescription.file_foto : `/${prescription.file_foto}`) : `/storage/${prescription.file_foto}`);
                                const isPdf = fileUrl.toLowerCase().includes('.pdf');
                                return (
                                    <div 
                                        className={`bg-gray-100 rounded-xl h-[400px] relative overflow-hidden border border-gray-200 cursor-pointer flex items-center justify-center ${isPdf ? 'bg-red-50 hover:bg-red-100' : 'hover:opacity-90'} transition-all`}
                                        onClick={() => window.open(fileUrl, '_blank')}
                                    >
                                        {isPdf ? (
                                            <div className="flex flex-col items-center justify-center text-red-500">
                                                <FileText size={64} />
                                                <span className="font-bold mt-4 tracking-widest text-lg">DOKUMEN PDF</span>
                                                <span className="text-sm font-medium mt-2">Klik untuk membuka di tab baru</span>
                                            </div>
                                        ) : (
                                            <div 
                                                className="absolute inset-0 bg-contain bg-no-repeat bg-center"
                                                style={{ backgroundImage: `url(${fileUrl})` }}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Daftar Obat (Only if Disetujui or Telah Dipesan) */}
                        {(status === 'Disetujui' || status === 'Telah Dipesan') && (
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19] mb-6">Daftar Obat</h3>
                                <div className="space-y-6 divide-y divide-gray-100">
                                    {drugs.map((drug, idx) => (
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
                        )}
                    </div>

                    {/* Right Col: Payment, Details & Actions */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Ringkasan Pembayaran (Only if Disetujui or Telah Dipesan) */}
                        {(status === 'Disetujui' || status === 'Telah Dipesan') && (
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#171d19] mb-8">Ringkasan Pembayaran</h3>
                                
                                <div className="space-y-5 mb-8">
                                    <div className="flex justify-between text-[14px] font-['Poppins',sans-serif] text-gray-500">
                                        <span>Total Harga ({drugs.length} produk)</span>
                                        <span>Rp {totalHarga.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between text-[14px] font-['Poppins',sans-serif] text-gray-500">
                                        <span>Biaya Pengiriman</span>
                                        <span>Rp {biayaPengiriman.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6 flex justify-between items-center mb-8">
                                    <span className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px]">Total Pembayaran</span>
                                    <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f] text-[20px]">
                                        Rp {totalPembayaran.toLocaleString('id-ID')}
                                    </span>
                                </div>

                                {activeTransaction ? (
                                    <div className="space-y-3">
                                        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl text-sm font-['Poppins',sans-serif]">
                                            ⚠️ Terdapat tagihan pembayaran yang belum diselesaikan untuk resep ini.
                                        </div>
                                        <button 
                                            onClick={() => router.visit(route('order.invoice', { id: activeTransaction.id }))}
                                            className="w-full flex items-center justify-center rounded-xl bg-amber-500 py-4 font-['Poppins',sans-serif] text-[15px] font-bold text-white transition-all hover:bg-amber-600 shadow-lg"
                                        >
                                            Lanjutkan Pembayaran Pending
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setIsConfirmModalOpen(true)}
                                        disabled={isProcessing || status === 'Telah Dipesan'}
                                        className="w-full flex items-center justify-center rounded-xl bg-[#006a3f] py-4 font-['Poppins',sans-serif] text-[15px] font-bold text-white transition-all hover:bg-[#005632] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {status === 'Telah Dipesan' ? 'Sudah Dibayar' : (isProcessing ? 'Memproses...' : 'Bayar Sekarang')}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Timeline Tracking Log (Only if Telah Dipesan) */}
                        {status === 'Telah Dipesan' && prescription.virtual_transactions && prescription.virtual_transactions.length > 0 && (
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#006a3f]">
                                <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#006a3f] mb-6 flex items-center gap-2">
                                    <Clock size={20} />
                                    Tabel Log Status Pesanan
                                </h3>
                                
                                {(() => {
                                    const vt = prescription.virtual_transactions[0];
                                    const vtStatus = vt.status || 'Pending';
                                    
                                    return (
                                        <div className="relative">
                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                            
                                            {/* Menunggu Pembayaran */}
                                            <div className="relative flex items-start mb-6">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                                                    ['Pending', 'Belum Bayar'].includes(vtStatus) 
                                                    ? 'bg-amber-100 border-2 border-amber-500 text-amber-600' 
                                                    : 'bg-[#006a3f] text-white'
                                                }`}>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h5 className={`font-['Inter',sans-serif] text-[14px] font-bold ${
                                                    ['Pending', 'Belum Bayar'].includes(vtStatus) ? 'text-amber-700' : 'text-gray-900'
                                                    }`}>Menunggu Pembayaran</h5>
                                                    <p className="text-[12px] text-gray-500 mt-1 font-medium">Pembayaran telah dikonfirmasi dan tervalidasi</p>
                                                </div>
                                            </div>

                                            {/* Diproses */}
                                            <div className="relative flex items-start mb-6">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                                                    ['Lunas', 'diproses', 'Diproses'].includes(vtStatus)
                                                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-600'
                                                    : (['dikirim', 'Dikirim', 'selesai', 'Selesai'].includes(vtStatus) ? 'bg-[#006a3f] text-white' : 'bg-gray-100 border-2 border-gray-200 text-gray-300')
                                                }`}>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h5 className={`font-['Inter',sans-serif] text-[14px] font-bold ${
                                                    ['Lunas', 'diproses', 'Diproses'].includes(vtStatus) ? 'text-blue-700' : 
                                                    (['dikirim', 'Dikirim', 'selesai', 'Selesai'].includes(vtStatus) ? 'text-gray-900' : 'text-gray-400')
                                                    }`}>Diproses</h5>
                                                    {['Lunas', 'diproses', 'Diproses'].includes(vtStatus) && (
                                                    <p className="text-[12px] text-gray-500 mt-1 font-medium">Pesanan sedang dikemas oleh apoteker</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Dikirim */}
                                            <div className="relative flex items-start mb-6">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                                                    ['dikirim', 'Dikirim'].includes(vtStatus)
                                                    ? 'bg-purple-100 border-2 border-purple-500 text-purple-600'
                                                    : (['selesai', 'Selesai'].includes(vtStatus) ? 'bg-[#006a3f] text-white' : 'bg-gray-100 border-2 border-gray-200 text-gray-300')
                                                }`}>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h5 className={`font-['Inter',sans-serif] text-[14px] font-bold ${
                                                    ['dikirim', 'Dikirim'].includes(vtStatus) ? 'text-purple-700' : 
                                                    (['selesai', 'Selesai'].includes(vtStatus) ? 'text-gray-900' : 'text-gray-400')
                                                    }`}>Dikirim</h5>
                                                    {['dikirim', 'Dikirim'].includes(vtStatus) && (
                                                    <p className="text-[12px] text-gray-500 mt-1 font-medium">Pesanan dalam perjalanan via kurir</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Selesai */}
                                            <div className="relative flex items-start">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                                                    ['selesai', 'Selesai'].includes(vtStatus)
                                                    ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-600'
                                                    : 'bg-gray-100 border-2 border-gray-200 text-gray-300'
                                                }`}>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-current"></div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h5 className={`font-['Inter',sans-serif] text-[14px] font-bold ${
                                                    ['selesai', 'Selesai'].includes(vtStatus) ? 'text-emerald-700' : 'text-gray-400'
                                                    }`}>Selesai</h5>
                                                    {['selesai', 'Selesai'].includes(vtStatus) && (
                                                    <p className="text-[12px] text-gray-500 mt-1 font-medium">Pesanan telah diterima</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Detail Pasien */}
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
                                    <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">{prescription.nama_pasien || user.name || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Tanggal Lahir</span>
                                    <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">{prescription.tanggal_lahir_pasien || user.dob || '-'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500">Nomor Telepon</span>
                                    <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">{prescription.whatsapp || user.phone || '-'}</span>
                                </div>
                                <div className="flex justify-between items-start gap-4 pt-2 border-t border-gray-50">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-500 whitespace-nowrap">Alamat Pengiriman</span>
                                    <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19] text-right">{prescription.shipping_address || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detail Dokter */}
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
                                    <span className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">{prescription.nama_dokter || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Catatan Pasien */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#006a3f]">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-['Poppins',sans-serif] font-bold text-[16px] text-[#171d19]">Catatan / Permintaan Khusus</h3>
                                    <p className="font-['Poppins',sans-serif] text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Dari Pasien</p>
                                </div>
                            </div>
                            
                            <div>
                                <p className="font-['Poppins',sans-serif] text-[14px] font-medium text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {prescription.catatan || '-'}
                                </p>
                            </div>
                        </div>

                        {/* Rejected Actions */}
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
            </main>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Konfirmasi Pembayaran"
                message="Anda akan memproses pembayaran untuk resep ini. Pastikan rincian harga dan data diri Anda sudah sesuai."
                confirmText="Ya, Lanjutkan"
                cancelText="Batal"
                type="warning"
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={executeProcess}
            />
        </div>
    );
}
