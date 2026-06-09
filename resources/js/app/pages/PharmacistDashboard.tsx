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
  Camera
} from 'lucide-react';
import { Link, router, usePage, useForm } from '@inertiajs/react';

export default function PharmacistDashboard({ prescriptions = [], products = [], orders = [] }: any) {
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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'prescriptions' | 'settings'>(() => {
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

  const [activeSubTab, setActiveSubTab] = useState<'menunggu' | 'disetujui' | 'ditolak' | 'pembayaran' | 'editor'>('menunggu');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [prescriptionView, setPrescriptionView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [validationNotes, setValidationNotes] = useState('');
  
  // Order states
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

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
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Pesanan baru masuk dari Budi Santoso', time: '5 menit lalu', isRead: false },
    { id: 2, text: 'Resep RX-20231102-05 perlu diverifikasi segera', time: '15 menit lalu', isRead: false },
    { id: 3, text: 'Pembayaran pesanan #12 berhasil', time: '1 jam lalu', isRead: true }
  ]);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
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
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between sticky top-0 h-screen z-30">
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
          <Link
            href={typeof route !== 'undefined' ? route('logout') : '#'}
            method="post"
            as="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
          >
            <LogOut size={18} className="text-red-500" />
            <span>Keluar</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
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
                      <div className="flex gap-4">
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
                                  <div className="flex items-center justify-between">
                                      <div className="flex flex-1 items-center gap-4 md:gap-6">
                                          {/* Order Info */}
                                          <div className="w-[220px] md:w-[280px] shrink-0">
                                              <div className="flex items-center gap-2 mb-1">
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
                                          <div className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2 w-[80px] shrink-0">
                                              <p className="mb-0.5 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                                  Items
                                              </p>
                                              <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-semibold text-[#171d19]">
                                                  {order.products ? order.products.length : 0}
                                              </p>
                                          </div>

                                          {/* Total */}
                                          <div className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-4 py-2 w-[140px] shrink-0">
                                              <p className="mb-0.5 font-['Inter',sans-serif] text-[11px] font-bold tracking-wider text-[#6e7a70] uppercase">
                                                  Total
                                              </p>
                                              <p className="font-['Roboto_Condensed',sans-serif] text-[18px] font-semibold text-[#006a3f] truncate">
                                                  Rp{' '}
                                                  {parseFloat(order.total_biaya || 0).toLocaleString(
                                                      'id-ID',
                                                  )}
                                              </p>
                                          </div>
                                      </div>

                                      {/* Status & Actions */}
                                      <div className="flex shrink-0 items-center gap-3">
                                          <select
                                              value={order.status}
                                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                              className={`w-[190px] rounded-xl border-2 px-3 py-2.5 font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase focus:ring-2 focus:ring-[#006a3f]/20 focus:outline-none ${config.bg} ${config.color} ${config.border}`}
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
                                              className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-2.5 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:border-[#006a3f] hover:bg-white"
                                          >
                                              Detail
                                          </button>
                                      </div>
                                  </div>
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
                      Resep Menunggu Verifikasi
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
                        { id: 'pembayaran' as const, label: 'Pembayaran' },
                        { id: 'editor' as const, label: 'Informasi Obat' }
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
              
              {/* editor tab content (drug editor) */}
              {activeSubTab === 'editor' ? (
                <div className="max-w-[1000px] mx-auto space-y-6">
                  {/* Search box for drug */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm relative">
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-3 block">
                      Cari Obat untuk Diedit
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Ketik nama obat..."
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                      />
                      {productSearch && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                           {products.filter((p: any) => p.nama_obat.toLowerCase().includes(productSearch.toLowerCase())).map((p: any) => (
                              <button
                                key={p.id}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-[#E2E8F0] last:border-0 font-['Inter',sans-serif] text-sm text-slate-800"
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setProductIndikasi(p.indikasi || '');
                                  setProductAturan(p.aturan_pakai || '');
                                  setProductEfek(p.efek_samping || '');
                                  setProductDeskripsi(p.deskripsi || '');
                                  setProductSearch('');
                                }}
                              >
                                {p.nama_obat}
                              </button>
                           ))}
                           {products.filter((p: any) => p.nama_obat.toLowerCase().includes(productSearch.toLowerCase())).length === 0 && (
                             <div className="px-4 py-3 text-sm text-slate-500 font-['Inter',sans-serif]">Tidak ada obat ditemukan.</div>
                           )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Container */}
                  <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
                      <div>
                        <h2 className="font-['Inter',sans-serif] font-bold text-xl text-slate-800">
                          Edit Informasi Obat
                        </h2>
                        <p className="font-['Inter',sans-serif] text-xs text-slate-400 mt-1">
                          Kelola data deskripsi obat, indikasi, dosis, dan kontraindikasi.
                        </p>
                      </div>
                      {selectedProduct && (
                        <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">
                          Dipilih: {selectedProduct.nama_obat}
                        </span>
                      )}
                    </div>

                    {selectedProduct ? (
                      <div className="space-y-6">
                        <div>
                          <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                            Nama Obat
                          </label>
                          <input
                            type="text"
                            disabled
                            value={selectedProduct.nama_obat}
                            className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none opacity-70 cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                            Indikasi
                          </label>
                          <textarea
                            rows={3}
                            value={productIndikasi}
                            onChange={(e) => setProductIndikasi(e.target.value)}
                            className="w-full p-4 bg-white border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] resize-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                            Aturan Pakai
                          </label>
                          <textarea
                            rows={3}
                            value={productAturan}
                            onChange={(e) => setProductAturan(e.target.value)}
                            className="w-full p-4 bg-white border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] resize-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                            Efek Samping
                          </label>
                          <textarea
                            rows={3}
                            value={productEfek}
                            onChange={(e) => setProductEfek(e.target.value)}
                            className="w-full p-4 bg-white border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] resize-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                            Deskripsi (Kontraindikasi/Tambahan)
                          </label>
                          <textarea
                            rows={3}
                            value={productDeskripsi}
                            onChange={(e) => setProductDeskripsi(e.target.value)}
                            placeholder="Tambahkan kontraindikasi..."
                            className="w-full p-4 bg-white border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] resize-none transition-all"
                          />
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-[#E2E8F0]">
                          <button 
                            onClick={() => {
                              router.put(`/pharmacist/products/${selectedProduct.id}`, {
                                indikasi: productIndikasi,
                                aturan_pakai: productAturan,
                                efek_samping: productEfek,
                                deskripsi: productDeskripsi
                              });
                            }}
                            className="flex-1 bg-[#0D6A36] hover:bg-[#0a542b] py-3.5 rounded-xl font-semibold font-['Inter',sans-serif] text-sm text-white hover:shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <Edit2 size={16} />
                            <span>Simpan Perubahan</span>
                          </button>
                          <button 
                            onClick={() => setSelectedProduct(null)}
                            className="px-6 py-3.5 rounded-xl font-semibold font-['Inter',sans-serif] text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
                        <p className="font-['Inter',sans-serif] text-sm text-slate-400">Silakan cari dan pilih obat untuk mengedit informasinya.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Main Table Queues (Menunggu, Disetujui, Ditolak, Pembayaran) */
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
                                      <div className="flex items-center justify-between">
                                          <div className="flex flex-1 items-center gap-4 md:gap-6">
                                              {/* ID Resep & Waktu Info */}
                                              <div className="w-[220px] md:w-[280px] shrink-0">
                                                  <div className="flex items-center gap-2 mb-1">
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
                                              <div className="flex items-center gap-3 shrink-0">
                                                  <div className="w-10 h-10 rounded-full bg-[#E7F5EC] text-[#0D6A36] flex items-center justify-center font-bold text-sm">
                                                      {(rx.user?.name || rx.customer || 'G').split(' ').map((n: string) => n[0]).join('')}
                                                  </div>
                                                  <span className="font-['Inter',sans-serif] text-[15px] font-semibold text-[#171d19]">
                                                      {rx.user?.name || rx.customer}
                                                  </span>
                                              </div>
                                          </div>

                                          {/* Status & Actions */}
                                          <div className="flex shrink-0 items-center gap-3">
                                              <div className={`px-4 py-2.5 rounded-xl border font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase ${config.bg} ${config.color} ${config.border}`}>
                                                  {config.text}
                                              </div>

                                              <button 
                                                  onClick={() => handleSelectPrescription(rx)}
                                                  className="rounded-xl border border-[#f1f5f9] bg-[#f9fafb] px-5 py-2.5 font-['Inter',sans-serif] text-[13px] font-medium text-[#171d19] transition-all hover:border-[#006a3f] hover:bg-white"
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
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.customer}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Tempat Tanggal Lahir</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.dob || 'Jakarta, 12-05-1985'}</p>
                                </div>
                                <div>
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Email</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.email || 'budi.s@example.com'}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Alamat</p>
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.alamat || 'Jl. Merdeka No. 45, Bekasi'}</p>
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
                                  <p className="font-bold text-slate-800 text-xs">{selectedPrescription.phone || '+628123456789'}</p>
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
              )}

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
        </main>
      </div>
    </div>
  );
}
