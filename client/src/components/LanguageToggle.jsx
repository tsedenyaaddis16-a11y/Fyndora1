import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

export const LanguageToggle = ({ variant = 'dropdown' }) => {
  const { language, setLanguage, toggleLanguage, isAmharic } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Simple direct button toggle (used on mobile or compact areas)
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-bold border border-slate-200 dark:border-slate-700"
        title={isAmharic ? 'ወደ እንግሊዝኛ ቀይር (Switch to English)' : 'ወደ አማርኛ ቀይር (Switch to Amharic)'}
        aria-label="Toggle language"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-500" />
        <span>{isAmharic ? 'አማ' : 'EN'}</span>
      </button>
    );
  }

  // Interactive Dropdown Menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-700/80"
        title="Select Language / ቋንቋ ይምረጡ"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-bold">
          {language === 'am' ? 'አማርኛ' : 'EN'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 py-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Language / ቋንቋ
          </div>

          <button
            type="button"
            onClick={() => {
              setLanguage('en');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
              language === 'en'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English</span>
            </div>
            {language === 'en' && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage('am');
              setIsOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
              language === 'am'
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/50 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇪🇹</span>
              <span>አማርኛ (Amharic)</span>
            </div>
            {language === 'am' && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
          </button>
        </div>
      )}
    </div>
  );
};
