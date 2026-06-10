import { Link, router, usePage } from '@inertiajs/react';
import { Search, User, ShoppingCart, Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { cartCount: initialCartCount = 0 } = usePage().props as { cartCount?: number };
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth } = usePage().props as any;
  const user = auth?.user;
  const [cartCount, setCartCount] = useState(initialCartCount);

  useEffect(() => {
    const handleCartUpdate = (e: any) => setCartCount(e.detail);
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.visit(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog', href: '/catalog' },
    { name: 'Rekomendasi AI', href: '/recommendation' },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 group">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white w-5 h-5 sm:w-6 sm:h-6">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 font-sans ml-1 sm:ml-2 truncate max-w-[140px] sm:max-w-none group-hover:text-emerald-700 transition-colors">
              Apotek Jaya Farma
            </h1>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-xl mx-4 lg:mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari obat, vitamin, atau produk kesehatan..."
              className="w-full px-5 py-2.5 pr-12 bg-[#f9fafb] rounded-full font-['Inter',sans-serif] text-[14px] text-[#171d19] border border-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:bg-white focus:border-[#006a3f] transition-all placeholder:text-[#6e7a70]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7a70] hover:text-[#006a3f] transition-colors"
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#3e4a41] hover:text-[#006a3f] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/resep"
              className="border border-emerald-600 text-emerald-600 text-sm font-medium px-4 py-1.5 rounded-xl hover:bg-emerald-50 transition duration-200"
            >
              Unggah Resep
            </Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/cart" className="relative p-2 hover:bg-[#f9fafb] rounded-xl transition-colors group" title="Keranjang">
                <ShoppingCart size={22} className="text-[#171d19] group-hover:text-[#006a3f] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#006a3f] text-white text-[10px] font-['Inter',sans-serif] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link href={route('notifications.index')} className="p-2 hover:bg-[#f9fafb] rounded-xl transition-colors group relative" title="Notifikasi">
                <Bell size={22} className="text-[#171d19] group-hover:text-[#006a3f] transition-colors" />
                <span className="absolute top-2.5 right-2.5 bg-red-500 w-2 h-2 rounded-full border border-white" />
              </Link>

              <Link href="/profile" className="p-2 hover:bg-[#f9fafb] rounded-xl transition-colors group hidden sm:block" title="Profil">
                <User size={22} className="text-[#171d19] group-hover:text-[#006a3f] transition-colors" />
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href={route('login')}
                className="bg-[#006a3f] hover:bg-[#005632] px-5 py-2 rounded-lg font-['Inter',sans-serif] font-bold text-[14px] text-white transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 lg:hidden text-[#171d19] hover:bg-[#f9fafb] rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Below Top Bar) */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari obat, vitamin..."
            className="w-full px-4 py-2.5 pr-10 bg-[#f9fafb] rounded-full font-['Inter',sans-serif] text-[14px] text-[#171d19] border border-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:bg-white focus:border-[#006a3f] transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7a70]"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#f1f5f9] absolute w-full shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-['Inter',sans-serif] text-[15px] font-medium text-[#171d19] py-3 px-4 hover:bg-[#f9fafb] rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/resep"
              className="font-['Inter',sans-serif] text-[15px] font-bold text-emerald-600 py-3 px-4 hover:bg-emerald-50 rounded-xl transition-colors border border-emerald-100 mt-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload Resep Dokter
            </Link>
            
            {!user && (
              <div className="mt-4 pt-4 border-t border-[#f1f5f9] flex flex-col gap-2">
                <Link
                  href={route('login')}
                  className="w-full text-center bg-[#006a3f] py-3 rounded-xl font-['Inter',sans-serif] font-bold text-[14px] text-white"
                >
                  Login
                </Link>
                <Link
                  href={route('register')}
                  className="w-full text-center border border-[#171d19] py-3 rounded-xl font-['Inter',sans-serif] font-bold text-[14px] text-[#171d19]"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {user && (
              <div className="mt-2 pt-2 border-t border-[#f1f5f9]">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 font-['Inter',sans-serif] text-[15px] font-medium text-[#171d19] py-3 px-4 hover:bg-[#f9fafb] rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profil Saya</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
