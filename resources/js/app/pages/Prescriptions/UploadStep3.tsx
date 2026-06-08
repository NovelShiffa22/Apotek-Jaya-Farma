import { Link, router } from '@inertiajs/react';
import { CheckCircle2, Circle, Clock, History } from 'lucide-react';
import { useEffect } from 'react';
import Header from '../../components/Header';

export default function UploadStep3() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (id) {
            // Simulate waiting 3 seconds for verification
            const timer = setTimeout(() => {
                // Update status in localStorage to "Disetujui"
                const existing = JSON.parse(localStorage.getItem('mock_prescriptions') || '[]');
                const updated = existing.map((p: any) => 
                    p.id === `#${id}` ? { ...p, status: 'Disetujui' } : p
                );
                localStorage.setItem('mock_prescriptions', JSON.stringify(updated));

                // Redirect to detail
                router.visit(route('prescriptions.detail', { id }));
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);
    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-4xl px-8 py-10">
                
                {/* Stepper */}
                <div className="mb-12 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006a3f] text-white font-semibold">1</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#171d19]">Petunjuk</span>
                        </div>
                        <div className="h-0.5 w-24 bg-[#006a3f]"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006a3f] text-white font-semibold">2</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#171d19]">Upload</span>
                        </div>
                        <div className="h-0.5 w-24 bg-[#006a3f]"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006a3f] text-white font-semibold">3</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#006a3f]">Konfirmasi</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#171d19] mb-4">
                        Langkah 3: Resep Anda Sedang Diverifikasi
                    </h1>
                    <p className="mx-auto max-w-lg font-['Poppins',sans-serif] text-[15px] leading-relaxed text-gray-600">
                        Mohon tunggu sebentar, apoteker profesional kami sedang meninjau dokumen resep yang Anda unggah untuk memastikan keaslian dan keamanan.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <div className="rounded-2xl bg-[#f8fafd] p-10 shadow-sm border border-blue-50 mb-10">
                        <h3 className="mb-8 font-['Poppins',sans-serif] text-[11px] font-bold uppercase tracking-wider text-gray-800">
                            LANGKAH BERIKUTNYA:
                        </h3>

                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="flex gap-4 relative">
                                <div className="absolute left-3 top-8 bottom-[-32px] w-[2px] bg-gray-200 z-0"></div>
                                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center bg-[#f8fafd]">
                                    <CheckCircle2 size={24} className="text-[#006a3f] bg-white rounded-full" />
                                </div>
                                <div>
                                    <h4 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">1. Verifikasi Apoteker</h4>
                                    <p className="mt-1 font-['Poppins',sans-serif] text-[14px] text-gray-600">Apoteker kami memastikan keaslian resep dan ketersediaan stok obat.</p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex gap-4 relative">
                                <div className="absolute left-3 top-8 bottom-[-32px] w-[2px] bg-gray-200 z-0"></div>
                                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center bg-[#f8fafd]">
                                    <Circle size={20} className="text-gray-300 bg-white rounded-full" />
                                    <div className="absolute h-2 w-2 rounded-full bg-gray-300"></div>
                                </div>
                                <div>
                                    <h4 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">2. Penyiapan Pesanan</h4>
                                    <p className="mt-1 font-['Poppins',sans-serif] text-[14px] text-gray-600">Obat akan diracik dan dikemas dengan standar klinis yang ketat.</p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex gap-4 relative">
                                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center bg-[#f8fafd]">
                                    <Circle size={24} className="text-gray-300 bg-white rounded-full" />
                                </div>
                                <div>
                                    <h4 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">3. Notifikasi Pembayaran</h4>
                                    <p className="mt-1 font-['Poppins',sans-serif] text-[14px] text-gray-600">Anda akan menerima invoice dan link pembayaran melalui aplikasi/WhatsApp.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <Link 
                            href={route('prescriptions.index')}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#006a3f] py-4 font-['Poppins',sans-serif] text-[15px] font-bold text-white transition-all hover:bg-[#005632] shadow-lg"
                        >
                            Lihat Riwayat Pesanan <History size={18} />
                        </Link>
                        
                        <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2">
                            <Clock size={16} className="text-gray-500" />
                            <span className="font-['Poppins',sans-serif] text-[13px] text-gray-600">Estimasi waktu tunggu: 5-10 menit</span>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
