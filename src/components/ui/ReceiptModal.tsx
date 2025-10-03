// File: src/components/ui/ReceiptModal.tsx

import { X } from 'lucide-react';
// --- PERBAIKI PATH IMPORT DI SINI ---
import type { CartItem } from '../../contexts/CartContext';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  customer: { name: string; whatsapp: string };
  onSendToTelegram: () => Promise<void>;
  isSending: boolean;
}

const ReceiptModal = ({ isOpen, onClose, cart, totalPrice, customer, onSendToTelegram, isSending }: ReceiptModalProps) => {
  if (!isOpen) return null;

  // --- FUNGSI generateReceiptText DIHAPUS KARENA TIDAK DIGUNAKAN LAGI DI SINI ---

  return (
    <div className="fixed inset-0 bg-black/70 z-[10002] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-sora text-white">Struk Pesanan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X /></button>
        </div>

        {/* Area Struk */}
        <div className="bg-gray-100 text-black p-4 rounded-md font-mono text-sm mb-6 whitespace-pre-wrap">
          <p>Nama: {customer.name}</p>
          <p>WhatsApp: {customer.whatsapp}</p>
          <hr className="border-gray-400 my-2" />
          <p>Pesanan:</p>
          {cart.map(item => (
            <p key={item.id}>- {item.name} (x{item.quantity})</p>
          ))}
          <hr className="border-gray-400 my-2" />
          <p className="font-bold">Total: Rp {totalPrice.toLocaleString('id-ID')}</p>
        </div>

        <button
          onClick={onSendToTelegram}
          disabled={isSending}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-400 transition-colors disabled:bg-gray-500"
        >
          {isSending ? 'Mengirim...' : 'Kirim Notifikasi ke Penjual (via Telegram)'}
        </button>
      </div>
    </div>
  );
};

export default ReceiptModal;