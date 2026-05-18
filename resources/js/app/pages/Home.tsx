import { Link } from '@inertiajs/react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { Pill, Thermometer, Heart, Stethoscope, Baby, Activity, ShieldCheck, Clock, HeartHandshake } from 'lucide-react';

const featuredProducts = products.slice(0, 6);

const categories = [
  {
    id: 'flu-batuk',
    name: 'Flu & Batuk',
    icon: Pill,
    color: 'bg-[#ecfdf5]',
    iconColor: 'text-[#006a3f]'
  },
  {
    id: 'demam',
    name: 'Demam',
    icon: Thermometer,
    color: 'bg-[#eff6ff]',
    iconColor: 'text-[#2d5f9f]'
  },
  {
    id: 'vitamin',
    name: 'Vitamin',
    icon: Heart,
    color: 'bg-[#fef2f2]',
    iconColor: 'text-[#ba1a1a]'
  },
  {
    id: 'alat-kesehatan',
    name: 'Alat Kesehatan',
    icon: Stethoscope,
    color: 'bg-[#f0fdf4]',
    iconColor: 'text-[#15803d]'
  },
  {
    id: 'ibu-anak',
    name: 'Ibu & Anak',
    icon: Baby,
    color: 'bg-[#fef3c7]',
    iconColor: 'text-[#d97706]'
  },
  {
    id: 'suplemen',
    name: 'Suplemen',
    icon: Activity,
    color: 'bg-[#f5f3ff]',
    iconColor: 'text-[#7c3aed]'
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header cartCount={0} />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Hero Section - Enhanced */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-[#006a3f] to-[#005632] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,106,63,0.2)] relative">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1580281657529-557a6abb6387?w=800&q=80"
                alt="Pharmacist"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative px-16 py-20 max-w-[650px]">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <p className="font-['Inter',sans-serif] text-[12px] text-white tracking-wider uppercase font-bold">
                  Apotek Terpercaya
                </p>
              </div>

              <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[56px] tracking-[-1.4px] text-white leading-[1.1] mb-6">
                Solusi Kesehatan Terpercaya Untuk Keluarga Anda
              </h1>

              <p className="font-['Inter',sans-serif] text-[16px] text-white/90 leading-relaxed mb-10 max-w-[500px]">
                Konsultasi gratis dengan apoteker berpengalaman. Pengiriman cepat ke seluruh Indonesia.
              </p>

              <div className="flex gap-4">
                <Link
                  href="/catalog"
                  className="bg-white px-8 py-4 rounded-lg font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-[#006a3f] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 font-medium"
                >
                  Belanja Sekarang
                </Link>
                <Link
                  href="/recommendation"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/30 px-8 py-4 rounded-lg font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:bg-white/20 transition-all duration-300 font-medium"
                >
                  Butuh Rekomendasi?
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Category Cards - New from Figma */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[40px] tracking-[-1px] text-[#171d19] mb-2">
                Kategori Obat
              </h2>
              <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41]">
                Temukan kebutuhan medis berdasarkan kategori
              </p>
            </div>
            <Link
              href="/catalog"
              className="font-['Inter',sans-serif] text-[16px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-6 gap-4">
            {categories.map(category => (
              <Link
                key={category.id}
                href={`/catalog?category=${category.id}`}
                className="group bg-white rounded-2xl p-6 border border-[#f1f5f9] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  <category.icon className={`${category.iconColor} w-7 h-7`} />
                </div>
                <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#171d19] text-center">
                  {category.name}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Promo Banner - New from Figma */}
        <section className="mb-20">
          <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[40px] tracking-[-1px] text-[#171d19] mb-8">
            Promo Spesial Untuk Anda
          </h2>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold mb-2 relative z-10">
                Gratis Ongkir
              </h3>
              <p className="font-['Inter',sans-serif] text-[14px] text-white/90 mb-4 relative z-10">
                Min. pembelian Rp 100.000
              </p>
              <button className="bg-white text-[#006a3f] px-6 py-2 rounded-lg font-['Inter',sans-serif] text-[14px] font-bold hover:shadow-lg transition-all relative z-10">
                Belanja Sekarang
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#2d5f9f] to-[#1e40af] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold mb-2 relative z-10">
                Diskon 10%
              </h3>
              <p className="font-['Inter',sans-serif] text-[14px] text-white/90 mb-4 relative z-10">
                Untuk member baru
              </p>
              <button className="bg-white text-[#2d5f9f] px-6 py-2 rounded-lg font-['Inter',sans-serif] text-[14px] font-bold hover:shadow-lg transition-all relative z-10">
                Daftar Sekarang
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#ba1a1a] to-[#991b1b] rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[24px] font-semibold mb-2 relative z-10">
                Vitamin Sale
              </h3>
              <p className="font-['Inter',sans-serif] text-[14px] text-white/90 mb-4 relative z-10">
                Diskon hingga 25%
              </p>
              <button className="bg-white text-[#ba1a1a] px-6 py-2 rounded-lg font-['Inter',sans-serif] text-[14px] font-bold hover:shadow-lg transition-all relative z-10">
                Lihat Promo
              </button>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[40px] tracking-[-1px] text-[#171d19] mb-2">
                Produk Terlaris
              </h2>
              <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41]">
                Pilihan terbaik untuk kebutuhan kesehatan Anda
              </p>
            </div>
            <Link
              href="/catalog"
              className="font-['Inter',sans-serif] text-[16px] font-bold text-[#006a3f] hover:text-[#005632] transition-colors"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Trust Section - Enhanced from Figma */}
        <section className="mb-20">
          <div className="grid grid-cols-3 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Aman & Terpercaya',
                desc: 'Obat asli berlisensi Kemenkes RI',
                color: 'bg-[#ecfdf5]',
                iconColor: 'text-[#006a3f]'
              },
              {
                icon: HeartHandshake,
                title: 'Apoteker Berpengalaman',
                desc: 'Saran berbasis standar klinis',
                color: 'bg-[#eff6ff]',
                iconColor: 'text-[#2d5f9f]'
              },
              {
                icon: Clock,
                title: 'Hasil Instan',
                desc: 'Apoteker siap kurang dari 1 detik',
                color: 'bg-[#f0fdf4]',
                iconColor: 'text-[#15803d]'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-sm">
                <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className={`${item.iconColor} w-8 h-8`} />
                </div>
                <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] text-[#171d19] mb-2 font-semibold">
                  {item.title}
                </h3>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-[#e8f2ea] to-[#d4e4d6] rounded-2xl p-12 text-center border border-[#6b8e6f]/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#006a3f] rounded-full -ml-32 -mt-32" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#006a3f] rounded-full -mr-32 -mb-32" />
            </div>

            <div className="relative z-10">
              <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[40px] tracking-[-1px] text-[#171d19] mb-4">
                Apoteker Kami Siap Membantu
              </h2>
              <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41] mb-8 max-w-[600px] mx-auto">
                Dapatkan rekomendasi obat yang tepat berdasarkan gejala yang Anda alami dalam 2 langkah mudah
              </p>
              <Link
                href="/recommendation"
                className="inline-block bg-[#006a3f] px-10 py-4 rounded-lg font-['Roboto_Condensed',sans-serif] text-[16px] tracking-[0.5px] text-white hover:shadow-[0_12px_32px_rgba(0,106,63,0.25)] transition-all duration-300 hover:-translate-y-0.5 font-medium"
              >
                Mulai Konsultasi
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
