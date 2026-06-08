import { Link } from '@inertiajs/react';
import { FileText, Plus, Search, Eye, Filter } from 'lucide-react';
import { useState } from 'react';
import Header from '../../components/Header';

const INITIAL_PRESCRIPTIONS = [
    {
        id: '#RX-882910',
        date: 'Oct 24, 2024',
        fileName: 'resep_obat.png',
        status: 'Pending',
    },
    {
        id: '#RX-883910',
        date: 'Oct 24, 2024',
        fileName: 'resep_obat.png',
        status: 'Disetujui',
    },
    {
        id: '#RX-884910',
        date: 'Oct 24, 2024',
        fileName: 'resep_obat.png',
        status: 'Ditolak',
    },
];

export default function PrescriptionIndex() {
    const [prescriptions, setPrescriptions] = useState(() => {
        const saved = localStorage.getItem('mock_prescriptions');
        if (saved) return JSON.parse(saved);
        localStorage.setItem('mock_prescriptions', JSON.stringify(INITIAL_PRESCRIPTIONS));
        return INITIAL_PRESCRIPTIONS;
    });

    const hasPrescriptions = prescriptions.length > 0;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-100 text-amber-700';
            case 'Disetujui':
                return 'bg-emerald-100 text-emerald-700';
            case 'Ditolak':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-6xl px-8 py-10">
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
                                    placeholder="Search by Pharmacy or Prescription ID..." 
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10"
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-[#f9fafb]">
                                    <tr>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Prescription ID</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Tinjau Resep Obat</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-['Poppins',sans-serif] text-[12px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {prescriptions.map((prescription: any, idx: number) => (
                                        <tr key={idx} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-5 font-['Poppins',sans-serif] text-[14px] text-gray-700">
                                                {prescription.date}
                                            </td>
                                            <td className="px-6 py-5 font-['Poppins',sans-serif] text-[14px] font-semibold text-[#006a3f]">
                                                {prescription.id}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                                                        <FileText size={18} className="text-gray-500" />
                                                    </div>
                                                    <span className="font-['Poppins',sans-serif] text-[14px] text-gray-700">{prescription.fileName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-['Poppins',sans-serif] text-[12px] font-medium ${getStatusStyle(prescription.status)}`}>
                                                    <div className={`h-1.5 w-1.5 rounded-full ${prescription.status === 'Pending' ? 'bg-amber-500' : prescription.status === 'Disetujui' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                    {prescription.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <Link 
                                                    href={route('prescriptions.detail', { id: prescription.id.replace('#', '') })}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 font-['Poppins',sans-serif] text-[13px] font-semibold text-[#006a3f] transition-colors hover:bg-emerald-100"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Mock */}
                        <div className="flex items-center justify-end gap-2 mt-6">
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                                &lt;
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006a3f] text-white">
                                1
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                                2
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                                3
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
