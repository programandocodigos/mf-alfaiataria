import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Lock, Mail, ShieldAlert, ArrowLeft, LogIn, Crown } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error("Erro no login:", err);
      let errorMsg = 'Falha ao realizar login. Verifique seu e-mail e senha.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMsg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Muitas tentativas malsucedidas. Tente novamente mais tarde.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Por favor, insira um e-mail válido.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aurum-bg flex items-center justify-center p-4 selection:bg-aurum-gold/30 selection:text-aurum-gold-light relative overflow-hidden">
      
      {/* Background Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-aurum-gold/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-aurum-card border border-aurum-gold/30 rounded-2xl p-8 shadow-gold-glow relative z-10 animate-fadeIn">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-aurum-gold/50 shadow-gold-sm mb-4">
            <img src={logoImg} alt="MF Alfaiataria" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1 text-aurum-gold text-xs font-semibold tracking-widest uppercase mb-1">
            <Crown className="w-3.5 h-3.5" />
            <span>Área Restrita</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-serif">Painel Administrativo</h1>
          <p className="text-xs text-gray-400 mt-1">Acesso exclusivo para gestão da MF Alfaiataria</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-3 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              E-mail Administrativo
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aurum-gold/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mfalfaiataria.com.br"
                className="w-full bg-aurum-surface border border-aurum-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aurum-gold/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-aurum-surface border border-aurum-border rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-aurum-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-aurum-gold-dark via-aurum-gold to-aurum-gold-light text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-aurum-border/60 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-aurum-gold transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o site público</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
