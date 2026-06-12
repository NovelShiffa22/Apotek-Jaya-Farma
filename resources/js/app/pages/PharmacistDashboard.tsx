import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  X,
  Edit2, 
  Search, 
  Clock, 
  AlertCircle, 
  FileText, 
  User, 
  Calendar, 
  LogOut, 
  Bell, 
  HelpCircle, 
  Settings, 
  ChevronRight, 
  ZoomIn,
  SlidersHorizontal,
  ShoppingBag,
  Camera,
  Menu,
  Package,
  Eye
} from 'lucide-react';
import { Link, router, usePage, useForm } from '@inertiajs/react';
import ConfirmModal from '../components/ConfirmModal';

export default function PharmacistDashboard({ prescriptions = [], products = [], orders = [], statusChanges = [] }: any) {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      password: '',
      password_confirmation: '',
      avatar: null as File | null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
      user?.avatar ? `/storage/${user.avatar}` : null
  );

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
      setAvatarPreview(user.avatar ? `/storage/${user.avatar}` : null);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setData('avatar', file);
          setAvatarPreview(URL.createObjectURL(file));
      }
  };

  const submitProfile = (e: React.FormEvent) => {
      e.preventDefault();
      post('/pharmacist/settings/profile', {
          preserveScroll: true,
          forceFormData: true,
          onSuccess: () => {
              setData('password', '');
              setData('password_confirmation', '');
          }
      });
  };

  const pendingPrescriptions = prescriptions.filter((p: any) => p.status_validasi === 'pending');
  const approvedPrescriptions = prescriptions.filter((p: any) => p.status_validasi === 'disetujui');
  const rejectedPrescriptions = prescriptions.filter((p: any) => p.status_validasi === 'ditolak');
  const paymentQueue = orders;

  const toLocalDateString = (d: Date) => {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const todayStr = toLocalDateString(new Date());
  const totalResepHariIni = prescriptions.filter((p: any) => (p.created_at || '').startsWith(todayStr)).length;
  const pesananHariIni = orders.filter((o: any) => (o.created_at || '').startsWith(todayStr)).length;

  const recentActivities = [...prescriptions]
    .filter((p: any) => p.status_validasi === 'disetujui' || p.status_validasi === 'ditolak')
    .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)
    .map((p: any) => ({
      action: p.status_validasi === 'disetujui' ? 'Approved' : 'Rejected',
      info: `Resep #${p.kode_resep || p.id} ${p.status_validasi === 'disetujui' ? 'telah diverifikasi' : 'ditolak'}`,
      detail: `${new Date(p.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} ${p.catatan_apoteker ? `· ${p.catatan_apoteker}` : ''}`,
      isSuccess: p.status_validasi === 'disetujui',
      isDanger: p.status_validasi === 'ditolak',
      raw: p
    }));

  const [verifikasiFilterDays, setVerifikasiFilterDays] = useState(7);

  const chartData = (() => {
    const data = [];
    const now = new Date();
    for (let i = verifikasiFilterDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        
        const count = prescriptions.filter((p: any) => {
          if (p.status_validasi !== 'disetujui' && p.status_validasi !== 'ditolak') return false;
          const targetDate = new Date(p.updated_at || p.created_at);
          if (isNaN(targetDate.getTime())) return false;
          return targetDate.getFullYear() === d.getFullYear() && 
                 targetDate.getMonth() === d.getMonth() && 
                 targetDate.getDate() === d.getDate();
        }).length;
            
        data.push({
            day: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
            value: count,
            active: i === 0
        });
    }
    return data;
  })();
  
  const maxChartValue = Math.max(...chartData.map(d => d.value), 10);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'prescriptions' | 'settings' | 'products'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('pharmacistActiveTab') as any) || 'dashboard';
    }
    return 'dashboard';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pharmacistActiveTab', activeTab);
    }
  }, [activeTab]);

  const [activeSubTab, setActiveSubTab] = useState<'menunggu' | 'disetujui' | 'ditolak' | 'pembayaran'>('menunggu');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  // States for 'products' tab
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [viewingProductDetail, setViewingProductDetail] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Compute completed orders sales count for each product
  const productsWithSales = products.map((product: any) => {
    let sales = 0;
    orders.forEach((order: any) => {
      if (order.status === 'selesai' && order.products) {
        order.products.forEach((op: any) => {
          if (op.id === product.id) {
            sales += op.pivot?.kuantitas || 0;
          }
        });
      }
    });
    return {
      ...product,
      sales
    };
  });
  const [prescriptionView, setPrescriptionView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [validationNotes, setValidationNotes] = useState('');
  
  // Order states
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

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

  const handlePharmacistLogout = (e: React.MouseEvent) => {
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

  const statusConfig: any = {
      menunggu_pembayaran: {
          bg: 'bg-amber-50',
          color: 'text-amber-700',
          border: 'border-amber-200',
      },
      diproses: {
          bg: 'bg-blue-50',
          color: 'text-blue-700',
          border: 'border-blue-200',
      },
      disiapkan: {
          bg: 'bg-purple-50',
          color: 'text-purple-700',
          border: 'border-purple-200',
      },
      dikirim: {
          bg: 'bg-indigo-50',
          color: 'text-indigo-700',
          border: 'border-indigo-200',
      },
      selesai: {
          bg: 'bg-emerald-50',
          color: 'text-emerald-700',
          border: 'border-emerald-200',
      },
      dibatalkan: {
          bg: 'bg-red-50',
          color: 'text-red-700',
          border: 'border-red-200',
      },
  };

  const updateOrderStatus = (id: number, status: string) => {
      router.put(
          `/pharmacist/orders/${id}/status`,
          { status },
          { preserveScroll: true }
      );
  };

  // Notification States
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (statusChanges && statusChanges.length > 0) {
      const lastReadTime = localStorage.getItem('pharmacist_notif_last_read') || '0';
      const readTimeMs = parseInt(lastReadTime, 10);

      const mapped = statusChanges.map((sc: any) => {
        const timeMs = new Date(sc.created_at).getTime();
        const pharmacistName = sc.changed_by_user?.name || 'Apoteker';
        const isSelf = sc.changed_by === user?.id;
        
        let text = '';
        const statusLabels: Record<string, string> = {
          menunggu_pembayaran: 'Menunggu Pembayaran',
          diproses: 'Diproses',
          disiapkan: 'Disiapkan',
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
  }, [statusChanges, user?.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    const maxTimeMs = Math.max(...notifications.map(n => n.timeMs), 0);
    localStorage.setItem('pharmacist_notif_last_read', maxTimeMs.toString());
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  // Doctor detail state (Mockup 3)
  const [doctorName, setDoctorName] = useState('Dr. Hermawan');
  const [doctorPoli, setDoctorPoli] = useState('Umum');
  const [doctorPPK, setDoctorPPK] = useState('Puskesmas Tebet');
  const [doctorAlamat, setDoctorAlamat] = useState('Jl. Raya Kemerdekaan No. 10, Jakarta Selatan');

  // Dynamic Prescription Items State
  const [prescriptionItems, setPrescriptionItems] = useState<any[]>([]);

  // Function to calculate subtotal for an item
  const calculateSubtotal = (item: any) => {
    return (item.harga_satuan || 0) * (item.kuantitas_ambil || 0);
  };

  // Helper to add a new non-racikan item
  const addNonRacikanItem = () => {
    setPrescriptionItems([...prescriptionItems, {
      product_id: null,
      product_name: '',
      is_racikan: false,
      kuantitas_resep: 1,
      kuantitas_ambil: 1,
      satuan: 'Tablet',
      signa: '3x1',
      harga_satuan: 0,
      subtotal: 0
    }]);
  };

  // Helper to add a new racikan item
  const addRacikanItem = () => {
    setPrescriptionItems([...prescriptionItems, {
      product_id: null,
      product_name: 'Racikan Baru',
      is_racikan: true,
      kuantitas_resep: 10,
      kuantitas_ambil: 10,
      satuan: 'Puyer',
      signa: '3x1',
      harga_satuan: 0,
      subtotal: 0
    }]);
  };

  // Product Editor State
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productIndikasi, setProductIndikasi] = useState('');
  const [productAturan, setProductAturan] = useState('');
  const [productEfek, setProductEfek] = useState('');
  const [productDeskripsi, setProductDeskripsi] = useState('');

  const priorityConfig = {
    high: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    normal: { label: 'Normal', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    low: { label: 'Low', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  };

  const handleSelectPrescription = (rx: any) => {
    setSelectedPrescription(rx);
    setPrescriptionView('detail');
    setValidationNotes(rx.catatan_apoteker || '');
    if (rx.doctor_name) setDoctorName(rx.doctor_name);
    if (rx.doctor_poli) setDoctorPoli(rx.doctor_poli);
    if (rx.doctor_ppk) setDoctorPPK(rx.doctor_ppk);
    if (rx.doctor_alamat) setDoctorAlamat(rx.doctor_alamat);
    
    if (rx.items && rx.items.length > 0) {
      setPrescriptionItems(rx.items);
    } else {
      setPrescriptionItems([]);
    }
  };

  const getFilteredList = () => {
    let rawList = [];
    if (activeSubTab === 'menunggu') rawList = pendingPrescriptions;
    else if (activeSubTab === 'disetujui') rawList = approvedPrescriptions;
    else if (activeSubTab === 'ditolak') rawList = rejectedPrescriptions;
    else if (activeSubTab === 'pembayaran') rawList = paymentQueue;
    
    return rawList.filter((rx: any) => {
      const idStr = (rx.kode_resep || rx.id || '').toString().toLowerCase();
      const nameStr = (rx.user?.name || rx.customer || '').toLowerCase();
      const matchesSearch = idStr.includes(searchQuery.toLowerCase()) || nameStr.includes(searchQuery.toLowerCase());

      let matchesMonth = true;
      if (monthFilter) {
        const dateStr = rx.created_at || rx.waktu_masuk || '';
        if (dateStr.length >= 7) {
          const rxMonth = dateStr.substring(5, 7);
          matchesMonth = rxMonth === monthFilter;
        } else {
          matchesMonth = false;
        }
      }

      return matchesSearch && matchesMonth;
    });
  };

  const activeFilteredList = getFilteredList();

  // Calculate Grand Total from dynamic items
  const totalHargaVal = prescriptionItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#E2E8F0] flex-col justify-between sticky top-0 h-screen z-30">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 h-20 border-b border-[#E2E8F0]">
            <div className="w-10 h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)] shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A] leading-tight">
                Apotek Jaya Farma
              </h2>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-6 space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-[#E7F5EC] text-[#0D6A36]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#0D6A36]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
            </button>

            <button
              onClick={() => {
                setActiveTab('prescriptions');
                setPrescriptionView('list');
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                activeTab === 'prescriptions'
                  ? 'bg-[#E7F5EC] text-[#0D6A36]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 ${activeTab === 'prescriptions' ? 'text-[#0D6A36]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Resep</span>
              </div>
              {activeTab === 'prescriptions' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-[#E7F5EC] text-[#0D6A36]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'text-[#0D6A36]' : 'text-slate-400'}`} />
                <span>Pesanan</span>
              </div>
              {activeTab === 'orders' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                activeTab === 'products'
                  ? 'bg-[#E7F5EC] text-[#0D6A36]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-5 h-5 ${activeTab === 'products' ? 'text-[#0D6A36]' : 'text-slate-400'}`} />
                <span>Produk dan Stok</span>
              </div>
              {activeTab === 'products' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-[#E7F5EC] text-[#0D6A36]'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings size={18} className={activeTab === 'settings' ? 'text-[#0D6A36]' : 'text-slate-400'} />
            <span>Pengaturan</span>
          </button>
          <button
            onClick={handlePharmacistLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
          >
            <LogOut size={18} className="text-red-500" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex md:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl mr-2 transition-all shrink-0"
          >
            <Menu size={22} />
          </button>
          
          {activeTab === 'dashboard' ? (
            /* Empty Header for Dashboard */
            <div></div>
          ) : activeTab === 'prescriptions' ? (
            /* Empty Header for Prescriptions */
            <div></div>
          ) : activeTab === 'orders' ? (
            /* Empty Header for Orders */
            <div></div>
          ) : (
            /* Empty Header for Settings */
            <div></div>
          )}

          {/* Quick Info & Profile */}
          <div className="flex items-center gap-6">
            {/* Bell Notification Icon */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2.5 text-slate-400 hover:text-[#0D6A36] hover:bg-[#E7F5EC] rounded-xl transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl z-50 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center">
                    <span className="font-['Inter',sans-serif] font-bold text-sm text-slate-800">Notifikasi</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-semibold text-[#0D6A36] hover:underline"
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
                          className={`px-4 py-3 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors text-left cursor-pointer ${
                            !notif.isRead ? 'bg-[#E7F5EC]/30' : ''
                          }`}
                          onClick={() => {
                            if (notif.orderId) {
                              const ord = orders.find((o: any) => o.id === notif.orderId);
                              if (ord) {
                                setActiveTab('orders');
                                setViewingOrder(ord);
                              }
                            }
                            // Mark this one as read in local state
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

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-['Inter',sans-serif] font-bold text-sm text-slate-800 leading-tight">
                  {user?.name || 'Apoteker'}
                </p>
                <p className="font-['Inter',sans-serif] text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                  PHARMACIST
                </p>
              </div>
              {user?.avatar ? (
                <img
                  src={user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`}
                  alt={user.name || 'Apoteker'}
                  className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 border border-[#E2E8F0] flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="p-8 flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-[1600px] mx-auto">
              
              {/* Banner Welcome */}
              <div className="relative bg-gradient-to-r from-[#09522C] to-[#0D6A36] rounded-2xl p-8 text-white overflow-hidden shadow-sm">
                <div className="relative z-10 max-w-2xl">
                  <h1 className="font-['Inter',sans-serif] font-bold text-2xl mb-2">
                    Selamat Pagi, {user?.name || 'Apoteker'}
                  </h1>
                  <p className="font-['Inter',sans-serif] text-sm text-white/80 whitespace-nowrap">
                    Berikut adalah ringkasan aktivitas apotek Anda hari ini. Semua sistem beroperasi dengan normal.
                  </p>
                </div>
                {/* SVG Shield Watermark */}
                <svg className="absolute right-6 -bottom-6 h-36 w-auto opacity-10 text-white pointer-events-none select-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v8M9 12h6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  { label: 'Pesanan Hari Ini', value: pesananHariIni, sub: 'Semua pesanan masuk', badge: 'Hari ini', icon: ShoppingBag, iconBg: 'bg-[#eff6ff] text-[#2d5f9f]', hasBadge: true },
                  { label: 'Total Resep Hari Ini', value: totalResepHariIni, sub: 'Semua resep masuk hari ini', badge: 'Hari ini', icon: FileText, iconBg: 'bg-[#e7f5ec] text-[#0D6A36]', hasBadge: true },
                  { label: 'Menunggu Verifikasi', value: pendingPrescriptions.length, sub: 'Segera periksa antrean', subColor: 'text-amber-600 font-semibold', icon: Clock, iconBg: 'bg-amber-50 text-amber-600' },
                  { label: 'Resep Disetujui', value: approvedPrescriptions.length, sub: 'Telah diproses', icon: CheckCircle, iconBg: 'bg-[#e7f5ec] text-[#0D6A36]' },
                  { label: 'Resep Ditolak', value: rejectedPrescriptions.length, sub: 'Memerlukan follow-up', icon: XCircle, iconBg: 'bg-red-50 text-red-600' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-44 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                        <stat.icon size={22} />
                      </div>
                      {stat.hasBadge && (
                        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-[#0D6A36] rounded-full border border-emerald-100">
                          {stat.badge}
                        </span>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="font-['Inter',sans-serif] text-xs text-slate-400 mb-0.5 font-medium">
                        {stat.label}
                      </p>
                      <p className="font-['Inter',sans-serif] text-3xl text-slate-800 font-bold tracking-tight">
                        {stat.value}
                      </p>
                      <p className={`font-['Inter',sans-serif] text-[11px] mt-1 ${stat.subColor || 'text-slate-400 font-medium'}`}>
                        {stat.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly Trends & Recent Activity */}
              <div className="grid grid-cols-12 gap-6">
                
                {/* Weekly Trend Chart Card */}
                <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-[380px]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-['Inter',sans-serif] font-bold text-lg text-slate-800">
                        Tren Verifikasi Resep
                      </h3>
                      <p className="font-['Inter',sans-serif] text-xs text-slate-400 mt-0.5">
                        Aktivitas mingguan apotek
                      </p>
                    </div>
                    <select 
                      value={verifikasiFilterDays}
                      onChange={(e) => setVerifikasiFilterDays(Number(e.target.value))}
                      className="rounded-xl border border-[#E2E8F0] bg-[#f9fafb] px-4 py-2 font-['Inter',sans-serif] text-[13px] font-medium text-slate-800 focus:border-[#0D6A36] focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                    >
                      <option value={7}>7 Hari Terakhir</option>
                      <option value={30}>30 Hari Terakhir</option>
                      <option value={90}>90 Hari Terakhir</option>
                    </select>
                  </div>
                  
                  {/* The Chart Body */}
                  <div className={`flex-1 flex items-end ${verifikasiFilterDays === 7 ? 'gap-4' : verifikasiFilterDays === 30 ? 'gap-1.5' : 'gap-[2px]'} rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-4 relative`}>
                    {/* Bars */}
                    {chartData.map((data, idx) => (
                      <div key={idx} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded absolute bottom-full mb-1 shadow-md whitespace-nowrap pointer-events-none z-10">
                          {data.day}: {data.value} Resep
                        </div>
                        <div 
                          className="w-full rounded-t-sm bg-gradient-to-t from-[#0D6A36] to-[#20a45b] transition-all duration-300 hover:opacity-80"
                          style={{ height: `${(data.value / maxChartValue) * 100}%`, minHeight: data.value > 0 ? '4px' : '0' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Card */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-[380px] overflow-hidden">
                  <div className="p-6 border-b border-[#E2E8F0]">
                    <h3 className="font-['Inter',sans-serif] font-bold text-lg text-slate-800">
                      Aktivitas Terbaru
                    </h3>
                  </div>
                  
                  {/* Activity List Container */}
                  <div className="flex-1 divide-y divide-[#E2E8F0] overflow-y-auto">
                    {recentActivities.length > 0 ? recentActivities.map((act, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-6 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                        onClick={() => {
                          setActiveTab('prescriptions');
                          setActiveSubTab(act.raw.status_validasi);
                          handleSelectPrescription(act.raw);
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <span className={`w-2.5 h-2.5 rounded-full mt-2.5 shrink-0 ${
                            act.isSuccess ? 'bg-[#0D6A36]' : act.isDanger ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="font-['Inter',sans-serif] text-sm font-semibold text-slate-800">
                              {act.info}
                            </p>
                            <p className="font-['Inter',sans-serif] text-xs text-slate-400 mt-1 line-clamp-1">
                              {act.detail}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    )) : (
                      <div className="p-6 text-center text-slate-400 font-['Inter',sans-serif] text-sm">Belum ada aktivitas verifikasi resep.</div>
                    )}
                  </div>

                  {/* See All Activities Button */}
                  <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 text-center">
                    <button 
                      onClick={() => setActiveTab('prescriptions')}
                      className="text-sm font-bold text-[#0D6A36] hover:text-[#0a542b] transition-colors"
                    >
                      Lihat Semua Aktivitas
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'orders' && (
              <div className="max-w-[1600px] mx-auto">
                  <div className="mb-6">
                      <h2 className="font-['Inter',sans-serif] text-2xl font-bold text-[#0D6A36] capitalize">
                          Daftar Pesanan
                      </h2>
                      <p className="font-['Inter',sans-serif] text-sm text-slate-400 mt-1">
                          Kelola dan perbarui status pesanan pelanggan.
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
                                  value={orderSearchQuery}
                                  onChange={(e) => setOrderSearchQuery(e.target.value)}
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
                              <option value="disiapkan">Disiapkan</option>
                              <option value="dikirim">Dikirim</option>
                              <option value="selesai">Selesai</option>
                              <option value="dibatalkan">Dibatalkan</option>
                          </select>
                      </div>
                  </div>

                  <div className="grid gap-4">
                      {orders.filter((order: any) => {
                          const customerName = order.user?.name || '';
                          const orderCode = order.kode_pesanan || '';
                          const matchesSearch = customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) || 
                                                orderCode.toLowerCase().includes(orderSearchQuery.toLowerCase());
                          const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
                          
                          let matchesDate = true;
                          if (orderDateFilter && order.created_at) {
                              const d = new Date(order.created_at);
                              const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                              matchesDate = localDateStr === orderDateFilter;
                          }
                          
                          return matchesSearch && matchesStatus && matchesDate;
                      }).map((order: any) => {
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
                                              <option value="disiapkan">Disiapkan</option>
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
                                                      disiapkan: 'Disiapkan',
                                                      dikirim: 'Dikirim',
                                                      selesai: 'Selesai',
                                                      dibatalkan: 'Dibatalkan',
                                                  };
                                                  return (
                                                      <span key={hIdx} className="inline-flex items-center gap-1 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-['Inter',sans-serif] text-slate-600">
                                                          <span className="font-semibold text-slate-800">{statusLabels[hist.status_sesudah] || hist.status_sesudah}</span>
                                                          <span className="text-slate-400">oleh</span>
                                                          <span className="font-bold text-[#0D6A36]">{hist.changed_by_user?.name || 'Sistem'}</span>
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

          {activeTab === 'prescriptions' && (
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-6">
                  <h2 className="font-['Inter',sans-serif] text-2xl font-bold text-[#0D6A36] capitalize">
                      Verifikasi Resep
                  </h2>
                  <p className="font-['Inter',sans-serif] text-sm text-slate-400 mt-1">
                      Daftar resep yang baru masuk dan memerlukan verifikasi apoteker.
                  </p>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="mb-6 border-b border-[#E2E8F0]">
                  <div className="flex gap-8">
                      {[
                        { id: 'menunggu' as const, label: 'Menunggu' },
                        { id: 'disetujui' as const, label: 'Disetujui' },
                        { id: 'ditolak' as const, label: 'Ditolak' },
                        { id: 'pembayaran' as const, label: 'Pembayaran' }
                      ].map((tab) => {
                        const isActive = activeSubTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveSubTab(tab.id);
                              setPrescriptionView('list');
                              setSearchQuery('');
                            }}
                            className={`font-['Inter',sans-serif] text-sm font-semibold pb-4 relative transition-all ${
                              isActive
                                ? 'text-[#0D6A36] border-b-2 border-[#0D6A36]'
                                : 'text-slate-400 hover:text-slate-600 border-b-2 border-transparent'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                  </div>
              </div>
              
              
              <div>
                  {prescriptionView === 'list' ? (
                    /* Grid Layout containing the Main Table */
                    <div className="space-y-6">
                      
                      {/* Search & Filter Bar */}
                      <div className="mb-6 rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                          <div className="flex gap-4">
                              <div className="relative flex-1">
                                  <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-[#6e7a70]" size={20} />
                                  <input
                                      type="text"
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      placeholder="Cari ID Resep atau Nama Pasien..."
                                      className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-3 pr-4 pl-12 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#006a3f] focus:bg-white focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none"
                                  />
                              </div>
                          </div>
                      </div>

                      <div className="grid gap-4">
                          {activeFilteredList.map((rx: any) => {
                              const config = rx.status_validasi === 'pending' ? { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', text: 'Menunggu' } :
                                           rx.status_validasi === 'disetujui' ? { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', text: 'Disetujui' } :
                                           rx.status_validasi === 'ditolak' ? { bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-200', text: 'Ditolak' } :
                                           { bg: 'bg-gray-50', color: 'text-gray-700', border: 'border-gray-200', text: rx.status_validasi || 'Menunggu' };
                                           
                              return (
                                  <div
                                      key={rx.id}
                                      className="rounded-2xl border border-[#f1f5f9] bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                                  >
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                          <div className="flex flex-col sm:flex-row sm:items-center flex-1 gap-4 md:gap-6">
                                              {/* ID Resep & Waktu Info */}
                                              <div className="flex-1 min-w-[150px]">
                                                  <div className="flex items-center flex-wrap gap-2 mb-1">
                                                      <p className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                                                          #{rx.kode_resep || rx.id}
                                                      </p>
                                                      {rx.is_urgent && (
                                                          <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700">
                                                              Urgent
                                                          </span>
                                                      )}
                                                  </div>
                                                  <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70] truncate">
                                                      {rx.created_at ? new Date(rx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : (rx.timeLabel || rx.date?.split(' ')[1])} • {rx.created_at ? new Date(rx.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : ''}
                                                  </p>
                                              </div>

                                              {/* NAMA PASIEN */}
                                              <div className="flex items-center gap-3 w-full sm:w-auto">
                                                  <div className="w-10 h-10 rounded-full bg-[#E7F5EC] text-[#0D6A36] flex items-center justify-center font-bold text-sm shrink-0">
                                                      {(rx.user?.name || rx.customer || 'G').split(' ').map((n: string) => n[0]).join('')}
                                                  </div>
                                                  <span className="font-['Inter',sans-serif] text-[15px] font-semibold text-[#171d19] truncate">
                                                      {rx.user?.name || rx.customer}
                                                  </span>
                                              </div>
                                          </div>

                                          {/* Status & Actions */}
                                          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                                              <div className={`px-4 py-2.5 rounded-xl border font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase text-center w-full sm:w-auto ${config.bg} ${config.color} ${config.border}`}>
                                                  {config.text}
                                              </div>

                                              <button 
                                                  onClick={() => handleSelectPrescription(rx)}
                                                  className="w-full sm:w-auto justify-center rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-2.5 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:border-[#006a3f] hover:bg-white flex items-center"
                                              >
                                                  {activeSubTab === 'menunggu' ? 'Verifikasi' : 'Detail'}
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })}
                          
                          {activeFilteredList.length === 0 && (
                              <div className="rounded-2xl border border-[#f1f5f9] bg-white p-12 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                                  <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
                                  <p className="font-['Inter',sans-serif] text-base text-slate-500 font-medium">Tidak ada resep dalam kategori ini</p>
                              </div>
                          )}
                      </div>
                    </div>
                  ) : (
                    /* Detailed Medical Prescription Validation view (Mockup 3) */
                    <div className="space-y-6">
                      
                      {/* Back button link */}
                      <button
                        onClick={() => setPrescriptionView('list')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-semibold text-sm transition-colors group mb-4"
                      >
                        <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Kembali ke Daftar Resep</span>
                      </button>

                      {/* Detail Container Card Layout */}
                      <div className="grid grid-cols-12 gap-6">
                        
                        {/* Left wider column with form fields */}
                        <div className="col-span-12 lg:col-span-9 space-y-6">
                          
                          {/* Detail User Card */}
                          <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
                            <div className="bg-[#0D6A36] text-white px-6 py-3.5 font-bold text-sm">
                              Detail User
                            </div>
                            <div className="bg-white p-6">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6">
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">NIK KTP</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.nik || '3275084920000001'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Nama Lengkap</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.user?.name || selectedPrescription.customer}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Tempat Tanggal Lahir</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.dob || 'Jakarta, 12-05-1985'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Email</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.user?.email || selectedPrescription.email || 'budi.s@example.com'}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Alamat</p>
                                  <p className="font-bold text-slate-800 text-xs">
                                    {(() => {
                                      const userAddress = selectedPrescription.user?.addresses?.find((addr: any) => addr.is_default) || selectedPrescription.user?.addresses?.[0];
                                      return userAddress 
                                        ? `${userAddress.alamat_lengkap}, ${userAddress.kota}, ${userAddress.provinsi} ${userAddress.kode_pos}`
                                        : (selectedPrescription.alamat || 'Jl. Merdeka No. 45, Bekasi');
                                    })()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Jenis Kelamin</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.gender || 'Laki-laki'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Status Perkawinan</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.marital || 'Menikah'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Pekerjaan</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.job || 'Karyawan Swasta'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">No. Telp</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.user?.phone || selectedPrescription.phone || '+628123456789'}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Detail Dokter Card */}
                          <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
                            <div className="bg-[#0D6A36] text-white px-6 py-3.5 font-bold text-sm">
                              Detail Dokter
                            </div>
                            <div className="bg-white p-6 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Nama Dokter <span className="text-red-500">*</span></label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      value={doctorName}
                                      onChange={(e) => setDoctorName(e.target.value)}
                                      placeholder="Cari Dokter..."
                                      className="w-full pl-3 pr-10 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D6A36] focus:border-[#0D6A36]"
                                    />
                                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Poli <span className="text-red-500">*</span></label>
                                  <select
                                    value={doctorPoli}
                                    onChange={(e) => setDoctorPoli(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D6A36] focus:border-[#0D6A36] bg-white cursor-pointer"
                                  >
                                    <option value="Umum">Pilih Poli</option>
                                    <option value="Umum">Poli Umum</option>
                                    <option value="Anak">Poli Anak</option>
                                    <option value="Gigi">Poli Gigi</option>
                                    <option value="Kardio">Poli Jantung</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">PPK Asal <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    value={doctorPPK}
                                    onChange={(e) => setDoctorPPK(e.target.value)}
                                    placeholder="Puskesmas / RS Asal"
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D6A36] focus:border-[#0D6A36]"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-slate-500 font-bold text-xs mb-1.5 font-['Inter',sans-serif]">Alamat Praktek <span className="text-red-500">*</span></label>
                                <input
                                  type="text"
                                  value={doctorAlamat}
                                  onChange={(e) => setDoctorAlamat(e.target.value)}
                                  placeholder="Alamat Praktek"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#0D6A36] focus:border-[#0D6A36]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Detail Resep Card */}
                          <div className="overflow-hidden rounded-xl shadow-sm border border-slate-200">
                            <div className="bg-[#0D6A36] text-white px-6 py-3.5 font-bold text-sm">
                              Detail Resep
                            </div>
                            <div className="bg-white p-6 space-y-6">
                              
                              {/* non-racik drug section */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-bold text-[#0D6A36] font-['Inter',sans-serif] text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                                    </svg>
                                    <span>Obat Non-Racik</span>
                                  </h4>
                                  {activeSubTab === 'menunggu' && (
                                    <button onClick={addNonRacikanItem} className="bg-[#0D6A36] hover:bg-[#0a542b] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                      <span>+ Tambah Obat</span>
                                    </button>
                                  )}
                                </div>

                                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                  <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                        <th className="p-3 w-64">NAMA OBAT</th>
                                        <th className="p-3 text-center">SATUAN</th>
                                        <th className="p-3 text-right">HARGA SATUAN</th>
                                        <th className="p-3 text-center w-20">JML RESEP</th>
                                        <th className="p-3 text-center w-20">JML AMBIL</th>
                                        <th className="p-3 text-center w-24">SIGNA</th>
                                        <th className="p-3 text-right">SUBTOTAL</th>
                                        {activeSubTab === 'menunggu' && <th className="p-3 text-center w-10"></th>}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                      {prescriptionItems.filter(item => !item.is_racikan).map((item, idx) => {
                                        const globalIndex = prescriptionItems.indexOf(item);
                                        return (
                                        <tr key={globalIndex}>
                                          <td className="p-3">
                                            {activeSubTab === 'menunggu' ? (
                                              <select 
                                                value={item.product_id || ''} 
                                                onChange={(e) => {
                                                  const pId = e.target.value;
                                                  const prod = products.find((p: any) => p.id.toString() === pId);
                                                  const newItems = [...prescriptionItems];
                                                  newItems[globalIndex].product_id = pId;
                                                  if (prod) {
                                                    newItems[globalIndex].product_name = prod.name;
                                                    newItems[globalIndex].harga_satuan = prod.price || 0;
                                                    newItems[globalIndex].satuan = prod.unit || 'Tablet';
                                                    newItems[globalIndex].subtotal = calculateSubtotal(newItems[globalIndex]);
                                                  }
                                                  setPrescriptionItems(newItems);
                                                }}
                                                className="w-full py-1.5 px-2 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                                              >
                                                <option value="" disabled>Pilih Obat...</option>
                                                {products.filter((p: any) => !p.is_racikan_only).map((p: any) => (
                                                  <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                              </select>
                                            ) : (
                                              <span className="font-bold text-slate-800">{item.product_name || item.product?.name}</span>
                                            )}
                                          </td>
                                          <td className="p-3 text-center text-slate-500 font-semibold">{item.satuan}</td>
                                          <td className="p-3 text-right text-slate-500 font-semibold">Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}</td>
                                          <td className="p-3 text-center">
                                            {activeSubTab === 'menunggu' ? (
                                              <input
                                                type="number"
                                                value={item.kuantitas_resep}
                                                onChange={(e) => updateItem(globalIndex, 'kuantitas_resep', Math.max(0, parseInt(e.target.value) || 0))}
                                                className="w-14 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                                              />
                                            ) : (
                                              <span className="font-bold">{item.kuantitas_resep}</span>
                                            )}
                                          </td>
                                          <td className="p-3 text-center">
                                            {activeSubTab === 'menunggu' ? (
                                              <input
                                                type="number"
                                                value={item.kuantitas_ambil}
                                                onChange={(e) => updateItem(globalIndex, 'kuantitas_ambil', Math.max(0, parseInt(e.target.value) || 0))}
                                                className="w-14 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                                              />
                                            ) : (
                                              <span className="font-bold text-[#0D6A36]">{item.kuantitas_ambil}</span>
                                            )}
                                          </td>
                                          <td className="p-3 text-center">
                                            {activeSubTab === 'menunggu' ? (
                                              <input
                                                type="text"
                                                value={item.signa}
                                                onChange={(e) => updateItem(globalIndex, 'signa', e.target.value)}
                                                className="w-full text-center py-1 px-2 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
                                                placeholder="3x1"
                                              />
                                            ) : (
                                              <span className="font-bold">{item.signa}</span>
                                            )}
                                          </td>
                                          <td className="p-3 text-right font-bold text-slate-800">
                                            Rp {(item.subtotal || 0).toLocaleString('id-ID')}
                                          </td>
                                          {activeSubTab === 'menunggu' && (
                                            <td className="p-3 text-center text-red-500 hover:text-red-750 cursor-pointer" onClick={() => removeItem(globalIndex)}>
                                              <X size={16} className="mx-auto" strokeWidth={2.5} />
                                            </td>
                                          )}
                                        </tr>
                                      )})}
                                      {prescriptionItems.filter(item => !item.is_racikan).length === 0 && (
                                        <tr>
                                          <td colSpan={activeSubTab === 'menunggu' ? 8 : 7} className="p-4 text-center text-slate-400 font-medium italic">Belum ada obat non-racik.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* racik drug section */}
                              <div className="pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-bold text-[#0D6A36] font-['Inter',sans-serif] text-xs uppercase tracking-wider flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <span>Obat Racik</span>
                                  </h4>
                                  {activeSubTab === 'menunggu' && (
                                    <button onClick={addRacikanItem} className="border border-[#0D6A36] text-[#0D6A36] hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                      <span>+ Tambah Racikan Baru</span>
                                    </button>
                                  )}
                                </div>

                                {prescriptionItems.filter(item => item.is_racikan).map((item, idx) => {
                                  const globalIndex = prescriptionItems.indexOf(item);
                                  return (
                                  <div key={globalIndex} className="border border-slate-200 border-dashed rounded-xl p-5 mb-4 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                      <div className="sm:col-span-4">
                                        <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Nama Racikan</label>
                                        {activeSubTab === 'menunggu' ? (
                                          <input
                                            type="text"
                                            value={item.product_name}
                                            onChange={(e) => updateItem(globalIndex, 'product_name', e.target.value)}
                                            placeholder="Contoh: Racikan Batuk Dewasa"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-bold focus:outline-none"
                                          />
                                        ) : (
                                          <div className="font-bold text-slate-800 text-sm mt-2">{item.product_name || item.product?.name}</div>
                                        )}
                                      </div>
                                      <div className="sm:col-span-2">
                                        <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5 text-center">Jml Diresepkan</label>
                                        {activeSubTab === 'menunggu' ? (
                                          <input
                                            type="number"
                                            value={item.kuantitas_resep}
                                            onChange={(e) => updateItem(globalIndex, 'kuantitas_resep', Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-750 font-bold text-center focus:outline-none"
                                          />
                                        ) : (
                                          <div className="font-bold text-slate-700 text-center mt-2">{item.kuantitas_resep}</div>
                                        )}
                                      </div>
                                      <div className="sm:col-span-2">
                                        <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5 text-center">Jml Diambil</label>
                                        {activeSubTab === 'menunggu' ? (
                                          <input
                                            type="number"
                                            value={item.kuantitas_ambil}
                                            onChange={(e) => updateItem(globalIndex, 'kuantitas_ambil', Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-[#0D6A36] font-bold text-center focus:outline-none"
                                          />
                                        ) : (
                                          <div className="font-bold text-[#0D6A36] text-center mt-2">{item.kuantitas_ambil}</div>
                                        )}
                                      </div>
                                      <div className="sm:col-span-2 text-center">
                                        <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Signa & Satuan</label>
                                        {activeSubTab === 'menunggu' ? (
                                          <div className="flex gap-1">
                                            <input
                                              type="text"
                                              value={item.signa}
                                              onChange={(e) => updateItem(globalIndex, 'signa', e.target.value)}
                                              placeholder="3x1"
                                              className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                                            />
                                            <select
                                              value={item.satuan}
                                              onChange={(e) => updateItem(globalIndex, 'satuan', e.target.value)}
                                              className="w-full px-1 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-bold bg-white focus:outline-none"
                                            >
                                              <option value="Puyer">Puyer</option>
                                              <option value="Kapsul">Kapsul</option>
                                              <option value="Bungkus">Bungkus</option>
                                            </select>
                                          </div>
                                        ) : (
                                          <div className="font-bold text-slate-700 text-center mt-2">{item.signa} {item.satuan}</div>
                                        )}
                                      </div>
                                      
                                      {activeSubTab === 'menunggu' && (
                                        <div className="sm:col-span-2 text-right">
                                          <button onClick={() => removeItem(globalIndex)} className="text-red-500 hover:text-red-750 text-[10px] font-bold pb-2.5 uppercase">
                                            Hapus
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    {/* Racikan Subtotal and Price Override */}
                                    <div className="flex justify-between items-center pt-2 mt-4 border-t border-slate-100">
                                      <div className="text-xs text-slate-500 italic">
                                        *Harga dan komponen racikan dapat disesuaikan pada sistem kasir atau input manual.
                                      </div>
                                      <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-2 text-slate-700 font-bold">
                                          <span>Harga Satuan:</span>
                                          {activeSubTab === 'menunggu' ? (
                                            <div className="flex items-center">
                                              <span className="mr-1">Rp</span>
                                              <input 
                                                type="number"
                                                value={item.harga_satuan}
                                                onChange={(e) => updateItem(globalIndex, 'harga_satuan', Math.max(0, parseInt(e.target.value) || 0))}
                                                className="w-24 text-right py-1 px-2 border border-slate-200 rounded text-slate-700 focus:outline-none"
                                              />
                                            </div>
                                          ) : (
                                            <span>Rp {(item.harga_satuan || 0).toLocaleString('id-ID')}</span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0D6A36] font-bold text-sm">
                                          <span>Subtotal Racikan:</span>
                                          <span>Rp {(item.subtotal || 0).toLocaleString('id-ID')}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )})}
                                {prescriptionItems.filter(item => item.is_racikan).length === 0 && (
                                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                                    <p className="text-slate-400 font-medium italic text-sm">Belum ada obat racikan.</p>
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>

                          {/* Catatan Farmasi */}
                          <div>
                            <p className="font-['Inter',sans-serif] font-bold text-[10px] text-slate-400 tracking-wider uppercase mb-2">CATATAN FARMASI</p>
                            <textarea
                              rows={3}
                              value={validationNotes}
                              onChange={(e) => setValidationNotes(e.target.value)}
                              placeholder="Tambahkan instruksi khusus untuk pasien atau keterangan farmasi..."
                              className="w-full p-4 bg-white border border-slate-200 rounded-xl font-['Inter',sans-serif] text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] resize-none shadow-sm transition-all"
                            />
                          </div>

                        </div>

                        {/* Right column with thumbnail file of prescription & total price block */}
                        <div className="col-span-12 lg:col-span-3 space-y-6">
                          
                          {/* Resep Document Card */}
                          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                            <div className="bg-[#0D6A36] text-white px-4 py-2.5 font-bold text-xs flex justify-between items-center">
                              <span>Resep</span>
                              <Search size={14} className="cursor-pointer" />
                            </div>
                            <div className="bg-white p-4">
                              <div className="relative group overflow-hidden rounded-lg aspect-[3/4] border border-slate-100">
                                <img
                                  src={selectedPrescription.file_foto || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400"}
                                  alt="Surat Resep Asli"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                                />
                                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow">
                                    <ZoomIn size={18} className="text-[#0D6A36]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Total Harga Summary Card */}
                          <div className="bg-white rounded-xl p-5 border border-slate-200 flex items-center justify-between text-right shadow-sm">
                            <div className="text-left">
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">TOTAL HARGA</p>
                            </div>
                            <div>
                              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-right">IDR</p>
                              <p className="text-2xl font-bold text-[#0D6A36] mt-0.5">
                                {totalHargaVal.toLocaleString('id-ID')}
                              </p>
                            </div>
                          </div>

                          {/* Validation CTA Buttons */}
                          <div className="space-y-3 pt-2">
                            <button 
                              onClick={() => {
                                router.put(`/pharmacist/prescriptions/${selectedPrescription.id}`, {
                                  status_validasi: 'disetujui',
                                  doctor_name: doctorName,
                                  doctor_poli: doctorPoli,
                                  doctor_ppk: doctorPPK,
                                  doctor_alamat: doctorAlamat,
                                  catatan_apoteker: validationNotes,
                                  total_biaya: totalHargaVal,
                                  items: prescriptionItems
                                }, { onSuccess: () => setPrescriptionView('list') });
                              }}
                              className="w-full bg-[#0D6A36] hover:bg-[#0a542b] text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(13,106,54,0.15)] hover:shadow-lg transition-all"
                            >
                              <CheckCircle size={15} />
                              <span>BUAT RESEP</span>
                            </button>
                            <button 
                              onClick={() => {
                                router.put(`/pharmacist/prescriptions/${selectedPrescription.id}`, {
                                  status_validasi: 'ditolak',
                                  catatan_apoteker: validationNotes
                                }, { onSuccess: () => setPrescriptionView('list') });
                              }}
                              className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
                            >
                              <XCircle size={15} />
                              <span>TOLAK</span>
                            </button>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}
                </div>

            </div>
          )}

          {activeTab === 'products' && (
            <div className="max-w-[1600px] mx-auto">
              {/* Header Section */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] font-semibold tracking-[-0.7px] text-[#171d19]">
                    Produk & Stok
                  </h2>
                  <p className="mt-1 font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">
                    Pantau katalog obat dan ketersediaan stok
                  </p>
                </div>
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
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      placeholder="Cari produk..."
                      className="w-full rounded-xl border border-[#f1f5f9] bg-[#f9fafb] py-3 pr-4 pl-12 font-['Inter',sans-serif] text-[14px] text-[#171d19] transition-all placeholder:text-[#6e7a70] focus:border-[#0D6A36] focus:bg-white focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
                    />
                  </div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-3 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19] transition-all focus:border-[#0D6A36] focus:ring-2 focus:ring-[#0D6A36]/20 focus:outline-none"
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
                    {productsWithSales
                      .filter((product: any) => {
                        const matchesSearch = product.nama_obat
                          .toLowerCase()
                          .includes(productSearchQuery.toLowerCase());
                        const matchesCategory =
                          productCategoryFilter === 'all' ||
                          product.jenis_obat === productCategoryFilter;
                        return matchesSearch && matchesCategory;
                      })
                      .map((product: any) => (
                        <tr
                          key={product.id}
                          className="border-b border-[#f1f5f9] transition-colors last:border-0 hover:bg-[#fafaf8]"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {product.gambar ? (
                                <img
                                  src={
                                    product.gambar.startsWith('http')
                                      ? product.gambar
                                      : `/storage/${product.gambar}`
                                  }
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
                                product.jenis_obat === 'bebas'
                                  ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                  : product.jenis_obat === 'keras'
                                  ? 'border border-red-200 bg-red-50 text-red-700'
                                  : 'border border-amber-200 bg-amber-50 text-amber-700'
                              }`}
                            >
                              {product.jenis_obat === 'bebas'
                                ? 'Bebas'
                                : product.jenis_obat === 'keras'
                                ? 'Keras'
                                : 'Terbatas'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`font-['Inter',sans-serif] text-[14px] font-semibold ${
                                product.stok < 10
                                  ? 'text-red-700'
                                  : product.stok < 50
                                  ? 'text-amber-700'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {product.stok}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-['Inter',sans-serif] text-[14px] font-medium text-[#171d19]">
                            Rp {parseFloat(product.harga).toLocaleString('id-ID')}
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
                                )
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setViewingProductDetail(product);
                                  setIsDetailModalOpen(true);
                                }}
                                className="group inline-flex items-center gap-1.5 rounded-lg border border-[#0D6A36]/30 px-3 py-1.5 font-['Inter',sans-serif] text-xs font-semibold text-[#0D6A36] bg-[#0D6A36]/5 hover:bg-[#0D6A36] hover:text-white transition-all duration-200"
                                title="Detail Produk"
                              >
                                <Eye size={14} />
                                <span>Detail</span>
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

          {activeTab === 'settings' && (
            <div className="max-w-[1600px] mx-auto">
              <div className="mb-6">
                  <h2 className="font-['Inter',sans-serif] text-2xl font-bold text-[#0D6A36] capitalize">
                      Pengaturan Profil
                  </h2>
                  <p className="font-['Inter',sans-serif] text-sm text-slate-400 mt-1">
                      Kelola informasi dasar dan keamanan akun apoteker Anda.
                  </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
                {recentlySuccessful && (
                    <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-600 font-['Inter',sans-serif]">
                        Profil berhasil diperbarui.
                    </div>
                )}
                
                <form onSubmit={submitProfile} className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover shadow-sm border border-[#E2E8F0]" />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 shadow-sm border border-[#E2E8F0]">
                                <span className="font-['Roboto_Condensed',sans-serif] text-[28px] font-bold text-slate-500">
                                    {user?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || 'AP'}
                                </span>
                            </div>
                        )}
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#0D6A36] text-white transition-colors hover:bg-[#0a542b]"
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
                        <h3 className="font-['Inter',sans-serif] text-[18px] font-bold text-slate-800">
                            {user?.name || 'Apoteker'}
                        </h3>
                        <p className="font-['Inter',sans-serif] text-[14px] text-slate-400">
                            Pharmacist
                        </p>
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-1 font-['Inter',sans-serif] text-[12px] font-bold text-[#0D6A36] hover:underline">
                            Ganti Foto Profil
                        </button>
                        {errors.avatar && <p className="mt-1 text-xs text-red-600">{errors.avatar}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                      required
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                      required
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                      No. Telepon
                    </label>
                    <input
                      type="text"
                      value={data.phone}
                      onChange={e => setData('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-slate-400">
                            Password Baru (Kosongkan jika tidak diubah)
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-2 block font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider text-slate-400">
                            Konfirmasi Password Baru
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
                  <button type="submit" disabled={processing} className="bg-[#0D6A36] hover:bg-[#0a542b] px-6 py-3 rounded-xl font-semibold font-['Inter',sans-serif] text-sm text-white transition-colors disabled:opacity-70">
                    {processing ? 'Menyimpan...' : 'Simpan Profil'}
                  </button>
                </div>
              </form>
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
                                            disiapkan: 'Disiapkan',
                                            dikirim: 'Dikirim',
                                            selesai: 'Selesai',
                                            dibatalkan: 'Dibatalkan',
                                        };
                                        const statusColors: Record<string, string> = {
                                            menunggu_pembayaran: 'bg-amber-500',
                                            diproses: 'bg-blue-500',
                                            disiapkan: 'bg-purple-500',
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
        {/* Mobile Sidebar Navigation Drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Backdrop */}
            <div 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/55 backdrop-blur-sm"
            />
            
            {/* Drawer Content */}
            <aside className="relative w-64 bg-white flex flex-col justify-between h-full shadow-2xl z-50">
              <div>
                {/* Logo Brand */}
                <div className="flex items-center justify-between px-6 h-20 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)] shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A] leading-tight">
                      Apotek Jaya Farma
                    </h2>
                  </div>
                  <button 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 py-6 space-y-1.5">
                  <button
                    onClick={() => {
                      setActiveTab('dashboard');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'dashboard'
                        ? 'bg-[#E7F5EC] text-[#0D6A36]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-[#0D6A36]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                      </svg>
                      <span>Dashboard</span>
                    </div>
                    {activeTab === 'dashboard' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('prescriptions');
                      setPrescriptionView('list');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'prescriptions'
                        ? 'bg-[#E7F5EC] text-[#0D6A36]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className={`w-5 h-5 ${activeTab === 'prescriptions' ? 'text-[#0D6A36]' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Resep</span>
                    </div>
                    {activeTab === 'prescriptions' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('orders');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'orders'
                        ? 'bg-[#E7F5EC] text-[#0D6A36]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'text-[#0D6A36]' : 'text-slate-400'}`} />
                      <span>Pesanan</span>
                    </div>
                    {activeTab === 'orders' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('products');
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'products'
                        ? 'bg-[#E7F5EC] text-[#0D6A36]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className={`w-5 h-5 ${activeTab === 'products' ? 'text-[#0D6A36]' : 'text-slate-400'}`} />
                      <span>Produk dan Stok</span>
                    </div>
                    {activeTab === 'products' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
                  </button>
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-[#E2E8F0] space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'settings'
                      ? 'bg-[#E7F5EC] text-[#0D6A36]'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Settings size={18} className={activeTab === 'settings' ? 'text-[#0D6A36]' : 'text-slate-400'} />
                  <span>Pengaturan</span>
                </button>
                <button
                  onClick={(e) => {
                    setIsMobileSidebarOpen(false);
                    handlePharmacistLogout(e);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
                >
                  <LogOut size={18} className="text-red-500" />
                  <span>Keluar</span>
                </button>
              </div>
            </aside>
          </div>
        )}
        </main>
      </div>
      
      {/* Product Detail Modal */}
      {isDetailModalOpen && viewingProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => {
              setIsDetailModalOpen(false);
              setViewingProductDetail(null);
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Body */}
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#E2E8F0] z-10 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] shrink-0">
              <h3 className="font-['Roboto_Condensed',sans-serif] text-xl font-bold text-[#171d19]">
                Detail Produk Obat
              </h3>
              <button 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setViewingProductDetail(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Upper Grid (Image + Main Stats) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Image Column */}
                <div className="md:col-span-1 flex flex-col items-center">
                  {viewingProductDetail.gambar ? (
                    <img 
                      src={viewingProductDetail.gambar.startsWith('http') ? viewingProductDetail.gambar : `/storage/${viewingProductDetail.gambar}`} 
                      alt={viewingProductDetail.nama_obat} 
                      className="w-full aspect-square rounded-2xl object-cover border border-[#E2E8F0] shadow-sm"
                    />
                  ) : (
                    <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] border border-[#E2E8F0] flex items-center justify-center text-slate-400">
                      <Package size={48} className="opacity-40" />
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-col gap-2 w-full">
                    {/* Golongan Obat Badge */}
                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="font-['Inter',sans-serif] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Golongan</span>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          viewingProductDetail.jenis_obat === 'bebas'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : viewingProductDetail.jenis_obat === 'keras'
                            ? 'border border-red-200 bg-red-50 text-red-700'
                            : 'border border-amber-200 bg-amber-50 text-amber-700'
                        }`}
                      >
                        {viewingProductDetail.jenis_obat === 'bebas'
                          ? 'Bebas'
                          : viewingProductDetail.jenis_obat === 'keras'
                          ? 'Keras'
                          : 'Terbatas'}
                      </span>
                    </div>
                    
                    {/* Active Status Badge */}
                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="font-['Inter',sans-serif] text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</span>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          viewingProductDetail.is_active
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border border-slate-200 bg-slate-50 text-slate-500'
                        }`}
                      >
                        {viewingProductDetail.is_active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Column */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="font-['Roboto_Condensed',sans-serif] text-2xl font-bold text-[#171d19]">
                      {viewingProductDetail.nama_obat}
                    </h4>
                    <p className="font-['Inter',sans-serif] text-sm text-[#0D6A36] font-semibold mt-1">
                      Kategori: {viewingProductDetail.category?.nama_kategori || '-'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Harga */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                      <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Harga Retail</p>
                      <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-bold text-[#171d19] mt-1">
                        Rp {parseFloat(viewingProductDetail.harga).toLocaleString('id-ID')}
                      </p>
                    </div>

                    {/* Penjualan */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                      <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Penjualan</p>
                      <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-bold text-[#171d19] mt-1">
                        {viewingProductDetail.sales || 0} unit
                      </p>
                    </div>

                    {/* Stok Sekarang */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                      <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Stok Sekarang</p>
                      <p className={`font-['Roboto_Condensed',sans-serif] text-[18px] font-bold mt-1 ${
                        viewingProductDetail.stok < 10
                          ? 'text-red-700'
                          : viewingProductDetail.stok < 50
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}>
                        {viewingProductDetail.stok} unit
                      </p>
                    </div>

                    {/* Stok Minimum */}
                    <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                      <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Batas Stok Minimum</p>
                      <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-bold text-slate-700 mt-1">
                        {viewingProductDetail.stok_minimum} unit
                      </p>
                    </div>
                  </div>

                  {/* Gejala Tags */}
                  <div>
                    <p className="font-['Inter',sans-serif] text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Label Gejala Terkait</p>
                    <div className="flex flex-wrap gap-2">
                      {viewingProductDetail.symptoms && viewingProductDetail.symptoms.length > 0 ? (
                        viewingProductDetail.symptoms.map((symptom: any, idx: number) => (
                          <span
                            key={idx}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-['Inter',sans-serif] text-xs font-semibold text-blue-700"
                          >
                            {symptom.nama_gejala || symptom}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Tidak ada label gejala</span>
                      )}
                    </div>
                  </div>
                </div>
                
              </div>

              <hr className="border-[#E2E8F0]" />

              {/* Lower Blocks */}
              <div className="space-y-4 font-['Inter',sans-serif]">
                
                {/* Deskripsi */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deskripsi Obat</h5>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {viewingProductDetail.deskripsi || '-'}
                  </p>
                </div>

                {/* Indikasi */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Indikasi Umum</h5>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {viewingProductDetail.indikasi || '-'}
                  </p>
                </div>

                {/* Aturan Pakai */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Aturan Pakai & Dosis</h5>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {viewingProductDetail.aturan_pakai || '-'}
                  </p>
                </div>

                {/* Efek Samping */}
                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Efek Samping</h5>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {viewingProductDetail.efek_samping || '-'}
                  </p>
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-slate-50 flex justify-end shrink-0">
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setViewingProductDetail(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-['Inter',sans-serif] text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
    </div>
  );
}
