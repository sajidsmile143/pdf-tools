
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className={`font-bold text-xl text-gray-900 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('app.title')}
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                {language === 'ur' ? 'English' : 'اردو'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
