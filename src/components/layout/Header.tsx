// File: src/components/layout/Header.tsx

import { useState } from 'react';
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

const Header = () => {
  const { totalItems, openCart } = useCart();
  const { user, signInWithGoogle, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : <UserIcon size={20} />;

  return (
    <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <div className="text-2xl font-bold font-sora text-white">
          TEH SOLO<span className="text-teal-400"> OCHA</span>
        </div>

        {/* Grup Tombol di Kanan */}
        <div className="flex items-center gap-6">
          
          {/* Ikon Keranjang */}
          <button onClick={openCart} className="relative text-white hover:text-teal-400 transition-colors">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-black">
                {totalItems}
              </span>
            )}
          </button>

          {/* Tombol Login atau Profil Pengguna */}
          {user ? (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                <span className="hidden md:block text-sm">{userName}</span>
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full"
                    referrerPolicy="no-referrer" // <-- PERBAIKAN DI SINI
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold">{userInitial}</span>
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  <button onClick={signOut} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="text-sm font-semibold bg-teal-500 text-black px-4 py-2 rounded-lg hover:bg-teal-400 transition-colors">
              Login
            </button>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;