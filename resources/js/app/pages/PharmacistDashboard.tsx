import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
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
  SlidersHorizontal
} from 'lucide-react';
import { Link } from '@inertiajs/react';

// List of prescriptions in the queue (second mockup)
const pendingPrescriptions = [
  {
    id: 'RX-20231102-01',
    customer: 'Budi Santoso',
    initials: 'BS',
    date: '2026-06-08 16:58',
    timeLabel: 'Baru saja',
    drug: 'Amoxicillin 500mg',
    priority: 'high',
    age: 41, // 1985 born -> 41 in 2026
    symptoms: 'Infeksi saluran pernapasan',
    status: 'Menunggu',
    nik: '3275084920000001',
    dob: 'Jakarta, 12-05-1985',
    email: 'budi.s@example.com',
    alamat: 'Jl. Merdeka No. 45, Bekasi',
    gender: 'Laki-laki',
    marital: 'Menikah',
    job: 'Karyawan Swasta',
    phone: '+628123456789'
  },
  {
    id: 'RX-20231102-05',
    customer: 'Siti Aminah',
    initials: 'SA',
    date: '2026-06-08 16:48',
    timeLabel: '10 menit lalu',
    drug: 'Omeprazole 20mg',
    priority: 'normal',
    age: 42,
    symptoms: 'GERD',
    status: 'Menunggu',
    nik: '3275084920000005',
    dob: 'Bandung, 18-09-1983',
    email: 'siti.a@example.com',
    alamat: 'Jl. Dago No. 12, Bandung',
    gender: 'Perempuan',
    marital: 'Menikah',
    job: 'Ibu Rumah Tangga',
    phone: '+628129876543'
  },
  {
    id: 'RX-20231102-12',
    customer: 'Ahmad Fauzi',
    initials: 'AF',
    date: '2026-06-08 16:33',
    timeLabel: '25 menit lalu',
    drug: 'Metformin 500mg',
    priority: 'low',
    age: 58,
    symptoms: 'Diabetes tipe 2',
    status: 'Menunggu',
    nik: '3275084920000012',
    dob: 'Surabaya, 05-02-1968',
    email: 'ahmad.f@example.com',
    alamat: 'Jl. Pemuda No. 78, Surabaya',
    gender: 'Laki-laki',
    marital: 'Menikah',
    job: 'Pensiunan',
    phone: '+628134567890'
  },
  {
    id: 'RX-20231102-15',
    customer: 'Ratna Kartika',
    initials: 'RK',
    date: '2026-06-08 16:26',
    timeLabel: '32 menit lalu',
    drug: 'Paracetamol 500mg',
    priority: 'normal',
    age: 28,
    symptoms: 'Demam dan pusing',
    status: 'Menunggu',
    nik: '3275084920000015',
    dob: 'Medan, 22-11-1997',
    email: 'ratna.k@example.com',
    alamat: 'Jl. Sudirman No. 9, Medan',
    gender: 'Perempuan',
    marital: 'Belum Menikah',
    job: 'Mahasiswi',
    phone: '+628123459876'
  },
  {
    id: 'RX-20231102-18',
    customer: 'Dedi Prasetyo',
    initials: 'DP',
    date: '2026-06-08 16:13',
    timeLabel: '45 menit lalu',
    drug: 'Cataflam 50mg',
    priority: 'high',
    age: 31,
    symptoms: 'Sakit gigi akut',
    status: 'Menunggu',
    nik: '3275084920000018',
    dob: 'Yogyakarta, 30-07-1994',
    email: 'dedi.p@example.com',
    alamat: 'Jl. Malioboro No. 34, Yogyakarta',
    gender: 'Laki-laki',
    marital: 'Belum Menikah',
    job: 'Wiraswasta',
    phone: '+628112345678'
  }
];

