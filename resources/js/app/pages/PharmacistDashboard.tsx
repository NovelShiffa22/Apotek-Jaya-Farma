import { useState } from 'react';
import { CheckCircle, XCircle, Edit2, Search, Clock, AlertCircle, FileText, User, Calendar } from 'lucide-react';

const pendingPrescriptions = [
  {
    id: 'RX-001',
    customer: 'John Doe',
    date: '2026-04-29 10:30',
    drug: 'Amoxicillin 500mg',
    priority: 'high',
    age: 35,
    symptoms: 'Infeksi saluran pernapasan'
  },
  {
    id: 'RX-002',
    customer: 'Jane Smith',
    date: '2026-04-29 11:15',
    drug: 'Omeprazole 20mg',
    priority: 'normal',
    age: 42,
    symptoms: 'GERD'
  },
  {
    id: 'RX-003',
    customer: 'Bob Wilson',
    date: '2026-04-29 12:00',
    drug: 'Metformin 500mg',
    priority: 'low',
    age: 58,
    symptoms: 'Diabetes tipe 2'
  },
];

const recentActivity = [
  { action: 'Approved', prescription: 'RX-045', time: '5 menit lalu' },
  { action: 'Rejected', prescription: 'RX-044', time: '12 menit lalu' },
  { action: 'Updated', drug: 'Paracetamol 500mg', time: '1 jam lalu' },
];

