"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="w-full pt-16 pb-12 px-6 flex flex-col items-center justify-center bg-[#EEEEEE] dark:bg-[#121212] border-t border-surface-container">
      
      {/* Information Dropdowns */}
      <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center mb-16">
        
        {/* Payment Methods */}
        <div className="flex flex-col w-full sm:w-64">
          <button 
            onClick={() => toggleSection('payment')}
            className="flex justify-between items-center py-3 border-b border-black/30 dark:border-white/30 hover:border-black dark:hover:border-white transition-colors"
          >
            <span className="font-label text-xs uppercase tracking-[0.2em] font-bold text-[#000000] dark:text-[#FFFFFF]">Payment Methods</span>
            <span className="material-symbols-outlined text-[#747878] dark:text-[#909393] text-sm transition-transform duration-300" style={{ transform: openSection === 'payment' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'payment' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center gap-4 py-2">
              <div className="flex flex-col gap-2 w-full">
                {/* Minimalist Logo Representations */}
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 border border-outline-variant/50 bg-white shadow-sm flex items-center justify-center w-20">
                    <span className="font-extrabold text-[10px] text-[#ED0226] italic tracking-wider">QRIS</span>
                  </div>
                  <div className="px-3 py-1.5 border border-outline-variant/50 bg-white shadow-sm flex items-center justify-center w-20">
                    <span className="font-black text-[10px] text-[#00529C] tracking-wide">BRI</span>
                  </div>
                  <div className="px-3 py-1.5 border border-outline-variant/50 bg-white shadow-sm flex items-center justify-center w-20">
                    <span className="font-extrabold text-[10px] text-[#118EEA] tracking-wider italic">DANA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Partners */}
        <div className="flex flex-col w-full sm:w-64">
          <button 
            onClick={() => toggleSection('shipping')}
            className="flex justify-between items-center py-3 border-b border-black/30 dark:border-white/30 hover:border-black dark:hover:border-white transition-colors"
          >
            <span className="font-label text-xs uppercase tracking-[0.2em] font-bold text-[#000000] dark:text-[#FFFFFF]">Shipping</span>
            <span className="material-symbols-outlined text-[#747878] dark:text-[#909393] text-sm transition-transform duration-300" style={{ transform: openSection === 'shipping' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'shipping' ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 border border-outline-variant/50 bg-white shadow-sm flex items-center justify-center w-20">
                  <span className="font-black text-[12px] text-[#002561] italic tracking-tighter">JNE</span>
                </div>
                <div className="px-3 py-1.5 border border-outline-variant/50 bg-[#E3000F] shadow-sm flex items-center justify-center w-20">
                  <span className="font-black text-[12px] text-white italic tracking-tighter">J&T</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex space-x-8 mb-8">
        <Link href="https://www.instagram.com/uppermoon.supply/" target="_blank" rel="noopener noreferrer" className="text-[0.6875rem] tracking-widest uppercase font-bold text-[#747878] dark:text-[#909393] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors">Instagram</Link>
        <Link href="https://www.tokopedia.com/uppermoonsupply" target="_blank" rel="noopener noreferrer" className="text-[0.6875rem] tracking-widest uppercase font-bold text-[#747878] dark:text-[#909393] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors">Tokopedia</Link>
      </div>
      <p className="text-[0.6875rem] tracking-widest uppercase text-[#747878] dark:text-[#909393]">
        © UPPERMOON. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
