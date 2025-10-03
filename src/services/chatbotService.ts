// File: src/services/chatbotService.ts

export async function getChatbotResponse(userInput: string): Promise<string> {
  try {
    // Panggil server perantara kita. Kita hanya perlu mengirim input dari pengguna.
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Body sekarang lebih sederhana, hanya berisi userInput
      body: JSON.stringify({
        userInput: userInput,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error || "Gagal menghubungi server perantara.";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.result || "Gagal mendapatkan respons dari AI.";

  } catch (error) {
    console.error("Error in getChatbotResponse:", error);
    if (error instanceof Error) {
        return error.message;
    }
    return "Terjadi kesalahan yang tidak diketahui.";
  }
}