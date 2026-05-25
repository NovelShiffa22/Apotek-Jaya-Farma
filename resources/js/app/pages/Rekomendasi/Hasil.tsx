import React, { useState } from 'react';
import axios from 'axios';
import { Link, router } from '@inertiajs/react';
import Header from '../../components/Header';
import { CheckCircle2, AlertTriangle, ShoppingCart, ArrowLeft, Star, AlertCircle, XCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

interface RecommendationResult {
  id: number;
  nama_obat: string;
  kategori: string;
  jenis_obat: string;
  harga: number;
  gambar?: string;
  aturan_pakai: string;
  skor_kecocokan: number;
  kategori_rekomendasi?: string;
  status?: string;
  alasan?: string;
}

interface Props {
  results: RecommendationResult[];
  input_usia?: number;
  total_found?: number;
}

// Komponen Kartu Recommendation yang memiliki local state (isProcessing) sendiri
const RecommendationCard = ({ product, isTopRecommendation }: { product: RecommendationResult, isTopRecommendation: boolean }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const isNotRecommended = product.kategori_rekomendasi === 'tidak disarankan' || product.status === 'tidak disarankan';
  
  // Konversi skor ke format persentase
  const percentageScore = product.skor_kecocokan > 0 
      ? Math.min(Math.round(product.skor_kecocokan * 45 + 50), 99) 
      : 0;

  // Handler integrasi Cart menggunakan Axios agar tidak memicu redirect halaman (mencegah 405 Not Found)
  const handleAddToCart = async () => {
      if (isNotRecommended) return;
      
      setIsProcessing(true);
      try {
          const response = await axios.post('/cart/add', { 
              product_id: product.id, 
              quantity: 1 
          });
          
          // Emit event lokal agar Navbar menangkap total cart terbaru tanpa harus reload Inertia
          if (response.data.cartCount !== undefined) {
              window.dispatchEvent(new CustomEvent('cartUpdated', { detail: response.data.cartCount }));
          }

          // Gunakan state notifikasi yang lebih estetis jika memungkinkan, tapi sementara pakai alert
          alert(response.data.message || 'Obat berhasil ditambahkan ke keranjang!');
      } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Gagal menambahkan ke keranjang.';
          alert('Gagal: ' + errorMessage);
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <div key={product.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-gray-100 gap-4 mb-3 last:mb-0 shadow-sm hover:shadow-md transition-shadow ${isNotRecommended ? 'bg-red-50' : 'bg-white'}`}>
        
        {/* SISI KIRI: Ikon Gambar & Detail Informasi Obat */}
        <div className="flex items-start gap-4 flex-1 w-full">
            {/* Placeholder Gambar Obat */}
            <div className="w-14 h-14 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                {product.gambar ? (
                  <img src={product.gambar} alt={product.nama_obat} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
            </div>
            
            {/* Teks Informasi Detail Obat */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900 text-base truncate">{product.nama_obat}</h4>
                  {isTopRecommendation && (
                    <span className="bg-[#006a3f] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      Terbaik
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-semibold uppercase tracking-wider ${isNotRecommended ? 'text-red-600' : 'text-emerald-600'}`}>{product.jenis_obat || 'Bebas'}</span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-500">{product.kategori || 'Analgesik'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                    <span className="font-medium text-gray-700">Aturan Pakai:</span> {product.aturan_pakai || 'Sesuai petunjuk dokter.'}
                </p>
                {isNotRecommended && product.alasan && (
                  <p className="text-[11px] font-semibold text-red-700 mt-1 bg-red-100/80 px-2 py-0.5 rounded-sm inline-block w-fit">
                    ⚠️ {product.alasan}
                  </p>
                )}
            </div>
        </div>

        {/* SISI KANAN: Harga, Skor Kecocokan, dan Tombol Aksi */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-shrink-0 min-w-[140px]">
            <div className="text-left md:text-right">
                <p className="text-lg font-bold text-gray-900">Rp {(product.harga || 0).toLocaleString('id-ID')}</p>
                {!isNotRecommended ? (
                  <p className="text-xs text-gray-500 mt-0.5">Kecocokan: <span className="font-bold text-[#006a3f]">{percentageScore}%</span></p>
                ) : (
                  <p className="text-[10px] font-bold text-red-600 uppercase mt-0.5">DILARANG KLINIS</p>
                )}
            </div>
            
            {/* Tombol yang reaktif terhadap state loading & not recommended */}
            <button 
                onClick={handleAddToCart}
                disabled={isNotRecommended || isProcessing}
                className={`px-4 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                    isNotRecommended || isProcessing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                    : 'bg-[#006a3f] text-white hover:bg-emerald-800'
                }`}
            >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShoppingCart size={14} strokeWidth={2} />
                )}
                {isNotRecommended ? 'Dilarang' : isProcessing ? 'Memproses' : 'Tambah'}
            </button>
        </div>

    </div>
  );
};

