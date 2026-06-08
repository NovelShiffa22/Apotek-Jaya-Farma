import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Header from '../components/Header';
import { MapPin, CheckCircle2, ChevronDown, Clock, CreditCard, Wallet, Building2 } from 'lucide-react';

export default function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState('kurir');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [timeLeft, setTimeLeft] = useState(20 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const cart = [
    { name: 'Paracetamol 500mg', qty: 2, price: 15000 },
    { name: 'Vitamin C 1000mg', qty: 1, price: 85000 }
  ];

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryCost = deliveryMethod === 'kurir' ? 12000 : 0;
  const total = subtotal + deliveryCost;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[1200px] mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Left Column */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Alamat Pengiriman */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-['Poppins',sans-serif] text-[20px] font-bold text-[#171d19]">
                  Alamat Pengiriman
                </h2>
                <button className="text-[#006a3f] font-['Poppins',sans-serif] text-[14px] font-bold">
                  Ubah
                </button>
              </div>
              <div className="bg-[#f9fafb] p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                <MapPin className="text-[#006a3f] shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19] mb-1">
                    Budi Santoso (Utama)
                  </h3>
                  <p className="font-['Poppins',sans-serif] text-[14px] text-[#171d19] mb-1">
                    Jl. Kemang Raya No. 42, Bangka, Mampang Prapatan, Jakarta Selatan, 12730
                  </p>
                  <p className="font-['Poppins',sans-serif] text-[14px] text-gray-500">
                    0812-3456-7890
                  </p>
                </div>
              </div>
            </section>

            {/* Metode Pengiriman */}
            <section>
              <h2 className="font-['Poppins',sans-serif] text-[20px] font-bold text-[#171d19] mb-4">
                Metode Pengiriman
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setDeliveryMethod('ambil')}
                  className={`cursor-pointer p-5 rounded-2xl border ${deliveryMethod === 'ambil' ? 'border-[#006a3f] bg-emerald-50/30' : 'border-gray-200'} transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">Ambil di Apotek</h4>
                      <p className="font-['Poppins',sans-serif] text-[13px] text-gray-500 mt-1">Siap dalam 2 jam</p>
                    </div>
                    {deliveryMethod === 'ambil' && <CheckCircle2 size={20} className="text-[#006a3f]" />}
                  </div>
                  <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f]">Gratis</span>
                </div>

                <div 
                  onClick={() => setDeliveryMethod('kurir')}
                  className={`cursor-pointer p-5 rounded-2xl border ${deliveryMethod === 'kurir' ? 'border-[#006a3f] bg-emerald-50/30' : 'border-gray-200'} transition-all`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-['Poppins',sans-serif] text-[15px] font-bold text-[#171d19]">Kurir Toko</h4>
                    </div>
                    {deliveryMethod === 'kurir' && <CheckCircle2 size={20} className="text-[#006a3f]" />}
                  </div>
                  <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f]">Rp 12.000</span>
                </div>
              </div>
            </section>

            {/* Metode Pembayaran */}
            <section>
              <h2 className="font-['Poppins',sans-serif] text-[20px] font-bold text-[#171d19] mb-6">
                Metode Pembayaran
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-['Poppins',sans-serif] text-[12px] font-bold text-gray-500 tracking-wider mb-3">TRANSFER BANK</h4>
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Building2 className="text-[#006a3f]" size={20} />
                      <span className="font-['Poppins',sans-serif] text-[14px] text-[#171d19]">Pilih Bank</span>
                    </div>
                    <ChevronDown size={20} className="text-gray-400" />
                  </div>
                </div>

                <div>
                  <h4 className="font-['Poppins',sans-serif] text-[12px] font-bold text-gray-500 tracking-wider mb-3">E-WALLET</h4>
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Wallet className="text-[#006a3f]" size={20} />
                      <span className="font-['Poppins',sans-serif] text-[14px] text-[#171d19]">Pilih E-Wallet</span>
                    </div>
                    <ChevronDown size={20} className="text-gray-400" />
                  </div>
                </div>

                <div>
                  <h4 className="font-['Poppins',sans-serif] text-[12px] font-bold text-gray-500 tracking-wider mb-3">KARTU KREDIT</h4>
                  <div className="border border-gray-200 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-[#006a3f]" size={20} />
                      <div>
                        <span className="font-['Poppins',sans-serif] text-[14px] text-[#171d19] block">Visa / Mastercard / JCB</span>
                        <span className="font-['Poppins',sans-serif] text-[11px] text-gray-400 block mt-0.5">Cicilan 0% tersedia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Ringkasan */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-32">
              <h3 className="font-['Poppins',sans-serif] text-[18px] font-bold text-[#171d19] mb-6">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-4 mb-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <p className="font-['Poppins',sans-serif] text-[14px] text-[#171d19]">{item.name}</p>
                      <p className="font-['Poppins',sans-serif] text-[12px] text-gray-500 mt-1">Qty: {item.qty}</p>
                    </div>
                    <p className="font-['Poppins',sans-serif] text-[14px] text-[#171d19]">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-['Poppins',sans-serif] text-[14px] text-gray-600">Subtotal Produk</span>
                  <span className="font-['Poppins',sans-serif] text-[14px] text-[#171d19]">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-['Poppins',sans-serif] text-[14px] text-gray-600">Biaya Pengiriman</span>
                  <span className="font-['Poppins',sans-serif] text-[14px] text-[#171d19]">Rp {deliveryCost.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6 flex justify-between items-end mb-8">
                <span className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[18px]">Total</span>
                <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f] text-[24px]">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <button className="w-full rounded-xl bg-[#006a3f] py-4 font-['Poppins',sans-serif] text-[16px] font-bold text-white transition-all hover:bg-[#005632] shadow-lg mb-4">
                Bayar Sekarang
              </button>

              <div className="bg-red-50 rounded-xl p-4 flex items-center justify-center gap-2">
                <Clock size={16} className="text-red-500" />
                <span className="font-['Poppins',sans-serif] text-[13px] font-bold text-red-600">
                  Selesaikan pembayaran dalam {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
