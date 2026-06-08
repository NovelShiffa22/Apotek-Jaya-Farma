import { Link, router } from '@inertiajs/react';
import { FilePlus, MapPin, X, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import Header from '../../components/Header';

export default function UploadStep2() {
    const [dragActive, setDragActive] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleKirim = () => {
        const newId = `#RX-${Math.floor(Math.random() * 900000) + 100000}`;
        const newPrescription = {
            id: newId,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            fileName: 'resep_baru_upload.png',
            status: 'Verifikasi'
        };

        const existing = JSON.parse(localStorage.getItem('mock_prescriptions') || '[]');
        localStorage.setItem('mock_prescriptions', JSON.stringify([newPrescription, ...existing]));

        router.visit(route('prescriptions.upload.step3', { id: newId.replace('#', '') }));
    };

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-5xl px-8 py-10">
                
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
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#006a3f]">Upload</span>
                        </div>
                        <div className="h-0.5 w-24 bg-[#006a3f]"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">3</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-gray-500">Konfirmasi</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#171d19]">
                        Langkah 2: Unggah & Alamat
                    </h1>
                    <p className="mt-2 font-['Poppins',sans-serif] text-[14px] text-gray-600">
                        Lengkapi dokumen resep dan tentukan lokasi pengiriman Anda.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - Upload Box */}
                    <div className="col-span-2 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <h2 className="mb-2 font-['Poppins',sans-serif] text-xl font-bold text-[#171d19]">
                            Foto Resep Dokter
                        </h2>
                        <p className="mb-6 font-['Poppins',sans-serif] text-[13px] text-gray-600">
                            Pastikan seluruh bagian resep terlihat jelas, terbaca, dan tidak terpotong.
                        </p>

                        <div 
                            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-16 transition-colors overflow-hidden ${dragActive ? 'border-[#006a3f] bg-emerald-50' : 'border-gray-200 bg-gray-50/50'}`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragActive(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
                                    reader.readAsDataURL(e.dataTransfer.files[0]);
                                }
                            }}
                        >
                            {selectedImage ? (
                                <div className="absolute inset-0 w-full h-full p-4">
                                    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            onClick={() => setSelectedImage(null)}
                                            className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        ref={fileInputRef} 
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                    />
                                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                                        <FilePlus size={32} className="text-[#006a3f]" />
                                    </div>
                                    <h3 className="mb-2 font-['Poppins',sans-serif] text-lg font-bold text-[#171d19]">
                                        Unggah Resep
                                    </h3>
                                    <p className="mb-6 max-w-xs text-center font-['Poppins',sans-serif] text-[13px] text-gray-500 leading-relaxed">
                                        Unggah resep Anda dan biarkan apoteker profesional kami menangani sisanya. Verifikasi cepat dan pengiriman langsung ke alamat Anda.
                                    </p>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 rounded-lg bg-[#006a3f] px-6 py-3 font-['Poppins',sans-serif] text-[14px] font-semibold text-white transition-all hover:bg-[#005632]"
                                    >
                                        <FilePlus size={18} />
                                        Pilih Gambar
                                    </button>
                                    <p className="mt-6 font-['Poppins',sans-serif] text-[12px] font-medium text-gray-400">
                                        Format: JPG, PNG, PDF (Maks. 5MB)
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Address & Detail */}
                    <div className="col-span-1 space-y-6">
                        
                        {/* Address Card */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-['Poppins',sans-serif] text-[16px] font-bold text-[#171d19]">
                                    Alamat Pengiriman
                                </h3>
                                <button className="font-['Poppins',sans-serif] text-[13px] font-semibold text-[#006a3f] hover:underline">
                                    Ubah
                                </button>
                            </div>

                            <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50/30 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-[#006a3f]" />
                                    <span className="font-['Poppins',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#006a3f]">Utama</span>
                                </div>
                                <p className="mb-1 font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">
                                    Rumah (Bapak Ahmad)
                                </p>
                                <p className="mb-3 font-['Poppins',sans-serif] text-[13px] leading-relaxed text-gray-600">
                                    Jl. Melati No. 45, Kompleks Griya Indah, Kel. Sukamaju, Kec. Serpong, Tangerang Selatan, Banten 15310
                                </p>
                                <p className="font-['Poppins',sans-serif] text-[12px] text-gray-400">
                                    0812-3456-7890
                                </p>
                            </div>
                        </div>

                        {/* Order Detail Card */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-['Poppins',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#006a3f]">
                                Detail Pesanan
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-600">Metode Pengiriman</span>
                                    <span className="font-['Poppins',sans-serif] text-[13px] font-bold text-[#171d19]">Reguler (1-2 Hari)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-600">Biaya Estimasi</span>
                                    <span className="font-['Poppins',sans-serif] text-[13px] font-bold text-[#171d19]">Dihitung otomatis</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button 
                                    onClick={handleKirim}
                                    className="block w-full rounded-xl bg-[#006a3f] py-3.5 text-center font-['Poppins',sans-serif] text-[14px] font-bold text-white transition-all hover:bg-[#005632] hover:shadow-lg"
                                >
                                    Kirim Resep
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}
