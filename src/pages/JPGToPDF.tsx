
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, Image, Upload, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument } from 'pdf-lib';

const JPGToPDF = () => {
  const { language } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const imageFiles = selectedFiles.filter(file => 
        file.type.startsWith('image/') && (file.type.includes('jpeg') || file.type.includes('jpg') || file.type.includes('png'))
      );
      
      if (imageFiles.length !== selectedFiles.length) {
        toast.error(language === 'ur' ? 
          'صرف JPG, JPEG اور PNG فائلیں قبول ہیں' : 
          'Only JPG, JPEG and PNG files are accepted'
        );
      }
      
      setFiles(prev => [...prev, ...imageFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error(language === 'ur' ? 
        'پہلے تصاویر منتخب کریں' : 
        'Please select images first'
      );
      return;
    }

    setProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        
        if (file.type.includes('png')) {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else {
          image = await pdfDoc.embedJpg(arrayBuffer);
        }

        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        // Calculate dimensions to fit image within page while maintaining aspect ratio
        const imageAspectRatio = image.width / image.height;
        const pageAspectRatio = width / height;
        
        let imageWidth, imageHeight;
        
        if (imageAspectRatio > pageAspectRatio) {
          imageWidth = width - 40; // 20px margin on each side
          imageHeight = imageWidth / imageAspectRatio;
        } else {
          imageHeight = height - 40; // 20px margin on top and bottom
          imageWidth = imageHeight * imageAspectRatio;
        }
        
        const x = (width - imageWidth) / 2;
        const y = (height - imageHeight) / 2;
        
        page.drawImage(image, {
          x,
          y,
          width: imageWidth,
          height: imageHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `images-to-pdf-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ur' ? 
        'تصاویر کامیابی سے PDF میں تبدیل ہو گئیں!' : 
        'Images converted to PDF successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Convert error:', error);
      toast.error(language === 'ur' ? 
        'تصاویر کنورٹ کرنے میں خرابی' : 
        'Error converting images'
      );
    }
    
    setProcessing(false);
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
          <Link to="/" className="inline-flex items-center text-pakistan-green-600 hover:text-pakistan-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
              {language === 'ur' ? 'واپس' : 'Back'}
            </span>
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Image className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              JPG to PDF
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'تصاویر کو PDF میں تبدیل کریں' : 
                'Convert images to PDF document'
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
                      {language === 'ur' ? 'تصاویر اپ لوڈ کریں' : 'Upload Images'}
                    </h3>
                    <p className={`text-gray-500 mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'تصاویر یہاں ڈراپ کریں یا کلک کریں' : 'Drop images here or click to browse'}
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      multiple
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button className="cursor-pointer">
                        <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                          {language === 'ur' ? 'تصاویر منتخب کریں' : 'Select Images'}
                        </span>
                      </Button>
                    </label>
                  </div>
                  
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                          <div className="flex items-center">
                            <Image className="w-5 h-5 text-purple-500 mr-3" />
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
                  )}
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={handleConvert}
                  disabled={files.length === 0 || processing}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800"
                >
                  {processing ? (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF بنا رہے ہیں...' : 'Creating PDF...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'PDF بنائیں' : 'Create PDF'}
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
                  {language === 'ur' ? 'PDF تیار ہے!' : 'PDF is ready!'}
                </h3>
                <p className={`text-green-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'آپ کی PDF فائل ڈاؤن لوڈ ہو گئی ہے' : 'Your PDF file has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی تصاویر کنورٹ کریں' : 'Convert More Images'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JPGToPDF;
