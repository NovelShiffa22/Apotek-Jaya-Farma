import { Link } from '@inertiajs/react';
import { Camera, FileText, CalendarCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '../../components/Header';

export default function UploadStep1() {
    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-4xl px-8 py-10">
                

                {/* Stepper */}
                <div className="mb-12 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#006a3f] text-white font-semibold">1</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#006a3f]">Petunjuk</span>
                        </div>
                        <div className="h-0.5 w-24 bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">2</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-gray-500">Upload</span>
                        </div>
                        <div className="h-0.5 w-24 bg-gray-200"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">3</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-gray-500">Konfirmasi</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#171d19]">
                        Step 1 of 3: Petunjuk
                    </h1>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm flex gap-12">
                    {/* Illustration Side */}
                    <div className="flex-1 rounded-2xl bg-[#8cb7a4] p-8 flex items-center justify-center relative overflow-hidden">
                        <div className="relative z-10 w-48 h-64 bg-white rounded-xl shadow-lg border-2 border-gray-800 p-4 flex items-center justify-center">
                             <div className="absolute top-8 left-6 right-6 space-y-2 opacity-20">
                                 <div className="h-2 w-full bg-gray-800 rounded"></div>
                                 <div className="h-2 w-3/4 bg-gray-800 rounded"></div>
                                 <div className="h-2 w-5/6 bg-gray-800 rounded"></div>
                             </div>
                             <div className="absolute top-4 left-4 text-gray-800 font-serif font-bold text-xl">Rx</div>
                             <div className="absolute bg-white border-2 border-gray-800 rounded-2xl w-32 h-48 right-[-20px] bottom-[-20px] shadow-xl flex items-center justify-center">
                                 <Camera size={32} className="text-[#006a3f]" />
                             </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1">
                        <h2 className="font-['Poppins',sans-serif] text-2xl font-bold text-[#171d19] mb-4">
                            Tips Foto Resep
                        </h2>
                        <p className="font-['Poppins',sans-serif] text-[14px] text-gray-600 mb-8 leading-relaxed">
                            Pastikan resep Anda memenuhi kriteria berikut agar pesanan dapat diproses dengan cepat oleh apoteker kami.
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#006a3f]">
                                    <Camera size={16} />
                                </div>
                                <div>
                                    <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">1. Foto Jelas & Terang</h3>
                                    <p className="font-['Poppins',sans-serif] text-[13px] text-gray-600 mt-1">
                                        Pastikan foto tidak buram dan pencahayaan cukup terang agar tulisan terbaca.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#006a3f]">
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">2. Nama & Dosis Terlihat</h3>
                                    <p className="font-['Poppins',sans-serif] text-[13px] text-gray-600 mt-1">
                                        Seluruh bagian resep termasuk nama pasien, nama obat, dan dosis harus terlihat utuh.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#006a3f]">
                                    <CalendarCheck size={16} />
                                </div>
                                <div>
                                    <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">3. Resep Masih Berlaku</h3>
                                    <p className="font-['Poppins',sans-serif] text-[13px] text-gray-600 mt-1">
                                        Pastikan tanggal resep masih dalam masa berlaku dan belum kedaluwarsa.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex justify-end">
                            <Link 
                                href={route('prescriptions.upload.step2')}
                                className="flex items-center gap-2 rounded-full bg-[#006a3f] px-8 py-3.5 font-['Poppins',sans-serif] text-[15px] font-bold text-white transition-all hover:bg-[#005632] hover:shadow-lg"
                            >
                                Lanjutkan <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
