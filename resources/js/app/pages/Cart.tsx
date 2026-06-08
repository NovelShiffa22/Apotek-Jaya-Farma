import { Link } from '@inertiajs/react';
import { Minus, Plus, Trash2, Tag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';

export default function Cart() {
    const [items, setItems] = useState([
        {
            id: 1,
            name: 'Paracetamol 500mg Strip',
            price: 15000,
            originalPrice: 15000,
            qty: 2,
            image: null,
            selected: true,
        },
        {
            id: 2,
            name: 'Amoxicillin 500mg Strip',
            price: 50000,
            originalPrice: 55000,
            qty: 1,
            image: null,
            selected: true,
        }
    ]);

    const toggleSelect = (id: number) => {
        setItems(items.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
    };

    const toggleAll = (checked: boolean) => {
        setItems(items.map(i => ({ ...i, selected: checked })));
    };

    const updateQty = (id: number, delta: number) => {
        setItems(items.map(i => {
            if (i.id === id) {
                const newQty = Math.max(1, i.qty + delta);
                return { ...i, qty: newQty };
            }
            return i;
        }));
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    const selectedItems = items.filter(i => i.selected);
    const totalOriginalPrice = selectedItems.reduce((acc, curr) => acc + (curr.originalPrice * curr.qty), 0);
    const totalPrice = selectedItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
    const totalDiscount = totalOriginalPrice - totalPrice;

    return (
        <div className="min-h-screen bg-[#fafaf8]">
            <Header />
            <main className="mx-auto max-w-6xl px-8 py-10">
                <h1 className="font-['Poppins',sans-serif] text-3xl font-bold text-[#171d19] mb-8">
                    Keranjang Belanja
                </h1>

                <div className="grid grid-cols-3 gap-8">
                    {/* Left: Cart Items */}
                    <div className="col-span-2 space-y-6">
                        
                        {/* Select All */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f]"
                                checked={items.length > 0 && items.every(i => i.selected)}
                                onChange={(e) => toggleAll(e.target.checked)}
                            />
                            <span className="font-['Poppins',sans-serif] font-semibold text-[#171d19] text-sm">Pilih Semua ({items.length} Produk)</span>
                        </div>

                        {/* Item List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                            {items.length === 0 ? (
                                <div className="p-10 text-center text-gray-500 font-['Poppins',sans-serif]">Keranjang Anda kosong.</div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="p-6 flex gap-6">
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded border-gray-300 text-[#006a3f] focus:ring-[#006a3f] mt-2"
                                            checked={item.selected}
                                            onChange={() => toggleSelect(item.id)}
                                        />
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl border border-gray-200 shrink-0">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px]">{item.name}</h3>
                                            
                                            <div className="mt-2 flex items-end gap-2">
                                                <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f] text-lg">Rp {item.price.toLocaleString('id-ID')}</span>
                                                {item.originalPrice > item.price && (
                                                    <span className="font-['Poppins',sans-serif] text-sm text-gray-400 line-through mb-0.5">Rp {item.originalPrice.toLocaleString('id-ID')}</span>
                                                )}
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 font-['Poppins',sans-serif] text-sm">
                                                    <Trash2 size={16} /> Hapus
                                                </button>

                                                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-1">
                                                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded text-[#006a3f] hover:bg-emerald-50 disabled:opacity-50" disabled={item.qty <= 1}>
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="font-['Poppins',sans-serif] font-bold text-[14px] w-6 text-center">{item.qty}</span>
                                                    <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded text-[#006a3f] hover:bg-emerald-50">
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                    </div>

                    {/* Right: Summary */}
                    <div className="col-span-1 space-y-6">
                        
                        {/* Promo */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Tag size={20} className="text-[#006a3f]" />
                                <span className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-sm">Promo Tersedia</span>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input type="text" placeholder="Masukkan kode promo" className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 font-['Poppins',sans-serif] text-sm focus:border-[#006a3f] focus:ring-1 focus:ring-[#006a3f] outline-none" />
                                <button className="rounded-xl bg-gray-800 px-4 py-2 text-white font-['Poppins',sans-serif] text-sm font-semibold hover:bg-gray-700">Terapkan</button>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px] mb-6">Ringkasan Belanja</h3>
                            
                            <div className="space-y-4 font-['Poppins',sans-serif] text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                                <div className="flex justify-between">
                                    <span>Total Harga ({selectedItems.length} barang)</span>
                                    <span>Rp {totalOriginalPrice.toLocaleString('id-ID')}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Total Diskon Barang</span>
                                        <span>-Rp {totalDiscount.toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-['Poppins',sans-serif] font-bold text-[#171d19] text-[16px]">Total Bayar</span>
                                <span className="font-['Poppins',sans-serif] font-bold text-[#006a3f] text-2xl">Rp {totalPrice.toLocaleString('id-ID')}</span>
                            </div>

                            <Link 
                                href={route('checkout.index')}
                                className={`w-full flex items-center justify-center gap-2 rounded-xl py-4 font-['Poppins',sans-serif] text-[15px] font-bold transition-all shadow-lg ${selectedItems.length > 0 ? 'bg-[#006a3f] text-white hover:bg-[#005632]' : 'bg-gray-200 text-gray-400 pointer-events-none'}`}
                            >
                                Beli ({selectedItems.length}) <ArrowRight size={18} />
                            </Link>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
