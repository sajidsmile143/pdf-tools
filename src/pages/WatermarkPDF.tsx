
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { ArrowLeft, Droplets, Upload, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

const WatermarkPDF = () => {
  const { language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [position, setPosition] = useState('center');
  const [opacity, setOpacity] = useState([0.3]);
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

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        let x, y, rotation = 0;
        
        // Position calculation
        switch (position) {
          case 'top-left':
            x = 50;
            y = height - 50;
            break;
          case 'top-center':
            x = width / 2;
            y = height - 50;
            break;
          case 'top-right':
            x = width - 50;
            y = height - 50;
            break;
          case 'center':
            x = width / 2;
            y = height / 2;
            rotation = 45;
            break;
          case 'bottom-left':
            x = 50;
            y = 50;
            break;
          case 'bottom-center':
            x = width / 2;
            y = 50;
            break;
          case 'bottom-right':
          default:
            x = width - 50;
            y = 50;
            break;
        }

        page.drawText(watermarkText, {
          x,
          y,
          size: 48,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity[0],
          rotate: degrees(rotation),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `watermarked-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(language === 'ur' ? 
        'واٹر مارک کامیابی سے شامل ہوا!' : 
        'Watermark added successfully!'
      );
      
      setProcessed(true);
    } catch (error) {
      console.error('Watermark error:', error);
      toast.error(language === 'ur' ? 
        'واٹر مارک شامل کرنے میں خرابی' : 
        'Error adding watermark'
      );
    }
    
    setProcessing(false);
  };

  const resetTool = () => {
    setFile(null);
    setProcessed(false);
    setWatermarkText('CONFIDENTIAL');
    setPosition('center');
    setOpacity([0.3]);
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
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'PDF میں واٹر مارک شامل کریں' : 
                'Add watermark to PDF document'
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
                <CardContent className="p-8 space-y-6">
                  <div>
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
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'واٹر مارک کی جگہ' : 'Position'}
                    </h3>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">{language === 'ur' ? 'اوپر بائیں' : 'Top Left'}</SelectItem>
                        <SelectItem value="top-center">{language === 'ur' ? 'اوپر وسط' : 'Top Center'}</SelectItem>
                        <SelectItem value="top-right">{language === 'ur' ? 'اوپر دائیں' : 'Top Right'}</SelectItem>
                        <SelectItem value="center">{language === 'ur' ? 'وسط (ترچھا)' : 'Center (Diagonal)'}</SelectItem>
                        <SelectItem value="bottom-left">{language === 'ur' ? 'نیچے بائیں' : 'Bottom Left'}</SelectItem>
                        <SelectItem value="bottom-center">{language === 'ur' ? 'نیچے وسط' : 'Bottom Center'}</SelectItem>
                        <SelectItem value="bottom-right">{language === 'ur' ? 'نیچے دائیں' : 'Bottom Right'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'شفافیت' : 'Opacity'}: {Math.round(opacity[0] * 100)}%
                    </h3>
                    <Slider
                      value={opacity}
                      onValueChange={setOpacity}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
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
                      {language === 'ur' ? 'واٹر مارک شامل کر رہے ہیں...' : 'Adding watermark...'}
                    </span>
                  ) : (
                    <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                      {language === 'ur' ? 'واٹر مارک شامل کریں' : 'Add Watermark'}
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
                  {language === 'ur' ? 'واٹر مارک کے ساتھ PDF ڈاؤن لوڈ ہو گئی ہے' : 'Your watermarked PDF has been downloaded'}
                </p>
              </div>
              <Button onClick={resetTool} size="lg">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 'نئی فائل میں واٹر مارک شامل کریں' : 'Watermark Another File'}
                </span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatermarkPDF;
