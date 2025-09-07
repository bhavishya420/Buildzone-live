// src/contexts/LanguageContext.jsx
import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  const t = (key) => {
    const dictionary = {
      en: { cart: "Cart", checkout: "Checkout", total: "Total" },
      hi: { cart: "कार्ट", checkout: "चेकआउट", total: "कुल" }
    };
    return dictionary[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
