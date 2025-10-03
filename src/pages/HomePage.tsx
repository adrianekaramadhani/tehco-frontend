// File: src/pages/HomePage.tsx

import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getProducts } from "../services/productService";
import type { Product } from "../types/types";
import ProductCard from "../components/ui/ProductCard";
import CartSidebar from "../components/ui/CartSidebar";
import Map from '../components/ui/Map';
import Chatbot from '../components/ui/Chatbot';
import HeroSection from '../components/ui/HeroSection'; // <-- LANGKAH 1: Impor komponen baru

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {/* --- GRUP 1: KONTEN UTAMA HALAMAN --- */}
      <div className="bg-[#121212] text-white">
        <Header />
        
        {/* LANGKAH 2: Tampilkan Hero Section di sini */}
        <HeroSection />

        {/* LANGKAH 3: Tambahkan id="menu-section" di sini */}
        <main className="container mx-auto p-4 md:p-8" id="menu-section">
          <h2 className="text-3xl md:text-4xl font-bold font-sora mb-8 text-center">
            Menu Kami
          </h2>
          
          {isLoading && <p className="text-center text-gray-400">Memuat produk...</p>}
          {error && <p className="text-center text-red-500">Error: {error}</p>}
          
          {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
        
        <Map /> 
        <Footer />
      </div>

      {/* --- GRUP 2: ELEMEN OVERLAY --- */}
      <CartSidebar />
      <Chatbot />
    </>
  );
};

export default HomePage;