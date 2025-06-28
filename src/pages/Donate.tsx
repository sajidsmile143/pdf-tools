
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { Heart, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Donate = () => {
  const { language, t } = useLanguage();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'jazzcash' | 'easypaisa' | null>(null);
  const [donated, setDonated] = useState(false);

  const predefinedAmounts = [50, 100, 250, 500, 1000];

  const handleDonate = () => {
    // Mock donation process
    setDonated(true);
  };

  if (donated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="py-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-3xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 'شکریہ!' : 'Thank You!'}
            </h1>
            <p className={`text-gray-600 mb-8 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {language === 'ur' ? 
                'آپ کا عطیہ ہمیں بہتر سروس فراہم کرنے میں مدد کرے گا۔' :
                'Your donation helps us provide better services to everyone.'}
            </p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 hover:from-pakistan-green-600 hover:to-pakistan-green-700">
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {t('common.back')}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center text-pakistan-green-600 hover:text-pakistan-green-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
              {t('common.back')}
            </span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('donate.title')}
            </h1>
            <p className={`text-gray-600 text-lg ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
              {t('donate.subtitle')}
            </p>
          </div>

          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                {language === 'ur' ? 'عطیہ کی رقم منتخب کریں' : 'Choose Donation Amount'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Predefined Amounts */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'تجویز کردہ رقم (PKR)' : 'Suggested Amount (PKR)'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant={amount === amt.toString() ? 'default' : 'outline'}
                      onClick={() => setAmount(amt.toString())}
                      className={amount === amt.toString() ? 'bg-pakistan-green-600 hover:bg-pakistan-green-700' : ''}
                    >
                      ₨{amt}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'یا اپنی رقم لکھیں' : 'Or enter custom amount'}
                </label>
                <Input
                  type="number"
                  placeholder="Amount in PKR"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'پیمنٹ کا طریقہ' : 'Payment Method'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={selectedMethod === 'jazzcash' ? 'default' : 'outline'}
                    onClick={() => setSelectedMethod('jazzcash')}
                    className={`h-16 ${selectedMethod === 'jazzcash' ? 'bg-pakistan-green-600 hover:bg-pakistan-green-700' : ''}`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-lg">JazzCash</div>
                      <div className={`text-sm ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                        {t('donate.jazzcash')}
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={selectedMethod === 'easypaisa' ? 'default' : 'outline'}
                    onClick={() => setSelectedMethod('easypaisa')}
                    className={`h-16 ${selectedMethod === 'easypaisa' ? 'bg-pakistan-green-600 hover:bg-pakistan-green-700' : ''}`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-lg">Easypaisa</div>
                      <div className={`text-sm ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                        {t('donate.easypaisa')}
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                disabled={!amount || !selectedMethod}
                size="lg"
                className="w-full bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 hover:from-pakistan-green-600 hover:to-pakistan-green-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? `₨${amount} عطیہ کریں` : `Donate ₨${amount}`}
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Why Donate Section */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className={`font-bold text-lg mb-4 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'آپ کا عطیہ کیوں اہم ہے؟' : 'Why Your Donation Matters?'}
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 
                    '• تمام ٹولز مفت رکھنے کے لیے' :
                    '• Keep all tools completely free'}
                </p>
                <p className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 
                    '• سرور اور ہوسٹنگ کی لاگت' :
                    '• Cover server and hosting costs'}
                </p>
                <p className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                  {language === 'ur' ? 
                    '• نئے فیچرز اور بہتری' :
                    '• Develop new features and improvements'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donate;