export default function Hasil({ results = [], input_usia }: Props) {
  
  // Logika filtering kategori yang sesuai dengan Controller
  const recommended = results.filter(p => p.kategori_rekomendasi === 'direkomendasikan' || p.status === 'direkomendasikan');
  const considered = results.filter(p => p.kategori_rekomendasi === 'dipertimbangkan' || p.status === 'dipertimbangkan');
  const notRecommended = results.filter(p => p.kategori_rekomendasi === 'tidak disarankan' || p.status === 'tidak disarankan');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[800px] mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-['Roboto_Condensed',sans-serif] font-bold text-[36px] tracking-tight text-[#171d19] mb-3">
            Hasil Analisis Rekomendasi
          </h1>
          <p className="font-['Inter',sans-serif] text-[15px] text-[#3e4a41] max-w-[500px] mx-auto leading-relaxed">
            Daftar obat yang disarankan berdasarkan keluhan medis dan profil usia {input_usia ? <span className="font-bold text-[#006a3f]">{input_usia} Tahun</span> : ''} Anda.
          </p>
        </div>

        {/* Struktur 3 Box Selalu Muncul */}
        <div className="space-y-8">

          {/* Box 1: Direkomendasikan */}
          <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center gap-3">
              <CheckCircle2 className="text-emerald-600" size={20} />
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-emerald-800">
                Direkomendasikan
              </h3>
            </div>
            {recommended.length > 0 && (
              <div className="flex flex-col p-4 bg-gray-50/30">
                {recommended.map((product, idx) => (
                  <RecommendationCard key={product.id} product={product} isTopRecommendation={idx === 0} />
                ))}
              </div>
            )}
          </div>

          {/* Box 2: Dipertimbangkan */}
          <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-100 px-6 py-4 flex items-center gap-3">
              <AlertCircle className="text-amber-600" size={20} />
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-amber-800">
                Dipertimbangkan
              </h3>
            </div>
            {considered.length > 0 && (
              <div className="flex flex-col p-4 bg-gray-50/30">
                {considered.map((product, idx) => (
                  <RecommendationCard key={product.id} product={product} isTopRecommendation={false} />
                ))}
              </div>
            )}
          </div>

          {/* Box 3: Tidak Disarankan */}
          <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
            <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
              <XCircle className="text-red-600" size={20} />
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-bold text-red-800">
                Tidak Disarankan
              </h3>
            </div>
            {notRecommended.length > 0 && (
              <div className="flex flex-col p-4 bg-gray-50/30">
                {notRecommended.map((product, idx) => (
                  <RecommendationCard key={product.id} product={product} isTopRecommendation={false} />
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="mt-10 flex justify-center">
          <Link 
            href="/recommendation"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-['Inter',sans-serif] text-[14px] font-bold text-[#6e7a70] bg-white border border-[#e5e7eb] hover:border-[#006a3f] hover:text-[#006a3f] transition-all"
          >
            <ArrowLeft size={16} />
            Kembali ke Form Gejala
          </Link>
        </div>
      </main>
    </div>
  );
}
