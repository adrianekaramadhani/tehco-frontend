// File: src/contexts/AuthContext.tsx

import { createContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../config/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Hapus import useCart

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Hapus pemanggilan useCart

  useEffect(() => {
    // Cek sesi awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listener hanya bertugas mengupdate sesi dan user
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Hapus dependensi

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error logging in with Google:', error);
  };

  const signOut = async () => {
    // Fungsi ini sekarang hanya bertugas untuk signOut
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, session, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};