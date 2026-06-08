import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { CheckCircle, Clock, Copy, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

interface Transaction {
  id: number;
  va_number: string;
  payment_method: string;
  total_amount: string | number; // usually string from DB
  status: string;
  created_at: string;
}

interface Props {
  transaction: Transaction;
}

export default function Invoice({ transaction }: Props) {
  const isLunas = transaction.status === 'Lunas';
  
  // Timer: 20 minutes from created_at
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isLunas) return;
    
    // Calculate difference between now and created_at + 20 mins
    const createdAt = new Date(transaction.created_at).getTime();
    const expiryTime = createdAt + (20 * 60 * 1000);
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      setTimeLeft(diff);
    };

    updateTimer(); // initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [transaction.created_at, isLunas]);

  const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transaction.va_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    router.post(`/invoice/${transaction.id}/simulasi-bayar`, {}, {
      preserveScroll: true,
    });
  };

  const goToHome = () => {
    router.get('/');
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] font-['Poppins',sans-serif]">
      <Head title="Invoice Pembayaran - Apotek Jaya Farma" />
      <Header />

      <main className="max-w-[800px] mx-auto px-4 py-12">
        
        <div className="mb-6">
          <Link href="/profile" className="inline-flex items-center gap-1 font-['Inter',sans-serif] text-[14px] text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft size={16} />
            Kembali ke Riwayat Pesanan
          </Link>
        </div>
        {isLunas ? (
          // SUKSES UI
          <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-gray-100 max-w-lg mx-auto transform transition-all animate-fade-in-up">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-[#006a3f]">
              <CheckCircle size={48} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-gray-500 mb-8">Terima kasih, pesanan Anda sedang diproses dan akan segera dikirimkan.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">Metode</span>
                <span className="font-bold text-gray-900">{transaction.payment_method}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total Dibayar</span>
                <span className="font-black text-[#006a3f] text-lg">Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</span>
              </div>
            </div>

            <Link 
              href="/profile?tab=orders&status=Lunas"
              className="w-full flex items-center justify-center bg-[#006a3f] text-white rounded-xl py-4 font-bold hover:bg-[#005632] transition-colors"
            >
              Lihat Riwayat Pesanan
            </Link>
          </div>
        ) : (
          // PENDING UI
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            
            {/* Header / Timer */}
            <div className="bg-amber-50 border-b border-amber-100 p-6 text-center">
              <h2 className="text-amber-800 font-bold mb-2">Selesaikan Pembayaran Dalam</h2>
              <div className="flex items-center justify-center gap-2 text-4xl font-black text-amber-600 tracking-tight">
                <Clock size={32} strokeWidth={3} />
                {formattedTime}
              </div>
              <p className="text-sm text-amber-700/70 mt-2">Batas akhir: {new Date(new Date(transaction.created_at).getTime() + 20*60000).toLocaleTimeString('id-ID')}</p>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Total Pembayaran</p>
                  <p className="text-3xl font-black text-[#006a3f]">Rp {Number(transaction.total_amount).toLocaleString('id-ID')}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={20} className="text-[#006a3f]" />
                    <p className="font-bold text-gray-900">Virtual Account / QRIS</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{transaction.payment_method}</p>
                  
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4">
                    <span className="text-2xl font-bold text-gray-900 tracking-wider">
                      {transaction.va_number}
                    </span>
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-sm font-bold text-[#006a3f] hover:text-[#005632] transition-colors bg-emerald-50 px-4 py-2 rounded-lg"
                    >
                      {copied ? 'Tersalin!' : (
                        <>
                          <Copy size={16} strokeWidth={2.5} /> Salin
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SIMULASI BUTTON */}
              <div className="mt-12 border-t border-dashed border-gray-200 pt-8">
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
                  <p className="text-indigo-800 font-bold mb-2">Area Developer (Simulasi)</p>
                  <p className="text-sm text-indigo-600 mb-6">Klik tombol di bawah untuk menyimulasikan sistem API bank memverifikasi pembayaran Anda.</p>
                  
                  <button 
                    onClick={handleSimulatePayment}
                    className="bg-indigo-600 text-white rounded-xl py-4 px-8 font-bold flex items-center justify-center gap-2 mx-auto hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 hover:shadow-lg"
                  >
                    Klik di Sini untuk Simulasi Bayar Lunas
                    <ArrowRight size={20} />
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
