import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, MapPin, Package, LogOut } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';



export default function Profile() {
  const { auth, orders = [] } = usePage().props as any;
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders'>('profile');
  const [orderTab, setOrderTab] = useState<'Pending' | 'Lunas'>('Pending');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'orders') {
      setActiveTab('orders');
      if (params.get('status')) {
        setOrderTab(params.get('status') as 'Pending' | 'Lunas');
      }
    }
  }, []);

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
                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-transparent hover:bg-red-50 text-[#ba1a1a] hover:border-red-200 mt-4 text-left"
                >
                  <LogOut size={18} />
                  <span className="font-['Inter',sans-serif] text-[14px] font-medium">
                    Keluar
                  </span>
                </Link>
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
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-3 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      defaultValue={user?.phone || ''}
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
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-6 font-semibold">
                  Riwayat Pesanan
                </h2>
                
                {/* Sub-tabs */}
                <div className="flex gap-4 mb-8 border-b border-[#f1f5f9]">
                  <button
                    onClick={() => setOrderTab('Pending')}
                    className={`pb-3 px-2 font-['Inter',sans-serif] text-[15px] font-bold transition-all border-b-2 ${
                      orderTab === 'Pending' ? 'border-[#006a3f] text-[#006a3f]' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Belum Bayar
                  </button>
                  <button
                    onClick={() => setOrderTab('Lunas')}
                    className={`pb-3 px-2 font-['Inter',sans-serif] text-[15px] font-bold transition-all border-b-2 ${
                      orderTab === 'Lunas' ? 'border-[#006a3f] text-[#006a3f]' : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Diproses
                  </button>
                </div>

                <div className="space-y-4">
                  {orders.filter((o: any) => o.status === orderTab).length === 0 ? (
                    <div className="bg-gray-50 p-8 rounded-2xl text-center text-gray-500 border border-gray-100 font-medium">
                      Tidak ada pesanan di kategori ini.
                    </div>
                  ) : orders.filter((o: any) => o.status === orderTab).map((order: any) => {
                    const isPending = order.status === 'Pending';
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-6 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] mb-1 font-semibold">
                              VA: {order.va_number}
                            </p>
                            <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                              {new Date(order.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })} • {order.payment_method}
                            </p>
                          </div>
                          <div className={`${isPending ? 'bg-amber-50' : 'bg-emerald-50'} px-4 py-2 rounded-full`}>
                            <p className={`font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase ${isPending ? 'text-amber-700' : 'text-emerald-700'}`}>
                              {isPending ? 'Belum Bayar' : 'Lunas'}
                            </p>
                          </div>
                        </div>

                        {/* Product Snapshot (Shopee Style) */}
                        {order.items && order.items.length > 0 && (
                          <div className="py-4">
                            <Link href={`/product/${order.items[0].id || order.items[0].product_id || 1}`} className="flex items-start gap-4 group">
                              <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {order.items[0].foto || order.items[0].image ? (
                                  <img 
                                    src={order.items[0].foto || order.items[0].image} 
                                    alt={order.items[0].nama || order.items[0].name} 
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-1" 
                                  />
                                ) : (
                                  <Package size={28} className="text-gray-400 group-hover:scale-105 transition-transform duration-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 mt-1">
                                <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19] group-hover:text-[#006a3f] transition-colors truncate">
                                  {order.items[0].nama || order.items[0].name || 'Produk Farmasi'}
                                </h3>
                                <p className="font-['Inter',sans-serif] text-[13px] text-gray-500 mt-1">
                                  x{order.items[0].quantity || 1}
                                </p>
                              </div>
                              <div className="text-right mt-1">
                                <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] font-medium">
                                  Rp {Number(order.items[0].harga || order.items[0].price || 0).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </Link>
                            
                            {order.items.length > 1 && (
                              <div className="mt-3 pl-[96px]">
                                <p className="font-['Inter',sans-serif] text-[13px] text-gray-500">
                                  Lihat +{order.items.length - 1} produk lainnya
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Footer Card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#f1f5f9] gap-4 mt-2">
                          <div className="text-right sm:text-left">
                            <span className="font-['Inter',sans-serif] text-[13px] text-gray-500 mr-2">Total Pesanan:</span>
                            <span className="font-['Poppins',sans-serif] text-[18px] text-[#006a3f] font-bold">
                              Rp {Number(order.total_amount).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex gap-3 justify-end">
                            <button className="font-['Inter',sans-serif] text-[14px] font-bold text-gray-600 hover:text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl transition-colors hover:bg-gray-50">
                              Lihat Detail
                            </button>
                            {isPending && (
                              <Link href={`/invoice/${order.id}`} className="bg-[#006a3f] text-white px-5 py-2.5 rounded-xl font-['Inter',sans-serif] text-[14px] font-bold hover:bg-[#005632] shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                                Bayar Sekarang
                              </Link>
                            )}
                          </div>
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
