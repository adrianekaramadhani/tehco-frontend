// File: src/config/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// Ambil URL dan Anon Key dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Pastikan variabel ada sebelum membuat client
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env.local");
}

// Buat dan ekspor client Supabase dengan opsi auth tambahan
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Izinkan penyimpanan sesi di localStorage agar lebih persisten
    persistSession: true,
    // Secara otomatis me-refresh token
    autoRefreshToken: true,
    // Deteksi sesi dari URL setelah redirect dari Google
    detectSessionInUrl: true 
  }
})