import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { CheckCircle, Clock, Copy, ArrowRight, ShieldCheck, ArrowLeft, Receipt, Package, Lock, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import ConfirmModal from '../components/ConfirmModal';

interface Transaction {
  id: number;
  va_number: string;
  payment_method: string;
  total_amount: string | number;
  status: string;
  created_at: string;
  snap_token?: string;
  items?: any[];
}

interface Props {
  transaction: Transaction;
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function Invoice({ transaction }: Props) {
  const [isLunasState, setIsLunasState] = useState(transaction.status === 'Lunas');
  const [isExpired, setIsExpired] = useState(transaction.status === 'Dibatalkan' || transaction.status === 'Expired');
  
  // Timer: 20 minutes from created_at
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [copied, setCopied] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Batal',
    type: 'warning' as 'warning' | 'delete' | 'logout',
    onConfirm: () => {}
  });

  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  // Load Midtrans Script
  useEffect(() => {
    const isProduction = import.meta.env.VITE_MIDTRANS_IS_PRODUCTION === 'true';
    const snapScript = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "SB-Mid-client-xxxxxxxxxxx";
    
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isLunasState) return;
    
    const createdAt = new Date(transaction.created_at).getTime();
    const expiryTime = createdAt + (20 * 60 * 1000);
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0) {
        setIsExpired(true);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [transaction.created_at, isLunasState]);

  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transaction.va_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayMidtrans = () => {
    if (transaction.snap_token) {
        window.snap.pay(transaction.snap_token, {
          onSuccess: function(result: any){
            setIsLunasState(true);
            setModalConfig({
                isOpen: true,
                title: 'Pembayaran Berhasil!',
                message: 'Transaksi Anda telah lunas. Nota tagihan resmi telah diterbitkan.',
                confirmText: 'Tutup',
                cancelText: '',
                type: 'warning',
                onConfirm: closeModal
            });
          },
          onPending: function(result: any){
            // Tetap di halaman
          },
          onError: function(result: any){
            if (result.transaction_status === 'expire' || result.status_code === '406' || result.status_code === '407') {
                setIsExpired(true);
            } else {
                setModalConfig({
                    isOpen: true,
                    title: 'Pembayaran Gagal/Kedaluwarsa!',
                    message: 'Maaf, pembayaran Anda tidak dapat diproses. Silakan coba kembali.',
                    confirmText: 'Tutup',
                    cancelText: '',
                    type: 'delete',
                    onConfirm: closeModal
                });
            }
          },
          onClose: function(){
            const now = new Date().getTime();
            const createdAt = new Date(transaction.created_at).getTime();
            if (now >= createdAt + (20 * 60 * 1000)) {
                setIsExpired(true);
            }
          }
        });
    } else {
        alert("Token pembayaran tidak tersedia. Silakan hubungi admin.");
    }
  };


  const handleCancelClick = () => {
    setModalConfig({
      isOpen: true,
      title: 'Batalkan Pesanan',
      message: 'Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dikembalikan.',
      confirmText: 'Ya, Batalkan',
      cancelText: 'Kembali',
      type: 'delete',
      onConfirm: () => {
        closeModal();
        router.post(`/invoice/${transaction.id}/cancel`, {}, {
          preserveScroll: true
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] font-['Poppins',sans-serif]">
      <Head title="Invoice Pembayaran - Apotek Jaya Farma" />
      <Header />

      <main className="max-w-[800px] mx-auto px-4 py-12">
        
        <div className="mb-6">
          <Link href="/profile?tab=orders" className="inline-flex items-center gap-1 font-['Inter',sans-serif] text-[14px] text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} />
            Kembali ke Riwayat Pesanan
          </Link>
        </div>

        {isLunasState ? (
          // SUKSES UI - NOTA RESMI
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 max-w-3xl mx-auto transform transition-all animate-fade-in-up relative overflow-hidden">
            {/* Dekorasi Nota */}
            <div className="absolute top-0 left-0 w-full h-3 bg-[#006a3f]"></div>
            <div className="absolute top-8 right-8 text-emerald-100 opacity-50">
              <Receipt size={120} strokeWidth={1} />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-8 mb-8 gap-6">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">INVOICE</h1>
                  <p className="text-gray-500 text-sm mt-1">Order #{transaction.id.toString().padStart(6, '0')}</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#006a3f] px-5 py-2.5 rounded-full border border-emerald-100 font-bold shadow-sm self-start sm:self-auto">
                  <CheckCircle size={20} />
                  [✓] PEMBAYARAN LUNAS
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informasi Pembayaran</p>
                  <p className="font-semibold text-gray-900 mb-1">{transaction.payment_method}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status Pengiriman</p>
                  <p className="font-semibold text-gray-900 mb-1">Diproses</p>
                  <p className="text-sm text-gray-500">Apoteker sedang menyiapkan pesanan Anda.</p>
                </div>
              </div>

              {/* Rincian Item */}
              <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Package size={14} /> Rincian Obat
                </p>
                <div className="space-y-4">
                  {transaction.items && transaction.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0">
                       <div className="flex-1 pr-4">
                         <p className="font-semibold text-gray-800 text-[15px]">{item.name}</p>
                         <p className="text-[13px] text-gray-500">{item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}</p>
                       </div>
                       <p className="font-bold text-gray-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center bg-[#fafaf8] rounded-xl p-6 border border-gray-200 shadow-sm">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Dibayar</span>
                <span className="font-black text-[#006a3f] text-2xl">Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</span>
              </div>

              <div className="mt-10">
                <button 
                  onClick={() => router.get('/profile', { tab: 'orders', status: 'Diproses' })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-4 px-6 text-center w-full block transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Kembali ke Riwayat Pesanan
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          // PENDING OR EXPIRED UI
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden max-w-2xl mx-auto">
            
            {/* Header / Timer */}
            <div className={`border-b p-6 text-center ${isExpired ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
              <h2 className={`font-bold mb-2 ${isExpired ? 'text-red-800' : 'text-amber-800'}`}>
                {isExpired ? 'Status Pesanan' : 'Selesaikan Pembayaran Dalam'}
              </h2>
              {isExpired ? (
                  <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-5 py-2.5 rounded-full font-bold shadow-sm mt-2">
                    <AlertCircle size={20} strokeWidth={2.5} />
                    <span>TRANSAKSI KEDALUWARSA (<span className="italic">EXPIRED</span>)</span>
                  </div>
              ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 text-4xl font-black text-amber-600 tracking-tight">
                        <Clock size={32} strokeWidth={3} />
                        {formattedTime}
                    </div>
                    <p className="text-sm text-amber-700/70 mt-2">Batas akhir: {new Date(new Date(transaction.created_at).getTime() + 20*60000).toLocaleTimeString('id-ID')}</p>
                  </>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {isExpired && (
                  <div className="bg-red-50/50 rounded-xl p-4 border border-red-100 mb-6 text-center">
                      <p className="text-red-600 text-sm leading-relaxed">
                          Waktu pembayaran Anda telah habis. Sisa stok obat telah dikembalikan ke sistem. Silakan lakukan pemesanan ulang melalui katalog.
                      </p>
                  </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Pembayaran</p>
                  <p className={`text-3xl font-black ${isExpired ? 'text-gray-400 line-through' : 'text-[#006a3f]'}`}>
                      Rp {Number(transaction.total_amount).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-8 space-y-4">
                {isExpired ? (
                    <button 
                      onClick={() => router.get('/catalog')}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 text-red-600 font-bold rounded-xl py-4 transition duration-200 text-base shadow-sm mt-6"
                    >
                      ← Kembali ke Katalog Obat
                    </button>
                ) : (
                    <>
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4 rounded-xl flex items-start gap-2.5 mb-6 text-left">
                            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                            <p className="leading-relaxed">⚠️ Jam Operasional Pengemasan & Pengiriman: 08.00-18.00 WIB. Pembayaran di luar jam tersebut akan diproses esok hari.</p>
                        </div>
                        <button 
                          onClick={handlePayMidtrans}
                          className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-4 px-6 transition duration-200 text-base shadow-lg"
                        >
                          <Lock size={20} strokeWidth={2} />
                          Selesaikan Pembayaran via Midtrans
                        </button>
                        <button 
                          onClick={handleCancelClick}
                          className="w-full bg-white border-2 border-red-500 text-red-500 rounded-xl py-3.5 font-bold flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          Batalkan Pesanan
                        </button>
                    </>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        type={modalConfig.type}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
      />
    </div>
  );
}
