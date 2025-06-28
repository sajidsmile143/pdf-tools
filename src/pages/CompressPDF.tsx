
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, Minimize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { compressPDF, downloadPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';

const CompressPDF = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
      } else {
        toast.error(language === 'ur' ? 
          'صرف PDF فائلیں قبول ہیں' : 
          'Only PDF files are accepted'
        );
      }
    }
  };

  const handleCompress = async () => {
    if (!file) {
      toast.error(language === 'ur' ? 
        'پہلے فائل منتخب کریں' : 
        'Please select a file first'
      );
      return;
    }

    setProcessing(true);

    try {
      const compressedPdfBytes = await compressPDF(file, 0.7);
      const filename = `compressed-${Date.now()}.pdf`;
      
      setCompressedSize(compressedPdfBytes.length);
      downloadPDF(compressedPdfBytes, filename);

      toast.success(language === 'ur' ? 
        'فائل کامیابی سے کمپریس ہو گئی!' : 
        'File compressed successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Compress error:', error);
      toast.error(language === 'ur' ? 
        'فائل کمپریس کرنے میں خرابی' : 
        'Error compressing file'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
    setProcessed(false);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  const getSavings = () => {
    if (originalSize && compressedSize) {
      const savings = ((originalSize - compressedSize) / originalSize) * 100;
      return Math.max(0, savings).toFixed(1);
    }
    return '0';
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
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Minimize2 className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('tools.compress')}
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF فائل کا سائز کم کریں' : 
                'Reduce PDF file size'
              }
            </p>
          </div>

          {!processed ? (
            <>
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
                      <FileText className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(file.size)} MB
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={handleCompress}
                  disabled={!file || processing}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'فائل کمپریس کر رہے ہیں...' : 'Compressing file...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF کمپریس کریں' : 'Compress PDF'}
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
                <div className="space-y-2 mb-4">
                  <p className={`text-green-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                    {language === 'ur' ? 'اصل سائز: ' : 'Original size: '}
                    <span className="font-medium">{formatFileSize(originalSize)} MB</span>
                  </p>
                  <p className={`text-green-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                    {language === 'ur' ? 'کمپریس سائز: ' : 'Compressed size: '}
                    <span className="font-medium">{formatFileSize(compressedSize)} MB</span>
                  </p>
                  <p className={`text-green-700 font-bold ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                    {language === 'ur' ? 'بچت: ' : 'Savings: '}
                    <span>{getSavings()}%</span>
                  </p>
                </div>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل کمپریس کریں' : 'Compress Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompressPDF;
