import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ShoppingCart, Lightbulb, Upload } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const SLIDES = [
  {
    id: 1,
    badge: "APOTEK TERPERCAYA",
    headline: "Satu Platform Cerdas untuk Semua Kebutuhan Obat & Resep Anda",
    subheadline: "Didukung asisten AI pintar untuk mencarikan obat yang sesuai dengan keluhan Anda, sistem penebusan resep online tepercaya, dan layanan antar kurir yang cepat",
    image: "/images/SLIDE 1.png",
    align: "left",
    bgColor: "bg-[#1e5b53]"
  },
  {
    id: 2,
    badge: "",
    headline: "Rekomendasi Obat Pintar, Sesuai Keluhan Anda",
    subheadline: "Analisis gejala Anda secara instan untuk memberikan rekomendasi obat yang tepat, praktis, dan terpercaya",
    image: "/images/SLIDE 2.png",
    align: "left",
    bgColor: "bg-[#1e7bc9]"
  },
  {
    id: 3,
    badge: "",
    headline: "Butuh obat? Punya resep dokter? Unggah resep anda sekarang!",
    subheadline: "Hemat waktu, cukup unggah resep dan kami bantu proses hingga obat siap untuk Anda",
    image: "/images/SLIDE 3.png",
    align: "right",
    bgColor: "bg-[#7c56b3]"
  },
  {
    id: 4,
    badge: "",
    headline: "Konsultasikan langsung dengan apoteker kami",
    subheadline: "Tanyakan apa saja tentang obat, apoteker kami siap membantu Anda",
    image: "/images/SLIDE 4.png",
    align: "left",
    bgColor: "bg-[#1e5b53]"
  }
];

const AUTOPLAY_MS = 8000;

export default function HeroSlider() {
  const { auth, whatsapp_number = '6281315324311' } = usePage().props as any;
  const user = auth?.user;

  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((idx: number) => {
    if (isAnimating || idx === current) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating, current]);

  const goNext = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const goPrev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goNext();
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goNext]);

  return (
    <div className="relative w-full flex items-center justify-center">
      
      {/* Container utama untuk slide dengan tinggi merespons gambar */}
      <div className="relative w-full rounded-2xl overflow-hidden select-none bg-gray-50 z-10 shadow-sm border border-gray-100">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] min-h-[280px] md:min-h-[400px]">
          {SLIDES.map((s, idx) => (
            <div
              key={s.id}
              className={`transition-opacity duration-700 ease-in-out w-full h-full overflow-hidden
                ${idx === current ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0'}`}
            >
              
              {/* Gambar Background Murni (Proporsional, Anti-Gepeng) */}
              <img 
                src={s.image} 
                alt={s.headline} 
                className="absolute inset-0 w-full h-full object-cover block" 
                draggable={false} 
              />

              {/* Kontainer Overlay HTML */}
              <div className="absolute inset-0 z-10 flex flex-col justify-center p-4 sm:p-8 md:p-16 lg:p-20 w-full h-full pointer-events-none">
                
                {/* Blok Teks HTML */}
                <div className={`pointer-events-auto flex flex-col justify-center ${s.align === 'right' ? 'w-[45%] md:max-w-[42%] text-right items-end ml-auto' : 'w-[45%] md:max-w-[42%] text-left items-start mr-auto'} space-y-1 sm:space-y-2 md:space-y-4`}>
                  
                  {s.badge && (
                    <span className="block w-max mb-2 md:mb-4 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-[8px] md:text-xs font-bold tracking-wider backdrop-blur-sm drop-shadow-md uppercase">
                      {s.badge}
                    </span>
                  )}
                  
                  <h1 className="text-xs sm:text-base md:text-2xl lg:text-4xl font-medium tracking-tight text-white leading-tight drop-shadow-md">
                    {s.headline}
                  </h1>
                  
                  <p className="text-[10px] sm:text-xs md:text-sm lg:text-base font-normal text-white/90 leading-relaxed drop-shadow-md">
                    {s.subheadline}
                  </p>

                  <div className={`flex flex-wrap gap-2 sm:gap-4 w-full mt-2 sm:mt-4 md:mt-8 ${s.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    
                    {s.id === 1 && (
                      <>
                        <Link href="/catalog" className="flex items-center gap-2 bg-white text-[#1e5b53] font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition-all text-[11px] md:text-sm">
                          <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5" />
                          Belanja Sekarang
                        </Link>
                        <Link href={user ? '/recommendation' : '/login'} className="flex items-center gap-2 bg-[#1e5b53] text-white font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-lg hover:bg-[#15463f] hover:scale-105 transition-all border border-white/20 text-[11px] md:text-sm">
                          <Lightbulb className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-300" />
                          Butuh Rekomendasi?
                        </Link>
                      </>
                    )}

                    {s.id === 2 && (
                      <Link href={user ? '/recommendation' : '/login'} className="flex items-center gap-2 bg-white text-[#0e63c0] font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-lg hover:bg-gray-50 hover:scale-105 transition-all text-[11px] md:text-sm">
                        <Lightbulb className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-400" />
                        Butuh Rekomendasi?
                      </Link>
                    )}

                    {s.id === 3 && (
                      <Link href={user ? '/prescriptions/upload/step-1' : '/login'} className="flex items-center gap-2 bg-white text-[#7e40c4] font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-lg hover:bg-purple-50 hover:scale-105 transition-all border border-purple-100 text-[11px] md:text-sm">
                        <Upload className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#7e40c4]" />
                        Unggah Resep Dokter
                      </Link>
                    )}

                    {s.id === 4 && (
                      <a href={`https://wa.me/${whatsapp_number}?text=Halo%20Apoteker%20Jaya%20Farma,%20saya%20ingin%20berkonsultasi%20mengenai...`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-[#1e5b53] font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg shadow-lg hover:bg-gray-50 hover:scale-105 transition-all text-[11px] md:text-sm">
                        <WhatsAppIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-[#25D366]" />
                        Konsultasi Sekarang
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator di bawah (di dalam slider box) */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3 bg-black/15 px-3 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-inner">
          {SLIDES.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => goTo(idx)} 
              aria-label={`Ke slide ${idx + 1}`}
              className={`rounded-full transition-all duration-300 shadow-sm ${idx === current ? 'bg-white w-6 h-2.5 sm:w-8 sm:h-3' : 'bg-white/60 w-2.5 h-2.5 sm:w-3 sm:h-3 hover:bg-white'}`} 
            />
          ))}
        </div>
      </div>

      {/* Navigasi Chevron Kiri (Digeser sedikit ke luar agar tidak menutupi gambar) */}
      <button 
        onClick={goPrev} 
        disabled={isAnimating} 
        className="absolute -left-3 sm:-left-5 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#1e5b53] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-50 hover:scale-110 transition-all disabled:opacity-40"
        aria-label="Slide sebelumnya"
      >
        <ChevronLeft size={24} strokeWidth={2.5} className="mr-0.5" />
      </button>

      {/* Navigasi Chevron Kanan (Digeser sedikit ke luar) */}
      <button 
        onClick={goNext} 
        disabled={isAnimating} 
        className="absolute -right-3 sm:-right-5 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#1e5b53] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-50 hover:scale-110 transition-all disabled:opacity-40"
        aria-label="Slide berikutnya"
      >
        <ChevronRight size={24} strokeWidth={2.5} className="ml-0.5" />
      </button>
      
    </div>
  );
}
