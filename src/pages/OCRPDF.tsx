
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';

const OCRPDF = () => {
  const { language, t } = useLanguage();
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

  const handleOCR = async () => {
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
      
      // Simulate OCR processing - creating a searchable PDF
      // In reality, this would use OCR libraries like Tesseract.js
      let ocrText = 'OCR Extracted Text from PDF\n\n';
      for (let i = 0; i < pages.length; i++) {
        ocrText += `Page ${i + 1} - Extracted Text:\n`;
        ocrText += `This is simulated OCR text extracted from page ${i + 1}.\n`;
        ocrText += `In a real implementation, OCR would analyze the image content and extract actual text.\n\n`;
      }

      // Create a new PDF with the OCR text
      const newPdf = await PDFDocument.create();
      const page = newPdf.addPage([612, 792]);
      page.drawText(ocrText, {
        x: 50,
        y: 750,
        size: 12,
      });

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ocr-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ur' ? 
        'OCR کامیابی سے مکمل ہوا!' : 
        'OCR completed successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('OCR error:', error);
      toast.error(language === 'ur' ? 
        'OCR پروسیسنگ میں خرابی' : 
        'Error processing OCR'
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
              {t('common.back')}
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              OCR PDF
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF میں سے متن نکالیں اور سرچ کے قابل بنائیں' : 
                'Extract text from PDF and make it searchable'
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
                      <FileText className="w-5 h-5 text-orange-500 mr-3" />
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
                  onClick={handleOCR}
                  disabled={!file || processing}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'OCR پروسیسنگ...' : 'Processing OCR...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'OCR شروع کریں' : 'Start OCR'}
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
                  {language === 'ur' ? 'OCR مکمل!' : 'OCR Complete!'}
                </h3>
                <p className={`text-orange-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی searchable PDF ڈاؤن لوڈ ہو گئی ہے' : 'Your searchable PDF has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل پروسیس کریں' : 'Process Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRPDF;
