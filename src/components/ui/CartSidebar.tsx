// File: src/components/ui/CartSidebar.tsx

import { useState } from 'react';
import { useCart } from "../../hooks/useCart";
import { useAuth } from '../../hooks/useAuth';
import { X, Trash2 } from 'lucide-react';
import { submitOrder } from '../../services/orderService';
import toast from 'react-hot-toast';
import CheckoutModal from './CheckoutModal';
import ReceiptModal from './ReceiptModal';

const CartSidebar = () => {
  const { cart, totalItems, totalPrice, removeFromCart, clearCart, isCartOpen, closeCart } = useCart();
  const { user } = useAuth();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Tambahkan 'notes' ke dalam state customerDetails
  const [customerDetails, setCustomerDetails] = useState({ name: '', whatsapp: '', notes: '' });

  // Perbarui tipe 'details' untuk menyertakan 'notes'
  const handleCheckoutSubmit = async (details: { name: string; whatsapp: string; notes: string }) => {
    if (!user) {
      toast.error("Sesi Anda berakhir, silakan login kembali.");
      return;
    }
    setIsLoading(true);
    try {
      // 'details' sekarang sudah berisi 'notes' dan akan dikirim ke submitOrder
      await submitOrder(cart, details, totalPrice, user.id);
      setCustomerDetails(details); // Simpan semua detail, termasuk notes
      setIsCheckoutOpen(false);
      setIsReceiptOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan pesanan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTelegram = async () => {
    setIsLoading(true);
    let message = `🔔 *Pesanan Baru Masuk!*\n\n`;
    message += `*Nama:* ${customerDetails.name}\n`;
    message += `*WhatsApp:* ${customerDetails.whatsapp}\n`;
    // Tambahkan notes ke pesan Telegram jika ada
    if (customerDetails.notes) {
      message += `*Catatan:* ${customerDetails.notes}\n`;
    }
    message += `\n*Detail Pesanan:*\n`;
    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) = Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
    });
    message += `\n*Total:* Rp ${totalPrice.toLocaleString('id-ID')}`;

    try {
      const response = await fetch('/api/send-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message,
          customerWhatsapp: customerDetails.whatsapp
        })
      });

      if (!response.ok) throw new Error("Gagal mengirim notifikasi.");

      toast.success('Notifikasi berhasil dikirim ke penjual!');
      
      setIsReceiptOpen(false);
      closeCart();
      clearCart();
    } catch (error) {
      toast.error("Gagal mengirim notifikasi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-[10001] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={closeCart}
      >
        <div 
          className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#1A202C] text-white shadow-xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold font-sora">Keranjang ({totalItems})</h2>
            <button onClick={closeCart} className="hover:text-teal-400">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 overflow-y-auto h-[calc(100%-150px)]">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center mt-8">Keranjang Anda kosong.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-4 mb-4">
                  <img src={item.image_url || ''} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-grow">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-[#1A202C]">
            <div className="flex justify-between items-center mb-4 font-bold">
              <span className="text-lg">Total</span>
              <span className="text-2xl text-teal-400">Rp {totalPrice.toLocaleString('id-ID')}</span>
            </div>
            <button 
              onClick={() => user ? setIsCheckoutOpen(true) : null}
              disabled={cart.length === 0 || !user}
              className="w-full bg-teal-500 text-black font-bold py-3 rounded-lg hover:bg-teal-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
              {user ? 'Lanjut ke Checkout' : 'Login untuk memesan'}
            </button>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
        isLoading={isLoading}
        userName={user?.user_metadata?.full_name}
      />

      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        cart={cart}
        totalPrice={totalPrice}
        customer={customerDetails} // customerDetails sekarang sudah berisi notes
        onSendToTelegram={handleSendTelegram}
        isSending={isLoading}
      />
    </>
  );
};

export default CartSidebar;