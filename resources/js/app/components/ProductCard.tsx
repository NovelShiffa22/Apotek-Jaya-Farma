import { Link } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string | number;
  name?: string;
  nama_obat?: string;
  price?: number;
  harga?: number;
  category?: 'bebas' | 'keras' | 'terbatas';
  jenis_obat?: 'bebas' | 'keras' | 'terbatas';
  image?: string;
  gambar?: string;
  deskripsi?: string;
  kategori_nama?: string;
  stok?: number;
}

export default function ProductCard(props: ProductCardProps) {
  const { id } = props;
  const productName = props.nama_obat || props.name || 'Produk';
  const productPrice = props.harga ?? props.price ?? 0;
  const productCategory = props.jenis_obat || props.category || 'bebas';
  const productImage = props.gambar || props.image;
  const stok = props.stok;
  const kategoriNama = props.kategori_nama;

  const categoryConfig = {
    bebas: { label: 'Obat Bebas', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', dot: 'bg-emerald-500' },
    keras: { label: 'Obat Keras', bgColor: 'bg-red-50', textColor: 'text-red-700', dot: 'bg-red-500' },
    terbatas: { label: 'Obat Terbatas', bgColor: 'bg-amber-50', textColor: 'text-amber-700', dot: 'bg-amber-500' }
  };

  const config = categoryConfig[productCategory];

  return (
    <div className="group bg-white rounded-2xl border border-[#f1f5f9] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <Link href={`/product/${id}`} className="block relative aspect-square bg-gradient-to-br from-[#f5f7f6] to-[#e8ede9] overflow-hidden">
        {productImage ? (
          <img
            src={productImage}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#6b8e6f] to-[#8ba68e] rounded-full opacity-20" />
          </div>
        )}

        {/* Category Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1.5 ${config.bgColor} ${config.textColor} px-3 py-1.5 rounded-full backdrop-blur-sm`}>
            <div className={`w-1.5 h-1.5 ${config.dot} rounded-full`} />
            <span className="font-['Inter',sans-serif] text-[11px] font-bold tracking-wider uppercase">
              {config.label}
            </span>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        {/* Kategori Label Text (Opsional) */}
        {kategoriNama && (
           <p className="font-['Inter',sans-serif] text-[11px] font-semibold text-[#006a3f] uppercase tracking-wider mb-1.5">
             {kategoriNama}
           </p>
        )}
        
        <Link href={`/product/${id}`}>
          <h3 className="font-['Roboto_Condensed',sans-serif] font-normal text-[18px] text-[#171d19] tracking-[-0.3px] mb-1 min-h-[50px] leading-tight hover:text-[#006a3f] transition-colors">
            {productName}
          </h3>
        </Link>

        {/* Info Stok */}
        {stok !== undefined && (
          <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70] mb-2">
            Stok: <span className="font-semibold text-[#171d19]">{stok}</span>
          </p>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="font-['Inter',sans-serif] text-[12px] text-[#6e7a70] uppercase tracking-wider mb-1">
              Harga
            </p>
            <p className="font-['Roboto_Condensed',sans-serif] font-semibold text-[20px] text-[#006a3f]">
              Rp {productPrice.toLocaleString('id-ID')}
            </p>
          </div>

          <Link
            href={`/product/${id}`}
            className="bg-[#006a3f] hover:bg-[#005632] p-3 rounded-xl transition-all duration-300 hover:shadow-lg group/btn"
          >
            <ShoppingCart className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
