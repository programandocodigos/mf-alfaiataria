import React from 'react';
import { Crown, Phone, Mail, MapPin, ShieldCheck, Award, Clock } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function Footer({ onSelectCategory }) {
  return (
    <footer className="bg-aurum-bg border-t border-aurum-gold/20 text-gray-400 text-xs">
      
      {/* Upper Brand Guarantees Banner */}
      <div className="border-b border-aurum-border/60 py-10 px-4 sm:px-8 bg-aurum-card/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 rounded-full bg-aurum-surface border border-aurum-gold/30 text-aurum-gold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Lã Fria 100% Italiana</h4>
              <p className="text-gray-400 text-[11px]">Tecidos nobres homologados Biella &amp; Como</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 rounded-full bg-aurum-surface border border-aurum-gold/30 text-aurum-gold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Atendimento Privativo</h4>
              <p className="text-gray-400 text-[11px]">Consultores de imagem via agendamento</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 rounded-full bg-aurum-surface border border-aurum-gold/30 text-aurum-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Ajustes Gratuitos</h4>
              <p className="text-gray-400 text-[11px]">Bainhas e cintura sem custo nos ateliês</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="p-3 rounded-full bg-aurum-surface border border-aurum-gold/30 text-aurum-gold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-white text-sm">Entrega VIP</h4>
              <p className="text-gray-400 text-[11px]">Transporte com capa e cabide em madeira</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectCategory('todos')}>
            <img 
              src={logoImg} 
              alt="MF Alfaiataria Logo" 
              className="w-12 h-12 flex-shrink-0 aspect-square rounded-full object-contain bg-aurum-bg border border-aurum-gold/40"
            />
            <span className="font-serif font-bold text-xl tracking-widest text-white block uppercase">
              MF <span className="text-aurum-gold font-light">ALFAIATARIA</span>
            </span>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
            Fundada sob os pilares da tradição alfaiate milanesa e da elegância contemporânea. 
            Criamos ternos, blazers e camisas sob medida para homens de presença e liderança.
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" className="w-9 h-9 rounded-full bg-aurum-surface border border-aurum-border flex items-center justify-center text-gray-300 hover:text-aurum-gold hover:border-aurum-gold transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" className="w-9 h-9 rounded-full bg-aurum-surface border border-aurum-border flex items-center justify-center text-gray-300 hover:text-aurum-gold hover:border-aurum-gold transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Collections Links */}
        <div>
          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-aurum-gold">
            Coleções
          </h4>
          <ul className="space-y-2.5">
            {CATEGORIES.map(cat => (
              <li key={cat.id}>
                <button
                  onClick={() => onSelectCategory(cat.id)}
                  className="hover:text-aurum-gold transition-colors text-left"
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Ateliê Stores */}
        <div>
          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-aurum-gold">
            Nossos Ateliês
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-aurum-gold flex-shrink-0 mt-0.5" />
              <span>Av. Brigadeiro Faria Lima, 3477 — Itaim Bibi, São Paulo - SP</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-aurum-gold flex-shrink-0 mt-0.5" />
              <span>Shopping VillageMall — Barra da Tijuca, Rio de Janeiro - RJ</span>
            </li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider mb-4 text-aurum-gold">
            Atendimento VIP
          </h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-aurum-gold" />
              <a href="https://wa.me/5511963497168" target="_blank" rel="noreferrer" className="hover:text-aurum-gold transition-colors">
                (11) 96349-7168
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-aurum-gold" />
              <span>concierge@mfalfaiataria.com.br</span>
            </li>
            <li className="pt-2 text-[11px] text-gray-500">
              Segunda a Sábado: 10h às 21h <br />
              Domingos: Atendimento por Agendamento
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-aurum-border/60 py-6 px-4 text-center text-[11px] text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MF Alfaiataria. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4 text-aurum-gold-champagne">
            <span>Termos de Serviço</span>
            <span>•</span>
            <span>Política de Privacidade</span>
            <span>•</span>
            <span>Sartorial Heritage</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
