import { Link } from '@inertiajs/react';
import { ArrowLeft, Printer, FileText, Search, ZoomIn, Calendar, Clock, X, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminPrescriptionDetail({ prescription }: { prescription: any }) {
    const [showImageModal, setShowImageModal] = useState(false);
    const handlePrint = () => window.print();

    if (!prescription) return null;

    const rawUrl = prescription.file_foto || '';
    const fileUrl = rawUrl.startsWith('http') ? rawUrl : (rawUrl.startsWith('/') ? rawUrl : (rawUrl.startsWith('storage/') ? `/${rawUrl}` : `/storage/${rawUrl}`));
    const isPdf = fileUrl.toLowerCase().includes('.pdf');

    const statusLabel = prescription.status_validasi === 'pending' ? 'Menunggu Verifikasi' : 
                        prescription.status_validasi === 'telah_dipesan' ? 'Telah dipesan' :
                        prescription.status_validasi?.toUpperCase();
    const statusStyle = prescription.status_validasi === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-300'
        : prescription.status_validasi === 'disetujui' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : prescription.status_validasi === 'telah_dipesan' ? 'bg-blue-50 text-blue-700 border-blue-200'
        : prescription.status_validasi === 'ditolak' ? 'bg-red-50 text-red-700 border-red-200'
        : 'bg-blue-50 text-blue-700 border-blue-200';

    const verifierName = prescription.verifier_name || prescription.validator?.name;
    const isPending = prescription.status_validasi === 'pending';

    const nonRacikItems = (prescription.items || []).filter((i: any) => !i.is_racikan);
    const racikItems = (prescription.items || []).filter((i: any) => i.is_racikan);

    const totalHarga = (prescription.items || []).reduce((sum: number, item: any) => {
        const qty = item.kuantitas_ambil || item.kuantitas_resep || item.quantity || 0;
        const price = item.harga_satuan || 0;
        return sum + (qty * price);
    }, 0);

    const dobCalc = () => {
        let dobString = prescription.tanggal_lahir_pasien || prescription.user?.dob;
        if (!dobString) return '-';
        const dob = new Date(dobString);
        const today = new Date();
        let years = today.getFullYear() - dob.getFullYear();
        let months = today.getMonth() - dob.getMonth();
        if (months < 0 || (months === 0 && today.getDate() < dob.getDate())) { years--; months += 12; }
        return `${dob.toLocaleDateString('id-ID')} (${years} Tahun ${months} Bulan)`;
    };

    const userAddress = () => {
        const addr = prescription.user?.addresses?.find((a: any) => a.is_default) || prescription.user?.addresses?.[0];
        return addr ? `${addr.alamat_lengkap}, ${addr.kota}, ${addr.provinsi} ${addr.kode_pos}` : (prescription.alamat || 'Tidak disebutkan');
    };

    return (
        <div className="h-screen overflow-y-auto bg-[#f8fafc] print:bg-white print:h-auto print:overflow-visible print:block print:min-h-0">
            {/* Header */}
            <div className="bg-white border-b border-[#E2E8F0] px-8 py-4 flex items-center justify-between sticky top-0 z-40 print:hidden">
                <div className="flex items-center gap-4">
                    <Link href="/admin?tab=prescriptions" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-['Poppins',sans-serif] text-[20px] font-bold text-[#171d19]">
                        Detail Resep: <span className="text-[#1e5b53]">{prescription.kode_resep || prescription.id}</span>
                    </h1>
                </div>
                <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e5b53] text-white font-['Inter',sans-serif] text-[14px] font-semibold transition-all hover:bg-[#005632] hover:shadow-lg print:hidden">
                    <Printer size={18} /> Cetak Dokumen
                </button>
            </div>

            {/* Print Header */}
            <div className="hidden print:block mb-8 text-center border-b-2 border-slate-800 pb-4 px-8 pt-6">
                <h1 className="font-['Poppins',sans-serif] text-[24px] font-bold text-slate-900">APOTEK JAYA FARMA</h1>
                <p className="font-['Inter',sans-serif] text-slate-600 text-[14px]">Dokumen Rekam Resep {prescription.kode_resep || prescription.id}</p>
            </div>

            <main className="mx-auto max-w-[1600px] px-6 md:px-8 py-6 md:py-8 print:px-4 print:py-0">
                <div className="grid grid-cols-12 gap-6">

                    {/* LEFT COLUMN (9/12) */}
                    <div className="col-span-12 lg:col-span-9 space-y-6 print:col-span-12">

                        {/* Rejected Alert */}
                        {prescription.status_validasi === 'ditolak' && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-3">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <h4 className="font-bold text-sm">Resep Ini Telah Ditolak</h4>
                                    <p className="font-medium text-xs mt-1">Alasan Penolakan: {prescription.rejection_reason || 'Tidak ada keterangan tambahan.'}</p>
                                </div>
                            </div>
                        )}

                        {/* Penanggung Jawab Verifikasi */}
                        <div className={`p-5 rounded-xl border shadow-sm flex items-center justify-between ${isPending ? 'bg-white border-slate-200' : 'bg-[#F4FDF8] border-[#0D6A36]/20'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${isPending ? 'bg-slate-100 text-slate-400' : 'bg-[#0D6A36]/10 text-[#0D6A36]'}`}>
                                    {isPending ? '?' : (verifierName || 'A').substring(0, 1).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-['Inter',sans-serif] text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Penanggung Jawab Verifikasi</p>
                                    <p className={`font-['Inter',sans-serif] text-[15px] font-bold ${isPending ? 'text-slate-400 italic' : 'text-[#0D6A36]'}`}>
                                        {isPending ? 'Belum Ditentukan' : (verifierName || '-')}
                                    </p>
                                    {!isPending && prescription.validated_at && (
                                        <p className="font-['Inter',sans-serif] text-[11px] text-slate-400 mt-0.5">
                                            Diverifikasi pada: {new Date(prescription.validated_at).toLocaleString('id-ID')}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="hidden sm:block text-right">
                                <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase border ${statusStyle}`}>
                                    Status: {statusLabel}
                                </span>
                            </div>
                        </div>

                        {/* Informasi Pemilik Resep (Pasien) */}
                        <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
                            <div className="bg-[#0D6A36] text-white px-6 py-3.5 font-bold text-sm">Informasi Pemilik Resep (Pasien)</div>
                            <div className="bg-white p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Nama Lengkap</p>
                                        <p className="font-bold text-slate-800 text-xs">{prescription.nama_pasien || prescription.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Tanggal Lahir & Umur</p>
                                        <p className="font-bold text-slate-800 text-xs">{dobCalc()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">No. Telp (WhatsApp)</p>
                                        <p className="font-bold text-slate-800 text-xs">{prescription.whatsapp || prescription.user?.phone || 'Tidak disebutkan'}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Metode Pengiriman</p>
                                        <p className="font-bold text-slate-800 text-xs">
                                        {prescription.shipping_method === 'kurir' || prescription.shipping_method === 'Kirim via Kurir' ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-200">
                                                    Kirim via Kurir
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-widest border border-amber-200">
                                                    Ambil di Apotek
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Alamat Lengkap</p>
                                        {prescription.shipping_method === 'ambil_sendiri' || prescription.shipping_method === 'Ambil di Apotek' ? (
                                            <p className="font-medium text-slate-400 text-xs italic">
                                                (Pasien akan mengambil pesanan di Apotek)
                                            </p>
                                        ) : (
                                            <p className="font-bold text-slate-800 text-xs leading-relaxed">{userAddress()}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">NIK KTP</p>
                                        <p className="font-bold text-slate-800 text-xs">{prescription.nik_ktp || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Jenis Kelamin</p>
                                        <p className="font-bold text-slate-800 text-xs">{prescription.jenis_kelamin || '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-semibold text-slate-400 italic">Email Akun Pengunggah: <span className="font-bold text-slate-600">{prescription.user?.email || 'Tidak ditemukan'}</span></span>
                                </div>
                            </div>
                        </div>

                        {/* Info Akses (Jika Pending) */}
                        {prescription.status_validasi === 'pending' && (
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 shadow-sm">
                                <div className="text-amber-500 mt-0.5">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-amber-800 text-sm font-['Inter',sans-serif]">Akses Terbatas: Hanya Apoteker</h4>
                                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                                        Resep ini masih berstatus <span className="font-bold">Menunggu Verifikasi</span>. Kolom detail resep di bawah ini dikunci (read-only) pada dashboard Admin. Untuk melakukan pengisian data dokter dan obat medis, silakan akses melalui akun <strong>Apoteker</strong>.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Detail Dokter */}
                        {prescription.status_validasi !== 'ditolak' && (
                        <div className="rounded-xl shadow-sm border border-slate-200">
                            <div className="bg-[#0D6A36] text-white px-6 py-3.5 font-bold text-sm rounded-t-xl">Detail Dokter</div>
                            <div className="bg-white p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Nama Dokter</label>
                                        <input type="text" disabled value={prescription.doctor_name || ''} placeholder="-" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold bg-slate-50 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Poli</label>
                                        <input type="text" disabled value={prescription.doctor_poli || ''} placeholder="-" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold bg-slate-50 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Tanggal Resep</label>
                                        <input type="text" disabled value={prescription.tanggal_resep ? new Date(prescription.tanggal_resep).toLocaleDateString('id-ID') : '-'} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold bg-slate-50 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">SIP Dokter</label>
                                        <input type="text" disabled value={prescription.sip_dokter || ''} placeholder="-" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold bg-slate-50 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">PPK Asal</label>
                                        <input type="text" disabled value={prescription.doctor_ppk || ''} placeholder="-" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold bg-slate-50 cursor-not-allowed" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Alamat Praktek</label>
                                    <input type="text" disabled value={prescription.doctor_alamat || ''} placeholder="-" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold bg-slate-50 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Detail Resep */}
                        {prescription.status_validasi !== 'ditolak' && (
                        <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
                            <div className="bg-[#0D6A36] text-white px-6 py-3.5 font-bold text-sm">Detail Resep</div>
                            <div className="bg-white p-6 space-y-6">

                                {/* Non-Racik */}
                                <div>
                                    <h4 className="font-bold text-[#0D6A36] font-['Inter',sans-serif] text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg>
                                        <span>Obat Non-Racik</span>
                                    </h4>
                                    <div className="border border-slate-100 rounded-xl">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                                    <th className="p-3 w-64">NAMA OBAT</th>
                                                    <th className="p-3 text-center">SATUAN</th>
                                                    <th className="p-3 text-right">HARGA SATUAN</th>
                                                    <th className="p-3 text-center w-20">JML RESEP</th>
                                                    <th className="p-3 text-center w-20">JML AMBIL</th>
                                                    <th className="p-3 text-center w-24">SIGNA</th>
                                                    <th className="p-3 text-right">SUBTOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {nonRacikItems.map((item: any, idx: number) => (
                                                    <tr key={idx}>
                                                        <td className="p-3"><span className="font-bold text-slate-800">{item.product_name || item.product?.nama_obat || '-'}</span></td>
                                                        <td className="p-3 text-center text-slate-500 font-semibold">{item.satuan || '-'}</td>
                                                        <td className="p-3 text-right text-slate-500 font-semibold">Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}</td>
                                                        <td className="p-3 text-center font-bold">{item.kuantitas_resep || 0}</td>
                                                        <td className="p-3 text-center font-bold text-[#0D6A36]">{item.kuantitas_ambil || 0}</td>
                                                        <td className="p-3 text-center font-bold">{item.signa || '-'}</td>
                                                        <td className="p-3 text-right font-bold text-slate-800">Rp {((item.kuantitas_ambil || 0) * (item.harga_satuan || 0)).toLocaleString('id-ID')}</td>
                                                    </tr>
                                                ))}
                                                {nonRacikItems.length === 0 && (
                                                    <tr><td colSpan={7} className="p-4 text-center text-slate-400 font-medium italic">Belum ada obat non-racik.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Racik */}
                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="font-bold text-[#0D6A36] font-['Inter',sans-serif] text-xs uppercase tracking-wider flex items-center gap-1.5 mb-4">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        <span>Obat Racik</span>
                                    </h4>
                                    {racikItems.map((item: any, idx: number) => (
                                        <div key={idx} className="border border-slate-200 border-dashed rounded-xl p-5 mb-4 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                                <div className="sm:col-span-4">
                                                    <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Nama Racikan</label>
                                                    <div className="font-bold text-slate-800 text-xs mt-2">{item.product_name || item.product?.nama_obat || '-'}</div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5 text-center">Jml Diresepkan</label>
                                                    <div className="font-bold text-slate-700 text-center text-xs mt-2">{item.kuantitas_resep || 0}</div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5 text-center">Jml Diambil</label>
                                                    <div className="font-bold text-[#0D6A36] text-center text-xs mt-2">{item.kuantitas_ambil || 0}</div>
                                                </div>
                                                <div className="sm:col-span-2 text-center">
                                                    <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Signa & Satuan</label>
                                                    <div className="font-bold text-slate-700 text-center text-xs mt-2">{item.signa || '-'} {item.satuan || ''}</div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-2 mt-4 border-t border-slate-100">
                                                <div className="text-xs text-slate-500 italic">*Harga dan komponen racikan dapat disesuaikan pada sistem kasir.</div>
                                                <div className="flex items-center gap-4 text-xs">
                                                    <span className="font-bold text-slate-700">Harga Satuan: Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}</span>
                                                    <span className="font-bold text-[#0D6A36] text-sm">Subtotal: Rp {((item.kuantitas_ambil || 0) * (item.harga_satuan || 0)).toLocaleString('id-ID')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {racikItems.length === 0 && (
                                        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                            <p className="text-slate-400 font-medium italic text-sm">Belum ada obat racikan.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        )}

                        {/* Catatan Farmasi */}
                        {prescription.status_validasi !== 'ditolak' && (
                        <div>
                            <p className="font-['Inter',sans-serif] font-bold text-[10px] text-slate-400 tracking-wider uppercase mb-2">CATATAN FARMASI</p>
                            <textarea rows={3} disabled value={prescription.catatan_apoteker || prescription.catatan || ''} placeholder="Tidak ada catatan farmasi." className="w-full p-4 bg-white border border-slate-200 rounded-xl font-['Inter',sans-serif] text-xs text-slate-800 leading-relaxed resize-none shadow-sm cursor-not-allowed bg-slate-50" />
                        </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN (3/12) */}
                    <div className="col-span-12 lg:col-span-3 space-y-6 print:hidden">

                        {/* Resep Document Card */}
                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                            <div className="bg-[#0D6A36] text-white px-4 py-2.5 font-bold text-xs flex justify-between items-center">
                                <span>Resep</span>
                                <Search size={14} className="cursor-pointer" onClick={() => setShowImageModal(true)} />
                            </div>
                            <div className="bg-white p-4">
                                {isPdf ? (
                                    <div className="relative group overflow-hidden rounded-lg aspect-[3/4] border border-slate-100 cursor-pointer flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 transition-all" onClick={() => window.open(fileUrl, '_blank')}>
                                        <FileText size={48} className="text-red-500" />
                                        <span className="font-bold mt-3 tracking-widest text-sm text-red-600">DOKUMEN PDF</span>
                                    </div>
                                ) : (
                                    <div className="relative group overflow-hidden rounded-lg aspect-[3/4] border border-slate-100 cursor-zoom-in" onClick={() => setShowImageModal(true)}>
                                        <img src={fileUrl} alt="Surat Resep Asli" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow"><ZoomIn size={18} className="text-[#0D6A36]" /></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Total Harga Summary Card */}
                        <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-[10px] text-slate-500 font-semibold">Subtotal Produk</p>
                                <p className="text-[11px] text-slate-700 font-bold">Rp {totalHarga.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                                <p className="text-[10px] text-slate-500 font-semibold">Biaya Pengiriman</p>
                                <p className="text-[11px] text-slate-700 font-bold">Rp {((prescription.shipping_method === 'kurir' || prescription.shipping_method === 'Kirim via Kurir' || prescription.shipping_method === 'kurir_toko') ? 12000 : 0).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">TOTAL PEMBAYARAN</p>
                                <div className="text-right">
                                    <p className="text-[9px] text-[#0D6A36] font-bold uppercase tracking-wider mb-0.5">IDR</p>
                                    <p className="text-xl font-bold text-[#0D6A36]">
                                        {(totalHarga + ((prescription.shipping_method === 'kurir' || prescription.shipping_method === 'Kirim via Kurir' || prescription.shipping_method === 'kurir_toko') ? 12000 : 0)).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Tracking Log (Only if Telah Dipesan or Disetujui with VT) */}
                        {(prescription.status_validasi === 'telah_dipesan' || prescription.status_validasi === 'disetujui') && prescription.virtual_transactions && prescription.virtual_transactions.length > 0 && (
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#1e5b53] mt-6">
                                <div className="mb-6">
                                    <h3 className="font-['Poppins',sans-serif] font-bold text-[18px] text-[#1e5b53] flex items-center gap-2 mb-2">
                                        <Clock size={22} />
                                        Log Status Pesanan
                                    </h3>
                                    <span className="inline-block bg-[#1e5b53] text-white text-[10px] font-bold px-2 py-1 rounded-md ml-8">
                                        {prescription.orders?.[0]?.kode_pesanan || `vt_${prescription.virtual_transactions[0].id}`}
                                    </span>
                                </div>
                                
                                {(() => {
                                    const vt = prescription.virtual_transactions[0];
                                    const vtStatus = vt.status || 'Pending';
                                    
                                    return (
                                        <>
                                            <div className="relative">
                                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                                
                                                {/* Menunggu Pembayaran */}
                                                <div className="relative flex items-start mb-6">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${
                                                        ['Pending', 'Belum Bayar'].includes(vtStatus) 
                                                        ? 'bg-amber-100 border-2 border-amber-500 text-amber-600' 
                                                        : 'bg-[#1e5b53] text-white'
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
                                                        : (['dikirim', 'Dikirim', 'selesai', 'Selesai'].includes(vtStatus) ? 'bg-[#1e5b53] text-white' : 'bg-gray-100 border-2 border-gray-200 text-gray-300')
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
                                                        : (['selesai', 'Selesai'].includes(vtStatus) ? 'bg-[#1e5b53] text-white' : 'bg-gray-100 border-2 border-gray-200 text-gray-300')
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

                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <Link 
                                                    href={`/admin/orders/${prescription.orders?.[0]?.id || 'vt_' + vt.id}`}
                                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-['Inter',sans-serif] text-[13px] font-bold text-white bg-[#0D6A36] hover:bg-[#0a522a] transition-all"
                                                >
                                                    Lihat Detail Pesanan
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}

                        {/* Cetak Button (replaces Buat Resep/Tolak) */}
                        <div className="space-y-3 pt-2">
                            <Link href="/admin?tab=prescriptions" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 text-slate-600 font-['Inter',sans-serif] text-sm font-bold hover:bg-slate-50 transition-all print:hidden">
                                <ArrowLeft size={16} /> Kembali ke Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Modal */}
            {showImageModal && !isPdf && (
                <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-8 print:hidden" onClick={() => setShowImageModal(false)}>
                    <button className="absolute top-6 right-6 text-white hover:text-red-400 transition-colors" onClick={() => setShowImageModal(false)}><X size={32} /></button>
                    <img src={fileUrl} alt="Resep Full" className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl" />
                </div>
            )}
        </div>
    );
}
