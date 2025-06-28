
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const WatermarkPDF = () => {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [processing, setProcessing] = useState(false);

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

  const handleWatermark = async () => {
    if (!file) {
      toast.error(language === 'ur' ? 
        'پہلے فائل منتخب کریں' : 
        'Please select a file first'
      );
      return;
    }

    if (!watermarkText.trim()) {
      toast.error(language === 'ur' ? 
        'واٹر مارک ٹیکسٹ داخل کریں' : 
        'Please enter watermark text'
      );
      return;
    }

    setProcessing(true);
    
    setTimeout(() => {
      toast.info(language === 'ur' ? 
        'یہ فیچر جلد آ رہا ہے!' : 
        'This feature is coming soon!'
      );
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-pakistan-green-600 hover:text-pakistan-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
              {language === 'ur' ? 'واپس' : 'Back'}
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              Watermark PDF
            </h1>
            <p className={`text-gray-600 text-lg mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF پر واٹر مارک لگائیں' : 
                'Add watermark to PDF documents'
              }
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              <span className={`text-sm ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'جلد آ رہا ہے!' : 'Coming Soon!'}
              </span>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pakistan-green-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className={`text-lg font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'پی ڈی ایف فائل اپ لوڈ کریں' : 'Upload PDF File'}
                </h3>
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
                  <FileText className="w-5 h-5 text-cyan-500 mr-3" />
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

          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'واٹر مارک ٹیکسٹ' : 'Watermark Text'}
              </h3>
              <Input
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder={language === 'ur' ? 
                  'واٹر مارک ٹیکسٹ داخل کریں' : 
                  'Enter watermark text'
                }
              />
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleWatermark}
              disabled={!file || !watermarkText.trim() || processing}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
            >
              {processing ? (
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'واٹر مارک لگا رہے ہیں...' : 'Adding watermark...'}
                </span>
              ) : (
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'واٹر مارک لگائیں' : 'Add Watermark'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatermarkPDF;
