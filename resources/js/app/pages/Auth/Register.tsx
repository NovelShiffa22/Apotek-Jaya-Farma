import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 p-6 font-['Inter',sans-serif]">
            <Head title="Buat Akun Baru" />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-100 p-8">
                
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1e5b53] to-[#005632] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_12px_rgba(0,106,63,0.25)]">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                        Buat Akun Baru
                    </h1>
                    <p className="text-sm text-slate-500">
                        Lengkapi data diri Anda untuk memulai perjalanan kesehatan bersama Apotek Jaya Farma.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-4">
                    {/* Nama Lengkap */}
                    <div>
                        <label htmlFor="name" className="block text-xs font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                            Nama Lengkap
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <User size={18} />
                            </span>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                placeholder="Contoh: Budi Santoso"
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                                    errors.name 
                                        ? 'border-red-500 focus:ring-red-500/20' 
                                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                                } rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 transition-all outline-none`}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                    </div>

                    {/* Alamat Email */}
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                            Alamat Email
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Mail size={18} />
                            </span>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                placeholder="budi@email.com"
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                                    errors.email 
                                        ? 'border-red-500 focus:ring-red-500/20' 
                                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                                } rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 transition-all outline-none`}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                    </div>

                    {/* Nomor Telepon */}
                    <div>
                        <label htmlFor="phone" className="block text-xs font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                            Nomor Telepon
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Phone size={18} />
                            </span>
                            <input
                                id="phone"
                                type="text"
                                name="phone"
                                value={data.phone}
                                placeholder="0812XXXXXXXX"
                                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                                    errors.phone 
                                        ? 'border-red-500 focus:ring-red-500/20' 
                                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                                } rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 transition-all outline-none`}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                            />
                        </div>
                        {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                    </div>

                    {/* Password & Confirm - Stacked for better mobile view in card */}
                    <div>
                        <label htmlFor="password" className="block text-xs font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={18} />
                            </span>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                placeholder="Min. 8 karakter"
                                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${
                                    errors.password 
                                        ? 'border-red-500 focus:ring-red-500/20' 
                                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                                } rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 transition-all outline-none`}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-xs font-bold tracking-wider text-slate-700 uppercase mb-1.5">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <Lock size={18} />
                            </span>
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="Ketik ulang kata sandi"
                                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${
                                    errors.password_confirmation 
                                        ? 'border-red-500 focus:ring-red-500/20' 
                                        : 'border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/20'
                                } rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 transition-all outline-none`}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password_confirmation && <p className="text-red-500 text-xs mt-1.5">{errors.password_confirmation}</p>}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-2">
                        <label className="flex items-start cursor-pointer">
                            <input
                                type="checkbox"
                                name="terms"
                                checked={data.terms}
                                className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-700 w-4 h-4 cursor-pointer mt-0.5"
                                onChange={(e) => setData('terms', e.target.checked)}
                                required
                            />
                            <span className="ms-3 text-[13px] text-slate-500 leading-snug">
                                Saya menyetujui <span className="text-emerald-700 font-bold hover:underline">Syarat & Ketentuan</span> serta <span className="text-emerald-700 font-bold hover:underline">Kebijakan Privasi</span>.
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 shadow-sm"
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
                <div className="text-center mt-8 pt-6 border-t border-slate-100">
                    <span className="text-[14px] text-slate-500">Sudah punya akun? </span>
                    <Link 
                        href={route('login')} 
                        className="text-[14px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                    >
                        Masuk di sini
                    </Link>
                </div>

            </div>
        </div>
    );
}
