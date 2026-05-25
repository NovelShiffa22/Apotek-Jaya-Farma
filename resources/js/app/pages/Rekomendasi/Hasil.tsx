import { Link } from '@inertiajs/react';
import Header from '../../components/Header';
import { CheckCircle2, AlertTriangle, ShoppingCart, ArrowLeft, Star } from 'lucide-react';

interface RecommendationResult {
  id: number;
  nama_obat: string;
  kategori: string;
  jenis_obat: string;
  harga: number;
  gambar?: string;
  aturan_pakai: string;
  skor_kecocokan: number;
  kategori_rekomendasi: 'direkomendasikan' | 'dipertimbangkan' | 'tidak disarankan';
  alasan?: string;
}

interface Props {
  results: RecommendationResult[];
  input_usia?: number;
  total_found?: number;
}

export default function Hasil({ results = [], input_usia }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[1000px] mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-['Roboto_Condensed',sans-serif] font-bold text-[40px] tracking-tight text-[#171d19] mb-4">
            Hasil Analisis Rekomendasi Obat
          </h1>
          <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41] max-w-[600px] mx-auto leading-relaxed">
            Berdasarkan keluhan medis dan profil usia {input_usia ? <span className="font-bold text-[#006a3f]">{input_usia} Tahun</span> : ''} yang Anda berikan, berikut adalah daftar obat yang dianalisis oleh sistem pakar kami.
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          {results.length > 0 ? (
            results.map((product, index) => {
              const isTopRecommendation = index === 0 && product.kategori_rekomendasi !== 'tidak disarankan';
              const isNotRecommended = product.kategori_rekomendasi === 'tidak disarankan';

              // Konversi persentase buatan untuk tampilan UI (skor relevansi asli * modifier)
              const percentageScore = product.skor_kecocokan > 0 
                  ? Math.min(Math.round(product.skor_kecocokan * 45 + 50), 99) 
                  : 0;

              return (
                <div 
                  key={product.id}
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    isTopRecommendation 
                      ? 'border-[#006a3f] bg-emerald-50/40 shadow-[0_8px_30px_rgba(0,106,63,0.12)]'
                      : isNotRecommended
                        ? 'border-red-200 bg-red-50/60 shadow-sm'
                        : 'border-[#f1f5f9] bg-white hover:border-[#bdcabe] hover:shadow-md'
                  }`}
                >
                  {/* Top Badge untuk Index 0 */}
                  {isTopRecommendation && (
                    <div className="absolute top-0 left-0 bg-[#006a3f] text-white px-5 py-2 rounded-br-2xl flex items-center gap-1.5 z-10 shadow-sm">
                      <Star size={14} className="fill-current text-yellow-300" />
                      <span className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase">
                        Rekomendasi Terbaik
                      </span>
                    </div>
                  )}

                  <div className={`p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 relative z-0 ${isTopRecommendation ? 'pt-10' : ''}`}>
                    
                    {/* Image Box */}
                    <div className="w-full sm:w-[160px] flex-shrink-0">
                      <div className="aspect-square rounded-2xl bg-white border border-[#e5e7eb] flex items-center justify-center p-2 overflow-hidden shadow-sm">
                        {product.gambar ? (
                          <img src={product.gambar} alt={product.nama_obat} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-[#6b8e6f] to-[#8ba68e] rounded-full opacity-20" />
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <p className="font-['Inter',sans-serif] text-[12px] font-bold text-[#006a3f] uppercase tracking-wider mb-1.5">
                              {product.kategori} • {product.jenis_obat}
                            </p>
                            <h3 className="font-['Roboto_Condensed',sans-serif] font-bold text-[26px] text-[#171d19] leading-tight">
                              {product.nama_obat}
                            </h3>
                          </div>
                          
                          {/* Score Circle (Tampil jika direkomendasikan/dipertimbangkan) */}
                          {!isNotRecommended && (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2.5">
                                <div className="text-right">
                                  <p className="font-['Inter',sans-serif] text-[11px] text-[#6e7a70] uppercase font-bold tracking-wider">
                                    Skor Kecocokan
                                  </p>
                                  <p className="font-['Roboto_Condensed',sans-serif] text-[26px] font-bold text-[#006a3f]">
                                    {percentageScore}%
                                  </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <CheckCircle2 className="text-[#006a3f]" size={22} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <p className="font-['Inter',sans-serif] text-[15px] text-[#3e4a41] leading-relaxed mb-4">
                          <span className="font-semibold text-[#171d19]">Aturan Pakai: </span> 
                          {product.aturan_pakai}
                        </p>

                        {/* Medical Alert Box (Warna kemerahan jika 'tidak disarankan') */}
                        {isNotRecommended && (
                          <div className="mt-4 mb-4 bg-red-100/90 border border-red-300 rounded-xl p-4 flex gap-3.5 items-start shadow-sm">
                            <AlertTriangle className="text-red-700 flex-shrink-0 mt-0.5" size={22} />
                            <div>
                              <p className="font-['Inter',sans-serif] text-[15px] font-bold text-red-800 mb-1">
                                Perhatian Klinis: Tidak Disarankan
                              </p>
                              <p className="font-['Inter',sans-serif] text-[14px] text-red-700 font-medium leading-relaxed">
                                {product.alasan || 'Obat ini mengandung risiko kesehatan jika dikonsumsi pada profil Anda saat ini.'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer: Price & CTA */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e5e7eb]/70">
                        <p className="font-['Roboto_Condensed',sans-serif] font-bold text-[28px] text-[#171d19]">
                          Rp {Number(product.harga).toLocaleString('id-ID')}
                        </p>
                        
                        {/* Tombol Cart dinonaktifkan jika obat berbahaya */}
                        <button 
                          disabled={isNotRecommended}
                          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-['Inter',sans-serif] text-[15px] font-bold transition-all duration-300 ${
                            isNotRecommended 
                              ? 'bg-red-200/50 text-red-400 cursor-not-allowed border border-red-200'
                              : 'bg-[#006a3f] text-white hover:bg-[#005632] hover:shadow-lg hover:-translate-y-1'
                          }`}
                        >
                          <ShoppingCart size={18} />
                          {isNotRecommended ? 'Dilarang Membeli' : 'Tambah ke Keranjang'}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-[#f1f5f9] shadow-sm">
              <div className="w-20 h-20 bg-[#f5f7f6] rounded-full mx-auto mb-5 flex items-center justify-center">
                <AlertTriangle className="text-[#6e7a70]" size={32} />
              </div>
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-bold text-[#171d19] mb-3">
                Tidak Ada Obat yang Ditemukan
              </h3>
              <p className="font-['Inter',sans-serif] text-[16px] text-[#6e7a70] max-w-[450px] mx-auto leading-relaxed">
                Sistem pakar kami tidak dapat menemukan obat yang aman dan sesuai dengan kombinasi gejala spesifik yang Anda alami. Segera hubungi dokter spesialis terdekat.
              </p>
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/recommendation"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-['Inter',sans-serif] text-[15px] font-bold text-[#6e7a70] bg-white border-2 border-[#e5e7eb] hover:border-[#006a3f] hover:text-[#006a3f] hover:shadow-md transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Kembali ke Form Gejala
          </Link>
        </div>
      </main>
    </div>
  );
}
