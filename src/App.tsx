// File: src/App.tsx

import HomePage from "./pages/HomePage";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    // LANGKAH 1: Pastikan AuthProvider adalah provider terluar
    <AuthProvider>
      <CartProvider>
        <HomePage />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;