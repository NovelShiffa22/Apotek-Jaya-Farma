import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FilePlus, MapPin, X, Image as ImageIcon, ArrowLeft, Plus, CheckCircle2, AlertCircle, Calendar, FileText } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import Header from '../../components/Header';
import ConfirmModal from '../../components/ConfirmModal';
import { regions } from '../../data/regions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { id } from 'date-fns/locale';
import InputMask from 'react-input-mask';

export default function UploadStep2({ defaultAddress, addresses = [] }: any) {
    const { auth, apotekInfo } = usePage().props as any;
    const jamOp = apotekInfo?.jam_operasional || '08.00 - 18.00 WIB';
    const [dragActive, setDragActive] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('upload_cancel_modal') === 'true';
        }
        return false;
    });
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('upload_cancel_modal', isCancelModalOpen ? 'true' : 'false');
        }
    }, [isCancelModalOpen]);

    useEffect(() => {
        if (window.location.hash !== '#form') {
            window.location.hash = 'form';
        }

        const handleHashChange = () => {
            if (window.location.hash !== '#form') {
                window.location.hash = 'form';
                setIsCancelModalOpen(true);
            }
        };

        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const { data, setData, post, processing, errors, transform, setError, clearErrors } = useForm<{ 
        prescription_file: File | null;
        nama_pasien: string;
        tanggal_lahir_pasien: string;
        whatsapp: string;
        catatan: string;
        shipping_address: string;
        shipping_method: string;
        is_legal_agreed: boolean;
    }>({
        prescription_file: null,
        nama_pasien: '',
        tanggal_lahir_pasien: '',
        whatsapp: '',
        catatan: '',
        shipping_address: '',
        shipping_method: 'ambil_sendiri',
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

    const isKotaBandung = (addr: any) => {
        if (!addr) return false;
        const kota = (addr.kota || '').toLowerCase().trim();
        const provinsi = (addr.provinsi || '').toLowerCase().trim();
        return (
            (provinsi === 'jawa barat' || provinsi === 'jawa-barat') &&
            (kota === 'bandung' || kota === 'kota bandung')
        );
    };

    const availableCities = useMemo(() => {
        if (!newProvinsi) return [];
        return regions.find(r => r.name.toLowerCase() === newProvinsi.toLowerCase())?.cities || [];
    }, [newProvinsi]);

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setNewProvinsi(value);
        setNewKota('');
    };

    // Auto-fill and lock region when adding a new address for prescription
    useEffect(() => {
        if (isAddingNewAddress) {
            setNewProvinsi('Jawa Barat');
            setNewKota('Kota Bandung');
        } else {
            setNewProvinsi('');
            setNewKota('');
        }
    }, [isAddingNewAddress]);

    // Initialize selectedAddress
    useEffect(() => {
        if (defaultAddress && isKotaBandung(defaultAddress)) {
            setSelectedAddress(defaultAddress);
        } else {
            const firstValid = addresses.find((addr: any) => isKotaBandung(addr));
            if (firstValid) {
                setSelectedAddress(firstValid);
            } else {
                setSelectedAddress(null);
            }
        }
    }, [defaultAddress, addresses]);

    const isKotaBandungValid = useMemo(() => {
        if (!selectedAddress) return false;
        const kotaLower = selectedAddress.kota.toLowerCase();
        return kotaLower.includes('bandung') && !kotaLower.includes('kabupaten') && !kotaLower.includes('kab.');
    }, [selectedAddress]);

    useEffect(() => {
        if (!isKotaBandungValid) {
            if (data.shipping_method === 'kurir') {
                setData('shipping_method', 'ambil_sendiri');
            }
        }
    }, [isKotaBandungValid, data.shipping_method]);

    // Handle select address
    const handleSelectAddress = (addr: any) => {
        setSelectedAddress(addr);
        setIsAddressModalOpen(false);
    };

    // Submit new address
    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validasi kode pos (harus 5 digit angka)
        if (!/^\d{5}$/.test(newKodePos)) {
            setAddressFormErrors({
                kode_pos: 'Kode pos harus terdiri dari 5 digit angka.'
            });
            return;
        }

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
            
            if (file.size > 5 * 1024 * 1024) {
                setFileSizeError("Ukuran file terlalu besar! Maksimal ukuran file resep adalah 5 MB.");
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }

            setFileSizeError(null);
            setData('prescription_file', file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Update data.shipping_address when selectedAddress changes
    useEffect(() => {
        if (selectedAddress) {
            setData('shipping_address', `${selectedAddress.alamat_lengkap}, ${selectedAddress.kota}, ${selectedAddress.provinsi} ${selectedAddress.kode_pos}`);
        } else {
            setData('shipping_address', '');
        }
    }, [selectedAddress]);

    const handleKirimClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^(08|628)[1-9][0-9]{7,10}$/.test(data.whatsapp)) {
            setError('whatsapp', 'Nomor tidak valid, masukkan angka (10-13 digit) diawali 08 atau 628');
            return;
        }
        setIsSubmitModalOpen(true);
    };

    const confirmSubmit = () => {
        post(route('prescriptions.store'), { 
            forceFormData: true,
            onSuccess: (page) => {
                setIsSubmitModalOpen(false);
                console.log('Sukses:', page);
            },
            onError: (errors) => {
                setIsSubmitModalOpen(false);
                console.log('Error Validasi Frontend:', errors);
            },
            onFinish: () => console.log('Selesai memproses request')
        });
    };

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-5xl px-8 py-10">
                

                {/* Stepper */}
                <div className="mb-12 flex items-center justify-center">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e5b53] text-white font-semibold">1</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#171d19]">Petunjuk</span>
                        </div>
                        <div className="h-0.5 w-24 bg-[#1e5b53]"></div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e5b53] text-white font-semibold">2</div>
                            <span className="font-['Poppins',sans-serif] text-[12px] font-bold text-[#1e5b53]">Upload</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#171d19]">
                        Langkah 2: Lengkapi Data Pasien & Resep
                    </h1>
                    <p className="mt-2 font-['Poppins',sans-serif] text-[14px] text-gray-600">
                        Lengkapi dokumen resep, data diri pasien, dan lokasi pengiriman Anda untuk proses skrining yang akurat.
                    </p>
                </div>

                <form onSubmit={handleKirimClick} method="POST" encType="multipart/form-data" className="flex flex-col lg:flex-row gap-6 w-full">
                    {/* Left Column - Upload Box */}
                    <div className="w-full lg:w-2/3 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                        <h2 className="mb-2 font-['Poppins',sans-serif] text-xl font-bold text-[#171d19]">
                            Foto Resep Dokter
                        </h2>
                        <p className="mb-6 font-['Poppins',sans-serif] text-[13px] text-gray-600">
                            Pastikan seluruh bagian resep terlihat jelas, terbaca, dan tidak terpotong.
                        </p>

                        <div 
                            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed min-h-[240px] p-8 overflow-hidden transition-colors ${dragActive ? 'border-[#1e5b53] bg-emerald-50' : 'border-gray-200 bg-gray-50/50'}`}
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
                                        {data.prescription_file?.type === 'application/pdf' ? (
                                            <div className="w-full min-w-[180px] max-w-[220px] aspect-[3/4] bg-red-50 border-2 border-red-200 rounded-xl flex flex-col items-center justify-center p-6 text-red-500">
                                                <FileText size={48} className="mb-3" />
                                                <p className="font-['Inter',sans-serif] text-sm font-bold text-center break-words w-full truncate px-2">{data.prescription_file.name}</p>
                                                <span className="text-xs mt-2 bg-red-100 px-3 py-1 rounded-full text-red-600 font-bold tracking-wider">PDF DOCUMENT</span>
                                            </div>
                                        ) : (
                                            <img src={selectedImage} alt="Preview" className="w-full h-full object-contain rounded-lg max-h-[220px]" />
                                        )}
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.preventDefault(); setSelectedImage(null); setData('prescription_file', null); setFileSizeError(null); }}
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
                                        <FilePlus size={32} className="text-[#1e5b53]" />
                                    </div>
                                    <h3 className="mb-2 font-['Poppins',sans-serif] text-lg font-bold text-[#171d19]">
                                        Unggah Resep
                                    </h3>
                                    <p className="mb-6 max-w-xs text-center font-['Poppins',sans-serif] text-[13px] text-gray-500 leading-relaxed">
                                        Unggah resep Anda dan biarkan apoteker profesional kami menangani sisanya. Verifikasi cepat dan pengiriman langsung ke alamat Anda.
                                    </p>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 rounded-lg bg-[#1e5b53] px-6 py-3 font-['Poppins',sans-serif] text-[14px] font-semibold text-white transition-all hover:bg-[#005632]"
                                    >
                                        <FilePlus size={18} />
                                        Pilih Gambar
                                    </button>
                                    <p className="mt-6 font-['Poppins',sans-serif] text-[12px] font-medium text-gray-400">
                                        Format: JPG, PNG, PDF (Maks. 5MB)
                                    </p>
                                    {fileSizeError && (
                                        <p className="mt-2 font-['Poppins',sans-serif] text-[13px] font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100 text-center">
                                            {fileSizeError}
                                        </p>
                                    )}
                                    {errors.prescription_file && !fileSizeError && (
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
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
                                    />
                                    {errors.nama_pasien && <p className="mt-1 text-xs text-red-500 font-medium">{errors.nama_pasien}</p>}
                                </div>
                                <div>
                                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Tanggal Lahir Pasien</label>
                                    <div className="relative w-full">
                                        <Calendar className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70] z-10 pointer-events-none" size={18} />
                                        <DatePicker
                                            selected={data.tanggal_lahir_pasien ? new Date(data.tanggal_lahir_pasien) : null}
                                            onChange={(date: Date | null) => {
                                                if (date) {
                                                    const yyyy = date.getFullYear();
                                                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                                                    const dd = String(date.getDate()).padStart(2, '0');
                                                    setData('tanggal_lahir_pasien', `${yyyy}-${mm}-${dd}`);
                                                } else {
                                                    setData('tanggal_lahir_pasien', '');
                                                }
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            locale={id}
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            isClearable
                                            placeholderText="dd/mm/yyyy"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                    {errors.tanggal_lahir_pasien && <p className="mt-1 text-xs text-red-500 font-medium">{errors.tanggal_lahir_pasien}</p>}
                                </div>
                                <div>
                                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Nomor WhatsApp Aktif</label>
                                    <input 
                                        type="text" 
                                        value={data.whatsapp}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setData('whatsapp', val);
                                            if (val && !/^(08|628)[1-9][0-9]{7,10}$/.test(val)) {
                                                setError('whatsapp', 'Nomor tidak valid, masukkan angka (10-13 digit) diawali 08 atau 628');
                                            } else {
                                                clearErrors('whatsapp');
                                            }
                                        }}
                                        placeholder="Contoh: 08123456789" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
                                    />
                                    {errors.whatsapp ? (
                                        <p className="mt-1 text-[11px] text-red-500 font-medium leading-snug">{errors.whatsapp}</p>
                                    ) : (
                                        <p className="mt-1 text-[11px] text-[#6e7a70] leading-snug">Masukkan nomor WhatsApp aktif diawali 08 atau 628</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Catatan / Permintaan Khusus (Opsional)</label>
                                <textarea 
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Contoh: Minta obat generik / Obat diganti sirup" 
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
                                />
                                {errors.catatan && <p className="mt-1 text-xs text-red-500 font-medium">{errors.catatan}</p>}
                            </div>

                            <div className="mt-6">
                                <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5">Metode Penyerahan Obat</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div 
                                        className={`border rounded-xl p-4 cursor-pointer transition-all ${data.shipping_method === 'ambil_sendiri' ? 'border-[#1e5b53] bg-emerald-50' : 'border-gray-200 hover:border-[#1e5b53]'}`}
                                        onClick={() => setData('shipping_method', 'ambil_sendiri')}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <input type="radio" checked={data.shipping_method === 'ambil_sendiri'} readOnly className="w-4 h-4 shrink-0 text-[#1e5b53] border-gray-300 focus:ring-[#1e5b53]" />
                                                <div>
                                                    <h4 className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">Ambil di Apotek</h4>
                                                    <p className="text-[12px] text-gray-500 font-['Inter',sans-serif] mt-0.5">Siap diambil setelah diverifikasi</p>
                                                </div>
                                            </div>
                                            <span className="font-['Inter',sans-serif] text-[13px] font-bold text-[#1e5b53] whitespace-nowrap shrink-0 ml-2">Rp 0</span>
                                        </div>
                                    </div>
                                    <div 
                                        className={`border rounded-xl p-4 transition-all ${(!isKotaBandungValid) ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : (data.shipping_method === 'kurir' ? 'border-[#1e5b53] bg-emerald-50 cursor-pointer' : 'border-gray-200 hover:border-[#1e5b53] cursor-pointer')}`}
                                        onClick={() => {
                                            if (isKotaBandungValid) {
                                                setData('shipping_method', 'kurir');
                                            }
                                        }}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <input type="radio" checked={data.shipping_method === 'kurir'} disabled={!isKotaBandungValid} readOnly className="w-4 h-4 shrink-0 text-[#1e5b53] border-gray-300 focus:ring-[#1e5b53] disabled:opacity-50" />
                                                <div>
                                                    <h4 className="font-['Poppins',sans-serif] text-[14px] font-bold text-[#171d19]">Kirim via Kurir (Kota Bandung)</h4>
                                                    <p className="text-[12px] text-gray-500 font-['Inter',sans-serif] mt-0.5">Pengantaran ke alamat</p>
                                                </div>
                                            </div>
                                            <span className="font-['Inter',sans-serif] text-[13px] font-bold text-[#1e5b53] whitespace-nowrap shrink-0 ml-2">Rp 12.000</span>
                                        </div>
                                    </div>
                                </div>
                                {(!isKotaBandungValid) && (
                                    <p className="mt-2 text-xs font-bold text-red-500">Alamat Anda di luar jangkauan kurir kami. Silakan pilih Ambil di Apotek.</p>
                                )}
                                <p className="mt-2 text-[11px] text-gray-400 font-['Inter',sans-serif] italic">*) Pengiriman via kurir hanya berlaku jika alamat utama Anda berada di wilayah Kota Bandung.</p>
                                {errors.shipping_method && <p className="mt-1 text-xs text-red-500 font-medium">{errors.shipping_method}</p>}
                            </div>

                            <div className="mt-6 flex items-start gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                <div className="flex items-center h-5 mt-0.5">
                                    <input
                                        id="is_legal_agreed"
                                        type="checkbox"
                                        required
                                        checked={data.is_legal_agreed}
                                        onChange={(e) => setData('is_legal_agreed', e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-[#1e5b53] focus:ring-[#1e5b53] transition-colors cursor-pointer"
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
                                    className="font-['Poppins',sans-serif] text-[13px] font-semibold text-[#1e5b53] hover:underline focus:outline-none"
                                >
                                    Ubah
                                </button>
                            </div>

                            <div className="rounded-xl border-2 border-emerald-100 bg-emerald-50/30 p-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-[#1e5b53]" />
                                    <span className="font-['Poppins',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#1e5b53]">
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
                            {errors.shipping_address && (
                                <p className="mt-2 font-['Poppins',sans-serif] text-[13px] font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                                    {errors.shipping_address}
                                </p>
                            )}
                        </div>

                        {/* Order Detail Card */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 font-['Poppins',sans-serif] text-[11px] font-bold uppercase tracking-wider text-[#1e5b53]">
                                Detail Pesanan
                            </h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-600">Metode Pengiriman</span>
                                    <span className="font-['Poppins',sans-serif] text-[13px] font-bold text-[#171d19]">{data.shipping_method === 'kurir' ? 'Kirim via Kurir (Kota Bandung)' : 'Ambil di Apotek'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-['Poppins',sans-serif] text-[13px] text-gray-600">Biaya Estimasi</span>
                                    <span className="font-['Poppins',sans-serif] text-[13px] font-bold text-[#171d19]">Dihitung otomatis</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl flex items-start gap-2.5 mb-6 text-left">
                                    <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="leading-relaxed">⚠️ Jam Operasional Verifikasi Resep: {jamOp}. Di luar jam tersebut, resep akan diperiksa esok hari.</p>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={
                                        processing || 
                                        !data.prescription_file || 
                                        !data.nama_pasien || 
                                        !data.tanggal_lahir_pasien || 
                                        !data.whatsapp || 
                                        !data.is_legal_agreed ||
                                        !selectedAddress ||
                                        !isKotaBandung(selectedAddress)
                                    }
                                    className="block w-full rounded-xl bg-[#1e5b53] py-3.5 text-center font-['Poppins',sans-serif] text-[14px] font-bold text-white transition-all hover:bg-[#005632] hover:shadow-lg disabled:!bg-gray-300 disabled:!text-gray-500 disabled:cursor-not-allowed disabled:hover:shadow-none"
                                >
                                    {processing ? 'Memproses...' : 'Kirim Resep'}
                                </button>
                                {errors.prescription_file && (
                                    <p className="mt-3 font-['Poppins',sans-serif] text-[13px] font-bold text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100 text-center">
                                        {errors.prescription_file}
                                    </p>
                                )}
                                {Object.keys(errors).length > 0 && !errors.prescription_file && (
                                    <div className="mt-4 font-['Poppins',sans-serif] text-[13px] font-bold text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
                                        <p className="mb-2 text-red-600">Terjadi kesalahan validasi:</p>
                                        <ul className="list-disc pl-5 text-left font-medium space-y-1">
                                            {Object.entries(errors).map(([field, msg]) => (
                                                <li key={field}>{msg}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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
                                                const isValid = isKotaBandung(addr);

                                                return (
                                                    <div 
                                                        key={addr.id} 
                                                        onClick={() => isValid && handleSelectAddress(addr)}
                                                        className={`p-5 rounded-xl border transition-all flex justify-between items-center gap-4 ${
                                                            !isValid
                                                                ? 'opacity-60 bg-gray-50 border-gray-200 cursor-not-allowed select-none'
                                                                : isSelected 
                                                                    ? 'border-[#1e5b53] bg-[#1e5b53]/[0.02] shadow-sm cursor-pointer' 
                                                                    : 'border-gray-200 hover:border-[#1e5b53]/50 hover:bg-gray-50/30'
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
                                                            <p className={`text-[13px] leading-relaxed font-['Inter',sans-serif] ${!isValid ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {addr.alamat_lengkap}, {addr.kota}, {addr.provinsi} {addr.kode_pos}
                                                            </p>
                                                            {!isValid && (
                                                                <p className="font-['Inter',sans-serif] text-[11px] font-medium text-red-500 mt-1 leading-normal">
                                                                    Alamat di luar jangkauan pengiriman resep obat keras (Khusus Kota Bandung).
                                                                </p>
                                                            )}
                                                        </div>
                                                        
                                                        {isSelected && isValid && (
                                                            <div className="text-[#1e5b53] shrink-0 pr-1">
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
                                        className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-[#1e5b53] text-gray-500 hover:text-[#1e5b53] rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all focus:outline-none"
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
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
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
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
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
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                                required
                                                disabled={true}
                                            >
                                                <option value="Jawa Barat">Jawa Barat</option>
                                            </select>
                                            {addressFormErrors.provinsi && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.provinsi}</p>}
                                        </div>

                                        <div>
                                            <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kota</label>
                                            <select 
                                                value={newKota}
                                                onChange={e => setNewKota(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                                required
                                                disabled={true}
                                            >
                                                <option value="Kota Bandung">Kota Bandung</option>
                                            </select>
                                            {addressFormErrors.kota && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.kota}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kode Pos</label>
                                        <input 
                                            type="text" 
                                            value={newKodePos}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 5) {
                                                    setNewKodePos(val);
                                                }
                                            }}
                                            maxLength={5}
                                            pattern="[0-9]{5}"
                                            placeholder="Masukkan 5 digit kode pos"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
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
                                            className="w-5 h-5 rounded border-gray-300 text-[#1e5b53] focus:ring-[#1e5b53]"
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
                                            className="px-8 py-3 bg-[#1e5b53] hover:bg-[#005632] text-white rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium tracking-wide transition-colors disabled:opacity-50"
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

            <ConfirmModal
                isOpen={isCancelModalOpen}
                title="Batalkan Proses?"
                message="Apakah Anda yakin ingin membatalkan unggah resep? Data yang sudah diisi akan hilang."
                confirmText="Ya, Batal"
                cancelText="Tutup"
                type="danger"
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={() => {
                    setIsCancelModalOpen(false);
                    sessionStorage.removeItem('upload_cancel_modal');
                    router.get('/cart');
                }}
            />

            {/* Submit Confirmation Modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 pb-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 border-4 border-emerald-100">
                                <AlertCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="font-['Poppins',sans-serif] text-xl font-bold text-gray-900 mb-2">Kirim Resep Dokter?</h3>
                            <p className="font-['Poppins',sans-serif] text-[14px] text-gray-500 leading-relaxed">
                                Pastikan foto resep terlihat jelas dan data pasien sudah sesuai. Apoteker kami akan segera memeriksa keaslian dokumen resep Anda.
                            </p>
                        </div>
                        <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setIsSubmitModalOpen(false)}
                                disabled={processing}
                                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-[14px] hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmSubmit}
                                disabled={processing}
                                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-[14px] hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </>
                                ) : (
                                    'Ya, Kirim Resep'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
