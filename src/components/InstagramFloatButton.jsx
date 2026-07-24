import React from 'react';
import { FaInstagram } from 'react-icons/fa';

export default function InstagramFloatButton() {
  return (
    <a
      href="https://www.instagram.com/mfalfaiataria/"
      target="_blank"
      rel="noreferrer"
      aria-label="Instagram MF Alfaiataria"
      className="fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-[14px] sm:rounded-2xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-[0_0_20px_rgba(225,48,108,0.5)] transition-all duration-300"
    >
      <FaInstagram className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-sm" />
    </a>
  );
}
