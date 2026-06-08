import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, MapPin, Package, LogOut, X } from 'lucide-react';
import { usePage, Link } from '@inertiajs/react';



export default function Profile() {
  const { auth, orders = [] } = usePage().props as any;
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders'>('profile');
  const [orderTab, setOrderTab] = useState<string>('Pending');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const toggleExpandOrder = (orderId: number) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'orders') {
      setActiveTab('orders');
      if (params.get('status')) {
        setOrderTab(params.get('status') as string);
      }
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return { label: 'Belum Bayar', bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'Lunas': return { label: 'Diproses', bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'Dikirim': return { label: 'Dikirim', bg: 'bg-purple-50', text: 'text-purple-700' };
      case 'Selesai': return { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-700' };
      default: return { label: status, bg: 'bg-gray-50', text: 'text-gray-700' };
    }
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
                <div className="flex gap-6 mb-8 border-b border-[#f1f5f9]">
                  {[
                    { id: 'Pending', label: 'Belum Bayar' },
                    { id: 'Lunas', label: 'Diproses' },
                    { id: 'Dikirim', label: 'Dikirim' },
                    { id: 'Selesai', label: 'Selesai' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderTab(tab.id)}
                      className={`pb-3 px-2 font-['Inter',sans-serif] text-[15px] font-semibold transition-all border-b-2 ${
                        orderTab === tab.id 
                          ? 'border-emerald-600 text-emerald-700 font-bold' 
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
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
                          <div className={`${getStatusBadge(order.status).bg} px-4 py-2 rounded-full`}>
                            <p className={`font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase ${getStatusBadge(order.status).text}`}>
                              {getStatusBadge(order.status).label}
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
                                <button 
                                  onClick={() => toggleExpandOrder(order.id)}
                                  className="font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 hover:text-[#006a3f] transition-colors"
                                >
                                  {expandedOrders.includes(order.id) 
                                    ? 'Sembunyikan produk' 
                                    : `Lihat +${order.items.length - 1} produk lainnya`
                                  }
                                </button>
                              </div>
                            )}

                            {/* Render sisa produk jika di-expand */}
                            {expandedOrders.includes(order.id) && order.items.length > 1 && (
                              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-4 animate-fade-in">
                                {order.items.slice(1).map((item: any, idx: number) => (
                                  <Link key={idx} href={`/product/${item.id || item.product_id || 1}`} className="flex items-start gap-4 group">
                                    <div className="w-20 h-20 bg-gray-100 rounded-xl border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                      {item.foto || item.image ? (
                                        <img 
                                          src={item.foto || item.image} 
                                          alt={item.nama || item.name} 
                                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-1" 
                                        />
                                      ) : (
                                        <Package size={28} className="text-gray-400 group-hover:scale-105 transition-transform duration-300" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0 mt-1">
                                      <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19] group-hover:text-[#006a3f] transition-colors truncate">
                                        {item.nama || item.name || 'Produk Farmasi'}
                                      </h3>
                                      <p className="font-['Inter',sans-serif] text-[13px] text-gray-500 mt-1">
                                        x{item.quantity || 1}
                                      </p>
                                    </div>
                                    <div className="text-right mt-1">
                                      <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] font-medium">
                                        Rp {Number(item.harga || item.price || 0).toLocaleString('id-ID')}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
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
                            <button 
                              onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                              className="font-['Inter',sans-serif] text-[14px] font-bold text-gray-600 hover:text-gray-900 border border-gray-200 px-5 py-2.5 rounded-xl transition-colors hover:bg-gray-50"
                            >
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

      {/* Modal Pop-up Detail */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#171d19]">
                Rincian Pesanan #{selectedOrder.id}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              
              <div>
                <h4 className="font-['Inter',sans-serif] text-[13px] font-bold text-gray-400 uppercase tracking-wider mb-3">Daftar Item</h4>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start text-[14px] font-['Inter',sans-serif]">
                      <div className="flex-1 pr-4">
                        <span className="text-[#171d19] font-medium leading-snug block">{item.nama || item.name}</span>
                        <span className="text-gray-500 text-[13px]">x{item.quantity || 1}</span>
                      </div>
                      <span className="font-bold text-[#171d19] whitespace-nowrap">Rp {Number((item.harga || item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-['Inter',sans-serif] text-[14px] text-gray-500">Metode Pembayaran</span>
                  <span className="font-['Inter',sans-serif] text-[14px] font-bold text-[#171d19]">{selectedOrder.payment_method || 'Virtual Account'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-['Inter',sans-serif] text-[14px] text-gray-500">Virtual Account</span>
                  <span className="font-['Inter',sans-serif] text-[14px] font-bold text-indigo-600 tracking-wider">{selectedOrder.va_number}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-['Inter',sans-serif] text-[14px] font-bold text-gray-900">Total Pembayaran</span>
                  <span className="font-['Poppins',sans-serif] text-[18px] font-black text-[#006a3f]">Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className={`border rounded-xl p-5 ${selectedOrder.status === 'Pending' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <h4 className={`font-['Inter',sans-serif] text-[12px] font-bold uppercase tracking-wider mb-1.5 ${selectedOrder.status === 'Pending' ? 'text-amber-700' : 'text-emerald-700'}`}>Status Pelacakan</h4>
                <p className={`font-['Inter',sans-serif] text-[14px] font-medium leading-relaxed ${selectedOrder.status === 'Pending' ? 'text-amber-800' : 'text-emerald-800'}`}>
                  {selectedOrder.status === 'Pending' ? 'Belum Bayar (Menunggu pembayaran Anda)' : 'Diproses (Apotek sedang menyiapkan obat Anda)'}
                </p>
              </div>

            </div>
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-2.5 rounded-xl font-['Inter',sans-serif] text-[14px] font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95"
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
