import React from 'react';
import { Languages } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export function LanguageToggle({ className = '', variant = 'pill' }) {
  const { lang, setLang, addToast } = useStudio();

  const toggleLanguage = () => {
    const nextLang = lang === 'uz' ? 'en' : 'uz';
    setLang(nextLang);
    addToast(
      nextLang === 'uz' 
        ? "Til 100% O'zbek tiliga o'tkazildi 🇺🇿" 
        : "Language switched to English 🇬🇧", 
      'success',
      2500
    );
  };

  if (variant === 'button') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono border transition-all ${
          lang === 'uz'
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
            : 'bg-studio-850 text-studio-300 border-white/10 hover:border-white/20 hover:text-white'
        } ${className}`}
        title={lang === 'uz' ? "Switch to English" : "O'zbek tiliga o'tkazish"}
      >
        <span className="text-sm">{lang === 'uz' ? '🇺🇿' : '🇬🇧'}</span>
        <span className="font-semibold">{lang === 'uz' ? "O'zbekcha" : 'English'}</span>
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center p-0.5 rounded-lg bg-studio-900 border border-white/10 ${className}`}>
      <button
        type="button"
        onClick={() => {
          if (lang !== 'uz') {
            setLang('uz');
            addToast("Til 100% O'zbek tiliga o'tkazildi 🇺🇿", 'success', 2500);
          }
        }}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
          lang === 'uz'
            ? 'bg-emerald-600 text-white font-semibold shadow-sm'
            : 'text-studio-400 hover:text-white'
        }`}
      >
        <span>🇺🇿</span>
        <span>O'zbek</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (lang !== 'en') {
            setLang('en');
            addToast("Language switched to English 🇬🇧", 'info', 2500);
          }
        }}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono transition-all ${
          lang === 'en'
            ? 'bg-indigo-600 text-white font-semibold shadow-sm'
            : 'text-studio-400 hover:text-white'
        }`}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
}
