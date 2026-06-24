import { Link, usePage } from '@inertiajs/react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { Pill, Thermometer, Heart, Stethoscope, Baby, Activity, ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'obat-batuk-pilek',
    name: 'Flu & Batuk',
    icon: Pill,
    color: 'bg-[#ecfdf5]',
    iconColor: 'text-[#1e5b53]'
  },
  {
    id: 'analgesik-antipiretik',
    name: 'Demam',
    icon: Thermometer,
    color: 'bg-[#eff6ff]',
    iconColor: 'text-[#2d5f9f]'
  },
  {
    id: 'suplemen-vitamin',
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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Home({ featuredProducts = [] }: { featuredProducts?: any[] }) {
  const { auth, whatsapp_number = '6281315324311' } = usePage().props as any;
  const user = auth?.user;

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-gradient-to-b from-[#fafaf8] to-white">
      <Header cartCount={0} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        {/* Hero Section - Slider */}
        <motion.section 
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        >
          <HeroSlider />
        </motion.section>

        {/* Category Cards - New from Figma */}
        <section className="mb-20">
          <motion.div 
            className="flex items-end justify-between mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, margin: "-50px" }}
          >
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
              className="font-['Inter',sans-serif] text-[16px] font-bold text-[#1e5b53] hover:text-[#005632] transition-colors"
            >
              Lihat Semua
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <Link
                  href={`/catalog?category=${category.id}`}
                  className="group bg-white rounded-2xl p-6 border border-[#f1f5f9] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 block h-full"
                >
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <category.icon className={`${category.iconColor} w-7 h-7`} />
                  </div>
                  <p className="font-['Roboto_Condensed',sans-serif] text-[16px] text-[#171d19] text-center">
                    {category.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-20">
          <motion.div 
            className="flex items-end justify-between mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, margin: "-50px" }}
          >
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
              className="font-['Inter',sans-serif] text-[16px] font-bold text-[#1e5b53] hover:text-[#005632] transition-colors"
            >
              Lihat Semua
            </Link>
          </motion.div>

          <div className="w-full max-w-full overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full">
            {featuredProducts.map((product: any, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex"
              >
                <div className="w-full">
                  <ProductCard 
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
                </div>
              </motion.div>
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
                iconColor: 'text-[#1e5b53]'
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
              <motion.div 
                key={idx} 
                className="bg-white rounded-2xl p-8 border border-[#f1f5f9] shadow-sm"
                initial={{ opacity: 0, x: 50 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.2 }} 
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center mb-6`}>
                  <item.icon className={`${item.iconColor} w-8 h-8`} />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug break-words tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="font-['Inter',sans-serif] text-[14px] text-[#3e4a41] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section - WhatsApp Consultation */}
        <section>
          <motion.div 
            className="relative w-full rounded-2xl p-8 md:p-12 shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden" style={{ backgroundImage: 'linear-gradient(105deg, #104c3e 0%, #317f5f 45%, #aceb86 100%)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
            viewport={{ once: true, margin: "-50px" }}
          >
            
            {/* Dekorasi Estetik & Floating Pills */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl -ml-32 -mt-32 animate-pulse" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-overlay filter blur-3xl -mr-32 -mb-32 animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Floating Pills Left */}
              <Pill className="absolute top-[15%] left-[5%] w-16 h-16 text-white/20 -rotate-45 blur-[1px] animate-[bounce_8s_infinite]" />
              <Pill className="absolute bottom-[20%] left-[12%] w-10 h-10 text-white/30 rotate-12 animate-[bounce_6s_infinite_1s]" />
              <Pill className="absolute top-[40%] left-[2%] w-12 h-12 text-emerald-200/20 rotate-90 blur-[2px] animate-[bounce_7s_infinite_2s]" />

              {/* Floating Pills Right */}
              <Pill className="absolute top-[25%] right-[8%] w-20 h-20 text-white/20 rotate-45 blur-[1px] animate-[bounce_9s_infinite_0.5s]" />
              <Pill className="absolute bottom-[15%] right-[5%] w-14 h-14 text-emerald-100/30 -rotate-12 animate-[bounce_7s_infinite_1.5s]" />
              <Pill className="absolute top-[10%] right-[15%] w-8 h-8 text-white/40 rotate-[60deg] animate-[bounce_5s_infinite_2s]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-lg">
                <WhatsAppIcon className="w-8 h-8 text-emerald-400" />
              </div>
              
              <h2 className="font-['Roboto_Condensed',sans-serif] font-bold text-[28px] sm:text-[44px] tracking-tight text-white mb-4 drop-shadow-md">
                Apoteker Kami Siap Membantu Anda
              </h2>
              
              <p className="font-['Inter',sans-serif] text-[15px] sm:text-[18px] text-emerald-50 mb-10 max-w-[700px] mx-auto leading-relaxed opacity-90">
                Masih ragu dengan gejala Anda? Konsultasikan keluhan kesehatan dan kebutuhan obat Anda langsung dengan tim Apoteker resmi kami via WhatsApp.
              </p>
              
              <a
                href={`https://wa.me/${whatsapp_number}?text=Halo%20Apoteker%20Jaya%20Farma,%20saya%20ingin%20berkonsultasi%20mengenai...`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] px-8 py-4 sm:px-12 sm:py-5 rounded-full font-['Roboto_Condensed',sans-serif] text-[16px] sm:text-[18px] tracking-[0.5px] text-white shadow-[0_12px_32px_rgba(37,211,102,0.4)] hover:bg-[#19D373] transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:-translate-y-1 font-bold group"
              >
                <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                Hubungi Apoteker
              </a>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
