import { router } from '@inertiajs/react';
import { Upload, ShoppingCart, ArrowLeft, Shield, Clock, Heart } from 'lucide-react';
import Header from '../components/Header';
import { products } from '../data/products';

export default function ProductDetail({ id }: { id: string }) {
  const navigate = (path: any) => typeof path === 'number' ? window.history.back() : router.visit(path);
  const product = products.find(p => p.id === id) || products[0];
  const isRestricted = product.category === 'keras' || product.category === 'terbatas';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-10 font-['Inter',sans-serif] text-[14px] text-[#1a1a1a] opacity-60 hover:opacity-100 transition-opacity group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        <div className="grid grid-cols-2 gap-16">
          {/* Product Image */}
          <div className="sticky top-32 self-start">
            <div className="bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] rounded-2xl aspect-square flex items-center justify-center border border-[#e8e8e6] p-12 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Shield, text: '100% Original', color: 'bg-[#ecfdf5]', iconColor: 'text-[#006a3f]' },
                { icon: Clock, text: 'Pengiriman Cepat', color: 'bg-[#eff6ff]', iconColor: 'text-[#2d5f9f]' },
                { icon: Heart, text: 'Quality Check', color: 'bg-[#fef2f2]', iconColor: 'text-[#ba1a1a]' }
              ].map((badge, idx) => (
                <div key={idx} className={`${badge.color} rounded-xl p-4 text-center border border-[#f1f5f9]`}>
                  <badge.icon className={`w-6 h-6 mx-auto mb-2 ${badge.iconColor}`} />
                  <p className="font-['Inter',sans-serif] text-[11px] text-[#171d19] font-medium">
                    {badge.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-10">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                product.category === 'bebas' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                product.category === 'keras' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  product.category === 'bebas' ? 'bg-emerald-500' :
                  product.category === 'keras' ? 'bg-red-500' :
                  'bg-amber-500'
                }`} />
                <p className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase">
                  {product.category === 'bebas' ? 'Obat Bebas' : product.category === 'keras' ? 'Obat Keras' : 'Obat Terbatas'}
                </p>
              </div>

              <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[56px] tracking-[-1.4px] text-[#171d19] leading-[1.1] mb-6">
                {product.name}
              </h1>

              <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41] mb-8 leading-relaxed max-w-[540px]">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-['Roboto_Condensed',sans-serif] text-[48px] text-[#006a3f] font-semibold tracking-[-1px]">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">per box</p>
              </div>
              <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70] mb-8">
                Sudah termasuk pajak
              </p>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-2xl p-8 mb-8 border border-[#f1f5f9] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <h2 className="font-['Roboto_Condensed',sans-serif] text-[28px] tracking-[-0.7px] text-[#171d19] mb-8 font-semibold">
                Informasi Medis
              </h2>

              <div className="space-y-8">
                <div className="border-l-4 border-[#006a3f] pl-6 py-1">
                  <p className="font-['Inter',sans-serif] text-[11px] font-bold text-[#6e7a70] tracking-wider uppercase mb-2">
                    INDIKASI
                  </p>
                  <p className="font-['Inter',sans-serif] text-[15px] text-[#171d19] leading-relaxed">
                    Mengatasi demam dan meredakan nyeri ringan hingga sedang seperti sakit kepala, sakit gigi, dan nyeri otot.
                  </p>
                </div>

                <div className="border-l-4 border-[#006a3f] pl-6 py-1">
                  <p className="font-['Inter',sans-serif] text-[11px] font-bold text-[#6e7a70] tracking-wider uppercase mb-2">
                    ATURAN PAKAI
                  </p>
                  <p className="font-['Inter',sans-serif] text-[15px] text-[#171d19] leading-relaxed">
                    Dewasa: 1-2 tablet setiap 4-6 jam. Maksimal 8 tablet per hari. Diminum sesudah makan.
                  </p>
                </div>

                <div className="border-l-4 border-[#006a3f] pl-6 py-1">
                  <p className="font-['Inter',sans-serif] text-[11px] font-bold text-[#6e7a70] tracking-wider uppercase mb-2">
                    EFEK SAMPING
                  </p>
                  <p className="font-['Inter',sans-serif] text-[15px] text-[#171d19] leading-relaxed">
                    Jarang terjadi. Dapat menyebabkan mual, muntah, atau reaksi alergi pada beberapa orang.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {isRestricted ? (
                <>
                  <button className="w-full bg-[#e5e7eb] opacity-60 px-8 py-5 rounded-xl cursor-not-allowed">
                    <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-[#6e7a70] flex items-center justify-center gap-3 font-medium">
                      <ShoppingCart size={20} />
                      Tambah ke Keranjang
                    </span>
                  </button>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-[#006a3f] hover:bg-[#005632] px-8 py-5 rounded-xl hover:shadow-[0_12px_32px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white flex items-center justify-center gap-3 font-medium">
                      <Upload size={20} className="group-hover:scale-110 transition-transform" />
                      Upload Resep & Beli
                    </span>
                  </button>
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[14px] font-bold">!</span>
                    </div>
                    <p className="font-['Inter',sans-serif] text-[14px] text-[#171d19] leading-relaxed">
                      Produk ini memerlukan resep dokter yang valid untuk pembelian
                    </p>
                  </div>
                </>
              ) : (
                <button className="w-full bg-[#006a3f] hover:bg-[#005632] px-8 py-5 rounded-xl hover:shadow-[0_12px_32px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5 group">
                  <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white flex items-center justify-center gap-3 font-medium">
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                    Tambah ke Keranjang
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
