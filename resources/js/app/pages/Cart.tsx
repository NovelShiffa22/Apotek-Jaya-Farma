import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Trash2, Plus, Minus, ArrowRight, CheckSquare } from 'lucide-react';
import Header from '../components/Header';

interface CartItem {
  id: number;
  nama: string;
  jenis_kemasan: string;
  harga: number;
  quantity: number;
  foto?: string | null;
}

interface FrequentlyBought {
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  foto?: string | null;
}

interface CartProps {
  cartItems: CartItem[];
  shippingCost: number;
  discount: number;
  frequentlyBought: FrequentlyBought[];
}

export default function Cart({ cartItems, shippingCost, discount, frequentlyBought }: CartProps) {
  // State for checked items (store array of item IDs)
  const [checkedItems, setCheckedItems] = useState<number[]>(cartItems.map(item => item.id));

  // Toggle single item
  const toggleItem = (id: number) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  // Toggle all items
  const isAllChecked = cartItems.length > 0 && checkedItems.length === cartItems.length;
  const toggleAll = () => {
    if (isAllChecked) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartItems.map(item => item.id));
    }
  };

  // Calculate Subtotal for checked items only
  const subtotal = useMemo(() => {
    return cartItems
      .filter(item => checkedItems.includes(item.id))
      .reduce((sum, item) => sum + (item.harga * item.quantity), 0);
  }, [cartItems, checkedItems]);

  const total = subtotal > 0 ? subtotal + shippingCost - discount : 0;

  // Handle quantity update
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    router.put(`/cart/${id}`, { quantity: newQuantity }, { preserveScroll: true, preserveState: true });
  };

  // Handle item removal
  const removeItem = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini dari keranjang?')) {
      router.delete(`/cart/${id}`, { 
        preserveScroll: true, 
        preserveState: true,
        onSuccess: () => {
          setCheckedItems(prev => prev.filter(itemId => itemId !== id));
        }
      });
    }
  };

  // Handle Add to cart from frequently bought
  const addToCart = (id: number) => {
    router.post('/cart/add', { product_id: id, quantity: 1 }, { preserveScroll: true });
  };

  // Handle Proceed to Checkout
  const handleCheckout = () => {
    if (checkedItems.length === 0) return;
    // Pass checked items to checkout via GET params
    router.get('/checkout', { items: checkedItems });
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] font-['Poppins',sans-serif]">
      <Head title="Keranjang Belanja - Apotek Jaya Farma" />
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#171d19] mb-8">Keranjang Belanja</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SISI KIRI: Daftar Keranjang & Rekomendasi */}
          <div className="lg:col-span-2">
            
            {/* Header: Pilih Semua */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between mb-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isAllChecked} 
                  onChange={toggleAll}
                />
                <div className={`w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors ${isAllChecked ? 'bg-[#006a3f] border-[#006a3f]' : 'border-gray-300 group-hover:border-[#006a3f]'}`}>
                  {isAllChecked && <CheckSquare size={16} className="text-white" strokeWidth={3} />}
                </div>
                <span className="font-bold text-gray-900 text-lg">Pilih Semua</span>
              </label>
              
              <button 
                onClick={() => setCheckedItems([])} 
                className="text-sm font-bold flex items-center gap-1.5 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={16} strokeWidth={2.5}/>
                Hapus Pilihan
              </button>
            </div>

            {/* List Item Keranjang */}
            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <div className="bg-white rounded-xl p-10 shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500">Keranjang Anda masih kosong.</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const isChecked = checkedItems.includes(item.id);
                  return (
                    <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all hover:shadow-md">
                      
                      <label className="flex-shrink-0 cursor-pointer pt-2 sm:pt-0 group">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={isChecked} 
                          onChange={() => toggleItem(item.id)}
                        />
                        <div className={`w-[22px] h-[22px] rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-[#006a3f] border-[#006a3f]' : 'border-gray-300 group-hover:border-[#006a3f]'}`}>
                          {isChecked && <CheckSquare size={16} className="text-white" strokeWidth={3} />}
                        </div>
                      </label>

                      <div className="w-[100px] h-[100px] bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-2">
                        {item.foto ? (
                          <img src={item.foto} alt={item.nama} className="w-full h-full object-contain" />
                        ) : (
                          <div className="text-gray-300 flex flex-col items-center">
                            <span className="text-[10px] font-medium mt-1">No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 text-[18px] leading-tight truncate pr-4">{item.nama}</h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={22} strokeWidth={2} />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{item.jenis_kemasan}</p>
                        </div>
                        <div className="flex items-end justify-between mt-4">
                          <p className="font-bold text-[#006a3f] text-xl">Rp {item.harga.toLocaleString('id-ID')}</p>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10 w-[110px]">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-10 h-full flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-30 transition-colors"
                            >
                              <Minus size={16} strokeWidth={2.5} />
                            </button>
                            <div className="flex-1 h-full flex items-center justify-center font-bold text-gray-900 border-x border-gray-200 bg-white">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-full flex items-center justify-center bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                            >
                              <Plus size={16} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sering Dibeli Bersama */}
            {frequentlyBought && frequentlyBought.length > 0 && (
              <div className="mt-10">
                <h2 className="text-[22px] font-bold text-gray-900 mb-5">Sering Dibeli Bersama</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {frequentlyBought.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
                      <div className="w-[70px] h-[70px] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 p-1">
                        {product.foto ? (
                          <img src={product.foto} alt={product.nama} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{product.nama}</h4>
                        <p className="font-semibold text-[#006a3f] text-[15px] mt-1">Rp {product.harga.toLocaleString('id-ID')}</p>
                      </div>
                      <button 
                        onClick={() => addToCart(product.id)}
                        className="w-8 h-8 rounded-full bg-[#006a3f] text-white flex items-center justify-center hover:bg-[#005632] transition-colors shadow-sm flex-shrink-0"
                      >
                        <Plus size={18} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* SISI KANAN: Ringkasan Pesanan (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 sticky top-24">
              
              <h2 className="text-[22px] font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[15px]">
                  <span className="text-gray-600">Subtotal ({checkedItems.length} item)</span>
                  <span className="font-medium text-gray-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                
                {subtotal > 0 && (
                  <>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-gray-600">Biaya Pengiriman</span>
                      <span className="font-medium text-gray-900">Rp {shippingCost.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#006a3f]">Potongan Harga</span>
                      <span className="font-medium text-[#006a3f]">-Rp {discount.toLocaleString('id-ID')}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t-2 border-gray-100 pt-5 mb-8 flex justify-between items-end">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-[#006a3f] tracking-tight">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkedItems.length === 0}
                className="w-full bg-[#006a3f] text-white rounded-xl py-[18px] flex items-center justify-center gap-2 font-bold text-[16px] hover:bg-[#005632] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                Lanjutkan ke Pembayaran
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
