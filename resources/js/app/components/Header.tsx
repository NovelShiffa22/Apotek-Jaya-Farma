import { Link, router, usePage } from '@inertiajs/react';
import { Search, MessageCircle, User, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { cartCount: initialCartCount = 0 } = usePage().props as { cartCount?: number };
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(initialCartCount);

  // Dengarkan event update tanpa harus reload halaman
  useEffect(() => {
    const handleCartUpdate = (e: any) => setCartCount(e.detail);
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.visit(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-[#f1f5f9] sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1440px] mx-auto px-8 py-5">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="font-['Roboto_Condensed',sans-serif] font-normal text-[24px] tracking-[-0.6px] text-[#171d19] group-hover:text-[#006a3f] transition-colors">
                Apotek Jaya Farma
              </h1>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-[600px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari obat, vitamin, atau produk kesehatan..."
                className="w-full px-5 py-3 pr-12 bg-[#f9fafb] rounded-xl font-['Inter',sans-serif] text-[14px] text-[#171d19] border border-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:bg-white focus:border-[#006a3f] transition-all placeholder:text-[#6e7a70]"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7a70] hover:text-[#006a3f] transition-colors"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#006a3f] hover:bg-[#005632] px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_8px_20px_rgba(0,106,63,0.3)] transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <MessageCircle size={18} className="text-white" />
              <span className="font-['Roboto_Condensed',sans-serif] text-[15px] tracking-[0.3px] text-white font-medium">
                Konsultasi
              </span>
            </a>

            <Link href="/cart" className="relative p-3 hover:bg-[#f9fafb] rounded-xl transition-colors group">
              <ShoppingCart size={22} className="text-[#171d19] group-hover:text-[#006a3f] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#006a3f] text-white text-[11px] font-['Inter',sans-serif] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/profile" className="p-3 hover:bg-[#f9fafb] rounded-xl transition-colors group">
              <User size={22} className="text-[#171d19] group-hover:text-[#006a3f] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
