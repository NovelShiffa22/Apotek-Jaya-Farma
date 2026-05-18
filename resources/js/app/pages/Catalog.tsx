import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { SlidersHorizontal } from 'lucide-react';

export default function Catalog() {
  const searchParams = new URLSearchParams(window.location.search);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const searchQuery = searchParams.get('search') || '';

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'vitamin', label: 'Vitamin & Suplemen' },
    { id: 'ibu-anak', label: 'Ibu & Anak' },
    { id: 'alat-kesehatan', label: 'Alat Kesehatan' },
    { id: 'perawatan', label: 'Perawatan Tubuh' }
  ];

  const symptoms = [
    'Demam', 'Batuk', 'Pilek', 'Sakit Kepala',
    'Flu', 'Alergi', 'Mual', 'Diare'
  ];

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const filtered = prev.filter(c => c !== 'all');
        if (prev.includes(categoryId)) {
          const newCats = filtered.filter(c => c !== categoryId);
          return newCats.length === 0 ? ['all'] : newCats;
        } else {
          return [...filtered, categoryId];
        }
      });
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafaf8] to-white">
      <Header />

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-['Roboto_Condensed',sans-serif] font-light text-[48px] tracking-[-1.2px] text-[#171d19] mb-2">
              Katalog Obat
            </h1>
            {searchQuery && (
              <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41]">
                Hasil pencarian untuk "<span className="text-[#006a3f] font-bold">{searchQuery}</span>"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#6e7a70]">
            <SlidersHorizontal size={16} />
            <span className="font-['Inter',sans-serif] text-[14px]">
              {filteredProducts.length} Produk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Filter - From Figma */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] sticky top-8">
              {/* Filter Header */}
              <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19] mb-6">
                Filter
              </h3>

              {/* Category Filter */}
              <div className="mb-8">
                <p className="font-['Inter',sans-serif] text-[12px] font-bold text-[#6e7a70] tracking-wider uppercase mb-4">
                  KATEGORI
                </p>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border transition-all ${
                          selectedCategories.includes(category.id)
                            ? 'bg-[#006a3f] border-[#006a3f]'
                            : 'bg-white border-[#6e7a70] group-hover:border-[#006a3f]'
                        }`}>
                          {selectedCategories.includes(category.id) && (
                            <svg className="w-full h-full text-white p-0.5" viewBox="0 0 16 16" fill="none">
                              <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="font-['Inter',sans-serif] text-[14px] text-[#171d19]">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] mb-8" />

              {/* Symptom Filter */}
              <div>
                <p className="font-['Inter',sans-serif] text-[12px] font-bold text-[#6e7a70] tracking-wider uppercase mb-4">
                  GEJALA
                </p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1.5 rounded-full font-['Inter',sans-serif] text-[14px] transition-all ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-[rgba(0,106,63,0.1)] text-[#006a3f] border border-[#006a3f]'
                          : 'bg-[#f9fafb] text-[#171d19] border border-[#e5e7eb] hover:border-[#006a3f]'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-span-9">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#f5f7f6] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#1a1a1a] opacity-20">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <p className="font-['Inter',sans-serif] text-[16px] text-[#1a1a1a] opacity-60">
                  Tidak ada produk ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
