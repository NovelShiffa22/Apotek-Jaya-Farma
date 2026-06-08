import { Link, router, usePage } from '@inertiajs/react';
import { FileText, Plus, Search, Eye, Filter } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import Header from '../../components/Header';

export default function PrescriptionIndex({ prescriptions, filters }: { prescriptions: any, filters: any }) {
    const { flash } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const hasPrescriptions = prescriptions.data.length > 0 || searchQuery !== '';

    const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(route('prescriptions.index'), { search: searchQuery }, { preserveState: true });
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', bg: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
            case 'disetujui':
                return { label: 'Disetujui', bg: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
            case 'ditolak':
                return { label: 'Ditolak', bg: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
            default:
                return { label: status, bg: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-6xl px-8 py-10">
                {flash?.success && (
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-emerald-50 px-6 py-4 border border-emerald-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                <FileText size={16} />
                            </div>
                            <p className="font-['Poppins',sans-serif] text-[14px] font-medium text-emerald-800">
                                {flash.success}
                            </p>
                        </div>
                    </div>
                )}
                
                {!hasPrescriptions ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-20 shadow-sm border border-gray-100">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#006a3f]/10">
                            <FileText size={40} className="text-[#006a3f]" />
                        </div>
                        <h2 className="mb-3 font-['Poppins',sans-serif] text-2xl font-semibold text-[#171d19]">
                            Unggah Resep
                        </h2>
                        <p className="mb-8 max-w-md text-center font-['Poppins',sans-serif] text-[14px] text-[#6e7a70] leading-relaxed">
                            Unggah resep Anda dan biarkan apoteker profesional kami menangani sisanya. Verifikasi cepat dan pengiriman langsung ke alamat Anda.
                        </p>
                        <Link
                            href={route('prescriptions.upload.step1')}
                            className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-6 py-3 font-['Poppins',sans-serif] text-[14px] font-medium text-white transition-all hover:bg-[#005632] hover:shadow-lg"
                        >
                            <Plus size={18} />
                            Unggah Resep Pertama
                        </Link>
                    </div>
                ) : (
                    // Filled State
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-['Poppins',sans-serif] text-2xl font-semibold text-[#171d19]">
                                Riwayat Resep
                            </h2>
                            <Link
                                href={route('prescriptions.upload.step1')}
                                className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-5 py-2.5 font-['Poppins',sans-serif] text-[14px] font-medium text-white transition-all hover:bg-[#005632] hover:shadow-lg"
                            >
                                <Plus size={18} />
                                Unggah Resep
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    placeholder="Search by Pharmacy or Prescription ID..." 
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10"
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-[#f9fafb]">
                                    <tr>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">ID Resep</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Berkas Resep</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {prescriptions.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-['Poppins',sans-serif] text-[14px]">
                                                Data tidak ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        prescriptions.data.map((prescription: any, idx: number) => {
                                            const statusInfo = getStatusStyle(prescription.status_validasi);
                                            return (
                                            <tr key={idx} className="transition-colors hover:bg-gray-50">
                                                <td className="px-6 py-5 font-['Poppins',sans-serif] text-[14px] text-gray-700">
                                                    {formatDate(prescription.created_at)}
                                                </td>
                                                <td className="px-6 py-5 font-['Poppins',sans-serif] text-[14px] font-semibold text-[#006a3f]">
                                                    {prescription.kode_resep}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                                            <FileText size={18} className="text-gray-500" />
                                                        </div>
                                                        <span className="font-['Poppins',sans-serif] text-[14px] text-gray-700">
                                                            {prescription.file_foto?.split('/').pop() || 'resep_obat.png'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-['Poppins',sans-serif] text-[12px] font-medium ${statusInfo.bg}`}>
                                                        <div className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <Link 
                                                        href={route('prescriptions.detail', { id: prescription.id })}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 font-['Poppins',sans-serif] text-[13px] font-semibold text-[#006a3f] transition-colors hover:bg-emerald-100"
                                                    >
                                                        Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        )})
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Links */}
                        {prescriptions.last_page > 1 && (
                            <div className="flex items-center justify-end gap-2 mt-6">
                                {prescriptions.links.map((link: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                                            link.active 
                                                ? 'bg-[#006a3f] text-white border-[#006a3f]' 
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
