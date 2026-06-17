import { Link, router, usePage } from '@inertiajs/react';
import { Search, User, ShoppingCart, Bell, Menu, X, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';

export default function Header() {
  const { cartCount: initialCartCount = 0 } = usePage().props as { cartCount?: number };
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth } = usePage().props as any;
  const user = auth?.user;
  const { url } = usePage();
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [hasUnreadNotifs, setHasUnreadNotifs] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isUploadFlow = url.startsWith('/prescriptions/upload');
  const isMinimalHeader = url.startsWith('/checkout') || isUploadFlow;

  useEffect(() => {
    const handleCartUpdate = (e: any) => setCartCount(e.detail);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    const checkUnreadNotifs = () => {
      const savedReadStatus = typeof window !== 'undefined' ? localStorage.getItem('readNotifications') : null;
      if (savedReadStatus) {
        const readIds = JSON.parse(savedReadStatus);
        // initialNotifications in Notifications.tsx has id 1 as unread initially.
        if (readIds.includes(1)) {
          setHasUnreadNotifs(false);
          return;
        }
      }
      setHasUnreadNotifs(true);
    };

    checkUnreadNotifs();
    window.addEventListener('notificationsUpdated', checkUnreadNotifs);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('notificationsUpdated', checkUnreadNotifs);
    };
  }, []);

  useEffect(() => {
    setCartCount(initialCartCount);
  }, [initialCartCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.visit(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const handleCancelTransaction = () => {
    setShowCancelModal(true);
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Katalog', href: '/catalog' },
    { name: 'Rekomendasi AI', href: '/recommendation' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
  ];

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-[9999] w-full bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      {isMinimalHeader ? (
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#006a3f] to-[#005632] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,106,63,0.25)] shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white w-5 h-5 sm:w-6 sm:h-6">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-emerald-600 font-sans ml-1 sm:ml-2 truncate group-hover:text-emerald-700 transition-colors">
              Apotek Jaya Farma
            </h1>
          </Link>
          <div className="flex items-center gap-4">
             {isUploadFlow ? (
               <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                 <ShieldCheck size={14} />
                 Verifikasi Medis
               </span>
             ) : (
               <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                 <ShieldCheck size={14} />
                 Pembayaran Aman
               </span>
             )}
             <button onClick={handleCancelTransaction} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm">
               Batal
             </button>
          </div>
        </div>
      ) : (
        <>
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
                    href={link.name === 'Rekomendasi AI' && !user ? route('login') : link.href}
                    className="font-['Inter',sans-serif] text-[14px] font-semibold text-[#3e4a41] hover:text-[#006a3f] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href={!user ? route('login') : "/prescriptions/upload/step-1"}
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
                    {hasUnreadNotifs && (
                      <span className="absolute top-2.5 right-2.5 bg-red-500 w-2 h-2 rounded-full border border-white" />
                    )}
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
                    Masuk
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
        </>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#f1f5f9] absolute w-full shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.name === 'Rekomendasi AI' && !user ? route('login') : link.href}
                className="font-['Inter',sans-serif] text-[15px] font-medium text-[#171d19] py-3 px-4 hover:bg-[#f9fafb] rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={!user ? route('login') : "/prescriptions/upload/step-1"}
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
                  Masuk
                </Link>
                <Link
                  href={route('register')}
                  className="w-full text-center border border-[#171d19] py-3 rounded-xl font-['Inter',sans-serif] font-bold text-[14px] text-[#171d19]"
                >
                  Daftar
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
    
    {/* Spacer to prevent content from hiding under fixed header */}
    <div className={isMinimalHeader ? "h-[76px]" : "h-20 sm:h-[76px]"} />

    {/* Floating WhatsApp Contact Button */}
    <a
      href="https://wa.me/628111230705"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-[9999] flex items-center justify-end rounded-full bg-[#25D366] text-white p-3 shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:max-w-xs cursor-pointer"
      title="Hubungi kami via WhatsApp"
    >
      <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden text-white font-medium transition-all duration-300 ease-in-out group-hover:max-w-[200px] group-hover:opacity-100 group-hover:mr-2 ml-1">
        Konsultasi Apoteker
      </span>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>

    <ConfirmModal
      isOpen={showCancelModal}
      title="Konfirmasi Batal?"
      message="Apakah Anda yakin ingin membatalkan proses ini? Seluruh data yang sudah Anda isi tidak akan disimpan."
      confirmText="Ya, Batal"
      cancelText="Lanjutkan"
      type="danger"
      onClose={() => setShowCancelModal(false)}
      onConfirm={() => {
        setShowCancelModal(false);
        router.visit('/cart');
      }}
    />
    </>
  );
}
