// File: src/types/types.ts

// Tipe untuk satu produk
export interface Product {
  id: string; // uuid akan menjadi string di JavaScript
  created_at: string;
  name: string;
  description?: string | null; // Tanda tanya (?) berarti opsional
  price: number;
  image_url?: string | null;
}

// Tipe untuk satu pesanan
export interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_whatsapp: string;
  total_price: number;
  status: string;
}

// Tipe untuk satu item di dalam pesanan
export interface OrderItem {
  id: number;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time_of_order?: number | null; // Opsional sesuai saran best practice
}