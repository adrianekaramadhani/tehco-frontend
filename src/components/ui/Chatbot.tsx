// File: src/components/ui/Chatbot.tsx

import { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { getChatbotResponse } from '../../services/chatbotService';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Fungsi untuk mendapatkan sapaan berdasarkan waktu
const getGreeting = (): string => {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Selamat Pagi";
  }
  if (currentHour >= 12 && currentHour < 15) {
    return "Selamat Siang";
  }
  if (currentHour >= 15 && currentHour < 18) {
    return "Selamat Sore";
  }
  return "Selamat Malam";
};

// Pesan sapaan awal yang akan ditampilkan
const initialMessage: Message = {
  sender: 'bot',
  text: `${getGreeting()}! Halo, Saya Ceria. Ada yang bisa saya bantu? Silakan tanya tentang menu, lokasi, atau jam buka kami.`
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Gunakan pesan sapaan sebagai state awal untuk messages
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botResponse = await getChatbotResponse(input);
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { text: "Maaf, terjadi kesalahan.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-96 bg-[#1A202C] rounded-xl shadow-2xl flex flex-col mb-4">
          <div className="p-3 bg-gray-800 rounded-t-xl flex items-center gap-2">
            <Bot className="text-teal-400" />
            <h3 className="font-bold text-white">Asisten Teh Solo <span className="text-teal-400"> OCHA</span></h3>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-teal-600' : 'bg-gray-200'}`}>
                  {msg.text}
                </p>
              </div>
            ))}
            {isLoading && <p className="text-gray-400 text-sm">Asisten sedang mengetik...</p>}
          </div>

          <div className="p-2 border-t border-gray-700 flex">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik pesan..."
              className="flex-1 bg-gray-400 rounded-l-md p-2 focus:outline-none"
            />
            <button onClick={handleSend} className="bg-teal-500 rounded-r-md px-4 hover:bg-teal-400">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className="bg-teal-500 text-black rounded-full p-4 shadow-lg hover:bg-teal-400 transition-transform hover:scale-110">
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>
    </div>
  );
};

export default Chatbot;