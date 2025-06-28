
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, FileText, Upload, Download, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { splitPDF, downloadPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';

const SplitPDF = () => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string>('');
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

  const handleSplit = async () => {
    if (!file) {
      toast.error(language === 'ur' ? 
        'پہلے فائل منتخب کریں' : 
        'Please select a file first'
      );
      return;
    }

    if (!pageRanges.trim()) {
      toast.error(language === 'ur' ? 
        'صفحات کی رینج داخل کریں' : 
        'Please enter page ranges'
      );
      return;
    }

    setProcessing(true);

    try {
      // Parse page ranges (e.g., "1-3,5-7,9")
      const ranges = pageRanges.split(',').map(range => {
        const [start, end] = range.trim().split('-').map(num => parseInt(num));
        return { start, end: end || start };
      });

      const splitPdfs = await splitPDF(file, ranges);
      
      // Download each split PDF
      splitPdfs.forEach((pdfBytes, index) => {
        const filename = `split-${index + 1}-${Date.now()}.pdf`;
        downloadPDF(pdfBytes, filename);
      });

      toast.success(language === 'ur' ? 
        'فائل کامیابی سے تقسیم ہو گئی!' : 
        'File split successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Split error:', error);
      toast.error(language === 'ur' ? 
        'فائل تقسیم کرنے میں خرابی' : 
        'Error splitting file'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
    setPageRanges('');
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
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('tools.split')}
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF فائل کو مختلف حصوں میں تقسیم کریں' : 
                'Split PDF file into separate documents'
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
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
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

              {/* Page Ranges */}
              <Card className="mb-8">
                <CardContent className="p-8">
                  <h3 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                    {language === 'ur' ? 'صفحات کی رینج' : 'Page Ranges'}
                  </h3>
                  <Input
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    placeholder={language === 'ur' ? 
                      'مثال: 1-3,5-7,9' : 
                      'Example: 1-3,5-7,9'
                    }
                    className="mb-2"
                  />
                  <p className={`text-sm text-gray-500 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                    {language === 'ur' ? 
                      'صفحات کی رینج کاما سے الگ کریں (مثال: 1-3,5-7,9)' : 
                      'Separate page ranges with commas (e.g., 1-3,5-7,9)'
                    }
                  </p>
                </CardContent>
              </Card>

              {/* Action Button */}
              <div className="text-center">
                <Button
                  onClick={handleSplit}
                  disabled={!file || !pageRanges.trim() || processing}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'فائل تقسیم کر رہے ہیں...' : 'Splitting file...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF تقسیم کریں' : 'Split PDF'}
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
                  {language === 'ur' ? 'فائلیں تیار ہیں!' : 'Files are ready!'}
                </h3>
                <p className={`text-green-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی فائلیں ڈاؤن لوڈ ہو گئی ہیں' : 'Your files have been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل تقسیم کریں' : 'Split Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitPDF;
