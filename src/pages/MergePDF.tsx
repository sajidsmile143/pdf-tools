
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Upload, FileText, Download, ArrowLeft, X, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mergePDFs, downloadPDF } from '@/utils/pdfUtils';
import { toast } from 'sonner';

const MergePDF = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length !== acceptedFiles.length) {
      toast.warning(language === 'ur' ? 
        'صرف PDF فائلیں قبول ہیں' : 
        'Only PDF files are accepted'
      );
    }
    setFiles(prev => [...prev, ...pdfFiles]);
  }, [language]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      const [removed] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, removed);
      return newFiles;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error(language === 'ur' ? 
        'کم از کم 2 فائلیں ضروری ہیں' : 
        'At least 2 files are required'
      );
      return;
    }
    
    setProcessing(true);
    
    try {
      const mergedPdfBytes = await mergePDFs(files);
      const filename = `merged-${Date.now()}.pdf`;
      
      // Download the file directly - no need to store for free users
      downloadPDF(mergedPdfBytes, filename);
      
      toast.success(language === 'ur' ? 
        'فائلیں کامیابی سے جوڑ دی گئیں!' : 
        'Files merged successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Merge error:', error);
      toast.error(language === 'ur' ? 
        'فائل جوڑنے میں خرابی' : 
        'Error merging files'
      );
    }
    
    setProcessing(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onDrop(Array.from(e.target.files));
    }
  };

  const resetTool = () => {
    setFiles([]);
    setProcessed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-pakistan-green-600 hover:text-pakistan-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
              {t('common.back')}
            </span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('tools.merge')}
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'متعدد PDF فائلوں کو ایک میں ضم کریں' : 
                'Combine multiple PDF files into one'
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
                      {language === 'ur' ? 'پی ڈی ایف فائلیں اپ لوڈ کریں' : 'Upload PDF Files'}
                    </h3>
                    <p className={`text-gray-500 mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'فائلیں یہاں ڈراپ کریں یا کلک کریں' : 'Drop files here or click to browse'}
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button className="cursor-pointer">
                        <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                          {language === 'ur' ? 'فائل منتخب کریں' : 'Select Files'}
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* File List */}
              {files.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'منتخب فائلیں' : 'Selected Files'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
                            <FileText className="w-5 h-5 text-red-500 mr-3" />
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="text-center">
                <Button
                  onClick={handleMerge}
                  disabled={files.length < 2 || processing}
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'فائلیں جوڑ رہے ہیں...' : 'Merging files...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'پی ڈی ایف جوڑیں' : 'Merge PDFs'}
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
                  {language === 'ur' ? 'آپ کی فائل ڈاؤن لوڈ ہو گئی ہے' : 'Your file has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل جوڑیں' : 'Merge Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MergePDF;
