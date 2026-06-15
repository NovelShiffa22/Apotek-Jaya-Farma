import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User, MapPin, Package, LogOut, X, CheckCircle2, Pencil, Trash2, FileText, Plus } from 'lucide-react';
import { usePage, Link, useForm, router } from '@inertiajs/react';
import ConfirmModal from '../components/ConfirmModal';
import { regions } from '../data/regions';

export default function Profile({ user, orders = { data: [], links: [] }, counts = {}, prescriptionCounts = {}, addresses = [], prescriptions = { data: [], links: [] } }: any) {
  const { apotekInfo } = usePage<any>().props;
  const jamOp = apotekInfo?.jam_operasional || '08.00 - 18.00 WIB';
  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'orders' | 'prescriptions'>('profile');
  const [orderTab, setOrderTab] = useState<string>('Pending');
  const [prescriptionTab, setPrescriptionTab] = useState<'Menunggu Verifikasi' | 'Disetujui' | 'Ditolak' | 'Telah dipesan'>('Menunggu Verifikasi');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'orders' || tabParam === 'address' || tabParam === 'profile' || tabParam === 'prescriptions') {
      setActiveTab(tabParam as any);
    }
  }, []);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
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

  const { data: formAddress, setData: setFormAddress, post: postAddress, processing: processingAddress, reset: resetAddress } = useForm({
    label: '',
    alamat_lengkap: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    is_default: false,
  });

  const availableCities = formAddress.provinsi
    ? regions.find(r => r.name.toLowerCase() === formAddress.provinsi.toLowerCase())?.cities || []
    : [];

  const { data: formProfile, setData: setFormProfile, patch: patchProfile, processing: processingProfile } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const passwordForm = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const submitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    patchProfile(route('profile.update_info'));
  };

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    passwordForm.put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  };

  const openEditModal = (address: any) => {
    setEditingAddressId(address.id);

    const foundProv = regions.find(r => r.name.toLowerCase() === (address.provinsi || '').toLowerCase());
    const normalizedProv = foundProv ? foundProv.name : address.provinsi;

    let normalizedKota = address.kota;
    if (foundProv) {
      const foundCity = foundProv.cities.find(c => c.toLowerCase() === (address.kota || '').toLowerCase());
      if (foundCity) {
        normalizedKota = foundCity;
      }
    }

    setFormAddress({
      label: address.label,
      alamat_lengkap: address.alamat_lengkap,
      kota: normalizedKota,
      provinsi: normalizedProv,
      kode_pos: address.kode_pos,
      is_default: address.is_default
    });
    setIsAddressModalOpen(true);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormAddress({
      ...formAddress,
      provinsi: value,
      kota: ''
    });
  };

  const confirmDelete = (id: number) => {
    setModalConfig({
        isOpen: true,
        type: 'delete',
        title: 'Hapus Alamat',
        message: 'Apakah Anda yakin ingin menghapus alamat ini? Data yang dihapus tidak dapat dikembalikan.',
        confirmText: 'Ya, Hapus',
        onConfirm: () => {
            closeConfirmModal();
            router.delete(route('addresses.destroy', id), {
              preserveScroll: true
            });
        }
    });
  };

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      router.patch(`/profile/address/${editingAddressId}`, formAddress as any, {
        onSuccess: () => {
          setIsAddressModalOpen(false);
          setEditingAddressId(null);
          resetAddress();
        }
      });
    } else {
      postAddress(route('address.store'), {
        onSuccess: () => {
          setIsAddressModalOpen(false);
          resetAddress();
        }
      });
    }
  };

  const setUtama = (id: number) => {
    router.patch(route('address.set_utama', id), {}, {
      onSuccess: () => {
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect');
        if (redirectUrl) {
          router.visit(redirectUrl);
        }
      }
    });
  };

  const toggleExpandOrder = (orderId: number) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleProfileLogout = (e: React.MouseEvent) => {
      e.preventDefault();
      setModalConfig({
          isOpen: true,
          type: 'logout',
          title: 'Keluar Akun',
          message: 'Apakah Anda yakin ingin keluar dari akun Anda?',
          confirmText: 'Ya, Keluar',
          onConfirm: () => {
              closeConfirmModal();
              window.history.replaceState(null, '', '/login');
              router.post(route('logout'));
          }
      });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab')) {
      const tabParam = params.get('tab') as 'profile' | 'address' | 'orders' | 'prescriptions';
      if (['profile', 'address', 'orders', 'prescriptions'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
      if (tabParam === 'orders' && params.get('status')) {
        setOrderTab(params.get('status') as string);
      }
      if (tabParam === 'prescriptions' && params.get('status')) {
        setPrescriptionTab(params.get('status') as any);
      }
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return { label: 'Belum Bayar', bg: 'bg-red-50 border border-red-600', text: 'text-red-600' };
      case 'Lunas': return { label: 'Diproses', bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'Dikirim': return { label: 'Dikirim', bg: 'bg-purple-50', text: 'text-purple-700' };
      case 'Selesai': return { label: 'Selesai', bg: 'bg-emerald-50', text: 'text-emerald-700' };
      default: return { label: status, bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[36px] sm:text-[48px] tracking-[-1.2px] text-[#171d19] mb-6 sm:mb-10">
          Profil Saya
        </h1>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-4 border border-[#f1f5f9] shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
              <nav className="space-y-2">
                {[
                  { id: 'profile' as const, label: 'Profil', icon: User },
                  { id: 'address' as const, label: 'Alamat', icon: MapPin },
                  { id: 'orders' as const, label: 'Riwayat Pesanan', icon: Package },
                  { id: 'prescriptions' as const, label: 'Riwayat Resep', icon: FileText }
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
                    <span className="font-['Inter',sans-serif] text-[14px] font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </button>
                ))}
                <button
                  onClick={handleProfileLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-transparent hover:bg-red-50 text-[#ba1a1a] hover:border-red-200 mt-4 text-left"
                >
                  <LogOut size={18} />
                  <span className="font-['Inter',sans-serif] text-[14px] font-medium whitespace-nowrap">
                    Keluar
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'profile' && (
              <>
                <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-8 font-semibold">
                  Informasi Profil
                </h2>
                <form onSubmit={submitProfile} className="space-y-6">
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formProfile.name}
                      onChange={e => setFormProfile('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formProfile.email}
                      onChange={e => setFormProfile('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={formProfile.phone}
                      onChange={e => setFormProfile('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={processingProfile}
                    className="bg-[#006a3f] hover:bg-[#005632] px-8 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5 font-medium disabled:opacity-50"
                  >
                    {processingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)] mt-8">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-8 font-semibold">
                  Ubah Kata Sandi
                </h2>
                <form onSubmit={submitPassword} className="space-y-6">
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Kata Sandi Saat Ini
                    </label>
                    <input
                      type="password"
                      value={passwordForm.data.current_password}
                      onChange={e => passwordForm.setData('current_password', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                    {passwordForm.errors.current_password && (
                      <p className="mt-2 text-sm text-red-600 font-['Inter',sans-serif]">{passwordForm.errors.current_password}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      value={passwordForm.data.password}
                      onChange={e => passwordForm.setData('password', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                    {passwordForm.errors.password && (
                      <p className="mt-2 text-sm text-red-600 font-['Inter',sans-serif]">{passwordForm.errors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="font-['Inter',sans-serif] font-bold text-[12px] text-[#6e7a70] tracking-wider uppercase mb-3 block">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                      type="password"
                      value={passwordForm.data.password_confirmation}
                      onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                    {passwordForm.errors.password_confirmation && (
                      <p className="mt-2 text-sm text-red-600 font-['Inter',sans-serif]">{passwordForm.errors.password_confirmation}</p>
                    )}
                  </div>
                  <button 
                    type="submit" 
                    disabled={passwordForm.processing}
                    className="bg-[#171d19] hover:bg-[#2c362f] px-8 py-4 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:shadow-[0_8px_20px_rgba(23,29,25,0.3)] transition-all duration-300 hover:-translate-y-0.5 font-medium disabled:opacity-50"
                  >
                    {passwordForm.processing ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                  </button>
                </form>
              </div>
              </>
            )}

            {activeTab === 'address' && (
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] font-semibold">
                    Alamat Pengiriman
                  </h2>
                  {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('redirect') && (
                    <Link 
                      href={new URLSearchParams(window.location.search).get('redirect') as string}
                      className="flex items-center gap-2 text-[14px] font-bold text-[#006a3f] bg-emerald-50 px-4 py-2.5 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 size={18} />
                      Selesai & Kembali
                    </Link>
                  )}
                </div>
                
                {addresses.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-8 border border-gray-300 mb-6 text-center">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="font-['Inter',sans-serif] text-[15px] text-gray-500">Anda belum menambahkan alamat pengiriman.</p>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {addresses.map((address: any) => (
                      <div key={address.id} className={`relative bg-gray-50 rounded-xl p-6 border flex flex-col justify-between ${address.is_default ? 'border-[#006a3f]' : 'border-gray-300'}`}>
                        <div className="absolute top-4 right-4 flex items-center">
                          {!address.is_default && (
                            <button 
                              onClick={() => setUtama(address.id)}
                              className="border border-emerald-500 text-emerald-600 bg-white text-[11px] sm:text-xs px-3 py-1.5 rounded-lg font-medium transition hover:bg-emerald-50 mr-2 inline-block"
                            >
                              Jadikan Utama
                            </button>
                          )}
                          <button 
                            onClick={() => openEditModal(address)}
                            className="text-gray-500 hover:text-emerald-600 transition-colors p-1 mr-1" 
                            title="Ubah Alamat"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => confirmDelete(address.id)}
                            className="text-gray-500 hover:text-red-600 transition-colors p-1" 
                            title="Hapus Alamat"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div className="flex flex-col flex-1">
                          <div className="flex items-start justify-between mb-3 pr-48">
                            <p className="font-['Roboto_Condensed',sans-serif] text-[18px] text-[#171d19] font-semibold flex items-center flex-wrap gap-2">
                              {address.label}
                              {address.is_default && (
                                <span className="bg-[#006a3f] text-white text-[11px] sm:text-xs px-3 py-1.5 rounded-lg font-bold ml-2 inline-flex items-center justify-center leading-none shadow-sm">
                                  Alamat Utama
                                </span>
                              )}
                            </p>
                          </div>
                          <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41] leading-relaxed mb-1">
                            {address.alamat_lengkap}<br />
                            {address.kota}, {address.provinsi}<br />
                            Kode Pos: {address.kode_pos}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className="font-['Inter',sans-serif] text-[14px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors"
                >
                  + Tambah Alamat Baru
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)] w-full text-left">
                <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-6 font-semibold">
                  Riwayat Pesanan
                </h2>
                
                <div className="flex gap-6 mb-8 border-b border-[#f1f5f9] overflow-x-auto pb-1 whitespace-nowrap">
                  {[
                    { id: 'Pending', label: 'Belum Bayar' },
                    { id: 'Lunas', label: 'Diproses' },
                    { id: 'Dikirim', label: 'Dikirim' },
                    { id: 'Selesai', label: 'Selesai' },
                    { id: 'Dibatalkan', label: 'Dibatalkan' }
                  ].map(tab => {
                    const count = counts[tab.id] || 0;
                    return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setOrderTab(tab.id);
                        router.get('/profile', { tab: 'orders', status: tab.id }, { preserveState: true, preserveScroll: true });
                      }}
                      className={`pb-3 px-2 font-['Inter',sans-serif] text-[15px] font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                        orderTab === tab.id 
                          ? 'border-emerald-600 text-emerald-700 font-bold' 
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {count > 0 && (
                        <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold leading-none rounded-full ${
                          orderTab === tab.id ? 'bg-[#006a3f] text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  )})}
                </div>

                <div className="space-y-4">
                  {(() => {
                    const ordersData = Array.isArray(orders) ? orders : (orders.data || []);
                    const filteredOrders = ordersData;

                    if (filteredOrders.length === 0) {
                      return (
                        <div className="text-center text-gray-500 py-8 font-medium">
                          Tidak ada pesanan di kategori ini.
                        </div>
                      );
                    }

                    return (
                      <>
                        {filteredOrders.map((order: any) => {
                          const isPending = order.status === 'Pending' || order.status === 'Belum Bayar';
                          return (
                            <div
                              key={order.id}
                              className="border-b border-gray-300 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0 w-full text-left"
                            >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] mb-1 font-semibold">
                              No. Pesanan: {order.id.toString().padStart(6, '0')}
                            </p>
                            <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70]">
                              {new Date(order.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long', 
                                year: 'numeric'
                              })} • {order.payment_method || 'Virtual Account'} {order.va_number && `(VA: ${order.va_number})`}
                            </p>
                            {['Lunas', 'Diproses'].includes(order.status) && (new Date().getHours() < 8 || new Date().getHours() >= 18) && (
                              <p className="text-amber-600 text-xs mt-1 italic font-medium">
                                ⚠️ Pesanan Anda akan dikemas & dikirim saat jam operasional besok pagi ({jamOp.split(' ')[0]} WIB).
                              </p>
                            )}
                          </div>
                          {['Expired', 'expired', 'Kedaluwarsa', 'expire'].includes(order.status) ? (
                            <div className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full">
                              <p className="font-['Inter',sans-serif] text-xs font-semibold text-gray-700">
                                Pembayaran Kedaluwarsa
                              </p>
                            </div>
                          ) : ['Dibatalkan', 'cancelled', 'rejected', 'Cancelled', 'Rejected', 'cancel', 'deny'].includes(order.status) ? (
                            <div className="bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                              <p className="font-['Inter',sans-serif] text-xs font-semibold text-red-700">
                                Pesanan Dibatalkan
                              </p>
                            </div>
                          ) : (
                            <div className={`${getStatusBadge(order.status).bg} px-4 py-2 rounded-full`}>
                              <p className={`font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase ${getStatusBadge(order.status).text}`}>
                                {getStatusBadge(order.status).label}
                              </p>
                            </div>
                          )}
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="py-2 space-y-4">
                            <Link href={`/product/${order.items[0].id || order.items[0].product_id || 1}`} className="flex flex-col md:flex-row items-center justify-between w-full gap-4 p-4 bg-white border border-gray-300 rounded-xl group hover:shadow-md transition-all">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                                <div className="flex-1">
                                  <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19] group-hover:text-[#006a3f] transition-colors line-clamp-2">
                                    {order.items[0].nama || order.items[0].name || 'Produk Farmasi'}
                                  </h3>
                                  <span className="font-['Inter',sans-serif] text-[13px] text-gray-500 block mt-1">
                                    {order.items[0].quantity || 1} x Rp {Number(order.items[0].harga || order.items[0].price || 0).toLocaleString('id-ID')}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full md:w-auto md:ml-auto md:text-right mt-2 md:mt-0 text-left">
                                <p className="font-['Inter',sans-serif] text-[16px] text-[#171d19] font-bold">
                                  Rp {Number((order.items[0].harga || order.items[0].price || 0) * (order.items[0].quantity || 1)).toLocaleString('id-ID')}
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

                            {expandedOrders.includes(order.id) && order.items.length > 1 && (
                              <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-4 animate-fade-in">
                                {order.items.slice(1).map((item: any, idx: number) => (
                                  <Link key={idx} href={`/product/${item.id || item.product_id || 1}`} className="flex flex-col md:flex-row items-center justify-between w-full gap-4 p-4 bg-white border border-gray-300 rounded-xl group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4 flex-1">
                                      <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
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
                                      <div className="flex-1">
                                        <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19] group-hover:text-[#006a3f] transition-colors line-clamp-2">
                                          {item.nama || item.name || 'Produk Farmasi'}
                                        </h3>
                                        <span className="font-['Inter',sans-serif] text-[13px] text-gray-500 block mt-1">
                                          {item.quantity || 1} x Rp {Number(item.harga || item.price || 0).toLocaleString('id-ID')}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-full md:w-auto md:ml-auto md:text-right mt-2 md:mt-0 text-left">
                                      <p className="font-['Inter',sans-serif] text-[16px] text-[#171d19] font-bold">
                                        Rp {Number((item.harga || item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#f1f5f9] gap-4 mt-2">
                          <div className="text-right sm:text-left">
                            <span className="font-['Inter',sans-serif] text-[13px] text-gray-500 mr-2">Total Pesanan:</span>
                            <span className="font-['Poppins',sans-serif] text-[18px] text-[#006a3f] font-bold">
                              Rp {Number(order.total_amount || 0).toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0 sm:justify-end">
                            <button 
                              onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                              className="w-full sm:w-auto text-center font-['Inter',sans-serif] text-[14px] font-bold text-gray-600 hover:text-gray-900 border border-gray-400 px-5 py-2.5 rounded-xl transition-colors hover:bg-gray-50"
                            >
                              Lihat Detail
                            </button>
                            {isPending && (
                              <Link href={`/invoice/${order.id}`} className="w-full sm:w-auto text-center bg-[#006a3f] text-white px-5 py-2.5 rounded-xl font-['Inter',sans-serif] text-[14px] font-bold hover:bg-[#005632] shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                                Bayar Sekarang
                              </Link>
                            )}
                            {order.status === 'Dibatalkan' && (
                              <button
                                onClick={() => {
                                  if(confirm('Apakah Anda yakin ingin menghapus riwayat pesanan ini?')) {
                                    router.delete(`/profile/orders/${order.id}`, { preserveScroll: true });
                                  }
                                }}
                                className="w-full sm:w-auto text-center bg-white border border-gray-300 text-gray-500 px-5 py-2.5 rounded-xl font-['Inter',sans-serif] text-[14px] font-bold hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap"
                              >
                                Hapus Riwayat
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {!Array.isArray(orders) && orders.links && orders.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                      {orders.links.map((link: any, i: number) => {
                        const url = link.url ? new URL(link.url, window.location.origin) : null;
                        if (url) {
                          url.searchParams.set('tab', 'orders');
                          url.searchParams.set('status', orderTab);
                        }
                        const finalUrl = url ? url.toString().replace(window.location.origin, '') : null;
                        
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (finalUrl) {
                                router.get(finalUrl, {}, { preserveState: true, preserveScroll: true });
                              }
                            }}
                            disabled={!finalUrl}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                              link.active
                                ? 'bg-[#006a3f] text-white border-[#006a3f]'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                            } ${!finalUrl ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                          />
                        );
                      })}
                    </div>
                  )}
                  </>
                  );
                })()}
                </div>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="bg-white rounded-2xl p-4 sm:p-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)] w-full text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] font-semibold">
                    Riwayat Resep
                  </h2>
                  <Link 
                    href="/prescriptions/upload/step-1"
                    className="inline-flex items-center justify-center gap-2 bg-[#006a3f] text-white px-5 py-2.5 rounded-xl font-['Inter',sans-serif] text-[14px] font-bold hover:bg-[#005632] shadow-sm hover:shadow-md transition-all"
                  >
                    <Plus size={18} />
                    Unggah Resep Baru
                  </Link>
                </div>

                <div className="flex gap-6 mb-8 border-b border-[#f1f5f9] overflow-x-auto pb-1 whitespace-nowrap">
                  {[
                    { id: 'Menunggu Verifikasi' as const, label: 'Menunggu Verifikasi' },
                    { id: 'Disetujui' as const, label: 'Disetujui' },
                    { id: 'Ditolak' as const, label: 'Ditolak' },
                    { id: 'Telah dipesan' as const, label: 'Telah Dipesan' }
                  ].map(tab => {
                    const count = prescriptionCounts[tab.id] || 0;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setPrescriptionTab(tab.id);
                          router.get('/profile', { tab: 'prescriptions', prescription_status: tab.id }, { preserveState: true, preserveScroll: true });
                        }}
                        className={`pb-3 px-2 font-['Inter',sans-serif] text-[15px] font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                          prescriptionTab === tab.id 
                            ? 'border-emerald-600 text-emerald-700 font-bold' 
                            : 'border-transparent text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {count > 0 && (
                          <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold leading-none rounded-full ${
                            prescriptionTab === tab.id ? 'bg-[#006a3f] text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {(() => {
                    const prescriptionsData = Array.isArray(prescriptions) ? prescriptions : (prescriptions.data || []);
                    let filteredPrescriptions = prescriptionsData;
                    if (prescriptionTab === 'Menunggu Verifikasi') filteredPrescriptions = filteredPrescriptions.filter((p: any) => p.status_validasi === 'pending');

                    if (filteredPrescriptions.length === 0) {
                      return (
                        <div className="text-center text-gray-500 py-8 font-medium font-['Inter',sans-serif]">
                          Tidak ada resep di kategori ini.
                        </div>
                      );
                    }

                    const cancelPrescription = (id: number) => {
                      setModalConfig({
                          isOpen: true,
                          type: 'warning',
                          title: 'Batalkan Resep',
                          message: 'Apakah Anda yakin ingin membatalkan resep ini? Aksi ini tidak dapat dibatalkan.',
                          confirmText: 'Ya, Batalkan',
                          onConfirm: () => {
                              closeConfirmModal();
                              router.delete(`/profile/prescriptions/${id}`, {
                                  preserveScroll: true,
                              });
                          }
                      });
                    };

                    return (
                      <>
                        {filteredPrescriptions.map((p: any) => (
                          <div
                            key={p.id}
                            className="flex flex-col justify-between p-4 sm:p-6 border border-gray-200 rounded-xl hover:border-emerald-200 hover:shadow-sm transition-all bg-white gap-4 w-full"
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex-1 min-w-0 flex items-start gap-4 w-full">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl border border-gray-200 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                                  {p.file_foto ? (
                                    <img 
                                      src={`/storage/${p.file_foto.replace('storage/', '')}`} 
                                      alt="Resep" 
                                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" 
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = p.file_foto; // Fallback to raw string
                                      }}
                                    />
                                  ) : (
                                    <FileText className="text-gray-400 w-8 h-8 sm:w-10 sm:h-10" />
                                  )}
                                </div>
                                <div className="flex flex-col gap-1 w-full text-left">
                                  <div className="flex flex-col gap-1">
                                    <h3 className="font-['Roboto_Condensed',sans-serif] text-[18px] sm:text-[20px] font-bold text-[#171d19]">
                                      No. Resep: {p.kode_resep} <span className="text-gray-500 font-medium text-[16px] sm:text-[18px]">({p.nama_pasien || 'Pasien Umum'})</span>
                                    </h3>
                                    <span className="font-['Inter',sans-serif] text-[13px] text-gray-500 block mb-1">
                                      {new Date(p.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                  </div>
                                  <div className="space-y-1 mt-1">
                                    {(p.nama_dokter || p.doctor_name) && (
                                      <p className="font-['Inter',sans-serif] text-[13px] text-gray-600">
                                        Dokter: <span className="font-medium text-gray-800">{p.nama_dokter || p.doctor_name}</span>
                                      </p>
                                    )}
                                    {p.status_validasi === 'pending' && (new Date().getHours() < 8 || new Date().getHours() >= 18) && (
                                      <p className="text-amber-600 text-xs mt-1 italic font-medium">
                                        ⚠️ Resep Anda akan diverifikasi & diperiksa saat jam operasional besok pagi ({jamOp.split(' ')[0]} WIB).
                                      </p>
                                    )}
                                    {p.catatan_apoteker && (
                                      <p className="font-['Inter',sans-serif] text-[13px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100 mt-2">
                                        <span className="font-semibold text-amber-800">Catatan Apoteker:</span> {p.catatan_apoteker}
                                      </p>
                                    )}
                                    {p.status_validasi === 'ditolak' && p.rejection_reason && (
                                      <p className="font-['Inter',sans-serif] text-[13px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-100 mt-2">
                                        <span className="font-semibold text-red-800">Alasan Penolakan:</span> {p.rejection_reason}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Status Badge (Top Right) */}
                              <div className="shrink-0 pl-2 text-right">
                                <span className={`px-3 py-1.5 rounded-full text-[12px] font-bold border font-['Inter',sans-serif] whitespace-nowrap ${
                                  p.status_validasi === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                  p.status_validasi === 'disetujui' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                  'bg-red-50 text-red-600 border-red-200'
                                }`}>
                                  {p.status_validasi === 'pending' ? 'Menunggu Verifikasi' :
                                   p.status_validasi === 'disetujui' ? 'Resep Disetujui' :
                                   p.status_validasi === 'ditolak' ? 'Resep Ditolak' : 
                                   p.status_validasi.toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons (Bottom Right) */}
                            <div className="flex flex-row gap-2 w-full justify-end mt-2 pt-4 border-t border-gray-100">
                              {p.status_validasi === 'pending' && (
                                <button 
                                  onClick={() => cancelPrescription(p.id)}
                                  className="text-[13px] font-bold text-center bg-red-50 border border-red-200 text-red-600 px-5 py-2 rounded-xl hover:bg-red-100 transition-colors font-['Inter',sans-serif]"
                                >
                                  Batalkan Resep
                                </button>
                              )}
                              <Link 
                                href={route('prescriptions.detail', { id: p.id })} 
                                className="text-[13px] font-bold text-center bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-50 hover:text-[#006a3f] hover:border-[#006a3f] transition-all font-['Inter',sans-serif] shadow-sm"
                              >
                                Detail
                              </Link>
                            </div>
                          </div>
                        ))}
                        
                        {!Array.isArray(prescriptions) && prescriptions.links && prescriptions.links.length > 3 && (
                          <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                            {prescriptions.links.map((link: any, i: number) => {
                              const url = link.url ? new URL(link.url, window.location.origin) : null;
                              if (url) {
                                url.searchParams.set('tab', 'prescriptions');
                                url.searchParams.set('prescription_status', prescriptionTab);
                              }
                              const finalUrl = url ? url.toString().replace(window.location.origin, '') : null;
                              
                              return (
                                <button
                                  key={i}
                                  onClick={() => {
                                    if (finalUrl) {
                                      router.get(finalUrl, {}, { preserveState: true, preserveScroll: true });
                                    }
                                  }}
                                  disabled={!finalUrl}
                                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${
                                    link.active
                                      ? 'bg-[#006a3f] text-white border-[#006a3f]'
                                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                  } ${!finalUrl ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}`}
                                  dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Detail */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#171d19]">
                Rincian Pesanan #{selectedOrder.va_number || selectedOrder.id}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
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
                  <span className="font-['Inter',sans-serif] text-[14px] font-bold text-indigo-600 tracking-wider">{selectedOrder.va_number || selectedOrder.status}</span>
                </div>
                <div className="flex justify-between items-start pt-2 border-t border-gray-50">
                  <span className="font-['Inter',sans-serif] text-[14px] text-gray-500 min-w-[120px]">Alamat Pengiriman</span>
                  <span className="font-['Inter',sans-serif] text-[13px] font-medium text-gray-800 text-right">{selectedOrder.shipping_address || 'Alamat belum diatur'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-['Inter',sans-serif] text-[14px] font-bold text-gray-900">Total Pembayaran</span>
                  <span className="font-['Poppins',sans-serif] text-[18px] font-black text-[#006a3f]">Rp {Number(selectedOrder.total_amount || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-2.5 rounded-xl font-['Inter',sans-serif] text-[14px] font-bold hover:bg-gray-50 transition-all">Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Alamat */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#171d19]">
                {editingAddressId ? 'Ubah Alamat' : 'Tambah Alamat Baru'}
              </h3>
              <button 
                onClick={() => { setIsAddressModalOpen(false); setEditingAddressId(null); resetAddress(); }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>
            <form onSubmit={submitAddress} className="p-6 space-y-4">
              <div>
                <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Label Alamat (Misal: Rumah, Kantor)</label>
                <input 
                  type="text" 
                  value={formAddress.label}
                  onChange={e => setFormAddress('label', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Alamat Lengkap</label>
                <textarea 
                  value={formAddress.alamat_lengkap}
                  onChange={e => setFormAddress('alamat_lengkap', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Provinsi</label>
                  <select 
                    value={formAddress.provinsi}
                    onChange={handleProvinceChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                    required
                  >
                    <option value="">Pilih Provinsi</option>
                    {regions.map(r => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kota</label>
                  <select 
                    value={formAddress.kota}
                    onChange={e => setFormAddress('kota', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                    disabled={!formAddress.provinsi}
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kode Pos</label>
                <input 
                  type="text" 
                  value={formAddress.kode_pos}
                  onChange={e => setFormAddress('kode_pos', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                  required
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="is_default"
                  checked={formAddress.is_default}
                  onChange={e => setFormAddress('is_default', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f]"
                />
                <label htmlFor="is_default" className="font-['Inter',sans-serif] text-[14px] text-gray-700">Jadikan alamat utama</label>
              </div>
              
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={processingAddress}
                  className="w-full py-4 bg-[#006a3f] hover:bg-[#005632] text-white rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium tracking-wide transition-colors"
                >
                  {processingAddress ? 'Menyimpan...' : 'Simpan Alamat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal {...modalConfig} onClose={closeConfirmModal} />
    </div>
  );
}