// Approved list mock data
const approvedPrescriptions = [
  { id: 'RX-20231102-02', customer: 'Sarah Wulandari', initials: 'SW', date: '2026-06-08 15:30', timeLabel: '1 jam lalu', drug: 'Paracetamol 500mg', priority: 'normal', age: 24, symptoms: 'Pusing kepala', status: 'Disetujui' },
  { id: 'RX-20231102-03', customer: 'Joko Widodo', initials: 'JW', date: '2026-06-08 14:15', timeLabel: '2 jam lalu', drug: 'Amlodipine 5mg', priority: 'low', age: 62, symptoms: 'Hipertensi', status: 'Disetujui' }
];

// Rejected list mock data
const rejectedPrescriptions = [
  { id: 'RX-20231102-04', customer: 'Luhut Pandjaitan', initials: 'LP', date: '2026-06-08 13:00', timeLabel: '3 jam lalu', drug: 'Ibuprofen 400mg', priority: 'high', age: 50, symptoms: 'Radang sendi', status: 'Ditolak', reason: 'Kontraindikasi dengan obat ginjal' }
];

// Payment queue mock data
const paymentQueue = [
  { id: 'RX-20231102-06', customer: 'Megawati Soekarno', initials: 'MS', date: '2026-06-08 12:45', timeLabel: '4 jam lalu', drug: 'Insulin Glargine', priority: 'high', age: 72, symptoms: 'Diabetes Melitus', status: 'Menunggu Pembayaran' }
];

