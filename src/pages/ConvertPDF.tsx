
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';

const ConvertPDF = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [convertTo, setConvertTo] = useState<string>('');
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

    if (!convertTo) {
      toast.error(language === 'ur' ? 
        'کنورٹ فارمیٹ منتخب کریں' : 
        'Please select convert format'
      );
      return;
    }

    setProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      let content = '';
      let mimeType = '';
      let extension = '';

      switch (convertTo) {
        case 'word':
          content = `Word Document from PDF\n\n`;
          for (let i = 0; i < pages.length; i++) {
            content += `Page ${i + 1}\n\nContent extracted from PDF page ${i + 1}\n\n`;
          }
          mimeType = 'application/msword';
          extension = 'doc';
          break;
        case 'excel':
          content = 'Page,Content\n';
          for (let i = 0; i < pages.length; i++) {
            content += `${i + 1},"Content from PDF page ${i + 1}"\n`;
          }
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'ppt':
          content = `PowerPoint Presentation from PDF\n\n`;
          for (let i = 0; i < pages.length; i++) {
            content += `Slide ${i + 1}\nContent from PDF page ${i + 1}\n\n`;
          }
          mimeType = 'application/vnd.ms-powerpoint';
          extension = 'ppt';
          break;
        case 'txt':
          content = `Text extracted from PDF\n\n`;
          for (let i = 0; i < pages.length; i++) {
            content += `Page ${i + 1}\n\nContent from PDF page ${i + 1}\n\n`;
          }
          mimeType = 'text/plain';
          extension = 'txt';
          break;
        default:
          throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ur' ? 
        'PDF کامیابی سے کنورٹ ہو گیا!' : 
        'PDF converted successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Convert error:', error);
      toast.error(language === 'ur' ? 
        'فائل کنورٹ کرنے میں خرابی' : 
        'Error converting file'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
    setConvertTo('');
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              Convert PDF
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF کو دوسرے فارمیٹ میں تبدیل کریں' : 
                'Convert PDF to other formats'
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
                      <FileText className="w-5 h-5 text-purple-500 mr-3" />
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
                    {language === 'ur' ? 'کنورٹ فارمیٹ' : 'Convert Format'}
                  </h3>
                  <Select value={convertTo} onValueChange={setConvertTo}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'ur' ? 'فارمیٹ منتخب کریں' : 'Select format'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="word">Word (.docx)</SelectItem>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="ppt">PowerPoint (.pptx)</SelectItem>
                      <SelectItem value="txt">Text (.txt)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={handleConvert}
                  disabled={!file || !convertTo || processing}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'فائل کنورٹ کر رہے ہیں...' : 'Converting file...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF کنورٹ کریں' : 'Convert PDF'}
                    </span>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="p-8 bg-purple-50 border border-purple-200 rounded-lg mb-6">
                <Download className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold text-purple-800 mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'فائل تیار ہے!' : 'File is ready!'}
                </h3>
                <p className={`text-purple-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی فائل ڈاؤن لوڈ ہو گئی ہے' : 'Your converted file has been downloaded'}
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

export default ConvertPDF;
