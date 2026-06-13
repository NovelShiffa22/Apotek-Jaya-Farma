import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Upload, ShoppingCart, ArrowLeft, Shield, Clock, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';

export default function ProductDetail({ product }: { product: any }) {
  const navigate = (path: any) => typeof path === 'number' ? window.history.back() : router.visit(path);
  const isRestricted = product.is_prescription_required;
  const [qty, setQty] = useState(1);

  const handleQtyChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stok) {
      setQty(newQty);
    }
  };

  const handleAddToCart = () => {
    router.post('/cart/add', {
      product_id: product.id,
      quantity: qty
    }, {
      preserveScroll: true,
      onSuccess: () => {
        alert("Obat berhasil dimasukkan ke keranjang!");
      }
    });
  };

  const handleBuyNow = () => {
    router.visit(`/checkout?buy_now_product_id=${product.id}&buy_now_quantity=${qty}`);
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Product Image */}
          <div className="md:sticky md:top-32 self-start">
            <div className="bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] rounded-2xl aspect-square flex items-center justify-center border border-[#e8e8e6] p-12 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden group">
              {product.gambar ? (
                <img
                  src={product.gambar}
                  alt={product.nama_obat}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-[#6b8e6f] to-[#8ba68e] rounded-full opacity-20" />
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {[
                { icon: Shield, text: '100% Original', color: 'bg-[#ecfdf5]', iconColor: 'text-[#006a3f]' },
                { icon: Clock, text: 'Pengiriman Cepat', color: 'bg-[#eff6ff]', iconColor: 'text-[#2d5f9f]' },
                { icon: Heart, text: 'Kualitas Terjamin', color: 'bg-[#fef2f2]', iconColor: 'text-[#ba1a1a]' }
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
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  product.jenis_obat === 'bebas' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  product.jenis_obat === 'keras' ? 'bg-red-50 text-red-700 border border-red-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    product.jenis_obat === 'bebas' ? 'bg-emerald-500' :
                    product.jenis_obat === 'keras' ? 'bg-red-500' :
                    'bg-amber-500'
                  }`} />
                  <p className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase">
                    {product.jenis_obat === 'bebas' ? 'Obat Bebas' : product.jenis_obat === 'keras' ? 'Obat Keras' : 'Obat Terbatas'}
                  </p>
                </div>
                {product.category?.nama_kategori && (
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                    <p className="font-['Inter',sans-serif] text-[12px] font-bold tracking-wider uppercase">
                      {product.category.nama_kategori}
                    </p>
                  </div>
                )}
              </div>

              <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[32px] md:text-[48px] tracking-[-1.4px] text-[#171d19] leading-[1.1] mb-6">
                {product.nama_obat}
              </h1>

              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-['Roboto_Condensed',sans-serif] text-[40px] text-[#006a3f] font-semibold tracking-[-1px]">
                  Rp {Number(product.harga).toLocaleString('id-ID')}
                </p>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#6e7a70]">/ {product.unit || 'kemasan'}</p>
              </div>
              <p className="font-['Inter',sans-serif] text-[13px] text-[#6e7a70] mb-8">
                Sudah termasuk pajak
              </p>

              {/* Detail Keterangan Obat */}
              <div className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-sm mb-8 space-y-6">
                {product.deskripsi && (
                  <div>
                    <h3 className="font-['Inter',sans-serif] text-[14px] font-bold text-[#171d19] uppercase tracking-wider mb-2">Deskripsi</h3>
                    <p className="font-['Inter',sans-serif] text-[15px] text-[#3e4a41] leading-relaxed">
                      {product.deskripsi}
                    </p>
                  </div>
                )}
                {product.indikasi && (
                  <div>
                    <h3 className="font-['Inter',sans-serif] text-[14px] font-bold text-[#171d19] uppercase tracking-wider mb-2">Indikasi Umum</h3>
                    <p className="font-['Inter',sans-serif] text-[15px] text-[#3e4a41] leading-relaxed">
                      {product.indikasi}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {product.aturan_pakai && (
                    <div>
                      <h3 className="font-['Inter',sans-serif] text-[14px] font-bold text-[#171d19] uppercase tracking-wider mb-2">Aturan Pakai</h3>
                      <p className="font-['Inter',sans-serif] text-[15px] text-[#3e4a41] leading-relaxed">
                        {product.aturan_pakai}
                      </p>
                    </div>
                  )}
                  {product.efek_samping && (
                    <div>
                      <h3 className="font-['Inter',sans-serif] text-[14px] font-bold text-[#171d19] uppercase tracking-wider mb-2">Efek Samping</h3>
                      <p className="font-['Inter',sans-serif] text-[15px] text-[#3e4a41] leading-relaxed">
                        {product.efek_samping}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>            {/* Action Buttons */}
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
                    onClick={() => router.visit(`/prescriptions/upload/step-1?product_id=${product.id}`)}
                    className="w-full bg-[#8B5cf6] hover:bg-[#7c3aed] px-8 py-5 rounded-xl hover:shadow-[0_12px_32px_rgba(139,92,246,0.3)] transition-all duration-300 hover:-translate-y-0.5 group"
                  >
                    <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white flex items-center justify-center gap-3 font-medium">
                      <Upload size={20} className="group-hover:scale-110 transition-transform" />
                      Unggah Resep Dokter
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
                <>
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center border border-gray-400 rounded-2xl bg-white h-14 w-[160px]">
                      <button 
                        onClick={() => handleQtyChange(qty - 1)}
                        disabled={qty <= 1}
                        className="w-14 h-full flex items-center justify-center hover:bg-red-50 rounded-xl text-red-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Minus size={20} strokeWidth={2.5} />
                      </button>
                      <div className="flex-1 h-full flex items-center justify-center font-bold text-[#171d19] text-[18px]">
                        {qty}
                      </div>
                      <button 
                        onClick={() => handleQtyChange(qty + 1)}
                        disabled={qty >= product.stok}
                        className="w-14 h-full flex items-center justify-center hover:bg-emerald-50 rounded-xl text-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <Plus size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                    <span className="font-['Inter',sans-serif] text-[15px] text-[#6e7a70]">
                      Tersedia: <strong className="text-[#171d19]">{product.stok} {product.jenis_kemasan || 'box'}</strong>
                    </span>
                  </div>

                  <div className="flex gap-4">
                  <button onClick={handleAddToCart} className="flex-1 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-4 rounded-xl transition-all duration-300 group">
                    <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] flex items-center justify-center gap-2 font-bold">
                      <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                      Tambah Keranjang
                    </span>
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl py-3 px-6 transition duration-200 group">
                    <span className="font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] flex items-center justify-center gap-2 font-bold">
                      <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
                      Beli Sekarang
                    </span>
                  </button>
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
