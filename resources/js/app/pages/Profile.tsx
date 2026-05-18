import { useState } from 'react';
import Header from '../components/Header';
import { User, MapPin, Package } from 'lucide-react';

const orderHistory = [
  { id: 'ORD-001', date: '2026-04-25', total: 45000, status: 'selesai' },
  { id: 'ORD-002', date: '2026-04-27', total: 125000, status: 'dikirim' },
  { id: 'ORD-003', date: '2026-04-28', total: 30000, status: 'disiapkan' },
  { id: 'ORD-004', date: '2026-04-29', total: 85000, status: 'diproses' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders'>('orders');

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    diproses: { label: 'Diproses', bg: 'bg-amber-50', text: 'text-amber-700' },
    disiapkan: { label: 'Disiapkan', bg: 'bg-blue-50', text: 'text-blue-700' },
    dikirim: { label: 'Dikirim', bg: 'bg-purple-50', text: 'text-purple-700' },
    selesai: { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-700' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[48px] tracking-[-1.2px] text-[#171d19] mb-10">
          Profil Saya
        </h1>

        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl p-4 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)] sticky top-32">
              <nav className="space-y-2">
                {[
                  { id: 'profile' as const, label: 'Profil', icon: User },
                  { id: 'address' as const, label: 'Alamat', icon: MapPin },
                  { id: 'orders' as const, label: 'Riwayat Pesanan', icon: Package }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-[rgba(0,106,63,0.08)] border border-[#006a3f] text-[#006a3f]'
                        : 'bg-transparent hover:bg-[#f9fafb] text-[#171d19]'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="font-['Inter',sans-serif] text-[14px] font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-8 font-semibold">
                  Informasi Profil
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full px-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john.doe@email.com"
                      className="w-full px-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      defaultValue="+62 812-3456-7890"
                      className="w-full px-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    />
                  </div>
                  <button className="bg-[#006a3f] hover:bg-[#005632] px-8 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5 font-medium">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-8 font-semibold">
                  Alamat Pengiriman
                </h2>
                <div className="bg-[#f9fafb] rounded-xl p-6 border border-[#f1f5f9] mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold">
                      Alamat Utama
                    </p>
                    <span className="px-3 py-1 bg-[#006a3f] text-white rounded-full font-['Inter',sans-serif] text-[11px] font-bold tracking-wider uppercase">
                      Utama
                    </span>
                  </div>
                  <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41] leading-relaxed">
                    Jl. Merdeka No. 123, Kelurahan Sudirman<br />
                    Kecamatan Menteng, Jakarta Pusat<br />
                    DKI Jakarta, 10110
                  </p>
                </div>
                <button className="font-['Inter',sans-serif] text-[14px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors">
                  + Tambah Alamat Baru
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-8 font-semibold">
                  Riwayat Pesanan
                </h2>
                <div className="space-y-4">
                  {orderHistory.map(order => {
                    const config = statusConfig[order.status];
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] mb-2 font-semibold">
                              {order.id}
                            </p>
                            <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                              {new Date(order.date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className={`${config.bg} px-4 py-2 rounded-full`}>
                            <p className={`font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase ${config.text}`}>
                              {config.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
                          <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold">
                            Total: Rp {order.total.toLocaleString('id-ID')}
                          </p>
                          <button className="font-['Inter',sans-serif] text-[14px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors">
                            Lihat Detail →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
