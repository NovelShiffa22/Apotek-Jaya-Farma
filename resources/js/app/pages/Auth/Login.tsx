import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className="w-full h-screen min-h-screen flex flex-row overflow-hidden bg-white">
            <Head title="Masuk" />

            {/* Left Pane - Image backdrop */}
            <div className="relative w-1/2 h-full flex flex-col justify-end p-8 text-white overflow-hidden">
                <img 
                    src="/images/latar_auth.png" 
                    alt="Latar Apotek" 
                    className="absolute inset-0 w-full h-full object-cover z-0" 
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                <div className="relative z-20 max-w-[480px]">
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
            <div className="w-1/2 h-full flex flex-col justify-center items-center bg-white p-8 relative overflow-y-auto">
                <div className="w-full max-w-[420px]">
                    <div className="mb-8">
                        <h1 className="font-['Roboto_Condensed',sans-serif] text-[36px] xl:text-[40px] font-bold text-[#171d19] tracking-tight mb-2">
                            Selamat Datang
                        </h1>
                        <p className="text-[14px] xl:text-[15px] text-[#6e7a70]">
                            Masuk untuk mengakses resep dan riwayat medis Anda.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {hasErrors && (
                        <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-xl p-4 mb-6 flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            <p className="text-[13px] text-[#b91c1c] leading-snug">
                                Email atau kata sandi tidak valid. Silakan coba lagi.
                            </p>
                        </div>
                    )}

                    {status && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm mb-6">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-[13px] font-semibold text-[#171d19] mb-2 font-['Inter',sans-serif]">
                                Email
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
                                    placeholder="doctor@jayafarma.com"
                                    className={`w-full pl-12 pr-4 py-3 bg-[#f3f4f6]/50 border ${
                                        errors.email 
                                            ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                            : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                    } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-[13px] font-semibold text-[#171d19] mb-2 font-['Inter',sans-serif]">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                                    <Lock size={18} />
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    placeholder="Kata Sandi"
                                    className={`w-full pl-12 pr-12 py-3 bg-[#f3f4f6]/50 border ${
                                        errors.password 
                                            ? 'border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]' 
                                            : 'border-transparent focus:border-[#006a3f] focus:ring-[#006a3f]/20'
                                    } rounded-xl text-[14px] text-[#171d19] focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 outline-none`}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#171d19]"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className="rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f] w-4 h-4 cursor-pointer"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-[13px] text-[#6e7a70] select-none">
                                    Ingat Saya
                                </span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-[13px] font-medium text-[#ba1a1a] hover:text-[#991b1b]"
                                >
                                    Lupa Kata Sandi?
                                </Link>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#006a3f] hover:bg-[#005632] text-white py-3.5 px-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(0,106,63,0.2)] transition-all duration-300 disabled:opacity-50"
                            >
                                <span>Masuk</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            </button>
                        </div>
                    </form>

                    {/* Bottom Redirect */}
                    <div className="text-center mt-8">
                        <span className="text-[14px] text-[#6e7a70]">Belum punya akun? </span>
                        <Link 
                            href={route('register')} 
                            className="text-[14px] font-bold text-[#006a3f] hover:text-[#005632] hover:underline"
                        >
                            Daftar Sekarang
                        </Link>
                    </div>

                    {/* Back to Home Divider */}
                    <div className="border-t border-[#f1f5f9] mt-10 pt-6 text-center">
                        <Link 
                            href="/" 
                            className="text-[13px] text-[#6e7a70] hover:text-[#171d19] inline-flex items-center gap-2 transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Kembali ke halaman utama
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
