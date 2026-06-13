import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FilePlus, MapPin, X, Image as ImageIcon, ArrowLeft, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '../../components/Header';
import { regions } from '../../data/regions';

export default function UploadStep2({ defaultAddress, addresses = [] }: any) {
    const { auth } = usePage().props as any;
    const [dragActive, setDragActive] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm<{ 
        prescription_file: File | null;
        nama_pasien: string;
        nama_dokter: string;
        whatsapp: string;
        catatan: string;
        is_legal_agreed: boolean;
    }>({
        prescription_file: null,
        nama_pasien: '',
        nama_dokter: '',
        whatsapp: '',
        catatan: '',
        is_legal_agreed: false,
    });

    // Address Modal States
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

    // New Address Form State
    const [newLabel, setNewLabel] = useState('');
    const [newAlamatLengkap, setNewAlamatLengkap] = useState('');
    const [newKota, setNewKota] = useState('');
    const [newProvinsi, setNewProvinsi] = useState('');
    const [newKodePos, setNewKodePos] = useState('');
    const [newIsDefault, setNewIsDefault] = useState(false);
    const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
    const [addressFormErrors, setAddressFormErrors] = useState<any>({});

    const availableCities = useMemo(() => {
        if (!newProvinsi) return [];
        return regions.find(r => r.name.toLowerCase() === newProvinsi.toLowerCase())?.cities || [];
    }, [newProvinsi]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setNewProvinsi(value);
        setNewKota('');
    };

    // Initialize selectedAddress
    useEffect(() => {
        if (defaultAddress) {
            setSelectedAddress(defaultAddress);
        }
    }, [defaultAddress]);

    // Handle select address
    const handleSelectAddress = (addr: any) => {
        setSelectedAddress(addr);
        setIsAddressModalOpen(false);
    };

    // Submit new address
    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingAddress(true);
        setAddressFormErrors({});

        router.post('/profile/address', {
            label: newLabel,
            alamat_lengkap: newAlamatLengkap,
            kota: newKota,
            provinsi: newProvinsi,
            kode_pos: newKodePos,
            is_default: newIsDefault
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSubmittingAddress(false);
                setIsAddingNewAddress(false);
                setNewLabel('');
                setNewAlamatLengkap('');
                setNewKota('');
                setNewProvinsi('');
                setNewKodePos('');
                setNewIsDefault(false);
            },
            onError: (errs) => {
                setIsSubmittingAddress(false);
                setAddressFormErrors(errs);
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('prescription_file', file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKirim = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('prescriptions.store'), { 
            forceFormData: true,
            onSuccess: (page) => console.log('Sukses:', page),
            onError: (errors) => console.log('Error Validasi Frontend:', errors),
            onFinish: () => console.log('Selesai memproses request')
        });
    };

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-5xl px-8 py-10">
                
                {/* Back Button */}
                <div className="mb-6">
                    <Link 
                        href={route('prescriptions.upload.step1')}
                        className="inline-flex items-center gap-2 font-['Poppins',sans-serif] text-[14px] font-medium text-gray-500 transition-colors hover:text-[#006a3f]"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </Link>
                </div>

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

                <form onSubmit={handleKirim} method="POST" encType="multipart/form-data" className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* Left Column - Upload Box */}
                    <div className="w-full lg:w-2/3 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <h2 className="mb-2 font-['Poppins',sans-serif] text-xl font-bold text-[#171d19]">
                            Foto Resep Dokter
                        </h2>
                        <p className="mb-6 font-['Poppins',sans-serif] text-[13px] text-gray-600">
                            Pastikan seluruh bagian resep terlihat jelas, terbaca, dan tidak terpotong.
                        </p>

                        <div 
                            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed min-h-[240px] p-8 overflow-hidden transition-colors ${dragActive ? 'border-[#006a3f] bg-emerald-50' : 'border-gray-200 bg-gray-50/50'}`}
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setDragActive(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    const file = e.dataTransfer.files[0];
                                    setData('prescription_file', file);
                                    const reader = new FileReader();
                                    reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }}
                        >
                            {selectedImage ? (
                                <div className="relative flex w-full justify-center">
                                    <div className="relative">
                                        <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-lg max-h-[220px]" />
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setSelectedImage(null); setData('prescription_file', null); }}
                                            className="absolute -top-3 -right-3 z-10 bg-red-50 text-red-600 p-1.5 rounded-full shadow-md border-2 border-white hover:bg-red-100 hover:text-red-700 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <input 
                                        type="file" 
                                        name="prescription_file"
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
                                    {errors.prescription_file && (
                                        <p className="mt-2 font-['Poppins',sans-serif] text-[13px] font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                                            {errors.prescription_file}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Additional Information Form */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h3 className="mb-4 font-['Poppins',sans-serif] text-lg font-bold text-[#171d19]">
                                Informasi Tambahan
                            </h3>
                            <div className="flex flex-col gap-4 mb-4">
                                <div>
                                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Nama Pasien</label>
                                    <input 
                                        type="text" 
                                        value={data.nama_pasien}
                                        onChange={(e) => setData('nama_pasien', e.target.value)}
                                        placeholder="Masukkan nama pasien yang tertera di resep" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                    />
                                    {errors.nama_pasien && <p className="mt-1 text-xs text-red-500 font-medium">{errors.nama_pasien}</p>}
                                </div>
                                <div>
                                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Nama Dokter</label>
                                    <input 
                                        type="text" 
                                        value={data.nama_dokter}
                                        onChange={(e) => setData('nama_dokter', e.target.value)}
                                        placeholder="Contoh: dr. Ahmad Subarjo, Sp.A" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                    />
                                    {errors.nama_dokter && <p className="mt-1 text-xs text-red-500 font-medium">{errors.nama_dokter}</p>}
                                </div>
                                <div>
                                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Nomor WhatsApp Aktif</label>
                                    <input 
                                        type="text" 
                                        value={data.whatsapp}
                                        onChange={(e) => setData('whatsapp', e.target.value)}
                                        placeholder="Contoh: 08123456789" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                    />
                                    {errors.whatsapp && <p className="mt-1 text-xs text-red-500 font-medium">{errors.whatsapp}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Catatan / Permintaan Khusus (Opsional)</label>
                                <textarea 
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Contoh: Minta obat generik / Obat diganti sirup" 
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                />
                                {errors.catatan && <p className="mt-1 text-xs text-red-500 font-medium">{errors.catatan}</p>}
                            </div>

                            <div className="mt-6 flex items-start gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                <div className="flex items-center h-5 mt-0.5">
                                    <input
                                        id="is_legal_agreed"
                                        type="checkbox"
                                        required
                                        checked={data.is_legal_agreed}
                                        onChange={(e) => setData('is_legal_agreed', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f] transition-colors cursor-pointer"
                                    />
                                </div>
                                <label htmlFor="is_legal_agreed" className="font-['Inter',sans-serif] text-[13px] text-[#171d19] leading-relaxed cursor-pointer select-none">
                                    Saya menyatakan bahwa dokumen resep yang diunggah adalah asli, sah dari dokter, dan belum pernah ditebus sebelumnya.
                                </label>
                            </div>
                            {errors.is_legal_agreed && <p className="mt-2 text-xs text-red-500 font-medium">{errors.is_legal_agreed}</p>}
                        </div>
                    </div>

                    {/* Right Column - Address & Detail */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        
                        {/* Address Card */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-['Poppins',sans-serif] text-[16px] font-bold text-[#171d19]">
                                    Alamat Pengiriman
                                </h3>
                                <button 
                                    type="button"
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="font-['Poppins',sans-serif] text-[13px] font-semibold text-[#006a3f] hover:underline focus:outline-none"
                                >
                                    Ubah
                                </button>
                            </div>

                            <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50/30 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-[#006a3f]" />
                                    <span className="font-['Poppins',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#006a3f]">
                                        {selectedAddress ? selectedAddress.label : 'Info'}
                                    </span>
                                </div>
                                {selectedAddress ? (
                                    <>
                                        <p className="mb-3 font-['Poppins',sans-serif] text-[13px] leading-relaxed text-gray-600 text-left">
                                            {selectedAddress.alamat_lengkap}, {selectedAddress.kota}, {selectedAddress.provinsi} {selectedAddress.kode_pos}
                                        </p>
                                    </>
                                ) : (
                                    <p className="font-['Poppins',sans-serif] text-[13px] text-gray-600 text-left">
                                        Belum ada alamat pengiriman. Silakan tambahkan alamat.
                                    </p>
                                )}
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
                                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl flex items-start gap-2.5 mb-6 text-left">
                                    <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="leading-relaxed">⚠️ Jam Operasional Verifikasi Resep: 08.00-18.00 WIB. Di luar jam tersebut, resep akan diperiksa esok hari.</p>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={
                                        processing || 
                                        !data.prescription_file || 
                                        !data.nama_pasien || 
                                        !data.nama_dokter || 
                                        !data.whatsapp || 
                                        !data.is_legal_agreed
                                    }
                                    className="block w-full rounded-xl bg-[#006a3f] py-3.5 text-center font-['Poppins',sans-serif] text-[14px] font-bold text-white transition-all hover:bg-[#005632] hover:shadow-lg disabled:!bg-gray-300 disabled:!text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                >
                                    {processing ? 'Memproses...' : 'Kirim Resep'}
                                </button>
                            </div>
                        </div>

                    </div>
                </form>

            </main>

            {/* Pop-up Modal Pilih Alamat */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    {/* Backdrop click to close */}
                    <div 
                        onClick={() => {
                            setIsAddressModalOpen(false);
                            setIsAddingNewAddress(false);
                            setAddressFormErrors({});
                        }}
                        className="fixed inset-0 cursor-default"
                    />

                    {/* Modal Container */}
                    <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100 flex flex-col max-h-[85vh] z-10 font-['Poppins',sans-serif]">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                            <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#171d19]">
                                {isAddingNewAddress ? 'Tambah Alamat Baru' : 'Pilih Alamat Pengiriman'}
                            </h3>
                            <button 
                                onClick={() => {
                                    setIsAddressModalOpen(false);
                                    setIsAddingNewAddress(false);
                                    setAddressFormErrors({});
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                                <X size={22} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Content (Scrollable) */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                            
                            {!isAddingNewAddress ? (
                                <>
                                    {/* Address List */}
                                    <div className="space-y-4">
                                        {addresses.length > 0 ? (
                                            addresses.map((addr: any) => {
                                                const isSelected = selectedAddress?.id === addr.id;

                                                return (
                                                    <div 
                                                        key={addr.id} 
                                                        onClick={() => handleSelectAddress(addr)}
                                                        className={`p-5 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-4 ${
                                                            isSelected 
                                                                ? 'border-[#006a3f] bg-[#006a3f]/[0.02] shadow-sm' 
                                                                : 'border-gray-200 hover:border-[#006a3f]/50 hover:bg-gray-50/30'
                                                        }`}
                                                    >
                                                        <div className="space-y-2 text-left flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-gray-900 text-[14.5px] font-['Inter',sans-serif]">{addr.label}</span>
                                                                {addr.is_default && (
                                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                                        Utama
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[13px] text-gray-600 leading-relaxed font-['Inter',sans-serif]">
                                                                {addr.alamat_lengkap}, {addr.kota}, {addr.provinsi} {addr.kode_pos}
                                                            </p>
                                                        </div>
                                                        
                                                        {isSelected && (
                                                            <div className="text-[#006a3f] shrink-0 pr-1">
                                                                <CheckCircle2 size={22} strokeWidth={2.5} />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-500 text-sm italic text-center py-4 font-['Inter',sans-serif]">Belum ada alamat tambahan.</p>
                                        )}
                                    </div>

                                    {/* Add New Address Trigger Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingNewAddress(true)}
                                        className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-[#006a3f] text-gray-500 hover:text-[#006a3f] rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all focus:outline-none"
                                    >
                                        <Plus size={18} />
                                        Tambah Alamat Baru
                                    </button>
                                </>
                            ) : (
                                /* New Address Form */
                                <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
                                    <div>
                                        <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Label Alamat (Misal: Rumah, Kantor)</label>
                                        <input 
                                            type="text" 
                                            value={newLabel}
                                            onChange={(e) => setNewLabel(e.target.value)}
                                            placeholder="Rumah / Kantor / Kos" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                            required
                                        />
                                        {addressFormErrors.label && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.label}</p>}
                                    </div>

                                    <div>
                                        <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Alamat Lengkap</label>
                                        <textarea 
                                            value={newAlamatLengkap}
                                            onChange={(e) => setNewAlamatLengkap(e.target.value)}
                                            placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" 
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                            required
                                        />
                                        {addressFormErrors.alamat_lengkap && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.alamat_lengkap}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Provinsi</label>
                                            <select 
                                                value={newProvinsi}
                                                onChange={handleProvinceChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                                required
                                            >
                                                <option value="">Pilih Provinsi</option>
                                                {regions.map(r => (
                                                    <option key={r.name} value={r.name}>{r.name}</option>
                                                ))}
                                            </select>
                                            {addressFormErrors.provinsi && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.provinsi}</p>}
                                        </div>

                                        <div>
                                            <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kota</label>
                                            <select 
                                                value={newKota}
                                                onChange={e => setNewKota(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                                required
                                                disabled={!newProvinsi}
                                            >
                                                <option value="">Pilih Kota/Kabupaten</option>
                                                {availableCities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            {addressFormErrors.kota && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.kota}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kode Pos</label>
                                        <input 
                                            type="text" 
                                            value={newKodePos}
                                            onChange={(e) => setNewKodePos(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                                            required
                                        />
                                        {addressFormErrors.kode_pos && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.kode_pos}</p>}
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <input 
                                            type="checkbox" 
                                            id="newIsDefaultUploadStep2"
                                            checked={newIsDefault}
                                            onChange={(e) => setNewIsDefault(e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f]"
                                        />
                                        <label htmlFor="newIsDefaultUploadStep2" className="font-['Inter',sans-serif] text-[14px] text-gray-700">Jadikan alamat utama</label>
                                    </div>

                                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingNewAddress(false);
                                                setAddressFormErrors({});
                                            }}
                                            className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium tracking-wide transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingAddress}
                                            className="px-8 py-3 bg-[#006a3f] hover:bg-[#005632] text-white rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium tracking-wide transition-colors disabled:opacity-50"
                                        >
                                            {isSubmittingAddress ? 'Menyimpan...' : 'Simpan Alamat'}
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
