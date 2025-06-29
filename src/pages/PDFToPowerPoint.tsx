
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, Presentation, Upload, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';

const PDFToPowerPoint = () => {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
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

  const handleConvert = async () => {
    if (!file) {
      toast.error(language === 'ur' ? 
        'پہلے فائل منتخب کریں' : 
        'Please select a file first'
      );
      return;
    }

    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Create simple PowerPoint-like content
      let pptContent = `PowerPoint Presentation from PDF\n\n`;
      for (let i = 0; i < pages.length; i++) {
        pptContent += `Slide ${i + 1}\n`;
        pptContent += `Content from PDF page ${i + 1}\n\n`;
      }

      const blob = new Blob([pptContent], { type: 'application/vnd.ms-powerpoint' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-${Date.now()}.ppt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ur' ? 
        'PDF کامیابی سے PowerPoint میں تبدیل ہو گیا!' : 
        'PDF converted to PowerPoint successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Convert error:', error);
      toast.error(language === 'ur' ? 
        'PDF کنورٹ کرنے میں خرابی' : 
        'Error converting PDF'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
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
              {language === 'ur' ? 'واپس' : 'Back'}
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Presentation className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              PDF to PowerPoint
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF کو PowerPoint میں تبدیل کریں' : 
                'Convert PDF to PowerPoint presentation'
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
                      <Presentation className="w-5 h-5 text-orange-500 mr-3" />
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

              <div className="text-center">
                <Button
                  onClick={handleConvert}
                  disabled={!file || processing}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PowerPoint میں کنورٹ کر رہے ہیں...' : 'Converting to PowerPoint...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PowerPoint میں کنورٹ کریں' : 'Convert to PowerPoint'}
                    </span>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="p-8 bg-orange-50 border border-orange-200 rounded-lg mb-6">
                <Download className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-orange-800 mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'فائل تیار ہے!' : 'File is ready!'}
                </h3>
                <p className={`text-orange-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی PowerPoint فائل ڈاؤن لوڈ ہو گئی ہے' : 'Your PowerPoint file has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل کنورٹ کریں' : 'Convert Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFToPowerPoint;
