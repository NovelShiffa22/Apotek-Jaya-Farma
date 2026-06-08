import { useForm } from '@inertiajs/react';
import {
    Mail,
    Phone,
    Shield,
    User,
    X,
    Lock,
} from 'lucide-react';
import { useState } from 'react';

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    role: string;
    password?: string;
    password_confirmation?: string;
}

interface CreateUserProps {
    isOpen: boolean;
    onClose: () => void;
    isEdit?: boolean;
    initialData?: any;
}

export default function CreateUser({ isOpen, onClose, isEdit = false, initialData }: CreateUserProps) {
    const { data, setData, post, put, errors, processing, reset } = useForm<UserFormData>({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        role: initialData?.role || 'user',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
            }
        };

        if (isEdit && initialData?.id) {
            put(`/admin/users/${initialData.id}`, options);
        } else {
            post('/admin/users', options);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#171d19]/40 transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#f9fafb] shadow-2xl transition-all h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
                    <div>
                        <h1 className="font-['Roboto_Condensed',sans-serif] text-2xl font-bold text-[#171d19]">
                            {isEdit ? 'Edit Data User' : 'Tambah User Baru'}
                        </h1>
                        <p className="mt-1 font-['Poppins',sans-serif] text-[13px] text-[#6e7a70]">
                            {isEdit ? 'Perbarui informasi detail akun pengguna' : 'Masukkan informasi detail untuk akun pengguna baru'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 transition-colors hover:bg-gray-100"
                    >
                        <X size={24} className="text-[#6e7a70]" />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-8 py-8">
                    <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Informasi Dasar */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <User size={20} className="text-[#006a3f]" />
                                <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                    Informasi Dasar
                                </h2>
                            </div>

                            <div className="space-y-5">
                                {/* Nama */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukkan nama lengkap..."
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email & Phone */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7a70]" size={18} />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="user@example.com"
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Nomor Telepon
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7a70]" size={18} />
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="081234567890"
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Keamanan & Peran */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-3">
                                <Shield size={20} className="text-[#006a3f]" />
                                <h2 className="font-['Poppins',sans-serif] text-lg font-semibold text-[#171d19]">
                                    Keamanan & Peran
                                </h2>
                            </div>

                            <div className="space-y-5">
                                {/* Role */}
                                <div>
                                    <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                        Peran (Role) <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all bg-white"
                                    >
                                        <option value="user">Pelanggan</option>
                                        <option value="pharmacist">Apoteker</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Password {isEdit && <span className="text-gray-400 font-normal">(opsional)</span>}
                                            {!isEdit && <span className="text-red-500">*</span>}
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7a70]" size={18} />
                                            <input
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder={isEdit ? "Biarkan kosong jika tidak diubah" : "Masukkan password..."}
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block font-['Poppins',sans-serif] text-[13px] font-medium text-[#6e7a70] mb-2">
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e7a70]" size={18} />
                                            <input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Ulangi password..."
                                                className="w-full rounded-xl border border-gray-200 py-2.5 pl-11 pr-4 font-['Poppins',sans-serif] text-[14px] focus:border-[#006a3f] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/10 transition-all"
                                            />
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="mt-1 font-['Poppins',sans-serif] text-[12px] text-red-600">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer / Actions */}
                <div className="border-t border-gray-200 bg-white px-8 py-5">
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-6 py-2.5 font-['Poppins',sans-serif] text-[14px] font-medium text-[#6e7a70] transition-colors hover:bg-gray-100 hover:text-[#171d19]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            form="userForm"
                            disabled={processing}
                            className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-8 py-2.5 font-['Poppins',sans-serif] text-[14px] font-medium text-white transition-all hover:bg-[#005632] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui User' : 'Simpan User')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
