
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ESignPDF = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast.error(language === 'ur' ? 
          'صرف PDF فائلیں قبول ہیں' : 
          'Only PDF files are accepted'
        );
      }
    }
  };

  const handleESign = async () => {
    if (!file) {
      toast.error(language === 'ur' ? 
        'پہلے فائل منتخب کریں' : 
        'Please select a file first'
      );
      return;
    }

    setProcessing(true);

    try {
      // This is a placeholder - actual e-signing would require signature service integration
      setTimeout(() => {
        toast.info(language === 'ur' ? 
          'یہ فیچر جلد آ رہا ہے!' : 
          'This feature is coming soon!'
        );
        setProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('E-Sign error:', error);
      toast.error(language === 'ur' ? 
        'ای سائن میں خرابی' : 
        'Error with e-signing'
      );
      setProcessing(false);
    }
  };

  const resetTool = () => {
    setFile(null);
    setProcessed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-pakistan-green-600 hover:text-pakistan-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
              {t('common.back')}
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PenTool className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('tools.esign')}
            </h1>
            <p className={`text-gray-600 text-lg mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF پر الیکٹرانک دستخط کریں' : 
                'Add electronic signature to PDF'
              }
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <span className={`text-sm ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'جلد آ رہا ہے!' : 'Coming Soon!'}
              </span>
            </div>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pakistan-green-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'پی ڈی ایف فائل اپ لوڈ کریں' : 'Upload PDF File'}
                </h3>
                <p className={`text-gray-500 mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'فائل یہاں ڈراپ کریں یا کلک کریں' : 'Drop file here or click to browse'}
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="cursor-pointer">
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'فائل منتخب کریں' : 'Select File'}
                    </span>
                  </Button>
                </label>
              </div>
              
              {file && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center">
                  <FileText className="w-5 h-5 text-pink-500 mr-3" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="text-center">
            <Button
              onClick={handleESign}
              disabled={!file || processing}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
            >
              {processing ? (
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'ای سائن تیار کر رہے ہیں...' : 'Preparing e-sign...'}
                </span>
              ) : (
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'ای سائن شروع کریں' : 'Start E-Sign'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESignPDF;
