import { Link, usePage, useForm, router } from '@inertiajs/react';
import ConfirmModal from '../components/ConfirmModal';
import { LogOut, UserCog, ChevronLeft, Camera } from 'lucide-react';
import { useState, useRef } from 'react';

export default function AdminSettings() {
    const { auth, globalDiscount = 0 } = usePage<any>().props;
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'logout' | 'delete' | 'timeout' | 'warning';
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
    }>({
        isOpen: false,
        type: 'warning',
        title: '',
        message: '',
        onConfirm: () => {}
    });

    const closeConfirmModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    const handleAdminLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setModalConfig({
            isOpen: true,
            type: 'logout',
            title: 'Keluar dari Sistem',
            message: 'Apakah Anda yakin ingin keluar dari sistem Apotek Jaya Farma?',
            confirmText: 'Ya, Keluar',
            onConfirm: () => {
                closeConfirmModal();
                router.post(route('logout'));
            }
        });
    };

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        phone: auth?.user?.phone || '',
        password: '',
        password_confirmation: '',
        avatar: null as File | null,
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        auth?.user?.avatar ? `/storage/${auth.user.avatar}` : null
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setData('password', '');
                setData('password_confirmation', '');
            }
        });
    };

    const { data: discountData, setData: setDiscountData, post: postDiscount, processing: processingDiscount } = useForm({
        discount: globalDiscount
    });

    const submitDiscount = (e: React.FormEvent) => {
        e.preventDefault();
        postDiscount('/admin/settings/discount', { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
            {/* Enhanced Header (Duplicated from AdminDashboard) */}
            <header className="sticky top-0 z-50 border-b border-[#f1f5f9] bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
                <div className="mx-auto max-w-[1600px] px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-['Roboto_Condensed',sans-serif] text-[32px] font-bold tracking-[-0.8px] text-[#171d19]">
                                Dashboard Admin
                            </h1>
                            <p className="mt-1 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                Pengaturan Profil Administrator
                            </p>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-3 rounded-xl border border-[#f1f5f9] bg-white p-2 pr-4 transition-all hover:border-[#006a3f] hover:shadow-sm"
                            >
                                <div className="text-right hidden md:block">
                                    <p className="font-['Roboto_Condensed',sans-serif] text-[15px] font-semibold text-[#171d19]">
                                        {auth?.user?.name || 'Admin'}
                                    </p>
                                    <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">
                                        Administrator
                                    </p>
                                </div>
                                {auth?.user?.avatar ? (
                                    <img src={`/storage/${auth.user.avatar}`} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                        <span className="font-['Roboto_Condensed',sans-serif] text-[15px] font-semibold text-gray-700">
                                            {auth?.user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'AD'}
                                        </span>
                                    </div>
                                )}
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#f1f5f9] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50">
                                    <div className="my-1 h-[1px] w-full bg-[#f1f5f9]"></div>
                                    <button
                                        onClick={handleAdminLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-['Inter',sans-serif] text-[13px] font-medium text-[#ba1a1a] transition-all hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        <span>Keluar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-8 py-8">
                <div className="mx-auto max-w-[1000px] mb-6">
                    <Link 
                        href="/admin" 
                        className="inline-flex items-center gap-2 rounded-lg py-2 font-['Inter',sans-serif] text-[14px] font-medium text-[#6e7a70] transition-colors hover:text-[#006a3f]"
                    >
                        <ChevronLeft size={16} />
                        Kembali ke Dashboard
                    </Link>
                </div>
                
                <form onSubmit={submit} className="mx-auto max-w-[1000px] rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-sm">
                    <h2 className="mb-2 font-['Inter',sans-serif] text-[24px] font-bold text-[#171d19]">
                        Pengaturan Profil
                    </h2>
                    <p className="mb-6 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                        Kelola informasi dasar dan keamanan akun administrator Anda.
                    </p>
                    
                    {recentlySuccessful && (
                        <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-600">
                            Profil berhasil diperbarui.
                        </div>
                    )}
                    
                    <div className="space-y-6 border-t border-[#f1f5f9] pt-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover shadow-sm" />
                                ) : (
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 shadow-sm">
                                        <span className="font-['Roboto_Condensed',sans-serif] text-[28px] font-bold text-gray-700">
                                            {auth?.user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'AD'}
                                        </span>
                                    </div>
                                )}
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#006a3f] text-white transition-colors hover:bg-[#005632]"
                                >
                                    <Camera size={14} />
                                </button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div>
                                <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-[#171d19]">
                                    {auth?.user?.name || 'Admin'}
                                </h3>
                                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                    Administrator
                                </p>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 font-['Inter',sans-serif] text-[12px] font-bold text-[#006a3f] hover:underline">
                                    Ganti Foto Profil
                                </button>
                                {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                    No. Telepon
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                    Password Baru (Kosongkan jika tidak diubah)
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                    Konfirmasi Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-6">
                            <button type="submit" disabled={processing} className="rounded-xl bg-[#006a3f] px-6 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#005632] disabled:opacity-70">
                                {processing ? 'Menyimpan...' : 'Simpan Profil'}
                            </button>
                        </div>
                    </div>
                </form>

                <form onSubmit={submitDiscount} className="mx-auto max-w-[1000px] mt-8 rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-sm">
                    <h2 className="mb-2 font-['Inter',sans-serif] text-[24px] font-bold text-[#171d19]">
                        Pengaturan Global Aplikasi
                    </h2>
                    <p className="mb-6 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                        Kelola pengaturan yang berdampak pada pengalaman seluruh pengguna Apotek Jaya Farma.
                    </p>
                    
                    <div className="space-y-6 border-t border-[#f1f5f9] pt-6">
                        <div>
                            <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                Potongan Harga (Diskon) Default Checkout & Keranjang
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
                                <input
                                    type="number"
                                    value={discountData.discount}
                                    onChange={e => setDiscountData('discount', Number(e.target.value))}
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] pl-12 pr-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-6">
                            <button type="submit" disabled={processingDiscount} className="rounded-xl bg-[#006a3f] px-6 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#005632] disabled:opacity-70">
                                {processingDiscount ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
        </div>
    );
}
