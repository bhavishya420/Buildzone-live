// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState("en");
  const t = (k) => {
    // minimal translation stub
    const translations = {
      en: { welcome_message: "Welcome to BuildZone" },
      hi: { welcome_message: "BuildZone में आपका स्वागत है" },
    };
    return translations[lang]?.[k] ?? k;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
