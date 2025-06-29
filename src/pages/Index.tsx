import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import ToolIcon from '@/components/ToolIcon';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { language, t } = useLanguage();

  const tools = [
    
    // PDF to other formats
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      desc: 'Convert PDF to editable Word documents',
      path: '/pdf-to-word',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'pdf-to-powerpoint',
      name: 'PDF to PowerPoint',
      desc: 'Convert PDF to PowerPoint presentations',
      path: '/pdf-to-powerpoint',
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      desc: 'Extract data from PDF to Excel spreadsheets',
      path: '/pdf-to-excel',
      color: 'from-green-500 to-green-700'
    },
    // Other formats to PDF
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      desc: 'Convert Word documents to PDF',
      path: '/word-to-pdf',
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: 'powerpoint-to-pdf',
      name: 'PowerPoint to PDF',
      desc: 'Convert PowerPoint to PDF',
      path: '/powerpoint-to-pdf',
      color: 'from-orange-600 to-orange-800'
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      desc: 'Convert Excel spreadsheets to PDF',
      path: '/excel-to-pdf',
      color: 'from-green-600 to-green-800'
    },
    // Image tools
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      desc: 'Convert PDF pages to JPG images',
      path: '/pdf-to-jpg',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      desc: 'Convert JPG images to PDF',
      path: '/jpg-to-pdf',
      color: 'from-purple-500 to-purple-700'
    },
    // Advanced tools
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      desc: 'Add text, images and annotations to PDF',
      path: '/edit-pdf',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF',
      desc: 'Add electronic signatures to PDF',
      path: '/sign-pdf',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'watermark-pdf',
      name: 'Watermark PDF',
      desc: 'Add watermarks to PDF documents',
      path: '/watermark-pdf',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      desc: 'Rotate PDF pages to any angle',
      path: '/rotate-pdf',
      color: 'from-teal-400 to-teal-600'
    },
    // Security tools
    {
      id: 'unlock-pdf',
      name: 'Unlock PDF',
      desc: 'Remove password protection from PDF',
      path: '/unlock-pdf',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'protect-pdf',
      name: 'Protect PDF',
      desc: 'Add password protection to PDF',
      path: '/protect-pdf',
      color: 'from-red-500 to-red-700'
    },
    // Organization tools
    {
      id: 'organize-pdf',
      name: 'Organize PDF',
      desc: 'Reorder, delete or add PDF pages',
      path: '/organize-pdf',
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'page-numbers',
      name: 'Page Numbers',
      desc: 'Add page numbers to PDF documents',
      path: '/page-numbers',
      color: 'from-slate-400 to-slate-600'
    },
    // Utility tools
    {
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      desc: 'Convert web pages to PDF',
      path: '/html-to-pdf',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      id: 'ocr-pdf',
      name: 'OCR PDF',
      desc: 'Extract text from scanned PDFs',
      path: '/ocr-pdf',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'repair-pdf',
      name: 'Repair PDF',
      desc: 'Fix corrupted PDF files',
      path: '/repair-pdf',
      color: 'from-rose-400 to-rose-600'
    },
    {
      id: 'crop-pdf',
      name: 'Crop PDF',
      desc: 'Crop PDF pages to custom size',
      path: '/crop-pdf',
      color: 'from-violet-400 to-violet-600'
    },
    // Core PDF tools
    {
      id: 'merge',
      name: 'tools.merge',
      desc: 'tools.merge.desc',
      path: '/merge',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 'split',
      name: 'tools.split',
      desc: 'tools.split.desc',
      path: '/split',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'compress',
      name: 'tools.compress',
      desc: 'tools.compress.desc',
      path: '/compress',
      color: 'from-green-400 to-green-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pakistan-green-600 to-pakistan-green-500 bg-clip-text text-transparent ${
            language === 'ur' ? 'font-urdu' : 'font-inter'
          }`}>
            {t('home.title')}
          </h1>
          <p className={`text-xl text-gray-600 mb-8 leading-relaxed ${
            language === 'ur' ? 'font-urdu' : 'font-inter'
          }`}>
            {t('home.subtitle')}
          </p>
          <div className={`flex items-center justify-center space-x-4 text-sm text-gray-500 mb-12 ${
            language === 'ur' ? 'font-urdu' : 'font-inter'
          }`}>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-pakistan-green-500" />
              <span>{t('home.features').split(' • ')[0]}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-pakistan-green-500" />
              <span>{t('home.features').split(' • ')[1]}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-pakistan-green-500" />
              <span>{t('home.features').split(' • ')[2]}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} to={tool.path} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <ToolIcon type={tool.id as any} className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 group-hover:text-pakistan-green-600 transition-colors ${
                      language === 'ur' ? 'font-urdu' : 'font-inter'
                    }`}>
                      {tool.name}
                    </h3>
                    <p className={`text-gray-600 text-sm mb-3 ${
                      language === 'ur' ? 'font-urdu' : 'font-inter'
                    }`}>
                      {tool.desc}
                    </p>
                    <div className="flex items-center text-pakistan-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                      <span className={language === 'ur' ? 'font-urdu mr-2' : 'font-inter mr-2'}>
                        {language === 'ur' ? 'استعمال کریں' : 'Use Tool'}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className={`font-bold text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {t('app.title')}
                </span>
              </div>
              <p className={`text-gray-400 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {t('app.subtitle')}
              </p>
            </div>
            <div>
              <h3 className={`font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'مقبول ٹولز' : 'Popular Tools'}
              </h3>
              <div className="space-y-2">
                {tools.slice(0, 6).map((tool) => (
                  <Link key={tool.id} to={tool.path} className={`block text-gray-400 hover:text-white transition-colors ${
                    language === 'ur' ? 'font-urdu' : 'font-inter'
                  }`}>
                    {tool.name}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h3 className={`font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'رابطہ' : 'Contact'}
              </h3>
              <div className="space-y-2 text-gray-400">
                <p className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'لاہور، پاکستان ': 'Lahore, Pakistan'}
                </p>
                <p className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  sajidsmile143@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div className={`border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 ${
            language === 'ur' ? 'font-urdu' : 'font-inter'
          }`}>
            <p>© 2024 LovePDF. {language === 'ur' ? 'تمام حقوق محفوظ ہیں۔' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