export default function PharmacistDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prescriptions' | 'settings'>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<'menunggu' | 'disetujui' | 'ditolak' | 'pembayaran' | 'editor'>('menunggu');
  const [selectedPrescription, setSelectedPrescription] = useState(pendingPrescriptions[0]);
  const [prescriptionView, setPrescriptionView] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('November');
  const [validationNotes, setValidationNotes] = useState('');

  // Doctor detail state (Mockup 3)
  const [doctorName, setDoctorName] = useState('Dr. Hermawan');
  const [doctorPoli, setDoctorPoli] = useState('Umum');
  const [doctorPPK, setDoctorPPK] = useState('Puskesmas Tebet');
  const [doctorAlamat, setDoctorAlamat] = useState('Jl. Raya Kemerdekaan No. 10, Jakarta Selatan');

  // Drugs validation state (Mockup 3)
  const [nonRacikQty, setNonRacikQty] = useState(10);
  const [nonRacikAmbil, setNonRacikAmbil] = useState(10);
  const [nonRacikSigna1, setNonRacikSigna1] = useState(3);
  const [nonRacikSigna2, setNonRacikSigna2] = useState(1);

  const [racikQty, setRacikQty] = useState(10);
  const [racikSigna1, setRacikSigna1] = useState(3);
  const [racikSigna2, setRacikSigna2] = useState(1);
  const [racikSatuan, setRacikSatuan] = useState('Puyer');
  const [racikDosis, setRacikDosis] = useState(250); // mg

  const priorityConfig = {
    high: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    normal: { label: 'Normal', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    low: { label: 'Low', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  };

  const getFilteredList = () => {
    let rawList = [];
    if (activeSubTab === 'menunggu') rawList = pendingPrescriptions;
    else if (activeSubTab === 'disetujui') rawList = approvedPrescriptions;
    else if (activeSubTab === 'ditolak') rawList = rejectedPrescriptions;
    else if (activeSubTab === 'pembayaran') rawList = paymentQueue;
    
    return rawList.filter(rx => 
      rx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.drug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const activeFilteredList = getFilteredList();

  // Price calculations
  const priceNonRacik = 2500; // per tablet
  const priceCompo = 3500; // per tablet
  
  const subtotalNonRacik = nonRacikQty * priceNonRacik;
  const numPillsNeeded = Math.ceil(racikQty * (racikDosis / 500));
  const subtotalRacik = numPillsNeeded * priceCompo;
  const totalHargaVal = subtotalNonRacik + subtotalRacik;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col justify-between sticky top-0 h-screen z-30">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E2E8F0]">
            <div className="p-2 bg-[#E7F5EC] rounded-xl text-[#0D6A36]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="font-['Inter',sans-serif] font-bold text-sm text-[#1A1A1A] leading-tight">
                Apotek Jaya Farma
              </h2>
              <p className="font-['Inter',sans-serif] text-[10px] text-[#1A1A1A]/50 font-bold tracking-wider">
                PROFESSIONAL PORTAL
              </p>
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
                <span>Prescriptions</span>
              </div>
              {activeTab === 'prescriptions' && <div className="w-1.5 h-5 bg-[#0D6A36] rounded-full" />}
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
            <span>Settings</span>
          </button>
          <Link
            href={typeof route !== 'undefined' ? route('logout') : '#'}
            method="post"
            as="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-['Inter',sans-serif] text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
          >
            <LogOut size={18} className="text-red-500" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic Header */}
        <header className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {activeTab === 'dashboard' ? (
            /* Dashboard Search in Header */
            <div className="relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari resep, obat, atau pasien..."
                className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full font-['Inter',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] transition-all"
              />
            </div>
          ) : activeTab === 'prescriptions' ? (
            /* Prescriptions Header Menu Tabs (Mockup 2) */
            <div className="flex items-center gap-8 h-full">
              <div className="bg-[#E7F5EC] text-[#0D6A36] px-4 py-1.5 rounded-xl font-['Inter',sans-serif] font-bold text-sm">
                Verifikasi Resep
              </div>
              <div className="flex gap-6 h-full items-center">
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
                      className={`font-['Inter',sans-serif] text-sm font-semibold h-full border-b-2 transition-all relative top-[1px] px-1 ${
                        isActive
                          ? 'border-[#0D6A36] text-[#0D6A36]'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Settings Header Title */
            <div className="font-['Inter',sans-serif] font-bold text-lg text-slate-800">
              Pengaturan Profil
            </div>
          )}

          {/* Quick Info & Profile */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
              <HelpCircle size={20} />
            </button>

            <div className="h-8 border-l border-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-['Inter',sans-serif] font-bold text-sm text-slate-800 leading-tight">
                  Apt. Sarah Azizah
                </p>
                <p className="font-['Inter',sans-serif] text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">
                  LEAD PHARMACIST
                </p>
              </div>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
                alt="Apt. Sarah Azizah"
                className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
              />
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
                    Selamat Pagi, Apt. Sarah Azizah
                  </h1>
                  <p className="font-['Inter',sans-serif] text-sm text-white/80 leading-relaxed">
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Resep Hari Ini', value: '156', sub: 'vs. 139 kemarin', badge: '+12%', icon: FileText, iconBg: 'bg-[#e7f5ec] text-[#0D6A36]', hasBadge: true },
                  { label: 'Menunggu Verifikasi', value: '8', sub: 'Segera periksa antrean', subColor: 'text-amber-600 font-semibold', icon: Clock, iconBg: 'bg-amber-50 text-amber-600' },
                  { label: 'Resep Disetujui', value: '142', sub: '91% dari total masuk', icon: CheckCircle, iconBg: 'bg-[#e7f5ec] text-[#0D6A36]' },
                  { label: 'Resep Ditolak', value: '6', sub: 'Memerlukan follow-up dokter', icon: XCircle, iconBg: 'bg-red-50 text-red-600' }
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
                    <span className="text-xs font-semibold px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-600 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      7 Hari Terakhir
                    </span>
                  </div>
                  
                  {/* The Chart Body */}
                  <div className="flex-1 flex items-end justify-between px-4 pb-2 relative h-48">
                    {/* Grid lines in background */}
                    <div className="absolute inset-x-0 bottom-8 top-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-b border-[#E2E8F0]/60 w-full"></div>
                      <div className="border-b border-[#E2E8F0]/60 w-full"></div>
                      <div className="border-b border-[#E2E8F0]/60 w-full"></div>
                      <div className="border-b border-[#E2E8F0]/60 w-full"></div>
                    </div>

                    {/* Bars */}
                    {[
                      { day: 'Sen', value: 70 },
                      { day: 'Sel', value: 90 },
                      { day: 'Rab', value: 55 },
                      { day: 'Kam', value: 120 },
                      { day: 'Jum', value: 105 },
                      { day: 'Sab', value: 145, active: true },
                      { day: 'Min', value: 40 },
                    ].map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-3 z-10 w-12 group relative">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded absolute bottom-full mb-1 shadow-md whitespace-nowrap pointer-events-none">
                          {data.value} Resep
                        </div>
                        <div 
                          className={`w-3.5 rounded-full transition-all duration-500 ease-out ${
                            data.active 
                              ? 'bg-[#0D6A36] shadow-[0_4px_12px_rgba(13,106,54,0.3)]' 
                              : 'bg-[#B6D0BD] group-hover:bg-[#97BA9F]'
                          }`}
                          style={{ height: `${(data.value / 160) * 100}%`, minHeight: '8px' }}
                        />
                        <span 
                          className={`font-['Inter',sans-serif] text-xs transition-colors ${
                            data.active ? 'text-[#0D6A36] font-bold' : 'text-slate-400 font-medium'
                          }`}
                        >
                          {data.day}
                        </span>
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
                    {[
                      { action: 'Approved', info: 'Resep #RX-882190 telah diverifikasi', detail: '2 menit yang lalu · Oleh Apt. Sarah', isSuccess: true },
                      { action: 'Rejected', info: 'Resep #RX-882188 ditolak', detail: '45 menit yang lalu · Alasan: Kontraindikasi', isDanger: true }
                    ].map((act, index) => (
                      <div key={index} className="flex items-center justify-between p-6 hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                        <div className="flex items-start gap-4">
                          <span className={`w-2.5 h-2.5 rounded-full mt-2.5 shrink-0 ${
                            act.isSuccess ? 'bg-[#0D6A36]' : act.isDanger ? 'bg-red-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <p className="font-['Inter',sans-serif] text-sm font-semibold text-slate-800">
                              {act.info}
                            </p>
                            <p className="font-['Inter',sans-serif] text-xs text-slate-400 mt-1">
                              {act.detail}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    ))}
                  </div>

                  {/* See All Activities Button */}
                  <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 text-center">
                    <button className="text-sm font-bold text-[#0D6A36] hover:text-[#0a542b] transition-colors">
                      Lihat Semua Aktivitas
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="max-w-[1600px] mx-auto">
              
              {/* editor tab content (drug editor) */}
              {activeSubTab === 'editor' ? (
                <div className="max-w-[1000px] mx-auto space-y-6">
                  {/* Search box for drug */}
                  <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm">
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-3 block">
                      Cari Obat untuk Diedit
                    </label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        placeholder="Ketik nama obat..."
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                      />
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
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-xs font-semibold">
                        Terakhir diupdate: 2 hari lalu
                      </span>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                          Nama Obat
                        </label>
                        <input
                          type="text"
                          defaultValue="Paracetamol 500mg"
                          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                          Indikasi
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="Mengatasi demam dan meredakan nyeri ringan hingga sedang seperti sakit kepala, sakit gigi, dan nyeri otot."
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white resize-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                          Aturan Pakai
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="Dewasa: 1-2 tablet setiap 4-6 jam. Maksimal 8 tablet per hari. Diminum sesudah makan."
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white resize-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                          Efek Samping
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="Jarang terjadi. Dapat menyebabkan mual, muntah, atau reaksi alergi pada beberapa orang."
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white resize-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                          Kontraindikasi
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tambahkan kontraindikasi..."
                          className="w-full p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white resize-none transition-all"
                        />
                      </div>

                      <div className="flex gap-4 pt-6 border-t border-[#E2E8F0]">
                        <button className="flex-1 bg-[#0D6A36] hover:bg-[#0a542b] py-3.5 rounded-xl font-semibold font-['Inter',sans-serif] text-sm text-white hover:shadow-md transition-all flex items-center justify-center gap-2">
                          <Edit2 size={16} />
                          <span>Simpan Perubahan</span>
                        </button>
                        <button className="px-6 py-3.5 rounded-xl font-semibold font-['Inter',sans-serif] text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Main Table Queues (Menunggu, Disetujui, Ditolak, Pembayaran) */
                <div>
                  {prescriptionView === 'list' ? (
                    /* Grid Layout containing the Main Table */
                    <div className="space-y-6">
                      
                      {/* Section Titles */}
                      <div>
                        <h2 className="font-['Inter',sans-serif] text-2xl font-bold text-[#0D6A36] capitalize">
                          Resep {activeSubTab} Verifikasi
                        </h2>
                        <p className="font-['Inter',sans-serif] text-sm text-slate-400 mt-1">
                          Daftar resep yang baru masuk dan memerlukan verifikasi apoteker.
                        </p>
                      </div>

                      {/* Main White Table Card Container */}
                      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
                        
                        {/* Table Controls (Search, Month select, Filter button) */}
                        <div className="p-6 border-b border-[#E2E8F0] flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            
                            {/* Search bar inside container */}
                            <div className="relative w-full sm:w-64">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari ID Resep atau Pasien..."
                                className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-xs focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36]"
                              />
                            </div>

                            {/* Month Dropdown filter */}
                            <div className="relative w-full sm:w-56">
                              <select
                                value={monthFilter}
                                onChange={(e) => setMonthFilter(e.target.value)}
                                className="w-full pl-4 pr-10 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-xs font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36]"
                              >
                                <option value="November">Pilih Bulan (November)</option>
                                <option value="Desember">Pilih Bulan (Desember)</option>
                                <option value="Januari">Pilih Bulan (Januari)</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                              </div>
                            </div>

                          </div>

                          {/* Filter Button */}
                          <button className="w-full sm:w-auto px-4 py-2 border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-xs font-semibold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                            <SlidersHorizontal size={14} />
                            <span>Filter</span>
                          </button>
                        </div>

                        {/* Table Layout */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                                <th className="p-4 font-['Inter',sans-serif] text-xs font-bold tracking-wider text-slate-400 uppercase">ID RESEP</th>
                                <th className="p-4 font-['Inter',sans-serif] text-xs font-bold tracking-wider text-slate-400 uppercase">NAMA PASIEN</th>
                                <th className="p-4 font-['Inter',sans-serif] text-xs font-bold tracking-wider text-slate-400 uppercase">WAKTU MASUK</th>
                                <th className="p-4 font-['Inter',sans-serif] text-xs font-bold tracking-wider text-slate-400 uppercase">STATUS</th>
                                <th className="p-4 font-['Inter',sans-serif] text-xs font-bold tracking-wider text-slate-400 uppercase text-center">AKSI</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E2E8F0]">
                              {activeFilteredList.map((rx) => (
                                <tr key={rx.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                                  {/* ID Resep Link */}
                                  <td className="p-4">
                                    <button 
                                      onClick={() => {
                                        setSelectedPrescription(rx);
                                        setPrescriptionView('detail');
                                        setValidationNotes('');
                                      }}
                                      className="font-['Inter',sans-serif] text-sm font-bold text-[#0D6A36] hover:underline"
                                    >
                                      #{rx.id}
                                    </button>
                                  </td>

                                  {/* Patient Initials Circle + Name */}
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-[#E7F5EC] text-[#0D6A36] flex items-center justify-center font-bold text-xs">
                                        {rx.initials || rx.customer.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <span className="font-['Inter',sans-serif] text-sm font-semibold text-slate-850">
                                        {rx.customer}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Entry Time */}
                                  <td className="p-4 font-['Inter',sans-serif] text-sm text-slate-500 font-medium">
                                    {rx.timeLabel || rx.date.split(' ')[1]}
                                  </td>

                                  {/* Status Indicator Dot Badge */}
                                  <td className="p-4">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-semibold text-slate-800">
                                      <span className={`w-2 h-2 rounded-full ${
                                        rx.status === 'Menunggu' ? 'bg-slate-900' :
                                        rx.status === 'Disetujui' ? 'bg-emerald-500' :
                                        rx.status === 'Ditolak' ? 'bg-red-500' : 'bg-amber-500'
                                      }`} />
                                      {rx.status}
                                    </span>
                                  </td>

                                  {/* Verifikasi Action Button */}
                                  <td className="p-4 text-center">
                                    <button
                                      onClick={() => {
                                        setSelectedPrescription(rx);
                                        setPrescriptionView('detail');
                                        setValidationNotes('');
                                      }}
                                      className="bg-[#0D6A36] hover:bg-[#0a542b] text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                                    >
                                      {activeSubTab === 'menunggu' ? 'Verifikasi' : 'Detail'}
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {activeFilteredList.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="text-center py-12">
                                    <AlertCircle className="mx-auto text-slate-350 mb-2" size={36} />
                                    <p className="font-['Inter',sans-serif] text-sm text-slate-400">Tidak ada resep dalam kategori ini</p>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Table Footer with Pagination */}
                        <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <span className="font-['Inter',sans-serif] text-xs text-slate-400 font-semibold">
                            Menampilkan 1 - {activeFilteredList.length} dari 128 data
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Prev page button */}
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>

                            {/* Page 1 (Active) */}
                            <button className="w-8 h-8 rounded-lg bg-[#0D6A36] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              1
                            </button>

                            {/* Other pages */}
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center justify-center font-semibold text-xs text-slate-500">
                              2
                            </button>
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center justify-center font-semibold text-xs text-slate-500">
                              3
                            </button>
                            <span className="text-slate-400 text-xs font-semibold px-1">...</span>
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 transition-colors flex items-center justify-center font-semibold text-xs text-slate-500">
                              26
                            </button>

                            {/* Next page button */}
                            <button className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>

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
                                  <button className="bg-[#0D6A36] hover:bg-[#0a542b] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                    <span>+ Tambah Obat</span>
                                  </button>
                                </div>

                                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                                  <table className="w-full text-left text-xs border-collapse">
                                    <thead>
                                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                        <th className="p-3">NAMA OBAT</th>
                                        <th className="p-3 text-center">STOK</th>
                                        <th className="p-3 text-center">SATUAN</th>
                                        <th className="p-3 text-right">HARGA</th>
                                        <th className="p-3 text-center w-16">JML RESEP</th>
                                        <th className="p-3 text-center w-16">JML AMBIL</th>
                                        <th className="p-3 text-center w-24">SIGNA</th>
                                        <th className="p-3 text-center">TGL KADALUARSA</th>
                                        <th className="p-3 text-right">SUBTOTAL</th>
                                        <th className="p-3 text-center w-10"></th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                      <tr>
                                        <td className="p-3 font-bold text-slate-800">
                                          <div>{selectedPrescription.drug}</div>
                                          <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Kapsul</div>
                                        </td>
                                        <td className="p-3 text-center text-slate-500 font-semibold">150</td>
                                        <td className="p-3 text-center text-slate-500 font-semibold">Tablet</td>
                                        <td className="p-3 text-right text-slate-500 font-semibold">Rp {priceNonRacik.toLocaleString('id-ID')}</td>
                                        <td className="p-3 text-center">
                                          <input
                                            type="number"
                                            value={nonRacikQty}
                                            onChange={(e) => {
                                              const v = Math.max(0, parseInt(e.target.value) || 0);
                                              setNonRacikQty(v);
                                              setNonRacikAmbil(v);
                                            }}
                                            className="w-12 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                                          />
                                        </td>
                                        <td className="p-3 text-center">
                                          <input
                                            type="number"
                                            value={nonRacikAmbil}
                                            onChange={(e) => setNonRacikAmbil(Math.max(0, parseInt(e.target.value) || 0))}
                                            className="w-12 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                                          />
                                        </td>
                                        <td className="p-3 text-center">
                                          <div className="flex items-center justify-center gap-1">
                                            <input
                                              type="number"
                                              value={nonRacikSigna1}
                                              onChange={(e) => setNonRacikSigna1(Math.max(0, parseInt(e.target.value) || 0))}
                                              className="w-8 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
                                            />
                                            <span className="text-slate-400">x</span>
                                            <input
                                              type="number"
                                              value={nonRacikSigna2}
                                              onChange={(e) => setNonRacikSigna2(Math.max(0, parseInt(e.target.value) || 0))}
                                              className="w-8 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
                                            />
                                          </div>
                                        </td>
                                        <td className="p-3 text-center text-slate-500 font-semibold">12/2025</td>
                                        <td className="p-3 text-right font-bold text-slate-800">
                                          Rp {subtotalNonRacik.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-3 text-center text-red-500 hover:text-red-750 cursor-pointer">
                                          <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </td>
                                      </tr>
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
                                  <button className="border border-[#0D6A36] text-[#0D6A36] hover:bg-emerald-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                                    <span>+ Tambah Racikan Baru</span>
                                  </button>
                                </div>

                                {/* Compounded Box Card */}
                                <div className="border border-slate-200 border-dashed rounded-xl p-5 space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                    <div className="sm:col-span-4">
                                      <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Nama Racikan</label>
                                      <input
                                        type="text"
                                        defaultValue="Racikan Batuk Dewasa"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-bold focus:outline-none"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5 text-center">Jml Racikan</label>
                                      <input
                                        type="number"
                                        value={racikQty}
                                        onChange={(e) => setRacikQty(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-750 font-bold text-center focus:outline-none"
                                      />
                                    </div>
                                    <div className="sm:col-span-3 text-center">
                                      <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Signa</label>
                                      <div className="flex items-center justify-center gap-1.5">
                                        <input
                                          type="number"
                                          value={racikSigna1}
                                          onChange={(e) => setRacikSigna1(Math.max(0, parseInt(e.target.value) || 0))}
                                          className="w-10 px-1 py-2 border border-slate-200 rounded-lg text-xs text-center font-semibold focus:outline-none"
                                        />
                                        <span className="text-slate-400">x</span>
                                        <input
                                          type="number"
                                          value={racikSigna2}
                                          onChange={(e) => setRacikSigna2(Math.max(0, parseInt(e.target.value) || 0))}
                                          className="w-10 px-1 py-2 border border-slate-200 rounded-lg text-xs text-center font-semibold focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <label className="block text-slate-400 font-bold text-[9px] uppercase tracking-wider mb-1.5">Satuan</label>
                                      <select
                                        value={racikSatuan}
                                        onChange={(e) => setRacikSatuan(e.target.value)}
                                        className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs text-slate-700 font-bold bg-white focus:outline-none"
                                      >
                                        <option value="Puyer">Puyer</option>
                                        <option value="Kapsul">Kapsul</option>
                                        <option value="Tablet">Tablet</option>
                                      </select>
                                    </div>
                                    <div className="sm:col-span-1 text-right">
                                      <button className="text-red-500 hover:text-red-750 text-[10px] font-bold pb-2.5">
                                        HAPUS
                                      </button>
                                    </div>
                                  </div>

                                  {/* Composition Ingredients Sub-Table */}
                                  <div className="overflow-x-auto border border-slate-100 rounded-lg">
                                    <table className="w-full text-left text-xs border-collapse">
                                      <thead>
                                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold">
                                          <th className="p-2.5">KOMPOSISI OBAT</th>
                                          <th className="p-2.5 text-center">STOK</th>
                                          <th className="p-2.5 text-center w-24">DOSIS (MG)</th>
                                          <th className="p-2.5 text-center">JML DIBUTUHKAN</th>
                                          <th className="p-2.5 text-right">HARGA</th>
                                          <th className="p-2.5 text-center w-10"></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="p-2.5 font-bold text-slate-800">Paracetamol 500mg</td>
                                          <td className="p-2.5 text-center text-slate-500 font-semibold">1000</td>
                                          <td className="p-2.5 text-center">
                                            <input
                                              type="number"
                                              value={racikDosis}
                                              onChange={(e) => setRacikDosis(Math.max(0, parseInt(e.target.value) || 0))}
                                              className="w-16 text-center py-1 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                                            />
                                          </td>
                                          <td className="p-2.5 text-center font-bold text-slate-700">
                                            {numPillsNeeded} Tab
                                          </td>
                                          <td className="p-2.5 text-right text-slate-500 font-semibold">Rp 5.000</td>
                                          <td className="p-2.5 text-center text-slate-400 hover:text-red-500 cursor-pointer">
                                            <svg className="w-4 h-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Add composition link */}
                                  <button className="text-[#0D6A36] hover:text-[#0a542b] font-bold text-xs flex items-center gap-1 transition-colors">
                                    <span>+ Tambah Komposisi</span>
                                  </button>

                                  {/* Subtotal calculation box */}
                                  <div className="flex justify-end pt-2">
                                    <div className="w-64 space-y-1 text-xs">
                                      <div className="flex justify-between text-slate-400 font-semibold">
                                        <span>Embalase:</span>
                                        <span className="text-slate-700 font-bold">Rp 0</span>
                                      </div>
                                      <div className="flex justify-between text-slate-400 font-semibold">
                                        <span>Harga Racikan:</span>
                                        <span className="text-slate-700 font-bold">Rp 0</span>
                                      </div>
                                      <div className="flex justify-between text-[#0D6A36] font-bold pt-1.5 border-t border-slate-100 text-sm">
                                        <span>Subtotal Racikan:</span>
                                        <span>Rp {subtotalRacik.toLocaleString('id-ID')}</span>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Catatan Farmasi */}
                          <div>
                            <p className="font-['Inter',sans-serif] font-bold text-[10px] text-slate-400 tracking-wider uppercase mb-2">CATATAN FARMASI</p>
                            <textarea
                              rows={3}
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
                                  src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400"
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
                            <button className="w-full bg-[#0D6A36] hover:bg-[#0a542b] text-white py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(13,106,54,0.15)] hover:shadow-lg transition-all">
                              <CheckCircle size={15} />
                              <span>BUAT RESEP</span>
                            </button>
                            <button className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
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
            <div className="max-w-[1000px] mx-auto bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
              <h2 className="font-['Inter',sans-serif] font-bold text-2xl text-slate-800 mb-2">
                Pengaturan Sistem
              </h2>
              <p className="font-['Inter',sans-serif] text-sm text-slate-400 mb-6">
                Kelola profil apoteker, pengaturan notifikasi, dan preferensi portal.
              </p>
              
              <div className="border-t border-[#E2E8F0] pt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
                    alt="Apt. Sarah Azizah"
                    className="w-20 h-20 rounded-full object-cover border border-[#E2E8F0]"
                  />
                  <div>
                    <h3 className="font-['Inter',sans-serif] font-bold text-lg text-slate-800">
                      Apt. Sarah Azizah
                    </h3>
                    <p className="font-['Inter',sans-serif] text-sm text-slate-400">
                      Lead Pharmacist · ID Apoteker: AP-77192
                    </p>
                    <button className="text-xs text-[#0D6A36] font-bold mt-1 hover:underline">Ganti Foto Profil</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="sarah.azizah@jayafarma.com"
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-xs text-slate-400 tracking-wider uppercase mb-2 block">
                      No. Telepon
                    </label>
                    <input
                      type="text"
                      defaultValue="+62 812-3456-7890"
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-['Inter',sans-serif] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0D6A36]/20 focus:border-[#0D6A36] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
                  <button className="bg-[#0D6A36] hover:bg-[#0a542b] px-6 py-3 rounded-xl font-semibold font-['Inter',sans-serif] text-sm text-white transition-colors">
                    Simpan Profil
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
