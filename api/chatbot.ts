// File: api/chatbot.ts

export const config = {
  runtime: 'edge',
};

const REPLICATE_API_URL = "https://api.replicate.com/v1/models/ibm-granite/granite-3.3-8b-instruct/predictions";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { userInput } = await req.json();

  if (!userInput) {
    return new Response(JSON.stringify({ error: 'userInput is required' }), { status: 400 });
  }
  
  const API_TOKEN = process.env.REPLICATE_API_TOKEN;

  // --- INSTRUKSI UTAMA DALAM BAHASA INDONESIA ---
  const systemPrompt = `Kamu adalah 'Teh Ceria', asisten virtual yang ramah untuk kedai minum bernama 'Teh Solo OCHA'. Pengetahuanmu hanya sebatas informasi berikut.
- Menu Minuman: 
  1. Es Milk Tea (Rp 5.000), 
  2. Es Teh Solo Jumbo (Rp 4.000), 
  3. Es Teh Solo Kecil (Rp 3.000), 
  4. Es Lemon Tea (Rp 6.000), 
  5. Es Jeruk Peras Kecil (Rp 5.000), 
  6. Es Jeruk Peras Jumbo (Rp 7.000), 
  7. Es Teh Jeruk Nipis (Rp 5.000), 
  8. Es Teh Jeruk Peras (Rp 5.000).
- Komposisi : Menggunakan Teh Berkualitas Tinggi dengan Gula GMP (Gunung Madu Plantation), Buah Lemon dan Jeruk Peras yang sangat segar berkualitas, Menggunakan susu yang sangat lezat dengan manis sangat pas.
- Lokasi: Jl. Pedati Raya No.10B 15, RT.15/RW.7, Cipinang Cempedak, Kecamatan Jatinegara, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13340. Tepatnya didepan Gedung Wihdatul Muslimat. Jarak bisa dilihat di peta pada website.
- Jam Buka: Setiap hari dari jam 08:00 pagi sampai jam 19:00 malam.
Aturan: 
Kalau ditanya menu, jawabnya harus menu.
Kalau ditanya komposisi, jawabnya harus komposisi.
Kalau ditanya lokasi, jawabnya harus lokasi.
Kalau ditanya jam buka toko maka jawabnya jam buka toko.
Gunakan sapaan sesuai waktu sekarang di Jakarta.
JANGAN menjawab pertanyaan di luar topik Teh Solo OCHA. Tolak dengan sopan. Jawablah selalu dalam Bahasa Indonesia.`;

  // --- FORMAT PERTANYAAN DALAM BAHASA INDONESIA ---
  const prompt = `${systemPrompt}\n\nPertanyaan: ${userInput}\nJawaban:`;


  if (!API_TOKEN) {
    return new Response(JSON.stringify({ error: 'Replicate API token not configured on the server.' }), { status: 500 });
  }

  try {
    const startResponse = await fetch(REPLICATE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { 
          prompt: prompt,
          max_new_tokens: 150,
        },
      }),
    });

    let prediction = await startResponse.json();
    if (startResponse.status !== 201) {
      console.error("Replicate start error:", prediction);
      return new Response(JSON.stringify(prediction), { status: 500 });
    }

    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await sleep(1000);
      const pollResponse = await fetch(prediction.urls.get, {
        headers: { 
          "Authorization": `Token ${API_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      prediction = await pollResponse.json();
      if (pollResponse.status !== 200) {
        console.error("Replicate poll error:", prediction);
        return new Response(JSON.stringify(prediction), { status: 500 });
      }
    }

    if (prediction.status === "failed") {
      console.error("Replicate prediction failed:", prediction.error);
      return new Response(JSON.stringify({ error: "Proses AI gagal." }), { status: 500 });
    }

    const result = (prediction.output || []).join("").trim();
    return new Response(JSON.stringify({ result }), { status: 200 });

  } catch (error) {
    console.error("Catch block error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch from Replicate' }), { status: 500 });
  }
}