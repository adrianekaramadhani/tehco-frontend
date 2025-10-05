<h1><b>Teh Solo OCHA - Aplikasi Web E-Commerce</b></h1> <br>
Aplikasi web full-stack modern untuk pemesanan minuman "Teh Solo OCHA", dibangun sebagai proyek capstone dengan fokus pada pengalaman pengguna yang interaktif dan alur pemesanan yang efisien.

<h2><b>Deskripsi</b></h2> <br>
Proyek ini bertujuan untuk mendigitalisasi proses pemesanan untuk bisnis F&B skala kecil. Aplikasi ini memungkinkan pelanggan untuk melihat menu, melakukan pemesanan, dan mendapatkan notifikasi, sementara penjual menerima pesanan secara real-time melalui Telegram. Aplikasi ini dilengkapi dengan fitur-fitur canggih seperti peta interaktif, rute, dan asisten AI untuk menjawab pertanyaan pelanggan.

<h2><b>Technologies Used</b></h2> <br>
<h3><b>Frontend</h3></b> <br>
Framework: React (dengan Vite & TypeScript)

Styling: Tailwind CSS

Manajemen State: React Context

Peta: Leaflet & React-Leaflet

Notifikasi: React Hot Toast

<h3><b>Backend & Services</b></h3> <br>
Backend-as-a-Service (BaaS): Supabase (PostgreSQL Database, Authentication, Storage)

Backend Kustom: Vercel Serverless Functions

AI Chatbot: Replicate API

Notifikasi Pesanan: Telegram Bot API

Deployment: Vercel

<h2>Fitur Utama</h2>
Autentikasi Pengguna: Login mudah dan aman menggunakan akun Google via Supabase Auth. <br>

Keranjang Belanja Persisten: Keranjang belanja disimpan di database per pengguna, memastikan data tidak hilang setelah logout. <br>

Proses Checkout: Alur checkout lengkap yang menyimpan data pesanan (termasuk catatan) ke database. <br>

Notifikasi Telegram Real-Time: Setiap pesanan baru secara otomatis mengirim notifikasi detail ke penjual, lengkap dengan link WhatsApp yang bisa di-klik. <br>

Peta & Rute Interaktif: Menampilkan lokasi kedai dan rute dari posisi pengguna menggunakan Leaflet. <br>

Asisten AI: Chatbot yang ditenagai oleh model AI di Replicate, mampu menjawab pertanyaan seputar menu, jam buka, dan lokasi. <br>

<h2><b>Setup Instructions</b></h2>
Untuk menjalankan proyek ini secara lokal, Anda memerlukan Node.js dan pnpm (atau npm/yarn). <br>
1. Clone Repositori <br>
   
    git clone https://github.com/nama-anda/tehco-frontend.git <br> 
    cd tehco-frontend <br>
   
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Buat file .env.local di root proyek.
   Daftarkan environment variable berikut di Vercel Dashboard dan sinkronkan dengan vercel env pull:
   ```.env.local
   VITE_SUPABASE_URL="..."
   VITE_SUPABASE_ANON_KEY="..."
   REPLICATE_API_TOKEN="..."
   TELEGRAM_BOT_TOKEN="..."
   TELEGRAM_CHAT_ID="..."
   ```
4. Jalankan dengan Vercel CLI:
   Pastikan Anda sudah login ke Vercel (vercel login).
   Jalankan server development:
   ```bash
   vercel dev
   ```
   
**AI Support Explanation**
Kecerdasan Buatan (AI) diimplementasikan dalam bentuk Asisten Virtual Pelanggan untuk meningkatkan interaktivitas dan efisiensi.

Cara Penggunaan: AI diakses melalui Replicate API untuk model IBM Granite yang dipanggil dari sebuah Vercel Serverless Function (api/chatbot.ts). Pendekatan ini memastikan API Key tetap aman di sisi server. Sebuah system prompt yang mendetail memberikan AI persona, batasan pengetahuan (menu, lokasi, jam buka), dan aturan percakapan.

Dampak pada Proyek: Penggunaan AI memberikan dampak nyata dengan menyediakan layanan pelanggan otomatis 24/7. Ini mengurangi beban kerja penjual untuk menjawab pertanyaan umum dan memberikan pengalaman yang lebih modern dan memuaskan bagi pelanggan, yang pada akhirnya meningkatkan keunggulan kompetitif aplikasi.
