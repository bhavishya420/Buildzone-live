import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const LanguageToggle = ({ className = "" }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium text-foreground bg-surface hover:bg-surface/80 rounded-lg border transition-colors ${className}`}
      aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
    >
      <span className="text-base">
        {language === 'en' ? '🇮🇳' : '🇺🇸'}
      </span>
      <span>
        {language === 'en' ? 'हिंदी' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;