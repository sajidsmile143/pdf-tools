
import React, { createContext, useContext, useState, useCallback } from 'react';

interface LanguageContextType {
  language: 'en' | 'ur';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'app.title': 'PDFRide',
    'app.subtitle': 'Free PDF Tools for Pakistan',
    'header.language': 'اردو',
    'header.dashboard': 'Dashboard',
    'header.donate': 'Donate',
    
    // Home
    'home.title': 'Free PDF Tools',
    'home.subtitle': 'Process your PDFs without limits. No registration required.',
    'home.features': 'No file size limits • Completely free • Urdu/English support',
    
    // Tools
    'tools.merge': 'Merge PDF',
    'tools.merge.desc': 'Combine multiple PDFs into one',
    'tools.split': 'Split PDF',
    'tools.split.desc': 'Extract pages from PDF',
    'tools.compress': 'Compress PDF',
    'tools.compress.desc': 'Reduce PDF file size',
    'tools.convert': 'Convert PDF',
    'tools.convert.desc': 'Convert PDF to Word, Excel, JPG',
    'tools.ocr': 'OCR',
    'tools.ocr.desc': 'Extract text from scanned PDFs',
    'tools.esign': 'E-Sign',
    'tools.esign.desc': 'Add digital signatures',
    
    // Common
    'common.upload': 'Upload Files',
    'common.download': 'Download',
    'common.processing': 'Processing...',
    'common.back': 'Back to Home',
    'common.support': 'Support Us',
    
    // Dashboard
    'dashboard.title': 'Your Dashboard',
    'dashboard.recent': 'Recent Files',
    'dashboard.stats': 'Statistics',
    
    // Donation
    'donate.title': 'Support PDFRide',
    'donate.subtitle': 'Help us keep PDF tools free for everyone',
    'donate.jazzcash': 'JazzCash',
    'donate.easypaisa': 'Easypaisa'
  },
  ur: {
    // Header
    'app.title': 'پی ڈی ایف رائیڈ',
    'app.subtitle': 'پاکستان کے لیے مفت پی ڈی ایف ٹولز',
    'header.language': 'English',
    'header.dashboard': 'ڈیش بورڈ',
    'header.donate': 'عطیہ',
    
    // Home
    'home.title': 'مفت پی ڈی ایف ٹولز',
    'home.subtitle': 'بغیر کسی حد کے اپنی پی ڈی ایف فائلوں کو پروسیس کریں۔ رجسٹریشن کی ضرورت نہیں۔',
    'home.features': 'فائل سائز کی حد نہیں • مکمل طور پر مفت • اردو/انگریزی سپورٹ',
    
    // Tools
    'tools.merge': 'پی ڈی ایف جوڑیں',
    'tools.merge.desc': 'متعدد پی ڈی ایف کو ایک میں جوڑیں',
    'tools.split': 'پی ڈی ایف تقسیم کریں',
    'tools.split.desc': 'پی ڈی ایف سے صفحات نکالیں',
    'tools.compress': 'پی ڈی ایف کمپریس کریں',
    'tools.compress.desc': 'پی ڈی ایف فائل سائز کم کریں',
    'tools.convert': 'پی ڈی ایف کنورٹ کریں',
    'tools.convert.desc': 'پی ڈی ایف کو ورڈ، ایکسل، جے پی جی میں تبدیل کریں',
    'tools.ocr': 'او سی آر',
    'tools.ocr.desc': 'اسکین شدہ پی ڈی ایف سے ٹیکسٹ نکالیں',
    'tools.esign': 'ای سائن',
    'tools.esign.desc': 'ڈیجیٹل دستخط شامل کریں',
    
    // Common
    'common.upload': 'فائلیں اپ لوڈ کریں',
    'common.download': 'ڈاؤن لوڈ',
    'common.processing': 'پروسیسنگ...',
    'common.back': 'ہوم واپس جائیں',
    'common.support': 'ہماری مدد کریں',
    
    // Dashboard
    'dashboard.title': 'آپ کا ڈیش بورڈ',
    'dashboard.recent': 'حالیہ فائلیں',
    'dashboard.stats': 'اعداد و شمار',
    
    // Donation
    'donate.title': 'پی ڈی ایف رائیڈ کی مدد کریں',
    'donate.subtitle': 'سب کے لیے پی ڈی ایف ٹولز مفت رکھنے میں ہماری مدد کریں',
    'donate.jazzcash': 'جاز کیش',
    'donate.easypaisa': 'ایزی پیسہ'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  }, []);

  const t = useCallback((key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key;
  }, [language]);

  const value = {
    language,
    toggleLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
