import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { ShieldCheck } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-aurum-bg flex flex-col items-center justify-center text-aurum-gold gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-aurum-gold/20 border-t-aurum-gold animate-spin flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-aurum-gold" />
        </div>
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold animate-pulse">
          Verificando Autenticação...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