export default function PharmacistDashboard() {
  const [activeTab, setActiveTab] = useState<'validation' | 'editor'>('validation');
  const [selectedPrescription, setSelectedPrescription] = useState(pendingPrescriptions[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const priorityConfig = {
    high: { label: 'Urgent', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
    normal: { label: 'Normal', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
    low: { label: 'Low', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#e8e8e6] shadow-[0_1px_3px_rgba(0,0,0,0.04)] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[32px] tracking-[-0.8px] text-[#1a1a1a]">
                Dashboard Apoteker
              </h1>
              <p className="font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] opacity-60 mt-1">
                Kelola validasi resep dan informasi obat
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6">
              {[
                { label: 'Pending', value: '3', icon: Clock, color: 'text-amber-600' },
                { label: 'Today', value: '12', icon: CheckCircle, color: 'text-emerald-600' },
                { label: 'Rejected', value: '1', icon: XCircle, color: 'text-red-600' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl px-6 py-3 border border-[#e8e8e6] shadow-sm">
                  <div className="flex items-center gap-3">
                    <stat.icon className={stat.color} size={20} />
                    <div>
                      <p className="font-['Inter',sans-serif] text-[11px] text-[#1a1a1a] opacity-60 uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="font-['Roboto_Condensed',sans-serif] text-[24px] text-[#1a1a1a] font-medium">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Enhanced Tab Navigation */}
        <div className="flex gap-3 mb-8">
          {[
            { id: 'validation' as const, label: 'Validasi Resep', icon: FileText, count: 3 },
            { id: 'editor' as const, label: 'Edit Informasi Obat', icon: Edit2, count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-['Inter',sans-serif] text-[14px] font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#6b8e6f] to-[#5a7a5e] text-white shadow-[0_4px_12px_rgba(107,142,111,0.25)]'
                  : 'bg-white text-[#1a1a1a] border border-[#e8e8e6] hover:border-[#6b8e6f] hover:shadow-sm'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-red-100 text-red-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'validation' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Prescription Queue */}
            <div className="col-span-4 space-y-4">
              {/* Search */}
              <div className="bg-white rounded-xl p-4 border border-[#e8e8e6] shadow-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a] opacity-40" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari resep..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f5f7f6] rounded-lg font-['Inter',sans-serif] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/30"
                  />
                </div>
              </div>

              {/* Queue Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#1a1a1a] font-medium">
                  Antrian Validasi
                </h2>
                <span className="font-['Inter',sans-serif] text-[12px] text-[#1a1a1a] opacity-60">
                  {pendingPrescriptions.length} resep
                </span>
              </div>

              {/* Prescription List */}
              <div className="space-y-3">
                {pendingPrescriptions.map(rx => {
                  const priority = priorityConfig[rx.priority];
                  return (
                    <button
                      key={rx.id}
                      onClick={() => setSelectedPrescription(rx)}
                      className={`w-full text-left bg-white rounded-xl p-5 transition-all duration-200 ${
                        selectedPrescription.id === rx.id
                          ? 'border-2 border-[#6b8e6f] shadow-[0_4px_12px_rgba(107,142,111,0.15)]'
                          : 'border border-[#e8e8e6] hover:border-[#6b8e6f] hover:shadow-sm'
                      }`}
                    >
                      {/* Priority Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium ${priority.bg} ${priority.color} border ${priority.border}`}>
                          {priority.label}
                        </span>
                        <span className="font-['Inter',sans-serif] text-[11px] text-[#1a1a1a] opacity-50">
                          {rx.date.split(' ')[1]}
                        </span>
                      </div>

                      <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#1a1a1a] font-medium mb-1">
                        {rx.id}
                      </p>
                      <p className="font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] opacity-70 mb-2">
                        {rx.customer}
                      </p>
                      <p className="font-['Inter',sans-serif] text-[13px] text-[#6b8e6f] font-medium">
                        {rx.drug}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-5 border border-[#e8e8e6] shadow-sm mt-6">
                <h3 className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#1a1a1a] font-medium mb-4">
                  Aktivitas Terakhir
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-[#e8e8e6] last:border-0 last:pb-0">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        activity.action === 'Approved' ? 'bg-emerald-500' :
                        activity.action === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-['Inter',sans-serif] text-[13px] text-[#1a1a1a]">
                          <span className="font-medium">{activity.action}</span> {activity.prescription || activity.drug}
                        </p>
                        <p className="font-['Inter',sans-serif] text-[11px] text-[#1a1a1a] opacity-50 mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Prescription Detail */}
            <div className="col-span-8 space-y-6">
              {/* Prescription Info Card */}
              <div className="bg-gradient-to-br from-white to-[#f5f7f6] rounded-2xl p-8 border border-[#e8e8e6] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-['Roboto_Condensed',sans-serif] text-[32px] tracking-[-0.8px] text-[#1a1a1a] font-medium mb-2">
                      {selectedPrescription.id}
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-[#1a1a1a] opacity-40" />
                        <p className="font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] opacity-70">
                          {selectedPrescription.customer}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#1a1a1a] opacity-40" />
                        <p className="font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] opacity-70">
                          {selectedPrescription.date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-[12px] font-medium ${priorityConfig[selectedPrescription.priority].bg} ${priorityConfig[selectedPrescription.priority].color} border ${priorityConfig[selectedPrescription.priority].border}`}>
                    {priorityConfig[selectedPrescription.priority].label} Priority
                  </span>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-[#e8e8e6]">
                    <p className="font-['Inter',sans-serif] text-[11px] text-[#1a1a1a] opacity-50 uppercase tracking-wider mb-1">
                      Obat yang Diminta
                    </p>
                    <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#1a1a1a] font-medium">
                      {selectedPrescription.drug}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#e8e8e6]">
                    <p className="font-['Inter',sans-serif] text-[11px] text-[#1a1a1a] opacity-50 uppercase tracking-wider mb-1">
                      Usia Pasien
                    </p>
                    <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#1a1a1a] font-medium">
                      {selectedPrescription.age} tahun
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#e8e8e6]">
                    <p className="font-['Inter',sans-serif] text-[11px] text-[#1a1a1a] opacity-50 uppercase tracking-wider mb-1">
                      Gejala
                    </p>
                    <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#1a1a1a] font-medium">
                      {selectedPrescription.symptoms}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescription Image Viewer */}
              <div className="bg-white rounded-2xl p-6 border border-[#e8e8e6] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#1a1a1a] font-medium">
                    Gambar Resep
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#f5f7f6] rounded-lg hover:bg-[#e8ede9] transition-colors">
                    <Search size={16} />
                    <span className="font-['Inter',sans-serif] text-[13px] font-medium">Zoom</span>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] rounded-xl aspect-[4/3] flex items-center justify-center border-2 border-dashed border-[#e8e8e6]">
                  <div className="text-center">
                    <div className="w-32 h-40 bg-white rounded-lg mx-auto mb-4 shadow-lg border border-[#e8e8e6]" />
                    <p className="font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] opacity-60">
                      Preview Resep {selectedPrescription.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Notes */}
              <div className="bg-white rounded-2xl p-6 border border-[#e8e8e6] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                <h3 className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#1a1a1a] font-medium mb-4">
                  Catatan Validasi (Opsional)
                </h3>
                <textarea
                  rows={4}
                  placeholder="Tambahkan catatan untuk pasien atau catatan internal..."
                  className="w-full p-4 bg-[#f5f7f6] border border-[#e8e8e6] rounded-xl font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-5 rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_12px_32px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-0.5 group">
                  <CheckCircle size={22} className="text-white" />
                  <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white font-medium">
                    Setujui Resep
                  </span>
                </button>
                <button className="flex-1 bg-gradient-to-r from-red-500 to-red-600 px-8 py-5 rounded-xl flex items-center justify-center gap-3 hover:shadow-[0_12px_32px_rgba(239,68,68,0.25)] transition-all duration-300 hover:-translate-y-0.5 group">
                  <XCircle size={22} className="text-white" />
                  <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white font-medium">
                    Tolak Resep
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="max-w-[1000px] mx-auto">
            {/* Drug Search */}
            <div className="bg-white rounded-2xl p-6 mb-6 border border-[#e8e8e6] shadow-sm">
              <label className="font-['Inter',sans-serif] font-medium text-[14px] text-[#1a1a1a] tracking-wider uppercase mb-3 block">
                Cari Obat untuk Diedit
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a] opacity-40" size={20} />
                <input
                  type="text"
                  placeholder="Ketik nama obat..."
                  className="w-full pl-12 pr-4 py-4 bg-[#f5f7f6] rounded-xl font-['Inter',sans-serif] text-[16px] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white border border-transparent focus:border-[#6b8e6f] transition-all"
                />
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white rounded-2xl p-8 border border-[#e8e8e6] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#1a1a1a] font-medium">
                  Edit Informasi Obat
                </h2>
                <span className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[12px] font-medium">
                  Terakhir diupdate: 2 hari lalu
                </span>
              </div>

              <div className="space-y-6">
                {/* Drug Name */}
                <div>
                  <label className="font-['Inter',sans-serif] font-medium text-[14px] text-[#1a1a1a] tracking-wider uppercase mb-3 block">
                    Nama Obat
                  </label>
                  <input
                    type="text"
                    defaultValue="Paracetamol 500mg"
                    className="w-full px-5 py-4 bg-[#f5f7f6] rounded-xl font-['Inter',sans-serif] text-[16px] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white border border-transparent focus:border-[#6b8e6f] transition-all"
                  />
                </div>

                {/* Indikasi */}
                <div>
                  <label className="font-['Inter',sans-serif] font-medium text-[14px] text-[#1a1a1a] tracking-wider uppercase mb-3 block">
                    Indikasi
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Mengatasi demam dan meredakan nyeri ringan hingga sedang seperti sakit kepala, sakit gigi, dan nyeri otot."
                    className="w-full p-5 bg-[#f5f7f6] border border-transparent rounded-xl font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] leading-relaxed focus:outline-none focus:border-[#6b8e6f] focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white resize-none transition-all"
                  />
                </div>

                {/* Aturan Pakai */}
                <div>
                  <label className="font-['Inter',sans-serif] font-medium text-[14px] text-[#1a1a1a] tracking-wider uppercase mb-3 block">
                    Aturan Pakai
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Dewasa: 1-2 tablet setiap 4-6 jam. Maksimal 8 tablet per hari. Diminum sesudah makan."
                    className="w-full p-5 bg-[#f5f7f6] border border-transparent rounded-xl font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] leading-relaxed focus:outline-none focus:border-[#6b8e6f] focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white resize-none transition-all"
                  />
                </div>

                {/* Efek Samping */}
                <div>
                  <label className="font-['Inter',sans-serif] font-medium text-[14px] text-[#1a1a1a] tracking-wider uppercase mb-3 block">
                    Efek Samping
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Jarang terjadi. Dapat menyebabkan mual, muntah, atau reaksi alergi pada beberapa orang."
                    className="w-full p-5 bg-[#f5f7f6] border border-transparent rounded-xl font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] leading-relaxed focus:outline-none focus:border-[#6b8e6f] focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white resize-none transition-all"
                  />
                </div>

                {/* Kontraindikasi */}
                <div>
                  <label className="font-['Inter',sans-serif] font-medium text-[14px] text-[#1a1a1a] tracking-wider uppercase mb-3 block">
                    Kontraindikasi
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tambahkan kontraindikasi..."
                    className="w-full p-5 bg-[#f5f7f6] border border-transparent rounded-xl font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] leading-relaxed focus:outline-none focus:border-[#6b8e6f] focus:ring-2 focus:ring-[#6b8e6f]/30 focus:bg-white resize-none transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-[#e8e8e6]">
                  <button className="flex-1 bg-gradient-to-r from-[#6b8e6f] to-[#5a7a5e] px-8 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:shadow-[0_12px_32px_rgba(107,142,111,0.25)] transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 font-medium">
                    <Edit2 size={18} />
                    Simpan Perubahan
                  </button>
                  <button className="px-8 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-[#1a1a1a] bg-[#f5f7f6] hover:bg-[#e8ede9] transition-colors">
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
