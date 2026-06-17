import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="auth-container">
            <Head title="Daftar Akun Baru" />

            {/* Left Pane - Image backdrop */}
            <div 
                className="auth-left-pane"
                style={{ backgroundImage: "url('/images/latar_auth.png')" }}
            >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-0" />

                <div className="relative z-10 max-w-[480px]">
                    {/* Brand/Logo */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#3e4a41]/70 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="font-['Roboto_Condensed',sans-serif] text-[22px] tracking-[-0.5px] font-semibold text-white">
                            Apotek Jaya Farma
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="font-['Roboto_Condensed',sans-serif] text-[40px] xl:text-[46px] font-bold leading-[1.15] text-white mb-4">
                        Your Health, Our Priority.
                    </h2>

                    {/* Description */}
                    <p className="text-[14px] xl:text-[15px] text-white/80 leading-relaxed font-light">
                        Berkomitmen untuk menyediakan perawatan farmasi yang andal dan obat-obatan otentik kepada masyarakat selama lebih dari dua dekade.
                    </p>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="auth-right-pane">
                <div className="mx-auto w-full max-w-[460px]">
                    <div className="mb-6">
                        <h1 className="font-['Roboto_Condensed',sans-serif] text-[36px] xl:text-[40px] font-bold text-[#171d19] tracking-tight mb-2">
                            Buat Akun Baru
                        </h1>
                        <p className="text-[14px] text-[#6e7a70]">
                            Lengkapi data diri Anda untuk memulai perjalanan kesehatan.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label htmlFor="name" className="block text-[11px] font-bold tracking-wider text-[#171d19] uppercase mb-1.5 font-['Inter',sans-serif]">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                    <User size={18} />
                                </span>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    placeholder="Contoh: Budi Santoso"
                                    className={`w-full pl-12 pr-4 py-2.5 bg-[#f3f4f6]/50 border ${
                                        errors.name 
                                            ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                            : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                    } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Alamat Email */}
                        <div>
                            <label htmlFor="email" className="block text-[11px] font-bold tracking-wider text-[#171d19] uppercase mb-1.5 font-['Inter',sans-serif]">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                    <Mail size={18} />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="budi@email.com"
                                    className={`w-full pl-12 pr-4 py-2.5 bg-[#f3f4f6]/50 border ${
                                        errors.email 
                                            ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                            : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                    } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Nomor Telepon */}
                        <div>
                            <label htmlFor="phone" className="block text-[11px] font-bold tracking-wider text-[#171d19] uppercase mb-1.5 font-['Inter',sans-serif]">
                                Nomor Telepon
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                    <Phone size={18} />
                                </span>
                                <input
                                    id="phone"
                                    type="text"
                                    name="phone"
                                    value={data.phone}
                                    placeholder="0812XXXXXXXX"
                                    className={`w-full pl-12 pr-4 py-2.5 bg-[#f3f4f6]/50 border ${
                                        errors.phone 
                                            ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                            : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                    } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                    onChange={(e) => setData('phone', e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>
                            {errors.phone ? (
                                <p className="text-[#ef4444] text-[11px] mt-1.5 font-medium leading-snug">{errors.phone}</p>
                            ) : (
                                <p className="text-[#6e7a70] text-[11px] mt-1.5 leading-snug">Hanya berupa angka (10-13 digit) diawali 08/62.</p>
                            )}
                        </div>

                        {/* Password & Konfirmasi Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-[11px] font-bold tracking-wider text-[#171d19] uppercase mb-1.5 font-['Inter',sans-serif]">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        placeholder="........"
                                        className={`w-full pl-12 pr-4 py-2.5 bg-[#f3f4f6]/50 border ${
                                            errors.password 
                                                ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                                : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                        } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password ? (
                                    <p className="text-[#ef4444] text-[11px] mt-1.5 font-medium leading-snug">{errors.password}</p>
                                ) : (
                                    <p className="text-[#6e7a70] text-[11px] mt-1.5 leading-snug">Minimal 8 karakter, wajib kombinasi huruf besar, kecil, dan angka.</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-[11px] font-bold tracking-wider text-[#171d19] uppercase mb-1.5 font-['Inter',sans-serif]">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                        <Lock size={18} />
                                    </span>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        placeholder="........"
                                        className={`w-full pl-12 pr-4 py-2.5 bg-[#f3f4f6]/50 border ${
                                            errors.password_confirmation 
                                                ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                                : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                        } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && <p className="text-[#ef4444] text-[11px] mt-1.5 font-medium leading-snug">{errors.password_confirmation}</p>}
                            </div>
                        </div>

                        {/* Terms and Privacy Checkbox */}
                        <div className="pt-2">
                            <label className="flex items-start cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="terms"
                                    checked={data.terms}
                                    className="rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f] w-4 h-4 cursor-pointer mt-0.5"
                                    onChange={(e) => setData('terms', e.target.checked)}
                                    required
                                />
                                <span className="ms-2.5 text-[13px] text-[#6e7a70] select-none leading-snug">
                                    Saya menyetujui <span className="text-[#006a3f] font-bold hover:underline">Syarat & Ketentuan</span> serta <span className="text-[#006a3f] font-bold hover:underline">Kebijakan Privasi</span> yang berlaku.
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#006a3f] hover:bg-[#005632] text-white py-3.5 px-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(0,106,63,0.2)] transition-all duration-300 disabled:opacity-50"
                            >
                                <span>Daftar Sekarang</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Bottom Redirect */}
                    <div className="text-center mt-6">
                        <span className="text-[14px] text-[#6e7a70]">Sudah punya akun? </span>
                        <Link 
                            href={route('login')} 
                            className="text-[14px] font-bold text-[#006a3f] hover:text-[#005632] hover:underline"
                        >
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
