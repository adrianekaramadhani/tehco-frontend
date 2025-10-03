// File: src/contexts/CartContext.tsx

import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Product } from "../types/types";
import toast from 'react-hot-toast';
import { useAuth } from "../hooks/useAuth";
import { fetchCartItems, upsertCartItem, removeCartItem, clearUserCart } from "../services/cartService";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Efek untuk memuat keranjang dari database saat pengguna login,
  // atau mengosongkan keranjang saat pengguna logout.
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const items = await fetchCartItems(user.id);
          setCart(items);
        } catch (error) {
          console.error("Gagal memuat keranjang dari database", error);
          toast.error("Gagal memuat keranjang.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Jika tidak ada user (sudah logout atau sesi awal), kosongkan keranjang
        setCart([]);
        setIsLoading(false);
      }
    };
    loadCart();
  }, [user]);

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Anda harus login untuk menambahkan item.");
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    const newQuantity = (existingItem ? existingItem.quantity : 0) + 1;

    // Update UI terlebih dahulu untuk respons cepat (Optimistic UI Update)
    const updatedCart = existingItem
      ? cart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item)
      : [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    
    toast.success(`${product.name} ditambahkan!`);
    
    // Sinkronkan dengan database di belakang layar
    try {
      await upsertCartItem(user.id, product.id, newQuantity);
    } catch (error) {
      toast.error("Gagal menyimpan keranjang ke database.");
      // Jika gagal, kembalikan state UI ke kondisi semula
      setCart(cart);
    }
  };
  
  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const originalCart = [...cart];
    // Update UI terlebih dahulu
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.error("Item dihapus dari keranjang.");

    // Sinkronkan dengan database
    try {
      await removeCartItem(user.id, productId);
    } catch (error) {
      toast.error("Gagal menghapus item dari database.");
      setCart(originalCart); // Kembalikan jika gagal
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const originalCart = [...cart];
    setCart([]); // Update UI
    try {
      await clearUserCart(user.id); // Hapus dari DB
    } catch (error) {
      toast.error("Gagal mengosongkan keranjang di database.");
      setCart(originalCart);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        clearCart,
        totalItems, 
        totalPrice, 
        isCartOpen, 
        openCart, 
        closeCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};