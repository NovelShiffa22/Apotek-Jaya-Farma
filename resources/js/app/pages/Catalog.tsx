import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal } from 'lucide-react';

export default function Catalog({ 
  products = [], 
  masterCategories = [], 
  masterSymptoms = [], 
  filters = {} 
}: { 
  products?: any[];
  masterCategories?: any[];
  masterSymptoms?: any[];
  filters?: any;
}) {
  const searchParams = new URLSearchParams(window.location.search);
  const searchQuery = searchParams.get('search') || '';

  const initialCat = filters.category || 'all';
  const initialSym = filters.symptoms ? (Array.isArray(filters.symptoms) ? filters.symptoms : filters.symptoms.split(',')) : [];
  const initialPriceMin = filters.price_min || '';
  const initialPriceMax = filters.price_max || '';

  const [selectedCategories, setSelectedCategories] = useState<string[]>([initialCat]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialSym);
  const [priceMin, setPriceMin] = useState<string>(initialPriceMin);
  const [priceMax, setPriceMax] = useState<string>(initialPriceMax);

  // Dynamic categories mapped from backend
  const categories = [
    { id: 'all', label: 'Semua Produk' },
    ...masterCategories.map(c => ({ id: c.slug, label: c.nama_kategori }))
  ];

  // Dynamic symptoms mapped from backend
  const symptoms = masterSymptoms.map(s => s.nama_gejala);

  const updateFilters = (cat: string[], sym: string[], resetSearch: boolean = false, minP: string = priceMin, maxP: string = priceMax) => {
    const params: any = {
      category: cat.includes('all') ? 'all' : cat[0],
      symptoms: sym.join(',')
    };
    if (!resetSearch && searchQuery) params.search = searchQuery;
    if (minP) params.price_min = minP;
    if (maxP) params.price_max = maxP;

    router.get('/catalog', params, { preserveState: true, replace: true });
  };

    const toggleCategory = (categoryId: string) => {
      let newCats = ['all'];
      if (categoryId !== 'all') {
        newCats = [categoryId]; // simplify to single select for category
      }
      setSelectedCategories(newCats);
      updateFilters(newCats, selectedSymptoms, true); // True to reset search
    };

    const resetAllFilters = () => {
      setSelectedCategories(['all']);
      setSelectedSymptoms([]);
      setPriceMin('');
      setPriceMax('');
      router.get('/catalog', {}, { preserveState: true, replace: true });
    };

  const toggleSymptom = (symptom: string) => {
    // Find symptom slug to send to backend instead of label
    const symObj = masterSymptoms.find(s => s.nama_gejala === symptom);
    const symSlug = symObj ? symObj.slug : symptom;

    let newSyms;
    if (selectedSymptoms.includes(symSlug)) {
      newSyms = selectedSymptoms.filter(s => s !== symSlug);
    } else {
      newSyms = [...selectedSymptoms, symSlug];
    }
    setSelectedSymptoms(newSyms);
    updateFilters(selectedCategories, newSyms, false);
  };

  // We no longer filter manually here because backend already filtered
  const filteredProducts = products;

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
              <div className="mt-2">
                <p className="font-['Inter',sans-serif] text-[16px] text-[#3e4a41] inline-block mr-3">
                  Hasil pencarian untuk "<span className="text-[#006a3f] font-bold">{searchQuery}</span>"
                </p>
                <button
                  onClick={() => updateFilters(selectedCategories, selectedSymptoms, true)}
                  className="text-red-500 text-[13px] font-bold hover:underline inline-block transition-all"
                >
                  [ Hapus Pencarian ]
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#6e7a70]">
            <SlidersHorizontal size={16} />
            <span className="font-['Inter',sans-serif] text-[14px]">
              {filteredProducts.length} Produk
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Sidebar Filter - From Figma */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 border border-[#f1f5f9] lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Roboto_Condensed',sans-serif] text-[20px] font-semibold text-[#171d19]">
                  Filter
                </h3>
                {(selectedCategories[0] !== 'all' || selectedSymptoms.length > 0 || priceMin || priceMax) && (
                  <button 
                    onClick={resetAllFilters}
                    className="text-red-500 text-[13px] font-bold hover:underline transition-all"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

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
              <div className="mb-8">
                <p className="font-['Inter',sans-serif] text-[12px] font-bold text-[#6e7a70] tracking-wider uppercase mb-4">
                  GEJALA
                </p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1.5 rounded-full font-['Inter',sans-serif] text-[14px] transition-all ${
                        selectedSymptoms.includes(masterSymptoms.find(s => s.nama_gejala === symptom)?.slug || symptom)
                          ? 'bg-[rgba(0,106,63,0.1)] text-[#006a3f] border border-[#006a3f]'
                          : 'bg-[#f9fafb] text-[#171d19] border border-[#e5e7eb] hover:border-[#006a3f]'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-[#e5e7eb] mb-8" />

              {/* Price Filter */}
              <div>
                <p className="font-['Inter',sans-serif] text-[12px] font-bold text-[#6e7a70] tracking-wider uppercase mb-4">
                  RENTANG HARGA
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="Harga Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[13px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Harga Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-[#f9fafb] border border-[#f1f5f9] rounded-xl font-['Inter',sans-serif] text-[13px] text-[#171d19] focus:outline-none focus:ring-2 focus:ring-[#006a3f]/20 focus:border-[#006a3f] transition-all"
                  />
                </div>
                <button
                  onClick={() => updateFilters(selectedCategories, selectedSymptoms, false, priceMin, priceMax)}
                  className="bg-[#006a3f] hover:bg-[#005632] text-white rounded-lg py-1.5 px-3 w-full text-xs font-bold mt-2 transition-colors"
                >
                  Terapkan
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {filteredProducts.map((product: any) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id.toString()}
                    nama_obat={product.nama_obat}
                    harga={Number(product.harga)}
                    jenis_obat={product.jenis_obat}
                    gambar={product.gambar}
                    deskripsi={product.deskripsi || product.indikasi}
                    kategori_nama={product.category?.nama_kategori}
                    stok={product.stok}
                    terjual={product.terjual}
                  />
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
