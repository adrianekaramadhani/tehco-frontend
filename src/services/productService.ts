// File: src/services/productService.ts

import { supabase } from "../config/supabaseClient";
import type { Product } from "../types/types";

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products') // Nama tabel di Supabase
    .select('*');     // Ambil semua kolom

  if (error) {
    console.error("Error fetching products:", error);
    throw new Error(error.message);
  }

  return data || []; // Kembalikan data atau array kosong jika data null
}