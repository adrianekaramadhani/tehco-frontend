// File: src/services/orderService.ts

import { supabase } from "../config/supabaseClient";
import type { CartItem } from "../contexts/CartContext";

interface CustomerDetails {
  name: string;
  whatsapp: string;
}

// LANGKAH 1: Tambahkan parameter 'userId' dengan tipe string
export async function submitOrder(cart: CartItem[], customer: CustomerDetails, totalPrice: number, userId: string) {
  // Langkah 1: Masukkan data ke tabel 'orders'
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customer.name,
      customer_whatsapp: customer.whatsapp,
      total_price: totalPrice,
      status: 'Baru', // Status default
      user_id: userId // <-- LANGKAH 2: Simpan ID pengguna yang sedang login
    })
    .select() // Minta agar data yang baru dibuat dikembalikan
    .single(); // Karena kita hanya membuat satu order

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error("Gagal membuat pesanan.");
  }

  const newOrderId = orderData.id;

  // Langkah 2: Siapkan data untuk tabel 'order_items'
  const orderItemsData = cart.map(item => ({
    order_id: newOrderId,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time_of_order: item.price
  }));

  // Langkah 3: Masukkan semua item ke tabel 'order_items'
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    // Di aplikasi nyata, kita mungkin perlu menghapus order yang sudah dibuat
    // Tapi untuk sekarang, cukup lemparkan error
    throw new Error("Gagal menyimpan detail item pesanan.");
  }

  // Jika semua berhasil, kembalikan data pesanan
  return orderData;
}