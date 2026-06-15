import { Link, usePage, useForm, router } from '@inertiajs/react';
import ConfirmModal from '../components/ConfirmModal';
import { LogOut, UserCog, TrendingUp, Package, ShoppingBag, Settings, Menu, X, Building2, MapPin, Clock, Phone, FileText, Tag } from 'lucide-react';
import { useState } from 'react';

interface AdminPharmacyInfoProps {
    apotekSettings: {
        deskripsi: string;
        alamat: string;
        jam_operasional: string;
        kontak: string;
    };
    globalDiscount: number;
}

export default function AdminPharmacyInfo({ apotekSettings, globalDiscount }: AdminPharmacyInfoProps) {
    const { auth } = usePage<any>().props;
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

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
                window.history.replaceState(null, '', '/login');
                router.post(route('logout'));
            }
        });
    };

    // Form for pharmacy info
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        deskripsi: apotekSettings.deskripsi || '',
        alamat: apotekSettings.alamat || '',
        jam_operasional: apotekSettings.jam_operasional || '',
        kontak: apotekSettings.kontak || '',
    });

    const submitInfo = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pharmacy-info', { preserveScroll: true });
    };

    // Form for global discount
    const { data: discountData, setData: setDiscountData, post: postDiscount, processing: processingDiscount, recentlySuccessful: discountSaved } = useForm({
        discount: globalDiscount,
    });

    const submitDiscount = (e: React.FormEvent) => {
        e.preventDefault();
        postDiscount('/admin/settings/discount', { preserveScroll: true });
    };

    const sidebarItems = [
        { id: 'analytics', label: 'Analitik', icon: TrendingUp, href: '/admin?tab=analytics' },
        { id: 'products', label: 'Produk & Stok', icon: Package, href: '/admin?tab=products' },
        { id: 'orders', label: 'Manajemen Pesanan', icon: ShoppingBag, href: '/admin?tab=orders' },
        { id: 'users', label: 'Manajemen User', icon: UserCog, href: '/admin?tab=users' },
    ];

    const bottomItems = [
        { id: 'profile', label: 'Pengaturan Profil', icon: Settings, href: '/admin/settings', active: false },
        { id: 'pharmacy', label: 'Informasi Apotek', icon: Building2, href: '/admin/pharmacy-info', active: true },
    ];

    const infoFields = [
        { key: 'deskripsi' as const, label: 'Deskripsi / Tentang Apotek', icon: FileText, placeholder: 'Deskripsikan apotek...', multiline: true },
        { key: 'alamat' as const, label: 'Alamat Fisik', icon: MapPin, placeholder: 'Jl. ...', multiline: false },
        { key: 'jam_operasional' as const, label: 'Jam Operasional', icon: Clock, placeholder: '08.00 - 18.00 WIB', multiline: false },
        { key: 'kontak' as const, label: 'Nomor Kontak', icon: Phone, placeholder: '+62 8xx-xxxx-xxxx', multiline: false },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar Navigation */}
            <aside className={`hidden md:flex bg-white border-r border-[#E2E8F0] flex-col justify-between sticky top-0 h-screen z-30 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div>
                    {/* Logo Brand */}
                    <div className="flex items-center justify-center gap-3 px-4 h-20 border-b border-[#E2E8F0]">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)] shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        {!isCollapsed && (
                            <div className="overflow-hidden whitespace-nowrap transition-all duration-300">
                                <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A] leading-tight">
                                    Apotek Jaya Farma
                                </h2>
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="px-3 py-6 space-y-1.5">
                        {sidebarItems.map((tab) => (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                title={isCollapsed ? tab.label : undefined}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200`}
                            >
                                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 w-full'}`}>
                                    <tab.icon size={20} className="text-slate-400" />
                                    {!isCollapsed && <span className="whitespace-nowrap">{tab.label}</span>}
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-[#E2E8F0] space-y-1">
                    {bottomItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 relative ${
                                item.active
                                    ? 'bg-[#E7F5EC] text-[#0D6A36]'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 w-full'}`}>
                                <item.icon size={20} className={item.active ? 'text-[#0D6A36]' : 'text-slate-400'} />
                                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </div>
                            {item.active && !isCollapsed && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full shrink-0" />}
                            {item.active && isCollapsed && <div className="absolute left-0 w-1 h-5 bg-[#0D6A36] rounded-r-full shrink-0" />}
                        </Link>
                    ))}
                    <button
                        onClick={handleAdminLogout}
                        title={isCollapsed ? "Keluar" : undefined}
                        className={`w-full mt-1 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200`}
                    >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                            <LogOut size={20} className="text-red-500" />
                            {!isCollapsed && <span className="whitespace-nowrap">Keluar</span>}
                        </div>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 w-full bg-slate-50 flex flex-col min-w-0">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between px-6 h-20 bg-white border-b border-[#E2E8F0] sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-lg flex items-center justify-center shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A]">
                            Apotek Jaya Farma
                        </h2>
                    </div>
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 text-slate-600">
                        <Menu size={24} />
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isMobileSidebarOpen && (
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
                        <aside className="relative w-64 max-w-[80%] bg-white h-full flex flex-col shadow-2xl">
                            <div className="flex items-center justify-between px-6 h-20 border-b border-[#E2E8F0]">
                                <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A]">Menu Admin</h2>
                                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                                {sidebarItems.map((tab) => (
                                    <Link key={tab.id} href={tab.href} className="w-full flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                        <div className="flex items-center gap-3 w-full">
                                            <tab.icon size={20} className="text-slate-400" />
                                            <span>{tab.label}</span>
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-[#E2E8F0] space-y-1">
                                {bottomItems.map((item) => (
                                    <Link key={item.id} href={item.href} className={`w-full flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold ${item.active ? 'bg-[#E7F5EC] text-[#0D6A36]' : 'text-slate-600 hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-3 w-full">
                                            <item.icon size={20} className={item.active ? 'text-[#0D6A36]' : 'text-slate-400'} />
                                            <span>{item.label}</span>
                                        </div>
                                        {item.active && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full shrink-0" />}
                                    </Link>
                                ))}
                                <button onClick={(e) => { setIsMobileSidebarOpen(false); handleAdminLogout(e); }} className="w-full mt-1 flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50">
                                    <div className="flex items-center gap-3">
                                        <LogOut size={20} className="text-red-500" />
                                        <span>Keluar</span>
                                    </div>
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Top Bar */}
                <header className="hidden md:block sticky top-0 z-20 border-b border-[#E2E8F0] bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
                    <div className="px-8 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                                <Menu size={20} />
                            </button>
                            <h1 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-bold tracking-[-0.5px] text-[#171d19]">
                                Informasi Apotek
                            </h1>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center gap-3 rounded-xl border border-[#f1f5f9] bg-white p-2 pr-4 transition-all hover:border-[#006a3f] hover:shadow-sm">
                                <div className="text-right hidden md:block">
                                    <p className="font-['Roboto_Condensed',sans-serif] text-[15px] font-semibold text-[#171d19]">{auth?.user?.name || 'Admin'}</p>
                                    <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">Administrator</p>
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
                                    <button onClick={handleAdminLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-['Inter',sans-serif] text-[13px] font-medium text-[#ba1a1a] transition-all hover:bg-red-50">
                                        <LogOut size={16} /><span>Keluar</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-8">
                    {/* Section 1: Pharmacy Info */}
                    <form onSubmit={submitInfo} className="mx-auto max-w-[1000px] rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#006a3f] to-[#005632] shadow-lg">
                                <Building2 size={22} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-['Inter',sans-serif] text-[20px] font-bold text-[#171d19]">
                                    Data Publik Apotek
                                </h2>
                                <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                                    Informasi ini ditampilkan ke publik dan digunakan di seluruh halaman sistem.
                                </p>
                            </div>
                        </div>

                        {recentlySuccessful && (
                            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm font-medium text-green-700">
                                ✓ Informasi Apotek berhasil disimpan dan langsung aktif di seluruh halaman.
                            </div>
                        )}

                        <div className="space-y-5 border-t border-[#f1f5f9] pt-6">
                            {infoFields.map((field) => (
                                <div key={field.key}>
                                    <label className="mb-2 flex items-center gap-2 font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                        <field.icon size={13} />
                                        {field.label}
                                    </label>
                                    {field.multiline ? (
                                        <textarea
                                            value={data[field.key]}
                                            onChange={e => setData(field.key, e.target.value)}
                                            rows={3}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 resize-none"
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            value={data[field.key]}
                                            onChange={e => setData(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-6 mt-6">
                            <button type="submit" disabled={processing} className="rounded-xl bg-[#006a3f] px-6 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#005632] disabled:opacity-70">
                                {processing ? 'Menyimpan...' : 'Simpan Informasi Apotek'}
                            </button>
                        </div>
                    </form>

                    {/* Section 2: Global Discount */}
                    <form onSubmit={submitDiscount} className="mx-auto max-w-[1000px] rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                                <Tag size={22} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-['Inter',sans-serif] text-[20px] font-bold text-[#171d19]">
                                    Pengaturan Global Aplikasi
                                </h2>
                                <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                                    Kelola pengaturan yang berdampak pada pengalaman seluruh pengguna.
                                </p>
                            </div>
                        </div>

                        {discountSaved && (
                            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-sm font-medium text-green-700">
                                ✓ Pengaturan diskon berhasil disimpan.
                            </div>
                        )}

                        <div className="space-y-5 border-t border-[#f1f5f9] pt-6">
                            <div>
                                <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-[#6e7a70]">
                                    Potongan Harga (Diskon) Default Checkout & Keranjang
                                </label>
                                <div className="relative max-w-xs">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">Rp</span>
                                    <input
                                        type="number"
                                        value={discountData.discount}
                                        onChange={e => setDiscountData('discount', Number(e.target.value))}
                                        className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] pl-12 pr-4 py-3 font-['Inter',sans-serif] text-[14px] text-[#171d19] focus:border-[#006a3f] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20"
                                        min="0"
                                    />
                                </div>
                                <p className="mt-2 font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">
                                    Nilai diskon ini akan otomatis diterapkan ke semua transaksi keranjang dan checkout pelanggan.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-[#f1f5f9] pt-6 mt-6">
                            <button type="submit" disabled={processingDiscount} className="rounded-xl bg-[#006a3f] px-6 py-3 font-['Inter',sans-serif] text-[14px] font-semibold text-white transition-colors hover:bg-[#005632] disabled:opacity-70">
                                {processingDiscount ? 'Menyimpan...' : 'Simpan Pengaturan Diskon'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
        </div>
    );
}
