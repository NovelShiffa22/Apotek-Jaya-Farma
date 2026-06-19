import { Link, usePage } from '@inertiajs/react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { Pill, Thermometer, Heart, Stethoscope, Baby, Activity, ShieldCheck, Clock, HeartHandshake, ShoppingCart, Lightbulb } from 'lucide-react';

const categories = [
  {
    id: 'obat-batuk-pilek',
    name: 'Flu & Batuk',
    icon: Pill,
    color: 'bg-[#ecfdf5]',
    iconColor: 'text-[#006a3f]'
  },
  {
    id: 'analgesik-antipiretik',
    name: 'Demam',
    icon: Thermometer,
    color: 'bg-[#eff6ff]',
    iconColor: 'text-[#2d5f9f]'
  },
  {
    id: 'vitamin-suplement',
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
    id: 'suplemen-vitamin',
    name: 'Suplemen',
    icon: Activity,
    color: 'bg-[#f5f3ff]',
    iconColor: 'text-[#7c3aed]'
  },
];

export default function Home({ featuredProducts = [] }: { featuredProducts?: any[] }) {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-gradient-to-b from-[#fafaf8] to-white">
      <Header cartCount={0} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* Hero Section - Enhanced */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-600 rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,106,63,0.2)] relative">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
              <img
                src="https://images.unsplash.com/photo-1580281657529-557a6abb6387?w=800&q=80"
                alt="Pharmacist"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative px-6 py-12 sm:px-16 sm:py-20 max-w-[650px]">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <p className="font-['Inter',sans-serif] text-[12px] text-white tracking-wider uppercase font-bold">
                  Apotek Terpercaya
                </p>
              </div>

              <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[32px] md:text-[56px] tracking-[-1.4px] text-white leading-[1.1] mb-6">
                Solusi Kesehatan Terpercaya Untuk Keluarga Anda
              </h1>

              <p className="font-['Inter',sans-serif] text-[16px] text-white/90 leading-relaxed mb-10 max-w-[500px]">
                Konsultasi gratis dengan apoteker berpengalaman. Pengiriman cepat ke seluruh Indonesia.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full sm:w-auto">
                <Link
                  href="/catalog"
                  className="bg-white text-emerald-800 font-semibold px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-100 transition flex items-center w-full sm:w-auto justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2 inline-block" />
                  Belanja Sekarang
                </Link>
                <Link
                  href={!user ? route('login') : "/recommendation"}
                  className="bg-transparent border-2 border-white text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition flex items-center w-full sm:w-auto justify-center"
                >
                  <Lightbulb className="w-5 h-5 mr-2 inline-block text-yellow-300" />
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
              <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[24px] sm:text-[40px] tracking-[-1px] text-[#171d19] mb-2">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
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

        {/* Featured Products */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[24px] sm:text-[40px] tracking-[-1px] text-[#171d19] mb-2">
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

          <div className="w-full max-w-full overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full">
            {featuredProducts.map((product: any) => (
              <ProductCard 
                key={product.id} 
                {...product}
                nama_obat={product.nama_obat}
                harga={product.harga}
                jenis_obat={product.is_prescription_required ? 'keras' : product.jenis_obat}
                gambar={product.gambar || 'https://images.unsplash.com/photo-1584308666744-24d5e47144e5?auto=format&fit=crop&q=80&w=400'}
                kategori_nama={product.category?.name}
                unit={product.unit}
                is_prescription_required={product.is_prescription_required}
                terjual={product.terjual}
              />
            ))}
            </div>
          </div>
        </section>

        {/* Trust Section - Enhanced from Figma */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                title: 'Cepat & Akurat',
                desc: 'Proses cepat, dosis tepat, jaminan aman',
                color: 'bg-[#f0fdf4]',
                iconColor: 'text-[#15803d]'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-sm">
                <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className={`${item.iconColor} w-8 h-8`} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug break-words tracking-tight mb-2">
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
              <h2 className="font-['Roboto_Condensed',sans-serif] font-light text-[24px] sm:text-[40px] tracking-[-1px] text-[#171d19] mb-4">
                Apoteker Kami Siap Membantu
              </h2>
              <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41] mb-8 max-w-[600px] mx-auto">
                Dapatkan rekomendasi obat yang tepat berdasarkan gejala yang Anda alami dalam 2 langkah mudah
              </p>
              <Link
                href={!user ? route('login') : "/recommendation"}
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
