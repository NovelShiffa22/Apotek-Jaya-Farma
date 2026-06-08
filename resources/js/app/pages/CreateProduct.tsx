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

interface ProductFormData {
    name: string;
    sku: string;
    category: string;
    manufacturer: string;
    buyPrice: string;
    sellPrice: string;
    initialStock: string;
    unit: string;
    description: string;
    sideEffects: string;
    expiryDate: string;
    photo: File | null;
}

interface CreateProductProps {
    isEdit?: boolean;
    initialData?: ProductFormData;
}

export default function CreateProduct({ isEdit = false, initialData }: CreateProductProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, put, errors, processing } = useForm<ProductFormData>({
        name: initialData?.name || '',
        sku: initialData?.sku || '',
        category: initialData?.category || '',
        manufacturer: initialData?.manufacturer || '',
        buyPrice: initialData?.buyPrice || '',
        sellPrice: initialData?.sellPrice || '',
        initialStock: initialData?.initialStock || '',
        unit: initialData?.unit || 'tablet',
        description: initialData?.description || '',
        sideEffects: initialData?.sideEffects || '',
        expiryDate: initialData?.expiryDate || '',
        photo: null,
    });

    // Calculate completion percentage
    const calculateProgress = () => {
        const fields = [
            data.name,
            data.sku,
            data.category,
            data.manufacturer,
            data.buyPrice,
            data.sellPrice,
            data.initialStock,
            data.unit,
            data.description,
            data.expiryDate,
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
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(file.type)) {
            alert('Format file tidak didukung. Gunakan PNG, JPG, atau JPEG.');
            return;
        }

        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar. Maksimal 2MB.');
            return;
        }

        setUploadedFile(file);
        setData('photo', file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setData('photo', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            // For FE demo, we can just use put or pretend it saves
            alert('Produk berhasil diperbarui (Simulasi FE)');
        } else {
            post(route('products.store'));
        }
    };

    const handleReset = () => {
        setData({
            name: '',
            sku: '',
            category: '',
            manufacturer: '',
            buyPrice: '',
            sellPrice: '',
            initialStock: '',
            unit: 'tablet',
            description: '',
            sideEffects: '',
            expiryDate: '',
            photo: null,
        });
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const progress = calculateProgress();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white px-8 py-8">
            <div className="mx-auto max-w-7xl">
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
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Masukkan nama obat"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Kode SKU */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Kode SKU
                                        </label>
                                        <input
                                            type="text"
                                            value={data.sku}
                                            onChange={(e) =>
                                                setData('sku', e.target.value)
                                            }
                                            placeholder="AP-XXXXX"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.sku && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.sku}
                                            </p>
                                        )}
                                    </div>

                                    {/* Kategori */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Kategori
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) =>
                                                setData('category', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        >
                                            <option value="">
                                                Pilih kategori
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
                                        {errors.category && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>

                                    {/* Pabrikan/Produsen */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Pabrikan/Produsen
                                        </label>
                                        <input
                                            type="text"
                                            value={data.manufacturer}
                                            onChange={(e) =>
                                                setData(
                                                    'manufacturer',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nama pabrikan"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.manufacturer && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.manufacturer}
                                            </p>
                                        )}
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

                                <div className="grid grid-cols-4 gap-4">
                                    {/* Harga Beli */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Harga Beli
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Poppins',sans-serif] text-[14px] font-medium text-[#6e7a70]">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                value={data.buyPrice}
                                                onChange={(e) =>
                                                    setData(
                                                        'buyPrice',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.buyPrice && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.buyPrice}
                                            </p>
                                        )}
                                    </div>

                                    {/* Harga Jual */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Harga Jual
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-['Poppins',sans-serif] text-[14px] font-medium text-[#6e7a70]">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                value={data.sellPrice}
                                                onChange={(e) =>
                                                    setData(
                                                        'sellPrice',
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.sellPrice && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.sellPrice}
                                            </p>
                                        )}
                                    </div>

                                    {/* Stok Awal */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Stok Awal
                                        </label>
                                        <input
                                            type="number"
                                            value={data.initialStock}
                                            onChange={(e) =>
                                                setData(
                                                    'initialStock',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="0"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.initialStock && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.initialStock}
                                            </p>
                                        )}
                                    </div>

                                    {/* Satuan */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Satuan
                                        </label>
                                        <select
                                            value={data.unit}
                                            onChange={(e) =>
                                                setData('unit', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        >
                                            <option value="tablet">
                                                Tablet
                                            </option>
                                            <option value="kapsul">
                                                Kapsul
                                            </option>
                                            <option value="botol_sirup">
                                                Botol Sirup
                                            </option>
                                            <option value="tube_salep">
                                                Tube Salep
                                            </option>
                                        </select>
                                        {errors.unit && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.unit}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Informasi Tambahan */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-3">
                                    <Calendar
                                        size={20}
                                        className="text-[#006a3f]"
                                    />
                                    <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                        Informasi Tambahan
                                    </h2>
                                </div>

                                <div className="space-y-5">
                                    {/* Deskripsi Obat */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Deskripsi Obat
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Deskripsi lengkap tentang obat..."
                                            rows={3}
                                            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.description && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.description}
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
                                            value={data.sideEffects}
                                            onChange={(e) =>
                                                setData(
                                                    'sideEffects',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Efek samping yang mungkin terjadi"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.sideEffects && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.sideEffects}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tanggal Kedaluwarsa */}
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Tanggal Kedaluwarsa
                                        </label>
                                        <input
                                            type="date"
                                            value={data.expiryDate}
                                            onChange={(e) =>
                                                setData('expiryDate', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                        />
                                        {errors.expiryDate && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.expiryDate}
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

                                {!uploadedFile ? (
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
                                                accept=".png,.jpg,.jpeg"
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
                                                    PNG, JPG, JPEG - Maks 2MB
                                                </p>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <div className="flex-1">
                                            <p className="font-['Poppins',sans-serif] text-[13px] font-medium text-[#171d19]">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="font-['Poppins',sans-serif] text-[12px] text-[#6e7a70]">
                                                {(
                                                    uploadedFile.size / 1024
                                                ).toFixed(2)}{' '}
                                                KB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="rounded-lg p-2 hover:bg-red-50 transition-colors"
                                        >
                                            <X
                                                size={18}
                                                className="text-red-600"
                                            />
                                        </button>
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

                                {errors.photo && (
                                    <p className="mt-3 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                        {errors.photo}
                                    </p>
                                )}
                            </div>

                            {/* Card 5: Status Penambahan & Progress */}
                            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50/50 to-blue-50/20 p-6 shadow-sm">
                                <h2 className="mb-4 font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                    Status Penambahan
                                </h2>

                                {/* Status Badge */}
                                <div className="mb-5 flex items-center gap-3 rounded-lg bg-white p-3">
                                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                                    <span className="font-['Poppins',sans-serif] text-[13px] font-medium text-[#171d19]">
                                        {isEdit ? 'Draft Perubahan Belum Disimpan' : 'Draft Belum Disimpan'}
                                    </span>
                                </div>

                                {/* Progress Bar Label */}
                                <p className="mb-2 font-['Poppins',sans-serif] text-[12px] font-medium text-[#6e7a70]">
                                    Kelengkapan Data
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
                                        Isi semua field untuk melanjutkan
                                        penyimpanan data produk.
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
                                onClick={() => window.history.back()}
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
