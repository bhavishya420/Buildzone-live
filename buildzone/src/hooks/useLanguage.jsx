// src/hooks/useLanguage.js
import React, { useState, useContext, createContext, useEffect, useMemo } from "react";

const LanguageContext = createContext(null);

// Hook to consume language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

// Provider that wraps the app
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  // Load saved language once on mount (guard for environments without window)
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("selectedLanguage") : null;
      if (saved) setLanguage(saved);
    } catch (e) {
      // ignore localStorage access errors (e.g. private mode)
    }
  }, []);

  // Persist language change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") localStorage.setItem("selectedLanguage", language);
    } catch (e) {
      // ignore write errors
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"));
  };

  // translations memoized by language
  const t = useMemo(() => {
    const translations = {
      en: {
        // Navigation
        home: "Home",
        products: "Products",
        cart: "Cart",
        checkout: "Checkout",
        profile: "Profile",
        orders: "Orders",
        community: "Community",
        categories: "Categories",
        offers: "Offers",

        // Cart & Checkout
        addToCart: "Add to Cart",
        quantity: "Quantity",
        total: "Total",
        placeOrderDemo: "Place Order (Demo)",
        orderPlaced: "Order Placed Successfully",
        emptyCart: "Your cart is empty",

        // BNPL
        applyForCredit: "Apply for Credit",
        bnplApplication: "BNPL Application",
        fullName: "Full Name",
        shopName: "Shop Name",
        panNumber: "PAN Number",
        gstDocument: "GST Document",
        requestedLimit: "Requested Limit",
        submitApplication: "Submit Application",
        applicationSubmitted: "Application Submitted Successfully",

        // General
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",
        loading: "Loading...",
        error: "Error",
        success: "Success",

        // Hero Banner
        uploadBanner: "Upload Banner",
        bannerImage: "Banner Image",
        targetUrl: "Target URL",
        publishBanner: "Publish Banner",
        bannerPublished: "Banner Published Successfully",
      },
      hi: {
        // Navigation
        home: "होम",
        products: "उत्पाद",
        cart: "कार्ट",
        checkout: "चेकआउट",
        profile: "प्रोफाइल",
        orders: "ऑर्डर",
        community: "कम्यूनिटी",
        categories: "श्रेणियां",
        offers: "ऑफर",

        // Cart & Checkout
        addToCart: "कार्ट में जोड़ें",
        quantity: "मात्रा",
        total: "कुल",
        placeOrderDemo: "ऑर्डर दें (डेमो)",
        orderPlaced: "ऑर्डर सफलतापूर्वक दिया गया",
        emptyCart: "आपका कार्ट खाली है",

        // BNPL
        applyForCredit: "क्रेडिट के लिए आवेदन करें",
        bnplApplication: "BNPL आवेदन",
        fullName: "पूरा नाम",
        shopName: "दुकान का नाम",
        panNumber: "पैन नंबर",
        gstDocument: "जीएसटी दस्तावेज़",
        requestedLimit: "मांगी गई सीमा",
        submitApplication: "आवेदन जमा करें",
        applicationSubmitted: "आवेदन सफलतापूर्वक जमा किया गया",

        // General
        save: "सेव करें",
        cancel: "रद्द करें",
        submit: "जमा करें",
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफलता",

        // Hero Banner
        uploadBanner: "बैनर अपलोड करें",
        bannerImage: "बैनर इमेज",
        targetUrl: "टार्गेट URL",
        publishBanner: "बैनर प्रकाशित करें",
        bannerPublished: "बैनर सफलतापूर्वक प्रकाशित किया गया",
      },
    };

    // translator function using current language (closed over below)
    return (key) => {
      return translations?.[language]?.[key] ?? key;
    };
  }, [language]);

  const contextValue = {
    language,
    toggleLanguage,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}
