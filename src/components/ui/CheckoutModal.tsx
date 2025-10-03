// File: src/components/ui/CheckoutModal.tsx

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { name: string; whatsapp: string }) => void;
  isLoading: boolean;
  userName?: string;
}

const CheckoutModal = ({ isOpen, onClose, onSubmit, isLoading, userName }: CheckoutModalProps) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Efek untuk mengisi nama secara otomatis saat modal terbuka
  useEffect(() => {
    if (isOpen && userName) {
      setName(userName);
    }
    // Mengosongkan form saat modal ditutup
    if (!isOpen) {
      setName('');
      setWhatsapp('');
    }
  }, [isOpen, userName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && whatsapp) {
      onSubmit({ name, whatsapp });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[10002] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-sora text-white">Detail Pemesan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          <div className="mb-8">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-2">Nomor WhatsApp</label>
            <input 
              type="tel" 
              id="whatsapp" 
              value={whatsapp} 
              onChange={e => setWhatsapp(e.target.value)} 
              required 
              placeholder="cth: 08123456789" 
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-teal-500 text-black font-bold py-3 rounded-lg hover:bg-teal-400 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Mengirim Pesanan...' : 'Kirim Pesanan'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;