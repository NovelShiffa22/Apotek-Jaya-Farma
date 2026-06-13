import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Bell,
    Calendar,
    DollarSign,
    Edit2,
    Filter,
    LogOut,
    Mail,
    Package,
    Plus,
    Search,
    Shield,
    ShoppingBag,
    Trash2,
    TrendingDown,
    TrendingUp,
    UserCog,
    Users,
    X,
    Settings,
    Menu,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CreateProduct from './CreateProduct';
import CreateUser from './CreateUser';
import { router, usePage } from '@inertiajs/react';
import ConfirmModal from '../components/ConfirmModal';

interface AdminDashboardProps {
    products?: any[];
    categories?: any[];
    users?: any[];
    symptoms?: any[];
    orders?: any[];
    statusChanges?: any[];
}

export default function AdminDashboard({ products = [], categories = [], users = [], symptoms = [], orders = [], statusChanges = [] }: AdminDashboardProps) {
    const { auth } = usePage<any>().props;
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (statusChanges && statusChanges.length > 0) {
            const lastReadTime = localStorage.getItem('admin_notif_last_read') || '0';
            const readTimeMs = parseInt(lastReadTime, 10);

            const mapped = statusChanges.map((sc: any) => {
                const timeMs = new Date(sc.created_at).getTime();
                const pharmacistName = sc.changed_by_user?.name || 'Apoteker';
                const isSelf = sc.changed_by === auth?.user?.id;
                
                let text = '';
                const statusLabels: Record<string, string> = {
                    menunggu_pembayaran: 'Menunggu Pembayaran',
                    diproses: 'Diproses',
                    dikirim: 'Dikirim',
                    selesai: 'Selesai',
                    dibatalkan: 'Dibatalkan',
                };

                const displayStatus = statusLabels[sc.status_sesudah] || sc.status_sesudah;

                if (isSelf) {
                    text = `Anda mengubah status Pesanan #${sc.order?.kode_pesanan || sc.order_id} menjadi "${displayStatus}"`;
                } else {
                    text = `${pharmacistName} mengubah status Pesanan #${sc.order?.kode_pesanan || sc.order_id} menjadi "${displayStatus}"`;
                }

                const dateObj = new Date(sc.created_at);
                const timeFormatted = dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                return {
                    id: sc.id,
                    text,
                    time: timeFormatted,
                    isRead: timeMs <= readTimeMs,
                    orderId: sc.order_id,
                    timeMs
                };
            });

            setNotifications(mapped);
        }
    }, [statusChanges, auth?.user?.id]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllRead = () => {
        const maxTimeMs = Math.max(...notifications.map(n => n.timeMs), 0);
        localStorage.setItem('admin_notif_last_read', maxTimeMs.toString());
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<any>(null);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [userToDelete, setUserToDelete] = useState<any>(null);

    const [viewingOrder, setViewingOrder] = useState<any>(null);

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

    const [activeTab, setActiveTab] = useState<
        'analytics' | 'products' | 'orders' | 'users'
    >(() => {
        return (localStorage.getItem('adminDashboardTab') as any) || 'analytics';
    });

    useEffect(() => {
        localStorage.setItem('adminDashboardTab', activeTab);
    }, [activeTab]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<
        'all' | 'admin' | 'pharmacist' | 'user'
    >('all');
    const [productCategoryFilter, setProductCategoryFilter] = useState('all');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [orderDateFilter, setOrderDateFilter] = useState('');
    const [revenueFilterDays, setRevenueFilterDays] = useState(7);

    const updateOrderStatus = (orderId: number | string, status: string) => {
        router.put(`/admin/orders/${orderId}/status`, { status }, {
            preserveScroll: true
        });
    };

    // Compute chart data based on orders and filter
    const revenueChartData = (() => {
        const data = [];
        const now = new Date();
        for (let i = revenueFilterDays - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            
            const dayTotal = orders
                .filter((o) => o.status === 'selesai' && o.created_at?.startsWith(dateStr))
                .reduce((sum, o) => sum + parseFloat(o.total_biaya || 0), 0);
                
            data.push({
                date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
                total: dayTotal
            });
        }
        return data;
    })();
    const maxRevenue = Math.max(...revenueChartData.map(d => d.total), 1);

    const productsWithSales = products.map(product => {
        let sales = 0;
        orders.forEach(order => {
            if (order.status === 'selesai' && order.products) {
                order.products.forEach((op: any) => {
                    if (op.id === product.id) {
                        sales += op.pivot?.kuantitas || 0;
                    }
                });
            }
        });
        return { ...product, sales };
    });

    const statusConfig: Record<
        string,
        { label: string; color: string; bg: string; border: string }
    > = {
        menunggu_pembayaran: {
            label: 'Menunggu Pembayaran',
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
        },
        diproses: {
            label: 'Diproses',
            color: 'text-blue-700',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
        },
        dikirim: {
            label: 'Dikirim',
            color: 'text-indigo-700',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
        },
        selesai: {
            label: 'Selesai',
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
        },
        dibatalkan: {
            label: 'Dibatalkan',
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-50 border-b border-[#f1f5f9] bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-md">
                <div className="mx-auto max-w-[1600px] px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-['Roboto_Condensed',sans-serif] text-[32px] font-bold tracking-[-0.8px] text-[#171d19]">
                                Dashboard Admin
                            </h1>
                            <p className="mt-1 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                Kelola produk, pesanan, dan analitik
                            </p>
                        </div>

                        {/* Notification Bell */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="p-2.5 text-slate-400 hover:text-[#006a3f] hover:bg-slate-50 rounded-xl transition-all relative border border-[#f1f5f9] bg-white shadow-sm"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white border border-[#f1f5f9] rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 overflow-hidden py-1">
                                        <div className="px-4 py-3 border-b border-[#f1f5f9] flex justify-between items-center bg-[#f9fafb]">
                                            <span className="font-['Inter',sans-serif] font-bold text-sm text-slate-800">Notifikasi</span>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllRead}
                                                    className="text-xs font-semibold text-[#006a3f] hover:underline"
                                                >
                                                    Tandai dibaca
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-72 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notif: any) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-[#fafaf8] transition-colors text-left cursor-pointer ${
                                                            !notif.isRead ? 'bg-[#006a3f]/5' : ''
                                                        }`}
                                                        onClick={() => {
                                                            if (notif.orderId) {
                                                                const ord = orders.find((o: any) => o.id === notif.orderId);
                                                                if (ord) {
                                                                    setActiveTab('orders');
                                                                    setViewingOrder(ord);
                                                                }
                                                            }
                                                            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                                                            setIsNotifOpen(false);
                                                        }}
                                                    >
                                                        <p className="font-['Inter',sans-serif] text-xs text-slate-800 font-medium leading-relaxed">
                                                            {notif.text}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 mt-1 block">
                                                            {notif.time}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center text-slate-400 font-['Inter',sans-serif] text-xs">
                                                    Tidak ada notifikasi baru
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                                    <span className="font-['Roboto_Condensed',sans-serif] text-[15px] font-semibold text-gray-700">
                                        {auth?.user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'AD'}
                                    </span>
                                </div>
                            </button>

                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-[#f1f5f9] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50">
                                            <Link
                                                href="/admin/settings"
                                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:bg-[#f9fafb] hover:text-[#006a3f]"
                                            >
                                                <UserCog size={16} />
                                                <span>Setting Profile</span>
                                            </Link>
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
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] px-8 py-8">
                {/* Enhanced Tab Navigation */}
                <div className="mb-8 flex gap-3 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                    {[
                        {
                            id: 'analytics' as const,
                            label: 'Analitik',
                            icon: TrendingUp,
                        },
                        {
                            id: 'products' as const,
                            label: 'Produk & Stok',
                            icon: Package,
                        },
                        {
                            id: 'orders' as const,
                            label: 'Manajemen Pesanan',
                            icon: ShoppingBag,
                        },
                        {
                            id: 'users' as const,
                            label: 'Manajemen User',
                            icon: UserCog,
                        },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 rounded-xl px-6 py-3 font-['Inter',sans-serif] text-[14px] font-medium transition-all duration-200 shrink-0 ${
                                activeTab === tab.id
                                    ? 'bg-[#006a3f] text-white shadow-[0_4px_12px_rgba(0,106,63,0.25)]'
                                    : 'border border-[#f1f5f9] bg-white text-[#171d19] hover:border-[#006a3f] hover:shadow-sm'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}

                        </button>
                    ))}
                </div>

                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        {/* Enhanced Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(() => {
                                const completedOrders = orders.filter((o) => o.status === 'selesai');
                                const totalPenjualan = completedOrders.reduce((sum, o) => sum + parseFloat(o.total_biaya || 0), 0);
                                const jumlahTransaksi = completedOrders.length;
                                const pelangganAktif = users.filter((u) => u.role === 'user').length;
                                const avgOrderValue = jumlahTransaksi > 0 ? totalPenjualan / jumlahTransaksi : 0;

                                const formatCurrency = (value: number) => {
                                    if (value >= 1000000000) {
                                        const val = value / 1000000000;
                                        return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} M`;
                                    } else if (value >= 1000000) {
                                        const val = value / 1000000;
                                        return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} Jt`;
                                    } else if (value >= 1000) {
                                        const val = value / 1000;
                                        return `Rp ${val % 1 === 0 ? val : val.toFixed(1)} rb`;
                                    }
                                    return `Rp ${value.toLocaleString('id-ID')}`;
                                };

                                return [
                                    {
                                        label: 'Total Penjualan',
                                        value: formatCurrency(totalPenjualan),
                                        change: '+18.5%', // Data historis bisa ditambahkan nanti
                                        trend: 'up',
                                        icon: DollarSign,
                                        color: 'from-emerald-500 to-emerald-600',
                                    },
                                    {
                                        label: 'Jumlah Transaksi',
                                        value: jumlahTransaksi.toString(),
                                        change: '+12.3%',
                                        trend: 'up',
                                        icon: ShoppingBag,
                                        color: 'from-blue-500 to-blue-600',
                                    },
                                    {
                                        label: 'Pelanggan Aktif',
                                        value: pelangganAktif.toString(),
                                        change: '+8.7%',
                                        trend: 'up',
                                        icon: Users,
                                        color: 'from-purple-500 to-purple-600',
                                    },
                                    {
                                        label: 'Rata-rata Pesanan',
                                        value: formatCurrency(avgOrderValue),
                                        change: '-2.4%',
                                        trend: 'down',
                                        icon: TrendingDown,
                                        color: 'from-amber-500 to-amber-600',
                                    },
                                ];
                            })().map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div
                                            className={`h-12 w-12 bg-gradient-to-br ${stat.color} flex items-center justify-center rounded-xl shadow-lg`}
                                        >
                                            <stat.icon
                                                className="text-white"
                                                size={22}
                                            />
                                        </div>
                                        <div
                                            className={`flex items-center gap-1 rounded-md px-2 py-1 ${
                                                stat.trend === 'up'
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {stat.trend === 'up' ? (
                                                <TrendingUp size={12} />
                                            ) : (
                                                <TrendingDown size={12} />
                                            )}
                                            <span className="font-['Inter',sans-serif] text-[11px] font-semibold">
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mb-2 font-['Inter',sans-serif] text-[12px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                        {stat.label}
                                    </p>
                                    <p className="font-['Roboto_Condensed',sans-serif] text-[32px] font-semibold tracking-tight text-[#171d19]">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <div className="rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                        Tren Pendapatan
                                    </h3>
                                    <select 
                                        value={revenueFilterDays}
                                        onChange={(e) => setRevenueFilterDays(Number(e.target.value))}
                                        className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] focus:border-[#006a3f] focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                    >
                                        <option value={7}>7 Hari Terakhir</option>
                                        <option value={30}>30 Hari Terakhir</option>
                                        <option value={90}>90 Hari Terakhir</option>
                                    </select>
                                </div>
                                {/* Bar Chart Implementation */}
                                <div className={`flex h-64 items-end ${revenueFilterDays === 7 ? 'gap-4' : revenueFilterDays === 30 ? 'gap-1.5' : 'gap-[2px]'} rounded-xl border border-[#f1f5f9] bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] p-4 relative`}>
                                    {revenueChartData.map((item, idx) => (
                                        <div key={idx} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 hidden whitespace-nowrap rounded-md bg-[#171d19] px-2 py-1 text-xs text-white group-hover:block z-10">
                                                {item.date}: Rp {item.total.toLocaleString('id-ID')}
                                            </div>
                                            {/* Bar */}
                                            <div 
                                                className="w-full rounded-t-sm bg-gradient-to-t from-[#006a3f] to-[#00a86b] transition-all duration-300 hover:opacity-80"
                                                style={{ height: `${(item.total / maxRevenue) * 100}%`, minHeight: item.total > 0 ? '4px' : '0' }}
                                            />

                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Products */}
                            <div className="rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                                <h3 className="mb-6 font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                    Produk Terlaris
                                </h3>
                                <div className="space-y-4">
                                    {productsWithSales
                                        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                                        .slice(0, 5)
                                        .map((product, idx) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#006a3f] to-[#005632] font-['Inter',sans-serif] text-[12px] font-semibold text-white">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-['Roboto_Condensed',sans-serif] text-[15px] font-medium text-[#171d19]">
                                                        {product.nama_obat}
                                                    </p>
                                                    <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">
                                                        {product.sales || 0}{' '}
                                                        penjualan
                                                    </p>
                                                </div>
                                                <p className="font-['Roboto_Condensed',sans-serif] text-[14px] font-semibold text-[#006a3f]">
                                                    Rp{' '}
                                                    {(
                                                        product.harga *
                                                        (product.sales || 0)
                                                    ).toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Critical Stock Alert */}
                        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-amber-50 p-8 shadow-[0_8px_24px_rgba(239,68,68,0.08)]">
                            <div className="mb-6 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                                    <AlertTriangle
                                        className="text-white"
                                        size={28}
                                    />
                                </div>
                                <div>
                                    <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold tracking-[-0.6px] text-[#171d19]">
                                        Peringatan Stok Kritis
                                    </h2>
                                    <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                        {
                                            productsWithSales.filter((p) => p.stok <= (p.stok_minimum || 10))
                                                .length
                                        }{' '}
                                        produk memerlukan restock segera
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {productsWithSales
                                    .filter((p) => p.stok <= (p.stok_minimum || 10))
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className="rounded-xl border border-red-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="mb-1 font-['Roboto_Condensed',sans-serif] text-[18px] font-semibold text-[#171d19]">
                                                        {product.nama_obat}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-red-100">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600"
                                                                style={{
                                                                    width: `${(product.stok / (product.stok_minimum || 10)) * 100}%`,
                                                                    maxWidth: '100%'
                                                                }}
                                                            />
                                                        </div>
                                                        <p
                                                            className={`font-['Inter',sans-serif] text-[13px] font-semibold ${
                                                                product.stok < 10
                                                                    ? 'text-red-700'
                                                                    : 'text-amber-700'
                                                            }`}
                                                        >
                                                            {product.stok} unit
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setIsProductModalOpen(true);
                                                }}
                                                className="w-full rounded-lg bg-[#006a3f] px-4 py-2.5 font-['Inter',sans-serif] text-[13px] font-medium text-white transition-all hover:bg-[#005632] hover:shadow-lg"
                                            >
                                                Restock Sekarang
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        {/* Header Section */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] font-semibold tracking-[-0.7px] text-[#171d19]">
                                    Produk & Stok
                                </h2>
                                <p className="mt-1 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                    Kelola katalog obat dan pantau ketersediaan stok
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsProductModalOpen(true);
                                }}
                                className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#005632] hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)]"
                            >
                                <Plus size={18} />
                                <span className="font-['Roboto_Condensed',sans-serif] text-[14px] font-medium">
                                    Tambah Produk
                                </span>
                            </button>
                        </div>


                        {/* Search & Filter Bar */}
                        <div className="mb-6 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari produk..."
                                        className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-3 pr-4 pl-12 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#006a3f] focus:bg-white focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                    />
                                </div>
                                <select 
                                    value={productCategoryFilter}
                                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#006a3f] focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                >
                                    <option value="all">Semua Jenis Obat</option>
                                    <option value="bebas">Obat Bebas</option>
                                    <option value="terbatas">Obat Terbatas</option>
                                    <option value="keras">Obat Keras</option>
                                </select>
                            </div>
                        </div>

                        {/* Enhanced Product Table */}
                        <div className="overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#f1f5f9] bg-gradient-to-r from-[#f9fafb] to-[#f5f7f6]">
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Produk
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Kategori Induk
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Golongan Obat
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Stok
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Harga
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Penjualan
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Label Gejala
                                        </th>
                                        <th className="px-6 py-4 text-right font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsWithSales.filter(product => {
                                        const matchesSearch = product.nama_obat.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesCategory = productCategoryFilter === 'all' || product.jenis_obat === productCategoryFilter;
                                        return matchesSearch && matchesCategory;
                                    }).map((product) => (
                                        <tr
                                            key={product.id}
                                            className="border-b border-[#f1f5f9] transition-colors last:border-0 hover:bg-[#fafaf8]"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    {product.gambar ? (
                                                        <img 
                                                            src={product.gambar.startsWith('http') ? product.gambar : `/storage/${product.gambar}`} 
                                                            alt={product.nama_obat} 
                                                            className="h-12 w-12 shrink-0 rounded-lg object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 shrink-0 rounded-lg bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9]" />
                                                    )}
                                                    <p className="font-['Roboto_Condensed',sans-serif] text-[16px] font-medium text-[#171d19]">
                                                        {product.nama_obat}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                                {product.category?.nama_kategori || '-'}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium ${
                                                        product.jenis_obat ===
                                                        'bebas'
                                                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                            : product.jenis_obat ===
                                                                'keras'
                                                              ? 'border border-red-200 bg-red-50 text-red-700'
                                                              : 'border border-amber-200 bg-amber-50 text-amber-700'
                                                    }`}
                                                >
                                                    {product.jenis_obat ===
                                                    'bebas'
                                                        ? 'Bebas'
                                                        : product.jenis_obat ===
                                                            'keras'
                                                          ? 'Keras'
                                                          : 'Terbatas'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span
                                                    className={`font-['Inter',sans-serif] text-[14px] font-semibold ${
                                                        product.stok < 10
                                                            ? 'text-red-700'
                                                            : product.stok <
                                                                50
                                                                ? 'text-amber-700'
                                                                : 'text-emerald-700'
                                                    }`}
                                                >
                                                    {product.stok}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19]">
                                                Rp{' '}
                                                {parseFloat(product.harga).toLocaleString(
                                                    'id-ID',
                                                )}
                                            </td>
                                            <td className="px-6 py-5 font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                                {product.sales || 0} unit
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {(product.symptoms || []).map(
                                                        (symptom: any, idx: number) => (
                                                            <span
                                                                key={idx}
                                                                className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 font-['Inter',sans-serif] text-[11px] font-medium text-blue-700"
                                                            >
                                                                {symptom.nama_gejala || symptom}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    {/* REVISI: Tombol Edit Produk Diubah Menjadi Modal Trigger */}
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(product);
                                                            setIsProductModalOpen(true);
                                                        }}
                                                        className="group inline-block rounded-lg p-2 transition-colors hover:bg-[#f9fafb]"
                                                        title="Edit Produk"
                                                    >
                                                        <Edit2
                                                            size={16}
                                                            className="text-[#171d19] opacity-60 transition-colors group-hover:text-[#006a3f] group-hover:opacity-100"
                                                        />
                                                    </button>
                                                    <button 
                                                        onClick={() => setProductToDelete(product)}
                                                        className="group inline-block rounded-lg p-2 transition-colors hover:bg-red-50"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                            className="text-red-600 opacity-60 transition-opacity group-hover:opacity-100"
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <div className="mb-6">
                            <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] font-semibold tracking-[-0.7px] text-[#171d19]">
                                Manajemen Pesanan
                            </h2>
                            <p className="mt-1 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                Pantau pesanan, ubah status pengiriman, dan kelola transaksi
                            </p>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="mb-6 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari berdasarkan kode pesanan atau nama pelanggan..."
                                        className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-3 pr-4 pl-12 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#006a3f] focus:bg-white focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                    />
                                </div>
                                <input
                                    type="date"
                                    value={orderDateFilter}
                                    onChange={(e) => setOrderDateFilter(e.target.value)}
                                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#006a3f] focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                />
                                <select 
                                    value={orderStatusFilter}
                                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#006a3f] focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                >
                                    <option value="all">Semua Status</option>
                                    <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                                    <option value="diproses">Diproses</option>
                                    <option value="dikirim">Dikirim</option>
                                    <option value="selesai">Selesai</option>
                                    <option value="dibatalkan">Dibatalkan</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {orders.filter(order => {
                                const customerName = order.user?.name || '';
                                const orderCode = order.kode_pesanan || '';
                                const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                      orderCode.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
                                
                                let matchesDate = true;
                                if (orderDateFilter && order.created_at) {
                                    const d = new Date(order.created_at);
                                    const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                                    matchesDate = localDateStr === orderDateFilter;
                                }
                                
                                return matchesSearch && matchesStatus && matchesDate;
                            }).map((order) => {
                                const config = statusConfig[order.status] || { bg: 'bg-gray-50', color: 'text-gray-700', border: 'border-gray-200' };
                                return (
                                    <div
                                        key={order.id}
                                        className="rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center flex-1 gap-4 md:gap-6">
                                                {/* Order Info */}
                                                <div className="flex-1 min-w-[200px]">
                                                    <div className="flex items-center flex-wrap gap-2 mb-1">
                                                        <p className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                                            {order.kode_pesanan}
                                                        </p>
                                                        {order.prescription && (
                                                            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                                                                Resep Terlampir
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70] truncate">
                                                        {order.user?.name || 'Guest'} •{' '}
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                    </p>
                                                </div>

                                                {/* Items Count */}
                                                <div className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2 w-full sm:w-20 shrink-0">
                                                    <p className="mb-0.5 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                                        Items
                                                    </p>
                                                    <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-semibold text-[#171d19]">
                                                        {order.products ? order.products.length : 0}
                                                    </p>
                                                </div>

                                                {/* Total */}
                                                <div className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2 w-full sm:w-36 shrink-0">
                                                    <p className="mb-0.5 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                                        Total
                                                    </p>
                                                    <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-semibold text-[#006a3f] truncate">
                                                        Rp{' '}
                                                        {parseFloat(order.total_biaya || 0).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-between sm:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-[#f1f5f9]">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                    className={`w-full sm:w-[190px] rounded-xl border-2 px-3 py-2.5 font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none ${config.bg} ${config.color} ${config.border}`}
                                                >
                                                    <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                                                    <option value="diproses">Diproses</option>
                                                    <option value="dikirim">Dikirim</option>
                                                    <option value="selesai">Selesai</option>
                                                    <option value="dibatalkan">Dibatalkan</option>
                                                </select>
 
                                                <button 
                                                    onClick={() => setViewingOrder(order)}
                                                    className="w-full sm:w-auto justify-center rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-2.5 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:border-[#006a3f] hover:bg-white flex items-center"
                                                >
                                                    Detail
                                                </button>
                                            </div>
                                        </div>

                                        {/* Status Change History Timeline */}
                                        {order.status_histories && order.status_histories.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-dashed border-[#e2e8f0]">
                                                <p className="font-['Inter',sans-serif] text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                                    Riwayat Status ({order.status_histories.length})
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.status_histories.map((hist: any, hIdx: number) => {
                                                        const statusLabels: Record<string, string> = {
                                                            menunggu_pembayaran: 'Menunggu Pembayaran',
                                                            diproses: 'Diproses',
                                                            dikirim: 'Dikirim',
                                                            selesai: 'Selesai',
                                                            dibatalkan: 'Dibatalkan',
                                                        };
                                                        return (
                                                            <span key={hIdx} className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-['Inter',sans-serif] text-slate-600">
                                                                <span className="font-semibold text-slate-800">{statusLabels[hist.status_sesudah] || hist.status_sesudah}</span>
                                                                <span className="text-slate-400">oleh</span>
                                                                <span className="font-bold text-[#006a3f]">{hist.changed_by_user?.name || 'Sistem'}</span>
                                                                <span className="text-[10px] text-slate-400">({new Date(hist.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})})</span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        {/* Header Section */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] font-semibold tracking-[-0.7px] text-[#171d19]">
                                    Manajemen User
                                </h2>
                                <p className="mt-1 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                    Kelola akses dan peran pengguna sistem
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setEditingUser(null);
                                    setIsUserModalOpen(true);
                                }}
                                className="flex items-center gap-2 rounded-xl bg-[#006a3f] px-6 py-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#005632] hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)]"
                            >
                                <Plus size={18} />
                                <span className="font-['Roboto_Condensed',sans-serif] text-[14px] font-medium">
                                    Tambah User Baru
                                </span>
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    label: 'Total Users',
                                    value: users.length,
                                    icon: Users,
                                    color: 'from-blue-500 to-blue-600',
                                    bg: 'bg-blue-50',
                                    text: 'text-blue-700',
                                },
                                {
                                    label: 'Admin',
                                    value: users.filter(
                                        (u) => u.role === 'admin',
                                    ).length,
                                    icon: Shield,
                                    color: 'from-purple-500 to-purple-600',
                                    bg: 'bg-purple-50',
                                    text: 'text-purple-700',
                                },
                                {
                                    label: 'Apoteker',
                                    value: users.filter(
                                        (u) => u.role === 'pharmacist',
                                    ).length,
                                    icon: UserCog,
                                    color: 'from-emerald-500 to-emerald-600',
                                    bg: 'bg-emerald-50',
                                    text: 'text-emerald-700',
                                },
                                {
                                    label: 'Pelanggan',
                                    value: users.filter(
                                        (u) => u.role === 'user',
                                    ).length,
                                    icon: Users,
                                    color: 'from-amber-500 to-amber-600',
                                    bg: 'bg-amber-50',
                                    text: 'text-amber-700',
                                },
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <div
                                            className={`h-12 w-12 bg-gradient-to-br ${stat.color} flex items-center justify-center rounded-xl shadow-lg`}
                                        >
                                            <stat.icon
                                                className="text-white"
                                                size={22}
                                            />
                                        </div>
                                    </div>
                                    <p className="mb-2 font-['Inter',sans-serif] text-[12px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                        {stat.label}
                                    </p>
                                    <p className="font-['Roboto_Condensed',sans-serif] text-[32px] font-semibold tracking-tight text-[#171d19]">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="mb-6 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari berdasarkan nama atau email..."
                                        className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-3 pr-4 pl-12 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#006a3f] focus:bg-white focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                    />
                                </div>
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value as any)
                                    }
                                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#006a3f] focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                >
                                    <option value="all">Semua Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="pharmacist">Apoteker</option>
                                    <option value="user">Pelanggan</option>
                                </select>
                            </div>
                        </div>

                        {/* User Table */}
                        <div className="overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#f1f5f9] bg-gradient-to-r from-[#f9fafb] to-[#f5f7f6]">
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Bergabung
                                        </th>
                                        <th className="px-6 py-4 text-left font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Terakhir Aktif
                                        </th>
                                        <th className="px-6 py-4 text-right font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users
                                        .filter((user) => {
                                            const matchesSearch =
                                                user.name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase(),
                                                    ) ||
                                                user.email
                                                    .toLowerCase()
                                                    .includes(
                                                        searchQuery.toLowerCase(),
                                                    );
                                            const matchesRole =
                                                roleFilter === 'all' ||
                                                user.role === roleFilter;
                                            return matchesSearch && matchesRole;
                                        })
                                        .map((user) => {
                                            const roleConfig = {
                                                admin: {
                                                    label: 'Admin',
                                                    bg: 'bg-purple-50',
                                                    text: 'text-purple-700',
                                                    border: 'border-purple-200',
                                                    icon: Shield,
                                                },
                                                pharmacist: {
                                                    label: 'Apoteker',
                                                    bg: 'bg-emerald-50',
                                                    text: 'text-emerald-700',
                                                    border: 'border-emerald-200',
                                                    icon: UserCog,
                                                },
                                                user: {
                                                    label: 'Pelanggan',
                                                    bg: 'bg-blue-50',
                                                    text: 'text-blue-700',
                                                    border: 'border-blue-200',
                                                    icon: Users,
                                                },
                                            }[
                                                user.role as
                                                    | 'admin'
                                                    | 'pharmacist'
                                                    | 'user'
                                            ] || {
                                                label: 'Pelanggan',
                                                bg: 'bg-blue-50',
                                                text: 'text-blue-700',
                                                border: 'border-blue-200',
                                                icon: Users,
                                            };

                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-[#f1f5f9] transition-colors last:border-0 hover:bg-[#fafaf8]"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#006a3f] to-[#005632]">
                                                                <span className="font-['Roboto_Condensed',sans-serif] text-[14px] font-semibold text-white">
                                                                    {user.name
                                                                        .split(
                                                                            ' ',
                                                                        )
                                                                        .map(
                                                                            (
                                                                                n,
                                                                            ) =>
                                                                                n[0],
                                                                        )
                                                                        .join(
                                                                            '',
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            2,
                                                                        )}
                                                                </span>
                                                            </div>
                                                            <p className="font-['Roboto_Condensed',sans-serif] text-[16px] font-medium text-[#171d19]">
                                                                {user.name}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <Mail
                                                                size={14}
                                                                className="text-[#6e7a70]"
                                                            />
                                                            <span className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div
                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${roleConfig.bg} ${roleConfig.text} border ${roleConfig.border}`}
                                                        >
                                                            <roleConfig.icon
                                                                size={14}
                                                            />
                                                            <span className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase">
                                                                {
                                                                    roleConfig.label
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-block rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase ${
                                                                (user.status || 'active') ===
                                                                'active'
                                                                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                                                    : 'border border-red-200 bg-red-50 text-red-700'
                                                            }`}
                                                        >
                                                            {(user.status || 'active') ===
                                                            'active'
                                                                ? 'Aktif'
                                                                : 'Nonaktif'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar
                                                                size={14}
                                                                className="text-[#6e7a70]"
                                                            />
                                                            <span className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41]">
                                                                {new Date(
                                                                    user.created_at || new Date(),
                                                                ).toLocaleDateString(
                                                                    'id-ID',
                                                                    {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    },
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                                                        {new Date(user.updated_at || new Date()).toLocaleString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser(user);
                                                                    setIsUserModalOpen(true);
                                                                }}
                                                                className="group inline-block rounded-lg p-2 transition-colors hover:bg-[#f9fafb]"
                                                                title="Edit user"
                                                            >
                                                                <Edit2
                                                                    size={16}
                                                                    className="text-[#171d19] opacity-60 transition-colors group-hover:text-[#006a3f] group-hover:opacity-100"
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() => setUserToDelete(user)}
                                                                className="group rounded-lg p-2 transition-colors hover:bg-red-50"
                                                                title="Hapus user"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                    className="text-red-600 opacity-60 transition-opacity group-hover:opacity-100"
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {users.filter((user) => {
                            const matchesSearch =
                                user.name
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase()) ||
                                user.email
                                    .toLowerCase()
                                    .includes(searchQuery.toLowerCase());
                            const matchesRole =
                                roleFilter === 'all' ||
                                user.role === roleFilter;
                            return matchesSearch && matchesRole;
                        }).length === 0 && (
                            <div className="rounded-2xl border border-[#f1f5f9] bg-white p-16 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f9fafb]">
                                    <Users
                                        size={32}
                                        className="text-[#6e7a70]"
                                    />
                                </div>
                                <h3 className="mb-2 font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                    Tidak ada user ditemukan
                                </h3>
                                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                                    Coba ubah filter atau kata kunci pencarian
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modal Tambah/Edit Produk */}
            <CreateProduct 
                key={editingProduct ? editingProduct.id : 'create'}
                isOpen={isProductModalOpen} 
                onClose={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                }} 
                isEdit={!!editingProduct} 
                initialData={editingProduct} 
                categories={categories}
                symptoms={symptoms}
            />

            {/* Modal Konfirmasi Hapus Produk Minimalist */}
            {productToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-6">
                    <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
                        <h3 className="mb-2 font-['Poppins',sans-serif] text-[15px] font-semibold text-[#171d19]">
                            Konfirmasi Hapus
                        </h3>
                        <p className="mb-5 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                            Apakah Anda yakin ingin menghapus produk?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="rounded-lg px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-[#6e7a70] transition-colors hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    router.delete(`/admin/products/${productToDelete.id}`);
                                    setProductToDelete(null);
                                }}
                                className="rounded-lg bg-red-600 px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tambah/Edit User */}
            <CreateUser 
                key={editingUser ? editingUser.id : 'create-user'}
                isOpen={isUserModalOpen} 
                onClose={() => {
                    setIsUserModalOpen(false);
                    setEditingUser(null);
                }} 
                isEdit={!!editingUser} 
                initialData={editingUser} 
            />

            {/* Modal Konfirmasi Hapus User Minimalist */}
            {userToDelete && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-6">
                    <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
                        <h3 className="mb-2 font-['Poppins',sans-serif] text-[15px] font-semibold text-[#171d19]">
                            Konfirmasi Hapus
                        </h3>
                        <p className="mb-5 font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                            Apakah Anda yakin ingin menghapus akun user ini?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="rounded-lg px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-[#6e7a70] transition-colors hover:bg-gray-100"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => {
                                    router.delete(`/admin/users/${userToDelete.id}`);
                                    setUserToDelete(null);
                                }}
                                className="rounded-lg bg-red-600 px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detail Pesanan */}
            {viewingOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6 my-6">
                        <button
                            onClick={() => setViewingOrder(null)}
                            className="absolute right-4 top-4 rounded-full bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
                        >
                            <X size={16} />
                        </button>
                        
                        <div className="mb-5">
                            <h2 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                {viewingOrder.kode_pesanan}
                            </h2>
                            <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                                {new Date(viewingOrder.created_at).toLocaleString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* User Info - Simplified */}
                            <div className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">Pelanggan</span>
                                        <span className="font-['Inter',sans-serif] text-[12px] font-medium text-[#171d19] text-right">{viewingOrder.user?.name || 'Guest'}</span>
                                    </div>
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">Pembayaran</span>
                                        <span className="font-['Inter',sans-serif] text-[12px] font-medium text-[#171d19] text-right">{viewingOrder.payment_method || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70] shrink-0">Alamat</span>
                                        <span className="font-['Inter',sans-serif] text-[12px] font-medium text-[#171d19] text-right line-clamp-2" title={viewingOrder.address?.alamat_lengkap || 'Ambil di Apotek'}>{viewingOrder.address?.alamat_lengkap || 'Ambil di Apotek'}</span>
                                    </div>
                                    {viewingOrder.prescription && (
                                        <div className="flex justify-between items-start gap-4 pt-2 mt-2 border-t border-[#f1f5f9]">
                                            <span className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70] shrink-0">Resep Dokter</span>
                                            <div className="text-right">
                                                <span className="font-['Inter',sans-serif] text-[12px] font-medium text-[#171d19] block">{viewingOrder.prescription.kode_resep}</span>
                                                <a 
                                                    href={viewingOrder.prescription.file_foto?.startsWith('http') ? viewingOrder.prescription.file_foto : `/storage/${viewingOrder.prescription.file_foto}`} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="inline-block mt-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline"
                                                >
                                                    Lihat Foto Resep
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="mb-2 font-['Inter',sans-serif] text-[12px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                    Item ({viewingOrder.products?.length || 0})
                                </h3>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                    {viewingOrder.products?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                                            <div className="flex items-center gap-3">
                                                {item.gambar ? (
                                                    <img src={item.gambar.startsWith('http') ? item.gambar : `/storage/${item.gambar}`} alt={item.nama_obat} className="h-10 w-10 rounded-md object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-md bg-gray-100" />
                                                )}
                                                <div>
                                                    <p className="font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] line-clamp-1">{item.nama_obat}</p>
                                                    <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70]">
                                                        {item.pivot.kuantitas} x Rp {parseFloat(item.pivot.harga_satuan).toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status History Timeline */}
                            {viewingOrder.status_histories && viewingOrder.status_histories.length > 0 && (
                                <div>
                                    <h3 className="mb-3 font-['Inter',sans-serif] text-[12px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                        Riwayat Perubahan Status
                                    </h3>
                                    <div className="relative space-y-0 max-h-[200px] overflow-y-auto pr-1">
                                        {viewingOrder.status_histories.map((history: any, idx: number) => {
                                            const statusLabels: Record<string, string> = {
                                                menunggu_pembayaran: 'Menunggu Pembayaran',
                                                diproses: 'Diproses',
                                                dikirim: 'Dikirim',
                                                selesai: 'Selesai',
                                                dibatalkan: 'Dibatalkan',
                                            };
                                            const statusColors: Record<string, string> = {
                                                menunggu_pembayaran: 'bg-amber-500',
                                                diproses: 'bg-blue-500',
                                                dikirim: 'bg-indigo-500',
                                                selesai: 'bg-emerald-500',
                                                dibatalkan: 'bg-red-500',
                                            };
                                            const dotColor = statusColors[history.status_sesudah] || 'bg-gray-400';
                                            return (
                                                <div key={idx} className="flex gap-3 pb-3 last:pb-0">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${dotColor}`} />
                                                        {idx < viewingOrder.status_histories.length - 1 && (
                                                            <div className="w-px flex-1 bg-gray-200 mt-1" />
                                                        )}
                                                    </div>
                                                    <div className="pb-1">
                                                        <p className="font-['Inter',sans-serif] text-[12px] font-semibold text-[#171d19]">
                                                            {history.status_sebelum
                                                                ? `${statusLabels[history.status_sebelum] || history.status_sebelum} → ${statusLabels[history.status_sesudah] || history.status_sesudah}`
                                                                : statusLabels[history.status_sesudah] || history.status_sesudah
                                                            }
                                                        </p>
                                                        <p className="font-['Inter',sans-serif] text-[11px] text-[#6e7a70]">
                                                            {history.changed_by_user?.name || 'Sistem'} &bull;{' '}
                                                            {new Date(history.created_at).toLocaleString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19]">Total Pembayaran</span>
                                <span className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#006a3f]">
                                    Rp {parseFloat(viewingOrder.total_biaya || 0).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
        </div>
    );
}

