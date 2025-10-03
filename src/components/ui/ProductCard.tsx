// File: src/components/ui/ProductCard.tsx

import type { Product } from "../../types/types";
import { Plus } from 'lucide-react';
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import toast from 'react-hot-toast'; // <-- Import toast

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth(); // Kita tidak butuh signInWithGoogle di sini lagi

  const handleAddToCart = () => {
    if (user) {
      // Jika sudah login, langsung tambahkan ke keranjang
      addToCart(product);
    } else {
      // --- PERUBAHAN DI SINI ---
      // Jika belum login, tampilkan notifikasi error
      toast.error('Harap login terlebih dahulu untuk memesan.');
    }
  };

  if (!product) {
    return null;
  }

  const imageUrl = product.image_url || 'https://placehold.co/600x400/121212/00F5D4?text=Teh.co';

  return (
    <div className="bg-[#1A202C] rounded-xl p-4 flex flex-col group relative
                    transition-all duration-300 ease-in-out
                    hover:scale-105 hover:shadow-lg hover:shadow-teal-500/20">
      
      {/* Gambar Produk */}
      <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Detail Produk */}
      <div className="flex-grow">
        <h3 className="font-bold font-sora text-lg text-white mb-1">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{product.description}</p>
      </div>

      {/* Harga dan Tombol Tambah */}
      <div className="flex justify-between items-center">
        <p className="font-bold text-xl text-teal-400">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <button onClick={handleAddToCart} className="bg-teal-500 text-black rounded-full p-2 transition-transform duration-300 group-hover:rotate-90">
          <Plus size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;