import { Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { id as localeID } from 'date-fns/locale';
import InputMask from 'react-input-mask';
import {
    AlertTriangle,
    AlertCircle,
    Bell,
    Calendar,
    Eye,
    DollarSign,
    Edit2,
    FileText,
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
    List,
    Clock,
    Loader,
    Truck,
    CheckCircle,
    XCircle,
    Building2,
    Check,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import CreateProduct from './CreateProduct';
import CreateUser from './CreateUser';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const DynamicPlaceholderInput = React.forwardRef(({ defaultPlaceholder, formatPlaceholder, ...props }: any, ref: any) => {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(defaultPlaceholder);
    return (
        <InputMask 
            {...props} 
            ref={ref} 
            mask="99/99/9999"
            maskChar={null}
            placeholder={currentPlaceholder} 
            onFocus={(e) => {
                setCurrentPlaceholder(formatPlaceholder);
                if (props.onFocus) props.onFocus(e);
            }}
            onBlur={(e) => {
                if (!e.target.value) {
                    setCurrentPlaceholder(defaultPlaceholder);
                }
                if (props.onBlur) props.onBlur(e);
            }}
        />
    );
});

interface AdminDashboardProps {
    products?: any;
    categories?: any[];
    users?: any;
    symptoms?: any[];
    orders?: any;
    statusChanges?: any[];
    stockHistories?: any[];
    analytics?: any;
    prescriptions?: any;
    defaultTab?: string;
}

export default function AdminDashboard({ products = [], categories = [], users = [], symptoms = [], orders = [], statusChanges = [], stockHistories = [], analytics = {}, prescriptions = [], defaultTab }: AdminDashboardProps) {
    const { auth } = usePage<any>().props;
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('adminNotifications');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminNotifications', JSON.stringify(notifications));
        }
    }, [notifications]);

    useEffect(() => {
        if (!auth?.user?.id) return;

        axios.get('/api/notifications').then((res) => {
            const mappedNotifs = res.data.map((n: any) => ({
                id: n.id,
                type: n.data.type || n.type,
                title: n.data.title || 'Notifikasi Baru',
                text: n.data.message,
                time: new Date(n.created_at).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                isRead: n.read_at !== null,
                orderId: n.data.order_id || n.data.invoice_number || null,
                prescriptionId: n.data.prescription_id || null,
                timeMs: new Date(n.created_at).getTime(),
                data: n.data
            }));
            setNotifications(mappedNotifs);
        }).catch(err => console.error(err));
    }, [auth?.user?.id]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllRead = async () => {
        const unreadNotifs = notifications.filter(n => !n.isRead);
        if (unreadNotifs.length === 0) return;
        
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            window.dispatchEvent(new CustomEvent('notificationsUpdated'));
            
            // Send requests
            await Promise.all(unreadNotifs.map(n => axios.patch(`/api/notifications/${n.id}/read`)));
        } catch (e) {
            console.error("Failed to mark all as read", e);
        }
    };

    // Listen to realtime broadcast notifications
    useEffect(() => {
        if (window.Echo && auth?.user?.id) {
            window.Echo.private(`App.Models.User.${auth.user.id}`)
                .notification((notification: any) => {
                    setNotifications(prev => [{
                        id: notification.id || Date.now(),
                        title: notification.title || 'Notifikasi Baru',
                        text: notification.message,
                        time: 'Baru saja',
                        isRead: false,
                        orderId: notification.order_id || notification.invoice_number || null,
                        prescriptionId: notification.prescription_id || null,
                        timeMs: Date.now(),
                        data: notification
                    }, ...prev]);
                    window.dispatchEvent(new CustomEvent('notificationsUpdated'));
                });
        }
        return () => {
            if (window.Echo && auth?.user?.id) {
                window.Echo.leave(`App.Models.User.${auth.user.id}`);
            }
        };
    }, [auth?.user?.id]);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [selectedUserActivities, setSelectedUserActivities] = useState<any[]>([]);
    const [selectedUserForActivity, setSelectedUserForActivity] = useState<any>(null);
    const [isFetchingActivities, setIsFetchingActivities] = useState(false);

    const fetchUserActivities = async (user: any) => {
        setSelectedUserForActivity(user);
        setIsFetchingActivities(true);
        setIsActivityModalOpen(true);
        try {
            const response = await fetch(`/admin/users/${user.id}/activities`);
            const data = await response.json();
            setSelectedUserActivities(data);
        } catch (error) {
            console.error('Failed to fetch user activities:', error);
        } finally {
            setIsFetchingActivities(false);
        }
    };

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

    const [activeTab, setActiveTab] = useState<
        'analytics' | 'products' | 'orders' | 'users' | 'prescriptions' | 'notifications'
    >(() => {
        if (defaultTab) return defaultTab as any;
        const validTabs = ['analytics', 'products', 'orders', 'users', 'prescriptions', 'notifications'];
        const urlTab = new URLSearchParams(window.location.search).get('tab');
        if (urlTab && validTabs.includes(urlTab)) return urlTab as any;
        return (localStorage.getItem('adminDashboardTab') as any) || 'analytics';
    });

    useEffect(() => {
        localStorage.setItem('adminDashboardTab', activeTab);
    }, [activeTab]);
    const urlParams = new URLSearchParams(window.location.search);
    
    const [searchQuery, setSearchQuery] = useState(urlParams.get('user_search') || '');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'pharmacist' | 'user'>(
        (urlParams.get('user_role') as any) || 'all'
    );

    const [productSearchQuery, setProductSearchQuery] = useState(urlParams.get('product_search') || '');
    const [productCategoryFilter, setProductCategoryFilter] = useState(urlParams.get('product_category') || 'all');
    const [orderSearchQuery, setOrderSearchQuery] = useState(urlParams.get('order_search') || '');
    const [orderStatusFilter, setOrderStatusFilter] = useState(urlParams.get('order_status') || 'all');
    const [orderStartDate, setOrderStartDate] = useState<Date | null>(null);
    const [orderEndDate, setOrderEndDate] = useState<Date | null>(null);
    const [revenueFilterDays, setRevenueFilterDays] = useState(7);
    const [prescriptionSearchQuery, setPrescriptionSearchQuery] = useState(urlParams.get('prescription_search') || '');
    const [prescriptionStatusFilter, setPrescriptionStatusFilter] = useState(urlParams.get('prescription_status') || 'menunggu');
    const [prescriptionStartDate, setPrescriptionStartDate] = useState<Date | null>(null);
    const [prescriptionEndDate, setPrescriptionEndDate] = useState<Date | null>(null);

    const updateOrderStatus = (orderId: number | string, status: string) => {
        router.put(`/admin/orders/${orderId}/status`, { status }, {
            preserveScroll: true
        });
    };

    // Use server-side chart data
    const revenueChartData = analytics?.revenue_chart_data || [];
    const maxRevenue = Math.max(...revenueChartData.map((d: any) => d.total), 1);
    const productsWithSales = analytics?.top_products || [];

    // Fetch data using Inertia router when filters change
    useEffect(() => {
        // Debounce to avoid too many requests while typing
        const handler = setTimeout(() => {
            const params: any = {};
            
            if (searchQuery) params.user_search = searchQuery;
            if (roleFilter !== 'all') params.user_role = roleFilter;
            
            if (productSearchQuery) params.product_search = productSearchQuery;
            if (productCategoryFilter !== 'all') params.product_category = productCategoryFilter;
            
            if (orderSearchQuery) params.order_search = orderSearchQuery;
            if (orderStatusFilter !== 'all') params.order_status = orderStatusFilter;
            if (orderStartDate && orderEndDate) {
                const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                params.order_date = `${format(orderStartDate)},${format(orderEndDate)}`;
            } else if (orderStartDate) {
                const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                params.order_date = `${format(orderStartDate)}`;
            } else if (orderEndDate) {
                const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                params.order_date = `${format(orderEndDate)}`;
            }

            if (prescriptionSearchQuery) params.prescription_search = prescriptionSearchQuery;
            if (prescriptionStatusFilter !== 'all') params.prescription_status = prescriptionStatusFilter;
            if (prescriptionStartDate && prescriptionEndDate) {
                const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                params.prescription_date = `${format(prescriptionStartDate)},${format(prescriptionEndDate)}`;
            } else if (prescriptionStartDate) {
                const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                params.prescription_date = `${format(prescriptionStartDate)}`;
            } else if (prescriptionEndDate) {
                const format = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                params.prescription_date = `${format(prescriptionEndDate)}`;
            }

            // Use Inertia to reload the current page with new query params
            router.get('/admin', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['users', 'orders', 'products', 'prescriptions', 'analytics']
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery, roleFilter, productSearchQuery, productCategoryFilter, orderSearchQuery, orderStatusFilter, orderStartDate, orderEndDate, prescriptionSearchQuery, prescriptionStatusFilter, prescriptionStartDate, prescriptionEndDate]);

    // Fetch analytics data when revenue filter changes
    useEffect(() => {
        const handler = setTimeout(() => {
            const params: any = {};
            if (revenueFilterDays !== 7) params.revenue_days = revenueFilterDays;
            
            router.get('/admin', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['analytics']
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [revenueFilterDays]);

    const statusConfig: Record<
        string,
        { label: string; color: string; bg: string; border: string; icon?: any }
    > = {
        menunggu_pembayaran: {
            label: 'Menunggu Pembayaran',
            color: 'text-amber-700',
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            icon: Clock,
        },
        diproses: {
            label: 'Diproses',
            color: 'text-blue-700',
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: Package,
        },
        dikirim: {
            label: 'Dikirim',
            color: 'text-indigo-700',
            bg: 'bg-indigo-50',
            border: 'border-indigo-200',
            icon: Truck,
        },
        selesai: {
            label: 'Selesai',
            color: 'text-emerald-700',
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            icon: CheckCircle,
        },
        dibatalkan: {
            label: 'Dibatalkan',
            color: 'text-red-700',
            bg: 'bg-red-50',
            border: 'border-red-200',
            icon: XCircle,
        },
    };

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] w-full max-w-full overflow-x-hidden">
            {/* Sidebar Navigation */}
            <aside className={`hidden md:flex fixed left-0 top-0 h-screen z-40 bg-white border-r border-slate-100 flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <div>
                    {/* Logo Brand */}
                    <div className="flex items-center justify-center gap-3 px-4 h-16 border-b border-slate-100">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#1e5b53] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)] shrink-0">
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
                        {[
                            { id: 'analytics' as const, label: 'Analitik', icon: TrendingUp },
                            { id: 'prescriptions' as const, label: 'Manajemen Resep', icon: FileText },
                            { id: 'orders' as const, label: 'Manajemen Pesanan', icon: ShoppingBag },
                            { id: 'products' as const, label: 'Produk & Stok', icon: Package },
                            { id: 'users' as const, label: 'Manajemen User', icon: UserCog },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                title={isCollapsed ? tab.label : undefined}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 relative group ${
                                    activeTab === tab.id
                                        ? 'bg-[#E7F5EC] text-[#0D6A36]'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 w-full'}`}>
                                    <tab.icon size={20} className={activeTab === tab.id ? 'text-[#0D6A36]' : 'text-slate-400'} />
                                    {!isCollapsed && <span className="whitespace-nowrap">{tab.label}</span>}
                                </div>
                                {activeTab === tab.id && !isCollapsed && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full shrink-0" />}
                                {activeTab === tab.id && isCollapsed && <div className="absolute left-0 w-1 h-5 bg-[#0D6A36] rounded-r-full shrink-0" />}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-[#E2E8F0] space-y-1">
                    <Link
                        href="/admin/settings"
                        title={isCollapsed ? "Pengaturan Profil" : undefined}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200`}
                    >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                            <Settings size={20} className="text-slate-400" />
                            {!isCollapsed && <span className="whitespace-nowrap">Pengaturan Profil</span>}
                        </div>
                    </Link>
                    <Link
                        href="/admin/pharmacy-info"
                        title={isCollapsed ? "Informasi Apotek" : undefined}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200`}
                    >
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                            <Building2 size={20} className="text-slate-400" />
                            {!isCollapsed && <span className="whitespace-nowrap">Informasi Apotek</span>}
                        </div>
                    </Link>
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
            <div className={`flex-1 h-screen overflow-y-auto w-full bg-slate-50 flex flex-col min-w-0 transition-all duration-300 max-w-full overflow-x-hidden ${isCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between px-6 h-16 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-[#1e5b53] to-[#005632] rounded-lg flex items-center justify-center shrink-0">
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
                            <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100">
                                <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A]">Menu Admin</h2>
                                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                                {[
                                    { id: 'analytics' as const, label: 'Analitik', icon: TrendingUp },
                                    { id: 'prescriptions' as const, label: 'Manajemen Resep', icon: FileText },
                                    { id: 'orders' as const, label: 'Manajemen Pesanan', icon: ShoppingBag },
                                    { id: 'products' as const, label: 'Produk & Stok', icon: Package },
                                    { id: 'users' as const, label: 'Manajemen User', icon: UserCog },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => { setActiveTab(tab.id); setIsMobileSidebarOpen(false); }}
                                        className={`w-full flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                                            activeTab === tab.id
                                                ? 'bg-[#E7F5EC] text-[#0D6A36]'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <tab.icon size={20} className={activeTab === tab.id ? 'text-[#0D6A36]' : 'text-slate-400'} />
                                            <span>{tab.label}</span>
                                        </div>
                                        {activeTab === tab.id && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full shrink-0" />}
                                    </button>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-[#E2E8F0] space-y-1">
                                <Link
                                    href="/admin/settings"
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="w-full flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings size={20} className="text-slate-400" />
                                        <span>Pengaturan Profil</span>
                                    </div>
                                </Link>
                                <Link
                                    href="/admin/pharmacy-info"
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="w-full flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Building2 size={20} className="text-slate-400" />
                                        <span>Informasi Apotek</span>
                                    </div>
                                </Link>
                                <button
                                    onClick={(e) => { setIsMobileSidebarOpen(false); handleAdminLogout(e); }}
                                    className="w-full mt-1 flex items-center px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut size={20} className="text-red-500" />
                                        <span>Keluar</span>
                                    </div>
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Enhanced Top Bar */}
                <header className="hidden md:block sticky top-0 z-20 border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-md">
                    <div className="px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <div></div>
                        </div>

                        {/* Notification Bell */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Link
                                    href="/admin/notifications"
                                    className="p-2.5 text-slate-400 hover:text-[#1e5b53] hover:bg-slate-50 rounded-xl transition-all relative border border-[#f1f5f9] bg-white shadow-sm flex items-center justify-center"
                                >
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-3 rounded-xl border border-[#f1f5f9] bg-white p-2 pr-4 transition-all hover:border-[#1e5b53] hover:shadow-sm"
                            >
                                <div className="text-right hidden md:block">
                                    <p className="font-['Roboto_Condensed',sans-serif] text-sm font-semibold text-[#171d19]">
                                        {auth?.user?.name || 'Admin'}
                                    </p>
                                    <p className="font-['Inter',sans-serif] text-xs text-slate-500">
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
                                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:bg-[#f9fafb] hover:text-[#1e5b53]"
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
                </header>

                <main className="p-8 overflow-x-hidden">

                {activeTab === 'notifications' && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="font-['Poppins',sans-serif] text-[28px] font-bold text-[#171d19] tracking-tight">
                                Rekap Notifikasi Admin
                            </h1>
                            <button 
                                onClick={markAllRead}
                                disabled={notifications.length === 0 || !notifications.some(n => !n.isRead)}
                                className={`font-['Poppins',sans-serif] text-[14px] font-bold transition-opacity ${
                                    notifications.length === 0 || !notifications.some(n => !n.isRead) 
                                        ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                        : 'text-[#1e5b53] hover:underline'
                                }`}
                            >
                                Tandai semua telah dibaca
                            </button>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 opacity-80">
                                <Bell className="text-gray-300 w-20 h-20 mb-4" />
                                <p className="text-gray-500 font-['Poppins',sans-serif] text-lg text-center">Kotak masukmu bersih! Belum ada tugas atau peringatan stok baru saat ini</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notifications.map(notif => (
                                    <Link 
                                        href={notif.data?.url || '#'}
                                        key={notif.id} 
                                        onClick={() => {
                                            if (!notif.isRead) {
                                                axios.patch(`/api/notifications/${notif.id}/read`).catch(console.error);
                                                setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                                                window.dispatchEvent(new CustomEvent('notificationsUpdated'));
                                            }
                                        }}
                                        className={`relative flex items-start gap-6 p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                                            !notif.isRead 
                                                ? 'border-transparent bg-white shadow-sm hover:shadow-md' 
                                                : 'border-gray-200 bg-gray-50 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        {!notif.isRead && (
                                            <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#1e5b53] rounded-r-md"></div>
                                        )}

                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                                            !notif.isRead ? 'bg-emerald-50 text-[#1e5b53]' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            <FileText size={24} className="text-current" />
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <h3 className={`font-['Poppins',sans-serif] font-bold text-[18px] mb-1 ${
                                                !notif.isRead ? 'text-[#171d19]' : 'text-gray-600'
                                            }`}>
                                                {notif.title}
                                            </h3>
                                            <p className={`font-['Poppins',sans-serif] text-[14px] mb-2 leading-relaxed ${
                                                !notif.isRead ? 'text-gray-600' : 'text-gray-500'
                                            }`}>
                                                {notif.text}
                                            </p>
                                            <span className={`font-['Poppins',sans-serif] text-[12px] font-medium ${
                                                !notif.isRead ? 'text-[#1e5b53]' : 'text-gray-400'
                                            }`}>
                                                {notif.time}
                                            </span>
                                        </div>

                                        {!notif.isRead && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#1e5b53] mt-2 shadow-[0_0_8px_rgba(30,91,83,0.6)]"></div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-8">
                        {/* Enhanced Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(() => {
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
                                        label: 'Total Pendapatan',
                                        value: formatCurrency(analytics.income_all_time || 0),
                                        subtext: (
                                            <div className="flex flex-col gap-2">
                                                <div className="self-start inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Rekap</div>
                                                <div className="flex flex-col gap-1.5 leading-none text-emerald-700 font-medium">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Hari ini: {formatCurrency(analytics.income_today || 0)}</span>
                                                    <span className="flex items-center gap-1.5"><TrendingUp size={14} /> Bulan ini: {formatCurrency(analytics.income_this_month || 0)}</span>
                                                </div>
                                            </div>
                                        ),
                                        icon: DollarSign,
                                        color: 'from-emerald-500 to-emerald-600',
                                    },
                                    {
                                        label: 'Pesanan Diproses',
                                        value: analytics.order_counts?.diproses || 0,
                                        subtext: (
                                            <div className="flex flex-col gap-2">
                                                <div className="self-start inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">Hari ini</div>
                                                <div className="flex flex-col gap-1.5 leading-none text-blue-700 font-medium">
                                                    <span className="flex items-center gap-1.5"><Package size={14} /> Pesanan masuk: {analytics.daily_metrics?.pesanan_masuk || 0}</span>
                                                    <span className="flex items-center gap-1.5"><CheckCircle size={14} /> Pesanan selesai: {analytics.daily_metrics?.pesanan_selesai || 0}</span>
                                                </div>
                                            </div>
                                        ),
                                        icon: Package,
                                        color: 'from-blue-500 to-blue-600',
                                    },
                                    {
                                        label: 'Resep Menunggu Verifikasi',
                                        value: analytics.prescriptions_pending || 0,
                                        subtext: (
                                            <div className="flex flex-col gap-2">
                                                <div className="self-start inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">Hari ini</div>
                                                <div className="flex flex-col gap-1.5 leading-none text-amber-700 font-medium">
                                                    <span className="flex items-center gap-1.5"><FileText size={14} /> Resep masuk: {analytics.daily_metrics?.resep_masuk || 0}</span>
                                                    <div className="grid grid-cols-2 gap-2 w-full mt-0.5">
                                                        <span className="flex items-center gap-1.5"><Check size={14} /> Disetujui: {analytics.daily_metrics?.resep_diverifikasi || 0}</span>
                                                        <span className="flex items-center gap-1.5"><XCircle size={14} /> Ditolak: {analytics.daily_metrics?.resep_ditolak || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                        icon: FileText,
                                        color: 'from-amber-500 to-amber-600',
                                    },
                                    {
                                        label: 'Peringatan Stok Kritis',
                                        value: analytics.critical_stock_products?.length || 0,
                                        subtext: <span className="flex items-center gap-1.5 mt-1 text-red-700 font-medium"><AlertTriangle size={14} /> Segera lakukan pengadaan obat</span>,
                                        icon: AlertCircle,
                                        color: 'from-red-500 to-red-600',
                                    },
                                ];
                            })().map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="mb-4 flex items-start justify-between">
                                            <div
                                                className={`h-12 w-12 bg-gradient-to-br ${stat.color} flex items-center justify-center rounded-xl shadow-lg`}
                                            >
                                                <stat.icon
                                                    className="text-white"
                                                    size={22}
                                                />
                                            </div>
                                        </div>
                                        <p className="mb-2 font-['Inter',sans-serif] text-base font-bold tracking-wide text-[#6e7a70] uppercase">
                                            {stat.label}
                                        </p>
                                        <p className="font-['Roboto_Condensed',sans-serif] text-[32px] font-semibold tracking-tight text-[#171d19]">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="mt-3 font-['Inter',sans-serif] text-[13px] text-slate-500 font-medium">
                                        {stat.subtext}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Revenue Chart */}
                            <div className="xl:col-span-2 rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                        Tren Pendapatan
                                    </h3>
                                    <select 
                                        value={revenueFilterDays}
                                        onChange={(e) => setRevenueFilterDays(Number(e.target.value))}
                                        className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] focus:border-[#1e5b53] focus:ring-2 focus:ring-[#1e5b53]/20 focus:outline-none"
                                    >
                                        <option value={7}>7 Hari Terakhir</option>
                                        <option value={30}>30 Hari Terakhir</option>
                                        <option value={90}>90 Hari Terakhir</option>
                                    </select>
                                </div>
                                {/* Area Chart Implementation */}
                                <div className="h-72 w-full mt-4">
                                    {!revenueChartData.some((item: any) => item.total > 0) ? (
                                        <div className="flex h-full w-full items-center justify-center rounded-xl border border-[#f1f5f9] bg-[#f9fafb]">
                                            <p className="font-['Inter',sans-serif] text-sm font-medium text-[#6e7a70]">
                                                Belum ada pendapatan pada periode ini
                                            </p>
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={revenueChartData}
                                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#1e5b53" stopOpacity={0.3}/>
                                                        <stop offset="95%" stopColor="#1e5b53" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <XAxis 
                                                    dataKey="date" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#6e7a70', fontSize: 12, fontFamily: 'Inter, sans-serif' }} 
                                                    dy={10}
                                                />
                                                <YAxis 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{ fill: '#6e7a70', fontSize: 12, fontFamily: 'Inter, sans-serif' }}
                                                    tickFormatter={(value) => {
                                                        if (value >= 1000000) return `Rp${(value / 1000000).toFixed(1)}Jt`;
                                                        if (value >= 1000) return `Rp${(value / 1000).toFixed(0)}rb`;
                                                        return `Rp${value}`;
                                                    }}
                                                />
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <RechartsTooltip 
                                                    formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    labelStyle={{ color: '#171d19', fontWeight: 'bold', marginBottom: '4px', fontFamily: 'Inter, sans-serif' }}
                                                    itemStyle={{ color: '#1e5b53', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="total" 
                                                    stroke="#1e5b53" 
                                                    strokeWidth={3}
                                                    fillOpacity={1} 
                                                    fill="url(#colorTotal)" 
                                                    activeDot={{ r: 6, fill: '#1e5b53', stroke: '#fff', strokeWidth: 2 }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                            {/* Top Products */}
                            <div className="xl:col-span-1 rounded-2xl border border-[#f1f5f9] bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
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
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e5b53] to-[#005632] font-['Inter',sans-serif] text-[12px] font-semibold text-white">
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
                                                <p className="font-['Roboto_Condensed',sans-serif] text-[14px] font-semibold text-[#1e5b53]">
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
                                            (analytics?.critical_stock_products || []).length
                                        }{' '}
                                        produk memerlukan restock segera
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {(analytics?.critical_stock_products || []).map((product: any) => (
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
                                                onClick={() => router.visit(`/admin/products/${product.id}/edit`)}
                                                className="w-full rounded-lg bg-[#1e5b53] px-4 py-2.5 font-['Inter',sans-serif] text-[13px] font-medium text-white transition-all hover:bg-[#005632] hover:shadow-lg"
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
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-bold text-[#1e5b53]">
                                Produk & Stok
                            </h2>
                            <p className="font-['Inter',sans-serif] text-[14px] text-slate-500 mt-1">
                                Kelola inventaris, kategori, dan harga produk apotek.
                            </p>
                        </div>
                        {/* Control Bar: Search, Filter, and Action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#f1f5f9] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                            <div className="flex w-full sm:w-auto items-center gap-4">
                                {/* Search Bar */}
                                <div className="relative w-full sm:w-96">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        value={productSearchQuery}
                                        onChange={(e) =>
                                            setProductSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari produk..."
                                        className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-4 pl-11 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#1e5b53] focus:bg-white focus:ring-2 focus:ring-[#1e5b53]/20 focus:outline-none"
                                    />
                                </div>
                                {/* Dropdown Filter */}
                                <select 
                                    value={productCategoryFilter}
                                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2.5 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#1e5b53] focus:ring-2 focus:ring-[#1e5b53]/20 focus:outline-none"
                                >
                                    <option value="all">Semua Jenis Obat</option>
                                    <option value="bebas">Obat Bebas</option>
                                    <option value="terbatas">Obat Terbatas</option>
                                    <option value="keras">Obat Keras</option>
                                </select>
                            </div>
                            
                            {/* Action Button */}
                            <button 
                                onClick={() => {
                                    setEditingProduct(null);
                                    setIsProductModalOpen(true);
                                }}
                                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-transparent bg-[#1e5b53] px-6 py-2.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#005632] hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)]"
                            >
                                <Plus size={18} />
                                <span className="font-['Roboto_Condensed',sans-serif] text-[14px] font-medium">
                                    Tambah Produk
                                </span>
                            </button>
                        </div>

                        {/* Enhanced Product Table */}
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[960px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#E2E8F0]">
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase w-12">No.</th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            KODE PRODUK
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Produk
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Kategori Induk
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Golongan Obat
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Stok
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Harga
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Penjualan
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Label Gejala
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {(products.data || []).map((product: any, index: number) => {
                                        const startIndex = ((products.current_page || 1) - 1) * (products.per_page || 10);
                                        return (
                                        <tr
                                            key={product.id}
                                            className="group transition-colors hover:bg-[#f8fafc]"
                                        >
                                            <td className="px-5 py-4">
                                                <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-400">{startIndex + index + 1}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-600">
                                                    {product.product_code || '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
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
                                                    {/* REVISI: Tombol Edit Produk Diubah Menjadi Link Halaman Penuh */}
                                                    <button
                                                        onClick={() => router.visit(`/admin/products/${product.id}/edit`)}
                                                        className="group inline-block rounded-lg p-2 transition-colors hover:bg-[#f9fafb]"
                                                        title="Edit Produk"
                                                    >
                                                        <Edit2
                                                            size={16}
                                                            className="text-[#171d19] opacity-60 transition-colors group-hover:text-[#1e5b53] group-hover:opacity-100"
                                                        />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setModalConfig({
                                                                isOpen: true,
                                                                type: 'delete',
                                                                title: 'Konfirmasi Hapus',
                                                                message: 'Apakah Anda yakin ingin menghapus produk?',
                                                                confirmText: 'Hapus',
                                                                onConfirm: () => {
                                                                    router.delete(`/admin/products/${product.id}`);
                                                                    closeConfirmModal();
                                                                }
                                                            });
                                                        }}
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
                                    );
                                    })}
                                </tbody>
                            </table>
                          </div>
                        <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
                            <p className="font-['Inter',sans-serif] text-[12px] text-slate-400">
                                Menampilkan <span className="font-bold text-slate-600">{products?.total || 0}</span> produk
                            </p>
                            {products.links && (
                                <Pagination links={products.links} />
                            )}
                        </div>
                      </div>
                    </div>
                )}

          {activeTab === 'orders' && (
              <div className="max-w-[1600px] mx-auto space-y-6">
                  <div>
                      <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-bold text-[#1e5b53]">
                          Manajemen Pesanan
                      </h2>
                      <p className="font-['Inter',sans-serif] text-[14px] text-slate-500 mt-1">
                          Pantau dan perbarui status pesanan pelanggan.
                      </p>
                  </div>
                  {/* Sub Navigation Tabs */}
                  <div className="border-b border-[#E2E8F0]">
                      <div className="flex gap-10 overflow-x-auto scrollbar-hide">
                          {[
                            { id: 'all', label: 'Semua', icon: List },
                            { id: 'menunggu_pembayaran', label: 'Menunggu Pembayaran', icon: Clock },
                            { id: 'diproses', label: 'Diproses', icon: Loader },
                            { id: 'dikirim', label: 'Dikirim', icon: Truck },
                            { id: 'selesai', label: 'Selesai', icon: CheckCircle },
                            { id: 'dibatalkan', label: 'Dibatalkan', icon: XCircle }
                          ].map((tab) => {
                            const isActive = orderStatusFilter === tab.id;
                            const Icon = tab.icon;
                            const count = analytics?.order_counts?.[tab.id] || 0;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => setOrderStatusFilter(tab.id)}
                                className={`font-['Inter',sans-serif] text-sm font-medium pb-4 relative transition-all whitespace-nowrap flex items-center gap-2.5 ${
                                  isActive
                                    ? 'text-[#0D6A36] border-b-2 border-[#0D6A36]'
                                    : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                                }`}
                              >
                                <Icon size={16} className={isActive ? "text-[#0D6A36]" : "text-slate-400"} />
                                <span>{tab.label}</span>
                                {count > 0 && (
                                  <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold leading-none rounded-full ${
                                    isActive ? 'bg-[#0D6A36] text-white' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {count}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                      </div>
                  </div>

                  {/* Search & Filter Bar */}
                  <div className="mb-5 rounded-2xl border border-[#f1f5f9] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                      <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1">
                              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]" size={18} />
                              <input
                                  type="text"
                                  value={orderSearchQuery}
                                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                                  placeholder="Cari berdasarkan kode pesanan atau nama pelanggan..."
                                  className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-4 pl-11 font-['Inter',sans-serif] text-[13px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#0D6A36] focus:bg-white focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                              />
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                              <div className="relative">
                                  <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7a70] z-10 pointer-events-none" size={18} />
                                  <DatePicker
                                      selected={orderStartDate}
                                      onChange={(date: Date | null) => setOrderStartDate(date)}
                                      selectsStart
                                      startDate={orderStartDate}
                                      endDate={orderEndDate}
                                      dateFormat="dd/MM/yyyy"
                                      locale={localeID}
                                      showYearDropdown
                                      showMonthDropdown
                                      dropdownMode="select"
                                      isClearable
                                      customInput={<DynamicPlaceholderInput defaultPlaceholder="Mulai" formatPlaceholder="dd/mm/yyyy" />}
                                      className="w-full sm:w-[160px] rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-8 pl-10 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all focus:border-[#0D6A36] focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                                  />
                              </div>
                              <span className="text-slate-400 font-medium">-</span>
                              <div className="relative">
                                  <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7a70] z-10 pointer-events-none" size={18} />
                                  <DatePicker
                                      selected={orderEndDate}
                                      onChange={(date: Date | null) => setOrderEndDate(date)}
                                      selectsEnd
                                      startDate={orderStartDate}
                                      endDate={orderEndDate}
                                      minDate={orderStartDate}
                                      dateFormat="dd/MM/yyyy"
                                      locale={localeID}
                                      showYearDropdown
                                      showMonthDropdown
                                      dropdownMode="select"
                                      isClearable
                                      customInput={<DynamicPlaceholderInput defaultPlaceholder="Akhir" formatPlaceholder="dd/mm/yyyy" />}
                                      className="w-full sm:w-[160px] rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-8 pl-10 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all focus:border-[#0D6A36] focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Orders Table */}
                  {(() => {
                    const filteredOrders = orders.data || [];

                    if (filteredOrders.length === 0) {
                      return (
                        <div className="rounded-2xl border border-[#f1f5f9] bg-white p-12 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                          <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
                          <p className="font-['Inter',sans-serif] text-base text-slate-500 font-medium">Tidak ada pesanan dalam kategori ini</p>
                          <p className="font-['Inter',sans-serif] text-sm text-slate-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                        </div>
                      );
                    }

                    return (
                      <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[960px] border-collapse text-left">
                            <thead>
                              <tr className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#E2E8F0]">
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase w-12">No.</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">ID Pesanan</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">User</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">Tanggal Pemesanan</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-center">Resep / Non-Resep</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-center">Metode Pengiriman</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-center">Jml. Barang</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-right">Total Harga</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">Penanggung Jawab</th>
                                <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#f1f5f9]">
                              {filteredOrders.map((order: any, index: number) => {
                                const startIndex = ((orders.current_page || 1) - 1) * (orders.per_page || 10);
                                const totalQty = order.products
                                  ? order.products.reduce((sum: number, p: any) => sum + (p.pivot?.kuantitas || 1), 0)
                                  : 0;

                                const penanggungJawab = (() => {
                                  if (!order.status_histories || order.status_histories.length === 0) return null;
                                  const found = [...order.status_histories].reverse().find((h: any) => h.changed_by_user?.name);
                                  return found?.changed_by_user?.name || null;
                                })();

                                const hasPrescription = !!order.prescription;
                                const prescriptionFileUrl = hasPrescription && order.prescription?.file_foto
                                  ? (order.prescription.file_foto.startsWith('http')
                                      ? order.prescription.file_foto
                                      : (order.prescription.file_foto.startsWith('storage/') || order.prescription.file_foto.startsWith('/storage/')
                                          ? (order.prescription.file_foto.startsWith('/') ? order.prescription.file_foto : `/${order.prescription.file_foto}`)
                                          : `/storage/${order.prescription.file_foto}`))
                                  : null;

                                const cfg = statusConfig[order.status] || { bg: 'bg-gray-50', color: 'text-gray-600', border: 'border-gray-200' };
                                const statusLabels: Record<string, string> = {
                                  menunggu_pembayaran: 'Menunggu Bayar', diproses: 'Diproses',
                                  dikirim: 'Dikirim', selesai: 'Selesai', dibatalkan: 'Dibatalkan',
                                };

                                return (
                                  <tr key={order.id} className="group transition-colors hover:bg-[#f8fafc]">
                                    <td className="px-5 py-4">
                                      <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-400">{startIndex + index + 1}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-['Inter',sans-serif] text-[13px] font-bold text-slate-800">
                                            {order.kode_pesanan || `#${String(order.id).padStart(6, '0')}`}
                                        </span>
                                        <span className={`inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                                            {cfg.icon && <cfg.icon size={12} />}
                                            {statusLabels[order.status] || order.status}
                                        </span>
                                        {hasPrescription && order.prescription?.kode_resep && (
                                            <div className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                                                ID Resep: {order.prescription.kode_resep}
                                            </div>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-[#E7F5EC] text-[#0D6A36] flex items-center justify-center font-bold text-xs shrink-0">
                                          {(order.user?.name || 'G').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-800 truncate max-w-[130px]">
                                            {order.user?.name || 'Guest'}
                                          </span>
                                          {order.user?.email && (
                                            <span className="font-['Inter',sans-serif] text-[10px] text-slate-400 truncate max-w-[130px] mt-0.5">
                                                {order.user.email}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-700">
                                          {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span className="font-['Inter',sans-serif] text-[11px] text-slate-400">
                                          {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                      {hasPrescription ? (
                                        prescriptionFileUrl ? (
                                          <a
                                            href={prescriptionFileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-['Inter',sans-serif] text-[11px] font-bold tracking-wide transition-colors ${prescriptionFileUrl.toLowerCase().includes('.pdf') ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                                            title="Klik untuk melihat file resep"
                                          >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                              {prescriptionFileUrl.toLowerCase().includes('.pdf') ? (
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                              ) : (
                                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                              )}
                                            </svg>
                                            {prescriptionFileUrl.toLowerCase().includes('.pdf') ? 'PDF Resep' : 'Foto Resep'} {order.prescription_id ? `#${order.prescription_id}` : ''}
                                          </a>
                                        ) : (
                                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-['Inter',sans-serif] text-[11px] font-bold tracking-wide">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Resep {order.prescription_id ? `#${order.prescription_id}` : ''}
                                          </span>
                                        )
                                      ) : (
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 border border-slate-200 font-['Inter',sans-serif] text-[11px] font-semibold tracking-wide">
                                          Non-Resep
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {['ambil_apotek', 'ambil_sendiri', 'ambil di apotek'].includes(String(order.shipping_method?.nama_metode || order.shippingMethod?.nama_metode || order.shippingMethod?.nama || (typeof order.shipping_method === 'string' ? order.shipping_method : '')).toLowerCase()) ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-widest border border-amber-200">
                                                Ambil di Apotek
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-200">
                                                Kirim via Kurir
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 font-['Inter',sans-serif] text-[14px] font-bold text-slate-700">
                                        {totalQty}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                      <span className="font-['Inter',sans-serif] text-[13px] font-bold text-[#0D6A36]">
                                        Rp {parseFloat(order.total_biaya || 0).toLocaleString('id-ID')}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4">
                                      {penanggungJawab ? (
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 rounded-full bg-[#0D6A36]/10 text-[#0D6A36] flex items-center justify-center font-bold text-[9px] shrink-0">
                                            {penanggungJawab.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                          </div>
                                          <span className="font-['Inter',sans-serif] text-[12px] font-semibold text-slate-700 truncate max-w-[120px]">{penanggungJawab}</span>
                                        </div>
                                      ) : (
                                        <span className="font-['Inter',sans-serif] text-[12px] text-slate-400 italic">Belum ditentukan</span>
                                      )}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <Link
                                          href={`/admin/orders/${order.id}`}
                                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] font-['Inter',sans-serif] text-[12px] font-semibold text-slate-700 transition-all hover:bg-[#0D6A36] hover:text-white hover:border-[#0D6A36] hover:shadow-md"
                                        >
                                          <Eye size={13} />
                                          Detail
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
                          <p className="font-['Inter',sans-serif] text-[12px] text-slate-400">
                            Menampilkan <span className="font-bold text-slate-600">{orders?.total || 0}</span> pesanan
                          </p>
                          {orders.links && (
                            <Pagination links={orders.links} />
                          )}
                        </div>
                      </div>
                    );
                  })()}
              </div>
          )}

                {activeTab === 'prescriptions' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-bold text-[#1e5b53]">
                                Manajemen Resep
                            </h2>
                            <p className="font-['Inter',sans-serif] text-[14px] text-slate-500 mt-1">
                                Pantau seluruh resep yang telah diunggah dan diverifikasi oleh Apoteker.
                            </p>
                        </div>

                        {/* Sub Navigation Tabs */}
                        <div className="mb-6 border-b border-[#E2E8F0]">
                            <div className="flex gap-10 overflow-x-auto scrollbar-hide">
                                {[
                                    { id: 'semua' as const, label: 'Semua', icon: List, count: (analytics?.prescriptions_pending || 0) + (analytics?.prescriptions_verified || 0) + (analytics?.prescriptions_rejected || 0) + (analytics?.prescriptions_dipesan || 0) },
                                    { id: 'menunggu' as const, label: 'Menunggu Verifikasi', icon: Clock, count: analytics?.prescriptions_pending || 0 },
                                    { id: 'disetujui' as const, label: 'Disetujui', icon: CheckCircle, count: analytics?.prescriptions_verified || 0 },
                                    { id: 'ditolak' as const, label: 'Ditolak', icon: XCircle, count: analytics?.prescriptions_rejected || 0 },
                                    { id: 'dipesan' as const, label: 'Telah Dipesan', icon: ShoppingBag, count: analytics?.prescriptions_dipesan || 0 }
                                ].map((tab) => {
                                    const isActive = prescriptionStatusFilter === tab.id;
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setPrescriptionStatusFilter(tab.id)}
                                            className={`font-['Inter',sans-serif] text-sm font-medium pb-4 relative transition-all whitespace-nowrap flex items-center gap-2.5 ${
                                                isActive
                                                    ? 'text-[#0D6A36] border-b-2 border-[#0D6A36]'
                                                    : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                                            }`}
                                        >
                                            <Icon size={16} className={isActive ? "text-[#0D6A36]" : "text-slate-400"} />
                                            <span>{tab.label}</span>
                                            {tab.count > 0 && (
                                                <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold leading-none rounded-full ${
                                                    isActive ? 'bg-[#0D6A36] text-white' : 'bg-slate-200 text-slate-700'
                                                }`}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="mb-6 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]" size={18} />
                                    <input
                                    type="text"
                                    value={prescriptionSearchQuery}
                                    onChange={(e) => setPrescriptionSearchQuery(e.target.value)}
                                    placeholder="Cari berdasarkan nama pasien..."
                                    className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-4 pl-11 font-['Inter',sans-serif] text-[13px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#0D6A36] focus:bg-white focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="relative">
                                    <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7a70] z-10 pointer-events-none" size={18} />
                                    <DatePicker
                                        selected={prescriptionStartDate}
                                        onChange={(date: Date | null) => setPrescriptionStartDate(date)}
                                        selectsStart
                                        startDate={prescriptionStartDate}
                                        endDate={prescriptionEndDate}
                                        dateFormat="dd/MM/yyyy"
                                        locale={localeID}
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        isClearable
                                        customInput={<DynamicPlaceholderInput defaultPlaceholder="Mulai" formatPlaceholder="dd/mm/yyyy" />}
                                        className="w-full sm:w-[160px] rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-8 pl-10 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all focus:border-[#0D6A36] focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                                    />
                                </div>
                                <span className="text-slate-400 font-medium">-</span>
                                <div className="relative">
                                    <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-[#6e7a70] z-10 pointer-events-none" size={18} />
                                    <DatePicker
                                        selected={prescriptionEndDate}
                                        onChange={(date: Date | null) => setPrescriptionEndDate(date)}
                                        selectsEnd
                                        startDate={prescriptionStartDate}
                                        endDate={prescriptionEndDate}
                                        minDate={prescriptionStartDate}
                                        dateFormat="dd/MM/yyyy"
                                        locale={localeID}
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        isClearable
                                        customInput={<DynamicPlaceholderInput defaultPlaceholder="Akhir" formatPlaceholder="dd/mm/yyyy" />}
                                        className="w-full sm:w-[160px] rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-8 pl-10 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all focus:border-[#0D6A36] focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                                    />
                                </div>
                                </div>
                        </div>
                        </div>

                        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[960px] border-collapse text-left">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#E2E8F0]">
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase">ID Resep</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase text-center">Dokumen Resep</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase">Nama Pasien</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase">Tanggal Masuk</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase text-center">Metode Pengiriman</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase text-center">Status</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase text-center">Penanggung Jawab</th>
                                            <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-slate-500 uppercase text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#f1f5f9]">
                                        {(prescriptions?.data || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className="rounded-2xl border border-[#f1f5f9] bg-white p-16 text-center shadow-[0_8px_24px_rgba(0,0,0,0.06)] mt-4 mb-4 mx-4">
                                                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#f9fafb]">
                                                            <FileText size={32} className="text-[#6e7a70]" />
                                                        </div>
                                                        <h3 className="mb-2 font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                                            {prescriptionStatusFilter === 'dipesan' ? 'Belum ada resep yang telah selesai' : 'Tidak ada resep ditemukan'}
                                                        </h3>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (prescriptions?.data || []).map((rx: any, index: number) => {
                                            const config = (rx.status_validasi === 'pending' || rx.status_validasi === 'menunggu') ? { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-300', text: 'Menunggu' } :
                                                           rx.status_validasi === 'disetujui' ? { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-300', text: 'Disetujui' } :
                                                           rx.status_validasi === 'ditolak' ? { bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-300', text: 'Ditolak' } :
                                                           rx.status_validasi === 'telah_dipesan' ? { bg: 'bg-blue-50', color: 'text-blue-700', border: 'border-blue-300', text: 'Telah Dipesan' } :
                                                           { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-300', text: 'Menunggu' };
                                                           
                                            return (
                                                <tr key={rx.id} className="group transition-colors hover:bg-[#f8fafc]">
                                                    <td className="px-5 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-['Inter',sans-serif] text-[13px] font-bold text-slate-800">{rx.kode_resep || rx.id}</span>
                                                                {rx.is_urgent && (
                                                                    <span className="inline-flex items-center self-start px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border border-red-200 bg-red-50 text-red-700">Urgent</span>
                                                                )}
                                                            </div>
                                                            {((rx.virtual_transactions && rx.virtual_transactions.length > 0 && rx.virtual_transactions[0].invoice_number) || (rx.orders && rx.orders.length > 0 && rx.orders[0].kode_pesanan)) && (
                                                                <div className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                                                                    ID Pesanan: {(rx.virtual_transactions && rx.virtual_transactions.length > 0 && rx.virtual_transactions[0].invoice_number) ? rx.virtual_transactions[0].invoice_number : rx.orders[0].kode_pesanan}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="w-12 h-16 mx-auto rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0 shadow-sm relative group/img">
                                                            {rx.file_foto ? (
                                                                rx.file_foto.endsWith('.pdf') ? (
                                                                    <div className="text-red-500 flex flex-col items-center">
                                                                        <FileText size={20} />
                                                                        <span className="text-[8px] font-bold mt-1">PDF</span>
                                                                    </div>
                                                                ) : (
                                                                    <img 
                                                                        src={rx.file_foto.startsWith('http') ? rx.file_foto : (rx.file_foto.startsWith('storage/') || rx.file_foto.startsWith('/storage/') ? (rx.file_foto.startsWith('/') ? rx.file_foto : `/${rx.file_foto}`) : `/storage/${rx.file_foto}`)} 
                                                                        alt="Resep" 
                                                                        className="w-full h-full object-cover transition-transform group-hover/img:scale-110" 
                                                                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('bg-slate-100'); }} 
                                                                    />
                                                                )
                                                            ) : (
                                                                <FileText size={20} className="text-slate-300" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-[#E7F5EC] text-[#0D6A36] flex items-center justify-center font-bold text-xs shrink-0">
                                                                {(rx.nama_pasien || rx.user?.name || rx.customer || 'P').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-800 truncate max-w-[150px]">
                                                                    {rx.nama_pasien || rx.user?.name || rx.customer || 'Pasien Anonim'}
                                                                </span>
                                                                {rx.user?.email && (
                                                                    <span className="font-['Inter',sans-serif] text-[10px] text-slate-400 truncate max-w-[150px] mt-0.5">
                                                                        {rx.user.email}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-700">
                                                                {rx.created_at ? new Date(rx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                                                            </span>
                                                            <span className="font-['Inter',sans-serif] text-[11px] text-slate-400">
                                                                {rx.created_at ? new Date(rx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : (rx.timeLabel || rx.date?.split(' ')[1])}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        {(rx.shipping_method === 'kurir' || rx.shipping_method === 'Kirim via Kurir') ? (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-widest border border-blue-200">
                                                                Kirim via Kurir
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-widest border border-amber-200">
                                                                Ambil di Apotek
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${config.bg} ${config.color} ${config.border}`}>
                                                            {config.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="flex justify-center">
                                                            {rx.validator?.name ? (
                                                                <span className="font-['Inter',sans-serif] text-[13px] font-medium text-slate-700">
                                                                    {rx.validator.name}
                                                                </span>
                                                            ) : (
                                                                <span className="font-['Inter',sans-serif] text-[13px] italic text-slate-400">
                                                                    Belum ditentukan
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-center">
                                                        <div className="flex justify-center">
                                                            <Link
                                                                href={`/admin/prescriptions/${rx.id}`}
                                                                className="group inline-flex items-center gap-1.5 rounded-lg border border-[#0D6A36]/30 px-3 py-1.5 font-['Inter',sans-serif] text-xs font-semibold text-[#0D6A36] bg-[#0D6A36]/5 hover:bg-[#0D6A36] hover:text-white transition-all duration-200"
                                                            >
                                                                <Eye size={14} /> Detail
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
                                <p className="font-['Inter',sans-serif] text-[12px] text-slate-400">
                                    Menampilkan <span className="font-bold text-slate-600">{prescriptions?.total || 0}</span> resep
                                </p>
                                {prescriptions?.links && <Pagination links={prescriptions.links} />}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-bold text-[#1e5b53]">
                                Manajemen User
                            </h2>
                            <p className="font-['Inter',sans-serif] text-[14px] text-slate-500 mt-1">
                                Kelola hak akses, role, dan data pengguna sistem.
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    label: 'Total Users',
                                    value: analytics?.user_counts?.total || 0,
                                    icon: Users,
                                    color: 'from-blue-500 to-blue-600',
                                    bg: 'bg-blue-50',
                                    text: 'text-blue-700',
                                },
                                {
                                    label: 'Admin',
                                    value: analytics?.user_counts?.admin || 0,
                                    icon: Shield,
                                    color: 'from-purple-500 to-purple-600',
                                    bg: 'bg-purple-50',
                                    text: 'text-purple-700',
                                },
                                {
                                    label: 'Apoteker',
                                    value: analytics?.user_counts?.pharmacist || 0,
                                    icon: UserCog,
                                    color: 'from-emerald-500 to-emerald-600',
                                    bg: 'bg-emerald-50',
                                    text: 'text-emerald-700',
                                },
                                {
                                    label: 'Pelanggan',
                                    value: analytics?.user_counts?.customer || 0,
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

                        {/* Control Bar: Search, Filter, and Action */}
                        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-[#f1f5f9] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                            <div className="flex w-full sm:w-auto items-center gap-4">
                                {/* Search Bar */}
                                <div className="relative w-full sm:w-96">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Cari berdasarkan nama atau email..."
                                        className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-2.5 pr-4 pl-11 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#1e5b53] focus:bg-white focus:ring-2 focus:ring-[#1e5b53]/20 focus:outline-none"
                                    />
                                </div>
                                {/* Dropdown Filter */}
                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value as any)
                                    }
                                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2.5 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#1e5b53] focus:ring-2 focus:ring-[#1e5b53]/20 focus:outline-none"
                                >
                                    <option value="all">Semua Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="pharmacist">Apoteker</option>
                                    <option value="user">Pelanggan</option>
                                </select>
                            </div>

                            {/* Action Button */}
                            <button 
                                onClick={() => {
                                    setEditingUser(null);
                                    setIsUserModalOpen(true);
                                }}
                                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-transparent bg-[#1e5b53] px-6 py-2.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#005632] hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)]"
                            >
                                <Plus size={18} />
                                <span className="font-['Roboto_Condensed',sans-serif] text-[14px] font-medium">
                                    Tambah User Baru
                                </span>
                            </button>
                        </div>

                        {/* User Table */}
                        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[960px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border-b border-[#E2E8F0]">
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase w-12">No.</th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            User
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Email
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Role
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Status
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Bergabung
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                            Terakhir Aktif
                                        </th>
                                        <th className="px-5 py-4 font-['Inter',sans-serif] text-[11px] font-bold tracking-widest text-slate-400 uppercase text-right">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#f1f5f9]">
                                    {(users.data || [])
                                        .map((user: any, index: number) => {
                                            const startIndex = ((users.current_page || 1) - 1) * (users.per_page || 10);
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
                                                    className="group transition-colors hover:bg-[#f8fafc]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <span className="font-['Inter',sans-serif] text-[13px] font-semibold text-slate-400">{startIndex + index + 1}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1e5b53] to-[#005632]">
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
                                                                onClick={() => fetchUserActivities(user)}
                                                                className="group inline-block rounded-lg p-2 transition-colors hover:bg-blue-50"
                                                                title="Riwayat Aktivitas"
                                                            >
                                                                <Clock
                                                                    size={16}
                                                                    className="text-blue-600 opacity-60 transition-opacity group-hover:opacity-100"
                                                                />
                                                            </button>
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
                                                                    className="text-[#171d19] opacity-60 transition-colors group-hover:text-[#1e5b53] group-hover:opacity-100"
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setModalConfig({
                                                                        isOpen: true,
                                                                        type: 'delete',
                                                                        title: 'Konfirmasi Hapus',
                                                                        message: 'Apakah Anda yakin ingin menghapus akun user ini?',
                                                                        confirmText: 'Hapus',
                                                                        onConfirm: () => {
                                                                            router.delete(`/admin/users/${user.id}`);
                                                                            closeConfirmModal();
                                                                        }
                                                                    });
                                                                }}
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
                        
                        <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
                            <p className="font-['Inter',sans-serif] text-[12px] text-slate-400">
                                Menampilkan <span className="font-bold text-slate-600">{users?.total || 0}</span> user
                            </p>
                            {users.links && (
                                <Pagination links={users.links} />
                            )}
                        </div>
                        </div>

                        {/* Empty State */}
                        {(users.data || []).length === 0 && (
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
            </div>

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


            {/* Modal Detail Pesanan */}
            <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
            
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

            {/* Modal Activity Log */}
            {isActivityModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/40" onClick={() => setIsActivityModalOpen(false)} />
                    <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
                            <div>
                                <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-slate-800">
                                    Riwayat Aktivitas
                                </h3>
                                <p className="font-['Inter',sans-serif] text-[13px] text-slate-500 mt-0.5">
                                    {selectedUserForActivity?.name} ({selectedUserForActivity?.email})
                                </p>
                            </div>
                            <button
                                onClick={() => setIsActivityModalOpen(false)}
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {isFetchingActivities ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader className="animate-spin text-[#0D6A36]" size={32} />
                                </div>
                            ) : selectedUserActivities.length > 0 ? (
                                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                                    {selectedUserActivities.map((act: any, idx: number) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#0D6A36]" />
                                            <div className="flex flex-col gap-1">
                                                <span className="font-['Inter',sans-serif] text-[12px] font-bold text-slate-400">
                                                    {new Date(act.created_at).toLocaleString('id-ID', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                </span>
                                                <p className="font-['Inter',sans-serif] text-[14px] text-slate-700">
                                                    {act.description}
                                                </p>
                                                {act.ip_address && (
                                                    <span className="font-['Inter',sans-serif] text-[11px] text-slate-400 mt-0.5">
                                                        IP: {act.ip_address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Clock className="mx-auto text-slate-300 mb-3" size={32} />
                                    <p className="font-['Inter',sans-serif] text-[14px] text-slate-500">Belum ada riwayat aktivitas untuk user ini.</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
                            <button
                                onClick={() => setIsActivityModalOpen(false)}
                                className="rounded-xl bg-slate-800 px-6 py-2.5 font-['Inter',sans-serif] text-[14px] font-bold text-white transition-all hover:bg-slate-700 hover:shadow-lg hover:shadow-slate-200 active:scale-[0.98]"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

