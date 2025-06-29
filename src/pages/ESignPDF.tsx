
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument, rgb } from 'pdf-lib';

const ESignPDF = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        toast.success(language === 'ur' ? 
          'فائل کامیابی سے منتخب ہوئی' : 
          'File selected successfully'
        );
      } else {
        toast.error(language === 'ur' ? 
          'صرف PDF فائلیں قبول ہیں' : 
          'Only PDF files are accepted'
        );
      }
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        toast.success(language === 'ur' ? 
          'فائل کامیابی سے منتخب ہوئی' : 
          'File selected successfully'
        );
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

    if (!signatureText.trim()) {
      toast.error(language === 'ur' ? 
        'دستخط کا متن لکھیں' : 
        'Please enter signature text'
      );
      return;
    }

    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      if (pages.length > 0) {
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        
        // Add signature text to the bottom right of the first page
        firstPage.drawText(`Signature: ${signatureText}`, {
          x: width - 200,
          y: 50,
          size: 12,
          color: rgb(0, 0, 1),
        });
        
        // Add signature date
        const currentDate = new Date().toLocaleDateString();
        firstPage.drawText(`Date: ${currentDate}`, {
          x: width - 200,
          y: 30,
          size: 10,
          color: rgb(0, 0, 1),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `signed-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ur' ? 
        'PDF پر دستخط کامیابی سے ہو گئے!' : 
        'PDF signed successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('E-Sign error:', error);
      toast.error(language === 'ur' ? 
        'ای سائن میں خرابی' : 
        'Error with e-signing'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
    setSignatureText('');
    setProcessed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              E-Sign PDF
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF پر الیکٹرانک دستخط کریں' : 
                'Add electronic signature to PDF'
              }
            </p>
          </div>

          {!processed ? (
            <>
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pakistan-green-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleFileSelect}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-lg font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'پی ڈی ایف فائل اپ لوڈ کریں' : 'Upload PDF File'}
                    </h3>
                    <p className={`text-gray-500 mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'فائل یہاں ڈراپ کریں یا کلک کریں' : 'Drop file here or click to browse'}
                    </p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    
                    <Button onClick={handleFileSelect}>
                      <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                        {language === 'ur' ? 'فائل منتخب کریں' : 'Select File'}
                      </span>
                    </Button>
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

              <Card className="mb-8">
                <CardContent className="p-8">
                  <h3 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                    {language === 'ur' ? 'دستخط کا متن' : 'Signature Text'}
                  </h3>
                  <Input
                    type="text"
                    placeholder={language === 'ur' ? 'اپنا نام یا دستخط لکھیں' : 'Enter your name or signature'}
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={handleESign}
                  disabled={!file || !signatureText.trim() || processing}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'دستخط کر رہے ہیں...' : 'Adding signature...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'دستخط کریں' : 'Sign PDF'}
                    </span>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="p-8 bg-pink-50 border border-pink-200 rounded-lg mb-6">
                <Download className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-pink-800 mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'دستخط مکمل!' : 'Signature Added!'}
                </h3>
                <p className={`text-pink-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی signed PDF ڈاؤن لوڈ ہو گئی ہے' : 'Your signed PDF has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل پر دستخط کریں' : 'Sign Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ESignPDF;
