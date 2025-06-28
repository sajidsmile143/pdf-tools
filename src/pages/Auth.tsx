
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, FileText } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast.error(language === 'ur' ? 
            'لاگ ان میں خرابی: ' + error.message : 
            'Login error: ' + error.message
          );
        } else {
          toast.success(language === 'ur' ? 'کامیابی سے لاگ ان ہو گئے!' : 'Successfully logged in!');
          navigate('/');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: formData.fullName
            }
          }
        });

        if (error) {
          toast.error(language === 'ur' ? 
            'سائن اپ میں خرابی: ' + error.message : 
            'Signup error: ' + error.message
          );
        } else {
          toast.success(language === 'ur' ? 
            'اکاؤنٹ بن گیا! اپنا ای میل چیک کریں۔' : 
            'Account created! Please check your email.'
          );
        }
      }
    } catch (error) {
      toast.error(language === 'ur' ? 'کوئی خرابی ہوئی' : 'Something went wrong');
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <CardTitle className={`text-2xl ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
            {isLogin ? 
              (language === 'ur' ? 'لاگ ان کریں' : 'Login') : 
              (language === 'ur' ? 'اکاؤنٹ بنائیں' : 'Sign Up')
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  {language === 'ur' ? 'پورا نام' : 'Full Name'}
                </label>
                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder={language === 'ur' ? 'اپنا نام لکھیں' : 'Enter your name'}
                />
              </div>
            )}
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'ای میل' : 'Email'}
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder={language === 'ur' ? 'اپنا ای میل لکھیں' : 'Enter your email'}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'پاس ورڈ' : 'Password'}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder={language === 'ur' ? 'اپنا پاس ورڈ لکھیں' : 'Enter your password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 hover:from-pakistan-green-600 hover:to-pakistan-green-700"
            >
              <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                {loading ? 
                  (language === 'ur' ? 'براہ کرم انتظار کریں...' : 'Please wait...') :
                  (isLogin ? 
                    (language === 'ur' ? 'لاگ ان کریں' : 'Login') : 
                    (language === 'ur' ? 'اکاؤنٹ بنائیں' : 'Sign Up')
                  )
                }
              </span>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={`text-pakistan-green-600 hover:text-pakistan-green-700 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}
            >
              {isLogin ? 
                (language === 'ur' ? 'نیا اکاؤنٹ بنائیں' : 'Create new account') : 
                (language === 'ur' ? 'پہلے سے اکاؤنٹ ہے؟ لاگ ان کریں' : 'Already have account? Login')
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
