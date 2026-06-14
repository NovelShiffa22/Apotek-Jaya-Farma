import { Head, Link } from '@inertiajs/react';
import Header from '../components/Header';
import { MapPin, Clock, Phone, ChevronRight, Building2, Heart, ShieldCheck, Leaf, Star } from 'lucide-react';

interface Props {
    apotekSettings: {
        deskripsi: string;
        alamat: string;
        jam_operasional: string;
        kontak: string;
    };
}

export default function TentangKami({ apotekSettings }: Props) {
    const { deskripsi, alamat, jam_operasional, kontak } = apotekSettings;

    const infoCards = [
        {
            icon: MapPin,
            label: 'Alamat Kami',
            value: alamat,
            color: 'from-emerald-500 to-teal-600',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            border: 'border-emerald-100',
        },
        {
            icon: Clock,
            label: 'Jam Operasional',
            value: jam_operasional,
            color: 'from-amber-500 to-orange-500',
            bg: 'bg-amber-50',
            text: 'text-amber-700',
            border: 'border-amber-100',
        },
        {
            icon: Phone,
            label: 'Hubungi Kami',
            value: kontak,
            color: 'from-sky-500 to-blue-600',
            bg: 'bg-sky-50',
            text: 'text-sky-700',
            border: 'border-sky-100',
        },
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: 'Terpercaya',
            desc: 'Lebih dari 50 tahun melayani masyarakat Bandung dengan standar kefarmasian terbaik.',
            color: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
        },
        {
            icon: Heart,
            title: 'Peduli',
            desc: 'Kami hadir untuk memberikan solusi kesehatan terbaik bagi setiap keluarga Indonesia.',
            color: 'bg-rose-100',
            iconColor: 'text-rose-600',
        },
        {
            icon: Leaf,
            title: 'Terjangkau',
            desc: 'Menyediakan obat generik dan bermerek dengan harga yang ramah di kantong masyarakat.',
            color: 'bg-lime-100',
            iconColor: 'text-lime-600',
        },
        {
            icon: Star,
            title: 'Profesional',
            desc: 'Didukung oleh apoteker berpengalaman yang siap memberikan konsultasi kefarmasian.',
            color: 'bg-amber-100',
            iconColor: 'text-amber-600',
        },
    ];

    return (
        <div className="min-h-screen bg-[#fafaf8] font-['Inter',sans-serif]">
            <Head title="Tentang Kami - Apotek Jaya Farma" />
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#004d2e] via-[#006a3f] to-[#00854f]">
                {/* Decorative circles */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
                <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.03] rounded-full" />

                <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-24 sm:pt-16 sm:pb-32 text-center">
                    {/* Icon badge - Logo Apotek */}
                    <div className="flex justify-center mb-5">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="font-['Roboto_Condensed',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3 leading-tight">
                        Apotek Jaya Farma
                    </h1>
                    <p className="text-emerald-100/90 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                        Melayani Kesehatan Anda dengan Sepenuh Hati Sejak <span className="font-bold text-white">1971</span>
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 mt-10">
                        {[
                            { value: '50+', label: 'Tahun Pengalaman' },
                            { value: '10K+', label: 'Pelanggan Setia' },
                            { value: '1000+', label: 'Jenis Produk' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="font-['Roboto_Condensed',sans-serif] text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
                                <p className="text-emerald-100/80 text-sm mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="#fafaf8"/>
                    </svg>
                </div>
            </section>

            {/* About Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-2 rounded-full mb-6">
                            <Building2 size={14} />
                            Sejarah & Profil Kami
                        </div>
                        <h2 className="font-['Roboto_Condensed',sans-serif] text-3xl sm:text-4xl font-black text-[#171d19] mb-6 leading-tight">
                            Pilar Kesehatan Kota Bandung Selama Lebih dari Lima Dekade
                        </h2>
                        <p className="text-[#3e4a41] text-[16px] leading-8 mb-6">
                            {deskripsi}
                        </p>
                        <p className="text-[#6e7a70] text-[15px] leading-7">
                            Kami berkomitmen untuk terus menghadirkan layanan kefarmasian yang modern, terpercaya, dan mudah diakses oleh seluruh lapisan masyarakat — kini hadir secara digital untuk memenuhi kebutuhan kesehatan Anda kapan pun dan di mana pun.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/catalog"
                                className="inline-flex items-center justify-center gap-2 bg-[#006a3f] hover:bg-[#005632] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Lihat Katalog Produk
                                <ChevronRight size={18} />
                            </Link>
                            <a
                                href={`https://wa.me/${kontak.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 border-2 border-[#006a3f] text-[#006a3f] hover:bg-emerald-50 font-bold px-6 py-3 rounded-xl transition-all"
                            >
                                Hubungi Kami
                            </a>
                        </div>
                    </div>

                    {/* Timeline / visual */}
                    <div className="relative">
                        <div className="bg-white rounded-3xl border border-[#f1f5f9] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 overflow-hidden">
                            {/* Decorative top strip */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#006a3f] via-emerald-400 to-teal-400 rounded-t-3xl" />

                            <h3 className="font-['Roboto_Condensed',sans-serif] text-xl font-bold text-[#171d19] mb-6">
                                Perjalanan Kami
                            </h3>

                            <div className="space-y-5">
                                {[
                                    { year: '1971', text: 'Apotek Jaya Farma berdiri di Jl. Malabar No. 50, Bandung — melayani masyarakat sekitar Kecamatan Lengkong.' },
                                    { year: '2000-an', text: 'Ekspansi produk dan layanan, menambah stok obat generik dan produk kesehatan lengkap.' },
                                    { year: '2020', text: 'Modernisasi sistem manajemen stok dan pelayanan resep dokter berbasis digital.' },
                                    { year: '2024', text: 'Peluncuran platform belanja online dengan sistem pembayaran terintegrasi Midtrans.' },
                                    { year: '2025', text: 'Sistem rekomendasi obat berbasis AI dan layanan konsultasi apoteker online.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#006a3f] to-emerald-500 flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                            {i < 4 && <div className="w-0.5 h-full bg-gradient-to-b from-emerald-200 to-transparent mt-1" />}
                                        </div>
                                        <div className="pb-5">
                                            <span className="inline-block font-bold text-[#006a3f] text-sm bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 mb-1.5">
                                                {item.year}
                                            </span>
                                            <p className="text-[#3e4a41] text-[14px] leading-6">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Info Cards */}
            <section className="bg-white border-y border-[#f1f5f9]">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-2 rounded-full mb-4">
                            Informasi Kontak
                        </div>
                        <h2 className="font-['Roboto_Condensed',sans-serif] text-3xl sm:text-4xl font-black text-[#171d19]">
                            Kunjungi atau Hubungi Kami
                        </h2>
                        <p className="text-[#6e7a70] mt-3 max-w-xl mx-auto">
                            Kami siap membantu Anda secara langsung maupun melalui platform digital.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {infoCards.map((card) => (
                            <div
                                key={card.label}
                                className={`rounded-2xl border ${card.border} ${card.bg} p-6 flex flex-col gap-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                                    <card.icon size={22} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-['Roboto_Condensed',sans-serif] text-[13px] font-bold uppercase tracking-wider text-[#6e7a70] mb-1">
                                        {card.label}
                                    </p>
                                    <p className={`font-semibold text-[15px] leading-6 ${card.text}`}>
                                        {card.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map Embed */}
                    <div className="mt-8 rounded-2xl overflow-hidden border border-[#f1f5f9] shadow-sm">
                        <div className="relative h-80 sm:h-96 w-full bg-slate-100">
                            <iframe 
                                src="https://maps.google.com/maps?q=Apotek%20Jaya%20Farma%20Bandung&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi Apotek Jaya Farma"
                            />
                        </div>
                        <div className="bg-emerald-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t border-emerald-100">
                            <div>
                                <p className="font-['Roboto_Condensed',sans-serif] font-bold text-[#006a3f] text-[15px]">Apotek Jaya Farma</p>
                                <p className="text-[#6e7a70] text-[13px] mt-0.5">{alamat}</p>
                            </div>
                            <a
                                href="https://share.google/Pz1qGhGSCV3OrnZP4"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#006a3f] hover:bg-[#005632] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap shrink-0"
                            >
                                <MapPin size={16} />
                                Buka di Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="max-w-6xl mx-auto px-6 py-16 sm:py-20">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold px-4 py-2 rounded-full mb-4">
                        Nilai-Nilai Kami
                    </div>
                    <h2 className="font-['Roboto_Condensed',sans-serif] text-3xl sm:text-4xl font-black text-[#171d19]">
                        Mengapa Memilih Apotek Jaya Farma?
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((val) => (
                        <div key={val.title} className="bg-white rounded-2xl border border-[#f1f5f9] p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
                            <div className={`w-14 h-14 rounded-2xl ${val.color} flex items-center justify-center mx-auto mb-4`}>
                                <val.icon size={26} className={val.iconColor} />
                            </div>
                            <h3 className="font-['Roboto_Condensed',sans-serif] text-[18px] font-bold text-[#171d19] mb-2">
                                {val.title}
                            </h3>
                            <p className="text-[#6e7a70] text-[13px] leading-6">
                                {val.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-6xl mx-auto px-6 pb-16">
                <div className="relative bg-gradient-to-br from-[#004d2e] via-[#006a3f] to-[#00854f] rounded-3xl overflow-hidden p-10 sm:p-14 text-center">
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                        <h2 className="font-['Roboto_Condensed',sans-serif] text-3xl sm:text-4xl font-black text-white mb-4">
                            Siap untuk Mulai Berbelanja?
                        </h2>
                        <p className="text-emerald-100 text-[15px] mb-8 max-w-xl mx-auto leading-relaxed">
                            Temukan ribuan produk kesehatan dan obat-obatan terpercaya di Apotek Jaya Farma. Pengiriman langsung ke pintu rumah Anda.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/catalog"
                                className="inline-flex items-center justify-center gap-2 bg-white text-[#006a3f] hover:bg-emerald-50 font-black px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-[15px]"
                            >
                                Belanja Sekarang
                                <ChevronRight size={18} />
                            </Link>
                            <Link
                                href="/recommendation"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-3.5 rounded-xl transition-all text-[15px]"
                            >
                                Coba Rekomendasi AI
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
