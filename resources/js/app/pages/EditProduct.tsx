import React, { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    DollarSign,
    FileText,
    Save,
    UploadCloud,
    Edit2,
    Trash2,
    AlertTriangle,
    Plus,
    X
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

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
    delete_gambar?: boolean;
}

interface EditProductProps {
    initialData: any;
    categories: Category[];
    symptoms: Symptom[];
    stockHistories?: any[];
}

export default function EditProduct({ initialData, categories = [], symptoms = [], stockHistories = [] }: EditProductProps) {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [showAdjustStockModal, setShowAdjustStockModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'danger' | 'warning' | 'delete' | 'success';
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
        cancelText?: string;
    }>({
        isOpen: false,
        type: 'danger',
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const closeConfirmModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const { data, setData, post, errors, processing } = useForm<ProductFormData>({
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
        delete_gambar: false,
    });

    const adjustStockForm = useForm({
        action: 'inbound_purchase',
        quantity: 1,
        reason: '',
        supplier: '',
        buy_price: '',
    });

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
            setModalConfig({
                isOpen: true,
                type: 'danger',
                title: 'Format Tidak Didukung',
                message: 'Format file tidak didukung. Gunakan PNG, JPG, JPEG, atau WEBP.',
                confirmText: 'Tutup',
                cancelText: '',
                onConfirm: closeConfirmModal
            });
            return;
        }

        if (file.size > maxSize) {
            setModalConfig({
                isOpen: true,
                type: 'danger',
                title: 'Ukuran Terlalu Besar',
                message: 'Ukuran file terlalu besar. Maksimal 2MB.',
                confirmText: 'Tutup',
                cancelText: '',
                onConfirm: closeConfirmModal
            });
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
        setData(prev => ({ ...prev, gambar: null, delete_gambar: true }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setModalConfig({
            isOpen: true,
            type: 'warning',
            title: 'Konfirmasi Perubahan',
            message: `Apakah Anda yakin ingin menyimpan perubahan pada produk ${data.nama_obat}? Tindakan ini akan memperbarui data secara langsung di database.`,
            confirmText: 'Ya, Simpan',
            cancelText: 'Batal',
            onConfirm: () => {
                closeConfirmModal();
                executeSubmit();
            }
        });
    };

    const executeSubmit = () => {
        post(`/admin/products/${initialData.id}?_method=PUT`, {
            forceFormData: true,
        });
    };

    const executeAdjustStock = (e: React.FormEvent) => {
        e.preventDefault();
        adjustStockForm.put(`/admin/products/${initialData.id}/stock`, {
            onSuccess: () => {
                setShowAdjustStockModal(false);
                adjustStockForm.reset();
                router.reload(); // Reload to get updated stock
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#fafaf8] pb-12">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-[#f1f5f9] bg-white shadow-sm">
                <div className="mx-auto max-w-[1200px] px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.visit('/admin')}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-600 bg-white text-emerald-600 transition-colors hover:bg-emerald-50"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="font-['Poppins',sans-serif] text-[24px] font-semibold text-[#171d19]">
                                    Edit Produk
                                </h1>
                                <p className="mt-1 font-['Poppins',sans-serif] text-[13px] text-[#6e7a70]">
                                    Perbarui informasi produk obat yang sudah ada
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.visit('/admin')}
                                className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:bg-gray-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-6 py-2.5 font-['Poppins',sans-serif] text-[13px] font-medium text-white shadow-[0_4px_12px_rgba(0,106,63,0.2)] transition-all hover:bg-[#005632] disabled:opacity-50"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Form Grid */}
            <main className="mx-auto max-w-[1200px] px-8 py-8">
                <form onSubmit={handleSubmit} className="grid gap-8 grid-cols-3 items-start">
                    {/* LEFT COLUMN - Form Cards */}
                    <div className="col-span-2 space-y-6">
                        {/* Card 1: Informasi Dasar */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <FileText size={20} className="text-[#006a3f]" />
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
                                        onChange={(e) => setData('nama_obat', e.target.value)}
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
                                        onChange={(e) => setData('jenis_obat', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    >
                                        <option value="">Pilih golongan</option>
                                        <option value="bebas">Obat Bebas</option>
                                        <option value="keras">Obat Keras</option>
                                        <option value="terbatas">Obat Terbatas</option>
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
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    >
                                        <option value="">Pilih Kategori Induk</option>
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
                                <div className="col-span-2 flex items-center mt-2">
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
                                <DollarSign size={20} className="text-[#006a3f]" />
                                <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                    Detail Harga & Stok
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4 items-end">
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
                                            onChange={(e) => setData('harga', e.target.value)}
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

                                {/* Stok Minimum */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                        Stok Minimum
                                    </label>
                                    <input
                                        type="number"
                                        value={data.stok_minimum}
                                        onChange={(e) => setData('stok_minimum', e.target.value)}
                                        placeholder="10"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    />
                                    {errors.stok_minimum && (
                                        <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                            {errors.stok_minimum}
                                        </p>
                                    )}
                                </div>

                                {/* Stok Saat Ini (READ ONLY) */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2 flex justify-between items-center">
                                        <span>Stok Real</span>
                                        <button
                                            type="button"
                                            onClick={() => setShowAdjustStockModal(true)}
                                            className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                                        >
                                            <Plus size={14} /> Kelola Stok
                                        </button>
                                    </label>
                                    <input
                                        type="text"
                                        value={initialData.stok}
                                        readOnly
                                        disabled
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Informasi Medis & Pemakaian */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <Calendar size={20} className="text-[#006a3f]" />
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
                                        onChange={(e) => setData('indikasi', e.target.value)}
                                        placeholder="Contoh: Meredakan demam dan nyeri"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    />
                                </div>

                                {/* Aturan Pakai */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                        Aturan Pakai
                                    </label>
                                    <input
                                        type="text"
                                        value={data.aturan_pakai}
                                        onChange={(e) => setData('aturan_pakai', e.target.value)}
                                        placeholder="Contoh: 3 kali sehari 1 tablet sesudah makan"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    />
                                </div>

                                {/* Efek Samping */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                        Efek Samping
                                    </label>
                                    <input
                                        type="text"
                                        value={data.efek_samping}
                                        onChange={(e) => setData('efek_samping', e.target.value)}
                                        placeholder="Efek samping yang mungkin terjadi"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    />
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
                                </div>

                                {/* Deskripsi Obat */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                        Deskripsi Panjang
                                    </label>
                                    <textarea
                                        value={data.deskripsi}
                                        onChange={(e) => setData('deskripsi', e.target.value)}
                                        placeholder="Deskripsi lengkap tentang obat..."
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Media Cards */}
                    <div className="col-span-1 space-y-6">
                        {/* Card 4: Foto Produk */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <UploadCloud size={20} className="text-[#006a3f]" />
                                <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                    Foto Produk
                                </h2>
                            </div>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleInputChange}
                                accept=".png,.jpg,.jpeg,.webp"
                                className="hidden"
                            />

                            {!(uploadedFile || (initialData?.gambar && !data.delete_gambar)) ? (
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                                        dragActive ? 'border-[#006a3f] bg-[#006a3f]/5' : 'border-gray-300 bg-gray-50'
                                    }`}
                                >
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                                        <div className="flex justify-center mb-3">
                                            <UploadCloud size={32} className="text-[#006a3f]" />
                                        </div>
                                        <p className="font-['Poppins',sans-serif] text-[14px] font-medium text-[#171d19]">
                                            Klik atau seret file ke sini
                                        </p>
                                        <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-[#6e7a70]">
                                            PNG, JPG, WEBP - Maks 2MB
                                        </p>
                                    </button>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl border border-gray-200">
                                        <img 
                                            src={uploadedFile ? URL.createObjectURL(uploadedFile) : (initialData.gambar?.startsWith('http') ? initialData.gambar : `/storage/${initialData.gambar}`)} 
                                            alt="Preview" 
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="mt-3 flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-['Poppins',sans-serif] text-[13px] font-medium text-[#006a3f] transition-colors hover:bg-[#006a3f]/10"
                                        >
                                            <Edit2 size={14} /> Ganti Foto
                                        </button>
                                        <div className="h-4 w-[1px] bg-gray-300"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setModalConfig({
                                                    isOpen: true,
                                                    type: 'delete',
                                                    title: 'Hapus Foto Produk?',
                                                    message: 'Tindakan ini akan menghapus foto secara permanen.',
                                                    confirmText: 'Hapus',
                                                    cancelText: 'Batal',
                                                    onConfirm: () => {
                                                        removeFile();
                                                        closeConfirmModal();
                                                    }
                                                });
                                            }}
                                            className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-['Poppins',sans-serif] text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <Trash2 size={14} /> Hapus Foto
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
                {/* Riwayat Mutasi Stok Section */}
                <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="mb-6 border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-3 text-[#171d19]">
                            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                                <FileText size={20} />
                            </div>
                            <h2 className="font-['Poppins',sans-serif] text-[18px] font-semibold">
                                Riwayat Perubahan & Mutasi Stok Obat
                            </h2>
                        </div>
                        <p className="mt-2 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                            Rekaman aktivitas penambahan, pengurangan, dan penyesuaian stok khusus untuk produk ini.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-100">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase w-12">No</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Tanggal & Waktu</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Tipe Aksi</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Qty</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Harga Beli</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Supplier</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Keterangan / Alasan</th>
                                    <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">Operator Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stockHistories.length > 0 ? (
                                    stockHistories.map((history, idx) => {
                                        const isAdd = history.type === 'inbound_purchase' || history.type === 'adjustment_add' || history.type === 'inbound';
                                        let typeLabel = '';
                                        let typeColor = '';
                                        
                                        if (history.type === 'inbound_purchase' || history.type === 'inbound') {
                                            typeLabel = 'Stok Masuk';
                                            typeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                                        } else if (history.type === 'adjustment_damaged') {
                                            typeLabel = 'Koreksi (Rusak)';
                                            typeColor = 'bg-red-50 text-red-700 border-red-200';
                                        } else if (history.type === 'adjustment_lost') {
                                            typeLabel = 'Koreksi (Hilang)';
                                            typeColor = 'bg-orange-50 text-orange-700 border-orange-200';
                                        } else if (history.type === 'adjustment_add') {
                                            typeLabel = 'Koreksi (+)';
                                            typeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                        } else {
                                            typeLabel = 'Koreksi (-)';
                                            typeColor = 'bg-red-50 text-red-700 border-red-200';
                                        }

                                        return (
                                            <tr key={history.id} className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50">
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[13px] text-[#3e4a41]">
                                                    {new Date(history.created_at).toLocaleString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium border ${typeColor}`}>
                                                        {typeLabel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[14px] font-semibold">
                                                    <span className={isAdd ? 'text-emerald-600' : 'text-red-600'}>
                                                        {isAdd ? '+' : '-'}{history.quantity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[13px] text-[#3e4a41]">
                                                    {history.buy_price ? `Rp ${history.buy_price.toLocaleString('id-ID')}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[13px] text-[#3e4a41]">
                                                    {history.supplier || '-'}
                                                </td>
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                                                    {history.reason || '-'}
                                                </td>
                                                <td className="px-6 py-4 font-['Inter',sans-serif] text-[13px] text-[#171d19] font-medium">
                                                    {history.user?.name || 'Sistem'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <FileText size={32} className="mb-3 opacity-20" />
                                                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                                    Belum ada riwayat pergerakan stok untuk produk ini
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>


            {/* Adjust Stock Modal */}
            {showAdjustStockModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all">
                    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white shadow-2xl overflow-hidden">
                        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
                            <h3 className="font-['Poppins',sans-serif] text-[16px] font-semibold text-white">
                                Penyesuaian Stok Khusus
                            </h3>
                            <button onClick={() => setShowAdjustStockModal(false)} className="text-white/80 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={executeAdjustStock} className="p-6">
                            <div className="mb-4 rounded-lg bg-amber-50 p-3 text-[12px] leading-relaxed text-amber-800 font-['Inter',sans-serif]">
                                <span className="font-semibold">Catatan:</span> Riwayat mutasi stok yang sudah disimpan tidak dapat diedit/dihapus demi keamanan data. Jika terjadi salah input, silakan lakukan kontra-transaksi (penyesuaian balik) pada input berikutnya.
                            </div>
                            <div className="mb-4">
                                <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                    Tipe Penyesuaian
                                </label>
                                <select
                                    value={adjustStockForm.data.action}
                                    onChange={e => adjustStockForm.setData('action', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                                >
                                    <option value="inbound_purchase">Stok Masuk (Pembelian Baru)</option>
                                    <option value="adjustment_damaged">Koreksi Stok (Barang Rusak)</option>
                                    <option value="adjustment_lost">Koreksi Stok (Barang Hilang)</option>
                                </select>
                            </div>
                            
                            {adjustStockForm.data.action === 'inbound_purchase' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Nama Supplier / Vendor
                                        </label>
                                        <input
                                            type="text"
                                            value={adjustStockForm.data.supplier}
                                            onChange={e => adjustStockForm.setData('supplier', e.target.value)}
                                            placeholder="Contoh: PT. Kimia Farma"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                                        />
                                        {adjustStockForm.errors.supplier && <p className="text-red-500 text-xs mt-1">{adjustStockForm.errors.supplier}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Harga Beli per Unit (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={adjustStockForm.data.buy_price}
                                            onChange={e => adjustStockForm.setData('buy_price', e.target.value)}
                                            placeholder="0"
                                            required
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                                        />
                                        {adjustStockForm.errors.buy_price && <p className="text-red-500 text-xs mt-1">{adjustStockForm.errors.buy_price}</p>}
                                    </div>
                                </>
                            )}

                            <div className="mb-4">
                                <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                    Jumlah (Unit)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={adjustStockForm.data.quantity}
                                    onChange={e => adjustStockForm.setData('quantity', parseInt(e.target.value))}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                                />
                                {adjustStockForm.errors.quantity && <p className="text-red-500 text-xs mt-1">{adjustStockForm.errors.quantity}</p>}
                            </div>
                            <div className="mb-6">
                                <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                    Alasan Penyesuaian (Wajib)
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={adjustStockForm.data.reason}
                                    onChange={e => adjustStockForm.setData('reason', e.target.value)}
                                    placeholder="Contoh: Barang rusak / Hilang / Kadaluarsa / Faktur Baru"
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                                ></textarea>
                                {adjustStockForm.errors.reason && <p className="text-red-500 text-xs mt-1">{adjustStockForm.errors.reason}</p>}
                            </div>
                            <button
                                type="submit"
                                disabled={adjustStockForm.processing}
                                className="w-full rounded-xl bg-emerald-600 py-3 font-['Poppins',sans-serif] text-[14px] font-medium text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {adjustStockForm.processing ? 'Menyimpan...' : 'Simpan Penyesuaian Stok'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
        </div>
    );
}
