// File: src/hooks/useCart.ts

import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
};