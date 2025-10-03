// File: api/send-telegram.ts

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  // Ambil 'message' dan 'customerWhatsapp' dari body
  const { message, customerWhatsapp } = await req.json();
  if (!message || !customerWhatsapp) {
    return new Response(JSON.stringify({ error: 'Message and customerWhatsapp are required' }), { status: 400 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return new Response(JSON.stringify({ error: 'Telegram credentials not configured' }), { status: 500 });
  }

  // Ubah nomor '08...' menjadi '628...' untuk link wa.me
  const formattedWhatsapp = customerWhatsapp.startsWith('0') 
    ? '62' + customerWhatsapp.substring(1) 
    : customerWhatsapp;
  
  const whatsappLink = `https://wa.me/${formattedWhatsapp}`;
  
  // Ganti baris WhatsApp di dalam pesan dengan format link Markdown
  const finalMessage = message.replace(
    `*WhatsApp:* ${customerWhatsapp}`,
    `*WhatsApp:* [${customerWhatsapp}](${whatsappLink})`
  );

  const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: finalMessage, // Gunakan pesan yang sudah memiliki link
        parse_mode: 'Markdown'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return new Response(JSON.stringify({ error: 'Failed to send message to Telegram' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("Catch block error:", error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}