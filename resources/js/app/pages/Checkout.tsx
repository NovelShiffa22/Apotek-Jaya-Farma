import { useState, useMemo, useEffect } from 'react';
import { Head, router, Link, usePage, useForm } from '@inertiajs/react';
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
  const { auth, errors } = usePage().props as any;
  const [shippingMethod, setShippingMethod] = useState<string>(shippingMethods[0]?.id || '');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEmptyCartAlertOpen, setIsEmptyCartAlertOpen] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('checkout_cancel_modal') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkout_cancel_modal', isCancelModalOpen ? 'true' : 'false');
    }
  }, [isCancelModalOpen]);

  useEffect(() => {
    // Hash trap yang kebal remount Inertia
    if (window.location.hash !== '#form') {
      window.location.hash = 'form';
    }

    const handleHashChange = () => {
      if (window.location.hash !== '#form') {
        window.location.hash = 'form';
        setIsCancelModalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  
  // Local Address Selection
  const defaultAddressStr = address?.alamat_lengkap && address.alamat_lengkap !== 'Alamat belum diatur' ? address : null;
  const [selectedAddressLocal, setSelectedAddressLocal] = useState<Address | null>(defaultAddressStr);

  const { data: formAddress, setData: setFormAddress, post: postAddress, processing: processingAddress, reset: resetAddress } = useForm({
    label: '',
    alamat_lengkap: '',
    provinsi: '',
    kota: '',
    kode_pos: '',
    is_default: true
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Calculations
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.harga * item.quantity), 0), [cartItems]);
  
  const currentShippingCost = useMemo(() => {
    const method = shippingMethods.find(m => m.id === shippingMethod);
    return method ? method.price : 0;
  }, [shippingMethod, shippingMethods]);

  const total = subtotal > 0 ? subtotal + currentShippingCost - discount : 0;

  const isAddressEmpty = !selectedAddressLocal || !selectedAddressLocal.alamat_lengkap || selectedAddressLocal.alamat_lengkap === 'Alamat belum diatur';

  // Handle Submission
  const handleProcess = () => {
    if (cartItems.length === 0) {
       setIsEmptyCartAlertOpen(true);
       return;
    }
    if (isAddressEmpty) {
       setShowAddressError(true);
       window.scrollTo({ top: 0, behavior: 'smooth' });
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
      shipping_address: selectedAddressLocal?.alamat_lengkap || ''
    });
  };

  // Address Modal Functions
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = e.target.value;
    setFormAddress('provinsi', prov);
    setFormAddress('kota', '');
    const selectedRegion = regions.find(r => r.name === prov);
    setAvailableCities(selectedRegion ? selectedRegion.cities : []);
  };

  const submitNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    postAddress(route('address.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setIsAddingNewAddress(false);
        resetAddress();
        setIsAddressModalOpen(false);
        // The newly saved address will be re-fetched by Inertia and loaded into `address` props.
        // We can manually set it to avoid needing a hard refresh logic if we wanted, but inertia reload handles it.
        window.location.reload(); 
      }
    });
  };

  const selectExistingAddress = (addr: DBAddress) => {
    router.patch(route('address.set_utama', addr.id), {}, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedAddressLocal({
           nama_penerima: `${auth?.user?.name || ''} (${addr.label})`,
           alamat_lengkap: `${addr.alamat_lengkap}, ${addr.kota}, ${addr.provinsi}, ${addr.kode_pos}`,
           nomor_hp: auth?.user?.phone || ''
        });
        setIsAddressModalOpen(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] font-['Poppins',sans-serif]">
      <Head title="Pembayaran - Apotek Jaya Farma" />
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-8 mt-4">
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
                  className="text-[14px] font-bold text-[#1e5b53] hover:text-[#005632] transition-colors focus:outline-none"
                >
                  Ubah
                </button>
              </div>

              <div className={`flex items-start gap-4 p-5 rounded-xl border ${(errors?.address || isAddressEmpty) ? 'border-[#ef4444] bg-red-50/50' : 'border-gray-200 bg-[#fafaf8]'}`}>
                <div className="mt-0.5 text-[#1e5b53]">
                  <MapPin size={24} strokeWidth={2}/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px]">{selectedAddressLocal?.nama_penerima || auth?.user?.name || 'Nama Penerima'}</h3>
                  <p className="text-gray-700 text-[14px] mt-1.5 leading-relaxed pr-4">
                    {selectedAddressLocal?.alamat_lengkap || 'Alamat lengkap belum tersedia'}
                  </p>
                  <p className="text-gray-700 font-medium text-[14px] mt-1.5">
                    {selectedAddressLocal?.nomor_hp || auth?.user?.phone || '-'}
                  </p>
                </div>
              </div>
              {(errors?.address || isAddressEmpty) && (
                <p className="text-[#ef4444] text-[13px] mt-3 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] inline-block"></span>
                  {errors?.address || 'Alamat pengiriman wajib diisi dan tidak boleh kosong sebelum memilih kurir!'}
                </p>
              )}
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
                          ? 'border-[#1e5b53] shadow-[0_0_0_1px_rgba(0,106,63,1)] bg-white' 
                          : 'border-gray-200 hover:border-[#1e5b53]/50 bg-white'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-5 right-5 text-[#1e5b53]">
                          <CheckCircle2 size={20} strokeWidth={2.5}/>
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 text-[15px]">{method.title}</h3>
                      {method.subtitle && (
                        <p className="text-[13px] text-gray-500 mt-1">{method.subtitle}</p>
                      )}
                      <p className={`font-bold mt-4 text-[15px] ${isActive ? 'text-[#1e5b53]' : 'text-[#1e5b53]'}`}>
                        {method.price === 0 ? 'Gratis' : `Rp ${method.price.toLocaleString('id-ID')}`}
                      </p>
                    </div>
                  )
                })}
              </div>
              {errors?.shipping_method && (
                <p className="text-[#ef4444] text-[13px] mt-4 font-medium flex items-center gap-1.5 p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] inline-block shrink-0"></span>
                  {errors.shipping_method}
                </p>
              )}
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
                    <span className="text-[#1e5b53] font-medium">Potongan Harga</span>
                    <span className="font-medium text-[#1e5b53]">-Rp {Number(discount).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-5 mb-8 flex justify-between items-center">
                  <span className="text-[18px] font-bold text-gray-900">Total</span>
                  <span className="text-[24px] font-black text-[#1e5b53] tracking-tight">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>

                <button 
                  onClick={handleProcess}
                  disabled={isAddressEmpty}
                  className={`w-full rounded-xl py-4 flex items-center justify-center font-bold text-[16px] transition-all shadow-md hover:shadow-lg ${isAddressEmpty ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1e5b53] text-white hover:bg-[#005632]'}`}
                >
                  Bayar Sekarang
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Super Modal Alamat */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transform transition-all scale-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-[#171d19]">
                {isAddingNewAddress ? 'Tambah Alamat Baru' : 'Pilih Alamat Pengiriman'}
              </h3>
              <button 
                onClick={() => { 
                  setIsAddressModalOpen(false); 
                  setIsAddingNewAddress(false); 
                  resetAddress(); 
                }}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="overflow-y-auto scrollbar-thin p-6 bg-[#fafaf8]">
              {isAddingNewAddress ? (
                <form onSubmit={submitNewAddress} className="space-y-4">
                  <div>
                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Label Alamat (Misal: Rumah, Kantor)</label>
                    <input 
                      type="text" 
                      value={formAddress.label}
                      onChange={e => setFormAddress('label', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-['Inter',sans-serif] text-[13px] font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Alamat Lengkap</label>
                    <textarea 
                      value={formAddress.alamat_lengkap}
                      onChange={e => setFormAddress('alamat_lengkap', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
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
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all"
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
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormAddress('kode_pos', val.slice(0, 5));
                      }}
                      pattern="\d{5}"
                      title="Kode pos harus terdiri dari 5 digit angka"
                      className={`w-full px-4 py-3 bg-white border rounded-xl font-['Inter',sans-serif] text-[15px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#1e5b53]/20 focus:border-[#1e5b53] transition-all ${
                        formAddress.kode_pos.length > 0 && formAddress.kode_pos.length < 5 ? 'border-[#ef4444]' : 'border-gray-300'
                      }`}
                      required
                    />
                    {formAddress.kode_pos.length > 0 && formAddress.kode_pos.length < 5 && (
                      <p className="mt-2 text-[12px] text-[#ef4444] font-medium font-['Inter',sans-serif]">
                        Kode pos tidak valid. Harus terdiri dari 5 digit angka.
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-6 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="flex-1 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold transition-colors hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      disabled={processingAddress || (formAddress.kode_pos.length > 0 && formAddress.kode_pos.length < 5)}
                      className="flex-1 py-4 bg-[#1e5b53] hover:bg-[#005632] text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingAddress ? 'Menyimpan...' : 'Simpan & Gunakan'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {addresses && addresses.length > 0 ? (
                    <div className="space-y-3">
                      {addresses.map((addr) => {
                        const addrString = `${addr.alamat_lengkap}, ${addr.kota}, ${addr.provinsi}, ${addr.kode_pos}`;
                        const isSelected = selectedAddressLocal?.alamat_lengkap === addrString;
                        return (
                          <div 
                            key={addr.id}
                            onClick={() => selectExistingAddress(addr)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected ? 'border-[#1e5b53] bg-emerald-50/30' : 'border-gray-200 bg-white hover:border-[#1e5b53]/50'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{addr.label}</span>
                                {addr.is_default && (
                                  <span className="text-[10px] font-bold bg-[#1e5b53] text-white px-2 py-0.5 rounded-full">
                                    Utama
                                  </span>
                                )}
                              </div>
                              {isSelected && <CheckCircle2 size={18} className="text-[#1e5b53]" />}
                            </div>
                            <p className="text-gray-600 text-[13px] leading-relaxed">
                              {addr.alamat_lengkap}
                              <br />
                              {addr.kota}, {addr.provinsi}
                              <br />
                              Kode Pos: {addr.kode_pos}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-[14px]">Anda belum memiliki alamat tersimpan.</p>
                    </div>
                  )}

                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="w-full flex items-center justify-center gap-2 py-4 mt-4 border-2 border-dashed border-[#1e5b53]/30 text-[#1e5b53] hover:bg-emerald-50 rounded-xl font-bold transition-all"
                  >
                    <Plus size={18} strokeWidth={2.5} />
                    Tambah Alamat Baru
                  </button>
                </div>
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

      <ConfirmModal
        isOpen={isEmptyCartAlertOpen}
        title="Keranjang Kosong"
        message="Tidak ada produk yang dipilih untuk dicheckout. Silakan kembali ke katalog untuk memilih produk."
        confirmText="Kembali ke Katalog"
        cancelText=""
        type="danger"
        onClose={() => setIsEmptyCartAlertOpen(false)}
        onConfirm={() => {
            setIsEmptyCartAlertOpen(false);
            router.get('/catalog');
        }}
      />

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Batalkan Proses?"
        message="Apakah Anda yakin ingin membatalkan proses checkout? Data alamat yang dipilih tidak akan tersimpan secara otomatis."
        confirmText="Ya, Batal"
        cancelText="Tutup"
        type="danger"
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
            setIsCancelModalOpen(false);
            sessionStorage.removeItem('checkout_cancel_modal');
            router.get('/cart');
        }}
      />
    </div>
  );
}
