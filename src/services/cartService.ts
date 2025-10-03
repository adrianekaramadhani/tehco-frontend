// File: src/services/cartService.ts

import { supabase } from "../config/supabaseClient";
import type { CartItem } from "../contexts/CartContext";
import type { Product } from "../types/types";

// Fungsi fetchCartItems tidak berubah
export const fetchCartItems = async (userId: string): Promise<CartItem[]> => {
  const { data, error } = await supabase
    .from('user_carts')
    .select(`
      quantity,
      products ( * )
    `)
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }

  return data.map((item: any) => ({
    ...(item.products as Product),
    quantity: item.quantity,
  }));
};

// --- FUNGSI UPSERT DIUBAH MENJADI DUA LANGKAH ---
export const upsertCartItem = async (userId: string, productId: string, quantity: number) => {
  // Langkah 1: Cek apakah item sudah ada
  const { data: existingItem, error: selectError } = await supabase
    .from('user_carts')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking for cart item:", selectError);
    throw selectError;
  }

  if (existingItem) {
    // Langkah 2a: Jika ada, UPDATE quantity
    const { error: updateError } = await supabase
      .from('user_carts')
      .update({ quantity: quantity })
      .eq('id', existingItem.id);
    if (updateError) {
      console.error("Error updating cart item:", updateError);
      throw updateError;
    }
  } else {
    // Langkah 2b: Jika tidak ada, INSERT item baru
    const { error: insertError } = await supabase
      .from('user_carts')
      .insert({ user_id: userId, product_id: productId, quantity: quantity });
    if (insertError) {
      console.error("Error inserting cart item:", insertError);
      throw insertError;
    }
  }
};
// ---------------------------------------------

// Fungsi removeCartItem dan clearUserCart tidak berubah
export const removeCartItem = async (userId: string, productId: string) => {
  const { error } = await supabase
    .from('user_carts')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const clearUserCart = async (userId: string) => {
  const { error } = await supabase
    .from('user_carts')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};