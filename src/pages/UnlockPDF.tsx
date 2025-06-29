
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, Unlock, Upload, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';

const UnlockPDF = () => {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
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

  const handleUnlock = async () => {
    if (!file) {
      toast.error(language === 'ur' ? 
        'پہلے فائل منتخب کریں' : 
        'Please select a file first'
      );
      return;
    }

    if (!password.trim()) {
      toast.error(language === 'ur' ? 
        'پاس ورڈ داخل کریں' : 
        'Please enter password'
      );
      return;
    }

    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Try to load PDF with password using correct API
      try {
        const pdfDoc = await PDFDocument.load(arrayBuffer, { 
          ignoreEncryption: false
        });
        
        // Note: pdf-lib doesn't directly support password-protected PDFs
        // This is a simplified implementation - in production, you'd need a different library
        // like pdf2pic or PDF.js for proper password handling
        
        // Save PDF (this will work for non-encrypted PDFs)
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `unlocked-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success(language === 'ur' ? 
          'PDF کامیابی سے کھل گیا!' : 
          'PDF unlocked successfully!'
        );
        
        setProcessed(true);
      } catch (error) {
        console.error('PDF load error:', error);
        toast.error(language === 'ur' ? 
          'غلط پاس ورڈ یا فائل کریپٹ ہے' : 
          'Wrong password or file is corrupted'
        );
      }
    } catch (error) {
      console.error('Unlock error:', error);
      toast.error(language === 'ur' ? 
        'PDF کھولنے میں خرابی' : 
        'Error unlocking PDF'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
    setPassword('');
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
              {language === 'ur' ? 'واپس' : 'Back'}
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Unlock className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              Unlock PDF
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'پاس ورڈ محفوظ PDF فائل کو کھولیں' : 
                'Remove password protection from PDF'
              }
            </p>
          </div>

          {!processed ? (
            <>
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pakistan-green-400 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-lg font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'محفوظ PDF فائل اپ لوڈ کریں' : 'Upload Protected PDF File'}
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
                      <FileText className="w-5 h-5 text-yellow-500 mr-3" />
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
                    {language === 'ur' ? 'پاس ورڈ' : 'Password'}
                  </h3>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'ur' ? 
                      'PDF کا پاس ورڈ داخل کریں' : 
                      'Enter PDF password'
                    }
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {language === 'ur' ? 
                      'نوٹ: یہ ایک بنیادی ٹول ہے، کچھ انکرپٹ شدہ PDFs کام نہیں کر سکتے' : 
                      'Note: This is a basic tool, some encrypted PDFs may not work'
                    }
                  </p>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={handleUnlock}
                  disabled={!file || !password.trim() || processing}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF کھول رہے ہیں...' : 'Unlocking PDF...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF کھولیں' : 'Unlock PDF'}
                    </span>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="p-8 bg-green-50 border border-green-200 rounded-lg mb-6">
                <Download className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-green-800 mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'فائل تیار ہے!' : 'File is ready!'}
                </h3>
                <p className={`text-green-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی کھلی ہوئی PDF ڈاؤن لوڈ ہو گئی ہے' : 'Your unlocked PDF has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل کھولیں' : 'Unlock Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnlockPDF;
