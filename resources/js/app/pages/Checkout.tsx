import { useState, useMemo, useEffect } from 'react';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { MapPin, CheckCircle2, ChevronDown, Landmark, Wallet, CreditCard, Clock, X, Plus } from 'lucide-react';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';
import { regions } from '../data/regions';

interface CartItem {
  id: number;
  nama: string;
  jenis_kemasan: string;
  harga: number;
  quantity: number;
  foto?: string | null;
}

interface Address {
  nama_penerima: string;
  alamat_lengkap: string;
  nomor_hp: string;
}

interface ShippingMethod {
  id: string;
  title: string;
  subtitle: string;
  price: number;
}

interface DBAddress {
  id: number;
  label: string;
  alamat_lengkap: string;
  kota: string;
  provinsi: string;
  kode_pos: string;
  is_default: boolean;
}

interface Props {
  cartItems: CartItem[];
  address: Address;
  addresses?: DBAddress[];
  shippingMethods: ShippingMethod[];
  discount?: number;
  isBuyNow?: boolean;
  prescriptionId?: number | null;
}

export default function Checkout({ cartItems = [], address, addresses = [], shippingMethods = [], discount = 0, isBuyNow = false, prescriptionId = null }: Props) {
  const { auth } = usePage().props as any;
  const [shippingMethod, setShippingMethod] = useState<string>(shippingMethods[0]?.id || '');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Address Modal States
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New Address Form State
  const [newLabel, setNewLabel] = useState('');
  const [newAlamatLengkap, setNewAlamatLengkap] = useState('');
  const [newKota, setNewKota] = useState('');
  const [newProvinsi, setNewProvinsi] = useState('');
  const [newKodePos, setNewKodePos] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [addressFormErrors, setAddressFormErrors] = useState<any>({});

  const availableCities = useMemo(() => {
    if (!newProvinsi) return [];
    return regions.find(r => r.name.toLowerCase() === newProvinsi.toLowerCase())?.cities || [];
  }, [newProvinsi]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setNewProvinsi(value);
    setNewKota('');
  };

  // Initialize selectedAddress from prop when it loads or changes
  useEffect(() => {
    if (address) {
      setSelectedAddress(address);
    }
  }, [address]);

  // Handle select address from modal list
  const handleSelectAddress = (addr: DBAddress) => {
    setSelectedAddress({
      nama_penerima: `${auth?.user?.name || 'User'} (${addr.label})`,
      alamat_lengkap: `${addr.alamat_lengkap}, ${addr.kota}, ${addr.provinsi} ${addr.kode_pos}`,
      nomor_hp: auth?.user?.phone || '-'
    });
    setIsAddressModalOpen(false);
  };

  // Submit new address to backend via Inertia
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAddress(true);
    setAddressFormErrors({});

    router.post('/profile/address', {
      label: newLabel,
      alamat_lengkap: newAlamatLengkap,
      kota: newKota,
      provinsi: newProvinsi,
      kode_pos: newKodePos,
      is_default: newIsDefault
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmittingAddress(false);
        setIsAddingNewAddress(false);
        // Reset form
        setNewLabel('');
        setNewAlamatLengkap('');
        setNewKota('');
        setNewProvinsi('');
        setNewKodePos('');
        setNewIsDefault(false);
      },
      onError: (errs) => {
        setIsSubmittingAddress(false);
        setAddressFormErrors(errs);
      }
    });
  };

  // Calculations
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.harga * item.quantity), 0), [cartItems]);
  
  const currentShippingCost = useMemo(() => {
    const method = shippingMethods.find(m => m.id === shippingMethod);
    return method ? method.price : 0;
  }, [shippingMethod, shippingMethods]);

  const total = subtotal > 0 ? subtotal + currentShippingCost - discount : 0;

  // Handle Submission
  const handleProcess = () => {
    if (cartItems.length === 0) {
       alert("Keranjang belanja kosong. Silakan kembali ke katalog.");
       return;
    }
    setIsConfirmModalOpen(true);
  };

  const executeProcess = () => {
    setIsConfirmModalOpen(false);
    router.post('/checkout/proses', {
      item_ids: cartItems.map(item => item.id),
      quantities: cartItems.map(item => item.quantity),
      shipping_method: shippingMethod,
      payment_method: 'Midtrans Payment Gateway',
      is_buy_now: isBuyNow,
      prescription_id: prescriptionId,
      shipping_address: selectedAddress?.alamat_lengkap || ''
    });
  };



  return (
    <div className="min-h-screen bg-[#fafaf8] font-['Poppins',sans-serif]">
      <Head title="Pembayaran - Apotek Jaya Farma" />
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-8 mt-4">
        <button onClick={() => window.history.back()} className="text-[#006a3f] hover:text-[#005632] flex items-center gap-2 mb-6 text-[14px] font-medium transition-colors w-fit">
            &larr; Kembali
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SISI KIRI: Form Checkout */}
          <div className="lg:col-span-2 space-y-7">
            
            {/* KARD 1: Alamat Pengiriman */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-bold text-gray-900">Alamat Pengiriman</h2>
                <button 
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)} 
                  className="text-[14px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors focus:outline-none"
                >
                  Ubah
                </button>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-[#fafaf8]">
                <div className="mt-0.5 text-[#006a3f]">
                  <MapPin size={24} strokeWidth={2}/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px]">{selectedAddress?.nama_penerima || 'Nama Penerima'}</h3>
                  <p className="text-gray-700 text-[14px] mt-1.5 leading-relaxed pr-4">
                    {selectedAddress?.alamat_lengkap || 'Alamat lengkap belum tersedia'}
                  </p>
                  <p className="text-gray-700 font-medium text-[14px] mt-1.5">
                    {selectedAddress?.nomor_hp || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* KARD 2: Metode Pengiriman */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h2 className="text-[22px] font-bold text-gray-900 mb-6">Metode Pengiriman</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {shippingMethods.map((method) => {
                  const isActive = shippingMethod === method.id;
                  return (
                    <div 
                      key={method.id}
                      onClick={() => setShippingMethod(method.id)}
                      className={`relative cursor-pointer p-5 rounded-xl border transition-all ${
                        isActive 
                          ? 'border-[#006a3f] shadow-[0_0_0_1px_rgba(0,106,63,1)] bg-white' 
                          : 'border-gray-200 hover:border-[#006a3f]/50 bg-white'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-5 right-5 text-[#006a3f]">
                          <CheckCircle2 size={20} strokeWidth={2.5}/>
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 text-[15px]">{method.title}</h3>
                      {method.subtitle && (
                        <p className="text-[13px] text-gray-500 mt-1">{method.subtitle}</p>
                      )}
                      <p className={`font-bold mt-4 text-[15px] ${isActive ? 'text-[#006a3f]' : 'text-[#006a3f]'}`}>
                        {method.price === 0 ? 'Gratis' : `Rp ${method.price.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>



          </div>

          {/* SISI KANAN: Ringkasan Pesanan (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <h2 className="text-[20px] font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>

                {/* Daftar Item */}
                <div className="space-y-4 mb-7 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                  {cartItems.length > 0 ? cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 p-1 flex items-center justify-center">
                        {item.foto ? (
                          <img src={item.foto} alt={item.nama} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-gray-400 font-medium">Tidak Ada Gambar</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-gray-800 text-[14px] leading-tight truncate">{item.nama}</p>
                        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Jumlah: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-[14px] whitespace-nowrap">
                        Rp {(item.harga * item.quantity).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )) : (
                     <p className="text-gray-500 text-sm">Tidak ada item di checkout.</p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-5 space-y-4 mb-6">
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-gray-600 font-medium">Subtotal Produk</span>
                    <span className="font-medium text-gray-800">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-gray-600 font-medium">Biaya Pengiriman</span>
                    <span className="font-medium text-gray-800">Rp {currentShippingCost.toLocaleString('id-ID')}</span>
                  </div>

                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#006a3f] font-medium">Potongan Harga</span>
                    <span className="font-medium text-[#006a3f]">-Rp {Number(discount).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-5 mb-8 flex justify-between items-center">
                  <span className="text-[18px] font-bold text-gray-900">Total</span>
                  <span className="text-[24px] font-black text-[#006a3f] tracking-tight">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>

                <button 
                  onClick={handleProcess}
                  className="w-full bg-[#006a3f] text-white rounded-xl py-4 flex items-center justify-center font-bold text-[16px] hover:bg-[#005632] transition-all shadow-md hover:shadow-lg"
                >
                  Bayar Sekarang
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Pop-up Modal Pilih Alamat */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          {/* Backdrop click to close */}
          <div 
            onClick={() => {
              setIsAddressModalOpen(false);
              setIsAddingNewAddress(false);
              setAddressFormErrors({});
            }}
            className="fixed inset-0 cursor-default"
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100 flex flex-col max-h-[85vh] z-10">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#171d19]">
                {isAddingNewAddress ? 'Tambah Alamat Baru' : 'Pilih Alamat Pengiriman'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setIsAddingNewAddress(false);
                  setAddressFormErrors({});
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              
              {!isAddingNewAddress ? (
                <>
                  {/* Address List */}
                  <div className="space-y-4">
                    {addresses.length > 0 ? (
                      addresses.map((addr) => {
                        const formattedAddrStr = `${addr.alamat_lengkap}, ${addr.kota}, ${addr.provinsi} ${addr.kode_pos}`;
                        const isSelected = selectedAddress?.alamat_lengkap === formattedAddrStr || 
                                           selectedAddress?.alamat_lengkap?.startsWith(addr.alamat_lengkap);

                        return (
                          <div 
                            key={addr.id} 
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-5 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-4 ${
                              isSelected 
                                ? 'border-[#006a3f] bg-[#006a3f]/[0.02] shadow-sm' 
                                : 'border-gray-200 hover:border-[#006a3f]/50 hover:bg-gray-50/30'
                            }`}
                          >
                            <div className="space-y-2 text-left flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-[14.5px] font-['Inter',sans-serif]">{addr.label}</span>
                                {addr.is_default && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Utama
                                  </span>
                                )}
                              </div>
                              <p className="text-[13px] text-gray-600 leading-relaxed font-['Inter',sans-serif]">
                                {addr.alamat_lengkap}, {addr.kota}, {addr.provinsi} {addr.kode_pos}
                              </p>
                            </div>
                            
                            {isSelected && (
                              <div className="text-[#006a3f] shrink-0 pr-1">
                                <CheckCircle2 size={22} strokeWidth={2.5} />
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-500 text-sm italic text-center py-4 font-['Inter',sans-serif]">Belum ada alamat tambahan.</p>
                    )}
                  </div>

                  {/* Add New Address Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(true)}
                    className="w-full py-3.5 border-2 border-dashed border-gray-200 hover:border-[#006a3f] text-gray-500 hover:text-[#006a3f] rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all focus:outline-none"
                  >
                    <Plus size={18} />
                    Tambah Alamat Baru
                  </button>
                </>
              ) : (
                /* New Address Form */
                <form onSubmit={handleSaveAddress} className="space-y-4 text-left">
                  <div>
                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Label Alamat (Misal: Rumah, Kantor)</label>
                    <input 
                      type="text" 
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Rumah / Kantor / Kos" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                    {addressFormErrors.label && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.label}</p>}
                  </div>

                  <div>
                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Alamat Lengkap</label>
                    <textarea 
                      value={newAlamatLengkap}
                      onChange={(e) => setNewAlamatLengkap(e.target.value)}
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" 
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                    {addressFormErrors.alamat_lengkap && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.alamat_lengkap}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Provinsi</label>
                      <select 
                        value={newProvinsi}
                        onChange={handleProvinceChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                        required
                      >
                        <option value="">Pilih Provinsi</option>
                        {regions.map(r => (
                          <option key={r.name} value={r.name}>{r.name}</option>
                        ))}
                      </select>
                      {addressFormErrors.provinsi && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.provinsi}</p>}
                    </div>

                    <div>
                      <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kota</label>
                      <select 
                        value={newKota}
                        onChange={e => setNewKota(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        required
                        disabled={!newProvinsi}
                      >
                        <option value="">Pilih Kota/Kabupaten</option>
                        {availableCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {addressFormErrors.kota && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.kota}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Kode Pos</label>
                    <input 
                      type="text" 
                      value={newKodePos}
                      onChange={(e) => setNewKodePos(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                      required
                    />
                    {addressFormErrors.kode_pos && <p className="mt-1 text-xs text-red-500 font-medium">{addressFormErrors.kode_pos}</p>}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      id="newIsDefault"
                      checked={newIsDefault}
                      onChange={(e) => setNewIsDefault(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f]"
                    />
                    <label htmlFor="newIsDefault" className="font-['Inter',sans-serif] text-[14px] text-gray-700">Jadikan alamat utama</label>
                  </div>

                  <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingNewAddress(false);
                        setAddressFormErrors({});
                      }}
                      className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium tracking-wide transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingAddress}
                      className="px-8 py-3 bg-[#006a3f] hover:bg-[#005632] text-white rounded-xl font-['Roboto_Condensed',sans-serif] text-[16px] font-medium tracking-wide transition-colors disabled:opacity-50"
                    >
                      {isSubmittingAddress ? 'Menyimpan...' : 'Simpan Alamat'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Konfirmasi Pesanan"
        message="Pastikan alamat dan metode pengiriman Anda sudah sesuai. Setelah ini, nota tagihan resmi akan diterbitkan."
        confirmText="Ya, Pesan Sekarang"
        cancelText="Batal"
        type="warning"
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={executeProcess}
      />
    </div>
  );
}
