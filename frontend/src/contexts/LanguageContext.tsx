import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    plans: 'Plans',
    profile: 'Profile',
    support: 'Support',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    welcome: 'Welcome to Subscription Manager',
    chooseRole: 'Choose Your Role',
    userRole: 'I am a User',
    adminRole: 'I am an Admin',
    
    // Dashboard
    activeSubscription: 'Active Subscription',
    subscribe: 'Subscribe',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    cancel: 'Cancel',
    applyDiscount: 'Apply Discount Code',
    
    // Plans
    basic: 'Basic',
    gold: 'Gold',
    platinum: 'Platinum',
    monthlyPrice: 'Monthly Price',
    features: 'Features',
    
    // Common
    save: 'Save',
    loading: 'Loading...',
    success: 'Success!',
    error: 'Error occurred',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    plans: 'योजनाएं',
    profile: 'प्रोफाइल',
    support: 'सहायता',
    logout: 'लॉगआउट',
    
    login: 'लॉगिन',
    register: 'रजिस्टर',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    welcome: 'सब्स्क्रिप्शन मैनेजर में आपका स्वागत है',
    chooseRole: 'अपनी भूमिका चुनें',
    userRole: 'मैं एक उपयोगकर्ता हूं',
    adminRole: 'मैं एक एडमिन हूं',
    
    activeSubscription: 'सक्रिय सब्स्क्रिप्शन',
    subscribe: 'सब्स्क्राइब करें',
    upgrade: 'अपग्रेड',
    downgrade: 'डाउनग्रेड',
    cancel: 'रद्द करें',
    applyDiscount: 'डिस्काउंट कोड लागू करें',
    
    basic: 'बेसिक',
    gold: 'गोल्ड',
    platinum: 'प्लेटिनम',
    monthlyPrice: 'मासिक मूल्य',
    features: 'विशेषताएं',
    
    save: 'सेव करें',
    loading: 'लोड हो रहा है...',
    success: 'सफल!',
    error: 'त्रुटि हुई',
  },
  te: {
    dashboard: 'డ్యాష్‌బోర్డ్',
    plans: 'ప్లాన్‌లు',
    profile: 'ప్రొఫైల్',
    support: 'మద్దతు',
    logout: 'లాగ్ అవుట్',
    
    login: 'లాగిన్',
    register: 'రిజిస్టర్',
    email: 'ఇమెయిల్',
    password: 'పాస్‌వర్డ్',
    name: 'పేరు',
    welcome: 'సబ్‌స్క్రిప్షన్ మేనేజర్‌కు స్వాగతం',
    chooseRole: 'మీ పాత్రను ఎంచుకోండి',
    userRole: 'నేను వినియోగదారుని',
    adminRole: 'నేను అడ్మిన్‌ని',
    
    activeSubscription: 'క్రియాశీల సబ్‌స్క్రిప్షన్',
    subscribe: 'సబ్‌స్క్రైబ్ చేయండి',
    upgrade: 'అప్‌గ్రేడ్',
    downgrade: 'డౌన్‌గ్రేడ్',
    cancel: 'రద్దు చేయండి',
    applyDiscount: 'డిస్కౌంట్ కోడ్ వర్తింపజేయండి',
    
    basic: 'బేసిక్',
    gold: 'గోల్డ్',
    platinum: 'ప్లాటినం',
    monthlyPrice: 'నెలవారీ ధర',
    features: 'లక్షణాలు',
    
    save: 'భద్రపరచండి',
    loading: 'లోడవుతోంది...',
    success: 'విజయవంతం!',
    error: 'లోపం సంభవించింది',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};