import { useForm } from '@inertiajs/react';
import {
    Calendar,
    DollarSign,
    FileText,
    RotateCcw,
    ShoppingBag,
    UploadCloud,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    nama_kategori: string;
}

interface Symptom {
    id: number;
    nama_gejala: string;
}

interface ProductFormData {
    nama_obat: string;
    category_id: string;
    deskripsi: string;
    jenis_obat: string;
    indikasi: string;
    aturan_pakai: string;
    efek_samping: string;
    harga: string;
    stok: string;
    stok_minimum: string;
    gambar: File | null;
    is_active: boolean;
    symptom_ids: number[];
}

interface CreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
    initialData?: any;
    categories?: Category[];
    symptoms?: Symptom[];
}

export default function CreateProduct({ isOpen, onClose, isEdit = false, initialData, categories = [], symptoms = [] }: CreateProductProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, errors, processing } = useForm<ProductFormData>({
        nama_obat: initialData?.nama_obat || '',
        category_id: initialData?.category_id || '',
        deskripsi: initialData?.deskripsi || '',
        jenis_obat: initialData?.jenis_obat || '',
        indikasi: initialData?.indikasi || '',
        aturan_pakai: initialData?.aturan_pakai || '',
        efek_samping: initialData?.efek_samping || '',
        harga: initialData?.harga || '',
        stok: initialData?.stok || '',
        stok_minimum: initialData?.stok_minimum || '10',
        gambar: null,
        is_active: initialData?.is_active ?? true,
        symptom_ids: initialData?.symptoms ? initialData.symptoms.map((s: any) => s.id) : (initialData?.symptom_ids || []),
    });

    // Calculate completion percentage
    const calculateProgress = () => {
        const fields = [
            data.nama_obat,
            data.jenis_obat,
            data.harga,
            data.stok,
            data.indikasi,
            data.aturan_pakai,
        ];
        const completedFields = fields.filter((field) => field !== '').length;
        return Math.round((completedFields / fields.length) * 100);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(file.type)) {
            alert('Format file tidak didukung. Gunakan PNG, JPG, JPEG, atau WEBP.');
            return;
        }

        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar. Maksimal 2MB.');
            return;
        }

        setUploadedFile(file);
        setData('gambar', file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setData('gambar', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                handleReset();
                onClose();
            }
        };

        if (isEdit && initialData?.id) {
            // Note: Inertia has issue with PUT + File Uploads, so we use _method=PUT via POST
            if (data.gambar) {
                // If there's an image, let's just use POST but tell Laravel it's a PUT
                post(`/admin/products/${initialData.id}?_method=PUT`, options);
            } else {
                put(`/admin/products/${initialData.id}`, options);
            }
        } else {
            post('/admin/products', options);
        }
    };

    const handleReset = () => {
        setData({
            nama_obat: '',
            category_id: '',
            deskripsi: '',
            jenis_obat: '',
            indikasi: '',
            aturan_pakai: '',
            efek_samping: '',
            harga: '',
            stok: '',
            stok_minimum: '10',
            gambar: null,
            is_active: true,
        });
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const progress = calculateProgress();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-6 overflow-y-auto">
            <div className="relative w-full max-w-6xl rounded-3xl bg-white shadow-2xl p-8 my-8">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-['Poppins',sans-serif] text-3xl font-semibold text-[#171d19]">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h1>
                    <p className="mt-2 font-['Poppins',sans-serif] text-[14px] text-[#6e7a70]">
                        {isEdit ? 'Perbarui informasi produk obat yang sudah ada' : 'Isi formulir di bawah untuk menambahkan produk obat baru ke sistem apotek'}
                    </p>
                </div>

                {/* Main Form Grid */}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-8 grid-cols-3 items-start">
                        {/* LEFT COLUMN - Form Cards */}
                        <div className="col-span-2 space-y-6">
                            {/* Card 1: Informasi Dasar */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <FileText
                                        size={20}
                                        className="text-[#006a3f]"
                                    />
                                    <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                        Informasi Dasar
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    {/* Nama Obat */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Nama Obat
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nama_obat}
                                            onChange={(e) =>
                                                setData('nama_obat', e.target.value)
                                            }
                                            placeholder="Masukkan nama obat"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.nama_obat && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.nama_obat}
                                            </p>
                                        )}
                                    </div>


                                    {/* Jenis Obat */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Jenis Obat
                                        </label>
                                        <select
                                            value={data.jenis_obat}
                                            onChange={(e) =>
                                                setData('jenis_obat', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        >
                                            <option value="">
                                                Pilih golongan
                                            </option>
                                            <option value="bebas">
                                                Obat Bebas
                                            </option>
                                            <option value="keras">
                                                Obat Keras
                                            </option>
                                            <option value="terbatas">
                                                Obat Terbatas
                                            </option>
                                        </select>
                                        {errors.jenis_obat && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.jenis_obat}
                                            </p>
                                        )}
                                    </div>

                                    {/* Kategori Induk */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Kategori Induk
                                        </label>
                                        <select
                                            value={data.category_id}
                                            onChange={(e) =>
                                                setData('category_id', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        >
                                            <option value="">
                                                Pilih Kategori Induk
                                            </option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.nama_kategori}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.category_id}
                                            </p>
                                        )}
                                    </div>
                                    
                                    {/* Status Aktif */}
                                    <div className="col-span-2 flex items-center">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f]"
                                        />
                                        <label htmlFor="is_active" className="ml-2 block font-['Poppins',sans-serif] text-[14px] text-[#171d19]">
                                            Aktif / Tersedia di Katalog
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Detail Harga & Stok */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <DollarSign
                                        size={20}
                                        className="text-[#006a3f]"
                                    />
                                    <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                        Detail Harga & Stok
                                    </h2>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {/* Harga Jual */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Harga
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Poppins',sans-serif] text-[14px] font-medium text-[#6e7a70]">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                value={data.harga}
                                                onChange={(e) =>
                                                    setData('harga', e.target.value)
                                                }
                                                placeholder="0"
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.harga && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.harga}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stok Saat Ini */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Stok
                                        </label>
                                        <input
                                            type="number"
                                            value={data.stok}
                                            onChange={(e) =>
                                                setData('stok', e.target.value)
                                            }
                                            placeholder="0"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.stok && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.stok}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stok Minimum */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Stok Minimum
                                        </label>
                                        <input
                                            type="number"
                                            value={data.stok_minimum}
                                            onChange={(e) =>
                                                setData('stok_minimum', e.target.value)
                                            }
                                            placeholder="10"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.stok_minimum && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.stok_minimum}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Informasi Medis & Pemakaian */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <Calendar
                                        size={20}
                                        className="text-[#006a3f]"
                                    />
                                    <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                        Informasi Medis & Pemakaian
                                    </h2>
                                </div>

                                <div className="space-y-5">
                                    {/* Indikasi */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Indikasi (Kegunaan)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.indikasi}
                                            onChange={(e) =>
                                                setData('indikasi', e.target.value)
                                            }
                                            placeholder="Contoh: Meredakan demam dan nyeri"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.indikasi && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.indikasi}
                                            </p>
                                        )}
                                    </div>

                                    {/* Aturan Pakai */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Aturan Pakai
                                        </label>
                                        <input
                                            type="text"
                                            value={data.aturan_pakai}
                                            onChange={(e) =>
                                                setData('aturan_pakai', e.target.value)
                                            }
                                            placeholder="Contoh: 3 kali sehari 1 tablet sesudah makan"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.aturan_pakai && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.aturan_pakai}
                                            </p>
                                        )}
                                    </div>

                                    {/* Efek Samping */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Efek Samping
                                        </label>
                                        <input
                                            type="text"
                                            value={data.efek_samping}
                                            onChange={(e) =>
                                                setData('efek_samping', e.target.value)
                                            }
                                            placeholder="Efek samping yang mungkin terjadi"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.efek_samping && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.efek_samping}
                                            </p>
                                        )}
                                    </div>

                                    {/* Kategori Gejala */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Kategori Gejala
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {symptoms.map((symptom) => {
                                                const isSelected = data.symptom_ids.includes(symptom.id);
                                                return (
                                                    <button
                                                        key={symptom.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setData('symptom_ids', data.symptom_ids.filter(id => id !== symptom.id));
                                                            } else {
                                                                setData('symptom_ids', [...data.symptom_ids, symptom.id]);
                                                            }
                                                        }}
                                                        className={`rounded-full px-4 py-1.5 text-[14px] transition-all ${
                                                            isSelected
                                                                ? 'bg-[#eef5f0] text-[#006a3f] border border-[#006a3f] font-medium'
                                                                : 'bg-white text-[#171d19] border border-gray-200 hover:border-[#006a3f] hover:text-[#006a3f]'
                                                        }`}
                                                    >
                                                        {symptom.nama_gejala}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {errors.symptom_ids && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.symptom_ids}
                                            </p>
                                        )}
                                    </div>

                                    {/* Deskripsi Obat */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Deskripsi Panjang
                                        </label>
                                        <textarea
                                            value={data.deskripsi}
                                            onChange={(e) =>
                                                setData('deskripsi', e.target.value)
                                            }
                                            placeholder="Deskripsi lengkap tentang obat..."
                                            rows={3}
                                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.deskripsi && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.deskripsi}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - Media & Status Cards */}
                        <div className="col-span-1 space-y-6">
                            {/* Card 4: Foto Produk */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <UploadCloud
                                        size={20}
                                        className="text-[#006a3f]"
                                    />
                                    <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                        Foto Produk
                                    </h2>
                                </div>

                                {!uploadedFile && !(isEdit && initialData?.gambar) ? (
                                    <>
                                        {/* Dropzone */}
                                        <div
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                            className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                                                dragActive
                                                    ? 'border-[#006a3f] bg-[#006a3f]/5'
                                                    : 'border-gray-300 bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                onChange={handleInputChange}
                                                accept=".png,.jpg,.jpeg,.webp"
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="w-full"
                                            >
                                                <div className="flex justify-center mb-3">
                                                    <UploadCloud
                                                        size={32}
                                                        className="text-[#006a3f]"
                                                    />
                                                </div>
                                                <p className="font-['Poppins',sans-serif] text-[14px] font-medium text-[#171d19]">
                                                    Klik atau seret file ke sini
                                                </p>
                                                <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-[#6e7a70]">
                                                    PNG, JPG, WEBP - Maks 2MB
                                                </p>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mb-4">
                                        {/* Tampilkan preview gambar sebelumnya atau gambar yang baru diupload */}
                                        {uploadedFile || initialData?.gambar ? (
                                            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl border border-gray-200">
                                                <img 
                                                    src={uploadedFile ? URL.createObjectURL(uploadedFile) : `/storage/${initialData.gambar}`} 
                                                    alt="Preview" 
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ) : null}
                                        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate font-['Poppins',sans-serif] text-[13px] font-medium text-[#171d19]">
                                                    {uploadedFile ? uploadedFile.name : (initialData?.gambar || 'Gambar Saat Ini')}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="ml-2 rounded-lg p-2 hover:bg-red-50 transition-colors"
                                            >
                                                <X
                                                    size={18}
                                                    className="text-red-600"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Alert Box */}
                                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                    <p className="font-['Poppins',sans-serif] text-[12px] leading-relaxed text-emerald-800">
                                        <span className="font-semibold">
                                            💡 Tip:
                                        </span>{' '}
                                        Gunakan pencahayaan yang baik dan
                                        background netral untuk hasil foto
                                        produk yang optimal dan profesional.
                                    </p>
                                </div>

                                {errors.gambar && (
                                    <p className="mt-3 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                        {errors.gambar}
                                    </p>
                                )}
                            </div>

                            {/* Card 5: Status Penambahan & Progress */}
                            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50/50 to-blue-50/20 p-6 shadow-sm">
                                <h2 className="mb-4 font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                    Status Pengisian
                                </h2>

                                {/* Status Badge */}
                                <div className="mb-5 flex items-center gap-3 rounded-lg bg-white p-3">
                                    <div className={`h-3 w-3 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                                    <span className="font-['Poppins',sans-serif] text-[13px] font-medium text-[#171d19]">
                                        {progress === 100 ? 'Data Lengkap' : 'Draft Belum Lengkap'}
                                    </span>
                                </div>

                                {/* Progress Bar Label */}
                                <p className="mb-2 font-['Poppins',sans-serif] text-[12px] font-medium text-[#6e7a70]">
                                    Kelengkapan Field Wajib
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <p className="text-right font-['Poppins',sans-serif] text-[12px] text-[#6e7a70]">
                                    {progress}% lengkap
                                </p>

                                {/* Info Box */}
                                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                                    <p className="font-['Poppins',sans-serif] text-[12px] text-blue-800">
                                        Pastikan mengisi kolom wajib yang ada di form dasar sebelum menyimpan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="col-span-3 mt-10 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex items-center gap-2 rounded-xl px-6 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-red-600 transition-all hover:bg-red-50"
                        >
                            <RotateCcw size={16} />
                            Reset Form
                        </button>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:bg-gray-50"
                            >
                                Batal
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-6 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-white shadow-[0_4px_12px_rgba(0,106,63,0.2)] transition-all hover:bg-[#005632] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingBag size={16} />
                                {processing
                                    ? 'Menyimpan...'
                                    : (isEdit ? 'Perbarui Produk' : 'Simpan Produk')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
