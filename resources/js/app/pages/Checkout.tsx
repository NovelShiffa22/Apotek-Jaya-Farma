import { useState, useMemo, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { MapPin, CheckCircle2, ChevronDown, Landmark, Wallet, CreditCard, Clock } from 'lucide-react';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';

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

interface Props {
  cartItems: CartItem[];
  address: Address;
  shippingMethods: ShippingMethod[];
  discount?: number;
  isBuyNow?: boolean;
}

export default function Checkout({ cartItems = [], address, shippingMethods = [], discount = 0, isBuyNow = false }: Props) {
  const [shippingMethod, setShippingMethod] = useState<string>(shippingMethods[0]?.id || '');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

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
      shipping_method: shippingMethod,
      payment_method: 'Midtrans Payment Gateway',
      is_buy_now: isBuyNow
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
                <Link href="/profile?tab=address&redirect=/checkout" className="text-[14px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors">
                  Ubah
                </Link>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-[#fafaf8]">
                <div className="mt-0.5 text-[#006a3f]">
                  <MapPin size={24} strokeWidth={2}/>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px]">{address?.nama_penerima || 'Nama Penerima'}</h3>
                  <p className="text-gray-700 text-[14px] mt-1.5 leading-relaxed pr-4">
                    {address?.alamat_lengkap || 'Alamat lengkap belum tersedia'}
                  </p>
                  <p className="text-gray-700 font-medium text-[14px] mt-1.5">
                    {address?.nomor_hp || '-'}
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
                          <span className="text-[9px] text-gray-400 font-medium">No Img</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-medium text-gray-800 text-[14px] leading-tight truncate">{item.nama}</p>
                        <p className="text-[13px] text-gray-500 font-medium mt-0.5">Qty: {item.quantity}</p>
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
