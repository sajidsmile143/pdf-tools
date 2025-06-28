
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FileText, Download, Calendar, TrendingUp, Users, Files } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface ProcessedFile {
  id: string;
  original_filename: string;
  processed_filename: string;
  tool_used: string;
  processed_at: string;
  file_size: number;
  file_url: string;
}

const Dashboard = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [recentFiles, setRecentFiles] = useState<ProcessedFile[]>([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch recent files
        const { data: filesData, error: filesError } = await supabase
          .from('processed_files')
          .select('*')
          .eq('user_id', user.id)
          .order('processed_at', { ascending: false })
          .limit(5);

        if (filesError) throw filesError;

        // Fetch stats
        const { data: allFiles, error: statsError } = await supabase
          .from('processed_files')
          .select('file_size, processed_at')
          .eq('user_id', user.id);

        if (statsError) throw statsError;

        const totalSize = allFiles?.reduce((sum, file) => sum + file.file_size, 0) || 0;
        const thisMonth = allFiles?.filter(file => {
          const fileDate = new Date(file.processed_at);
          const now = new Date();
          return fileDate.getMonth() === now.getMonth() && fileDate.getFullYear() === now.getFullYear();
        }).length || 0;

        setRecentFiles(filesData || []);
        setStats({
          totalFiles: allFiles?.length || 0,
          totalSize: Math.round(totalSize / 1024 / 1024 * 100) / 100, // Convert to MB
          thisMonth
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const downloadFile = async (fileUrl: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pdf-files')
        .download(fileUrl);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const formatToolName = (tool: string) => {
    const toolNames = {
      merge: language === 'ur' ? 'جوڑنا' : 'Merge',
      split: language === 'ur' ? 'تقسیم' : 'Split',
      compress: language === 'ur' ? 'کمپریس' : 'Compress',
      convert: language === 'ur' ? 'تبدیل' : 'Convert',
      ocr: language === 'ur' ? 'او سی آر' : 'OCR',
      esign: language === 'ur' ? 'ای سائن' : 'E-Sign'
    };
    return toolNames[tool as keyof typeof toolNames] || tool;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          <Header />
          <div className="py-20 px-4">
            <div className="max-w-6xl mx-auto text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pakistan-green-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        
        <div className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-4xl font-bold mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {t('dashboard.title')}
              </h1>
              <p className={`text-gray-600 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                {language === 'ur' ? 'اپنے پی ڈی ایف ٹولز کی سرگرمی دیکھیں' : 'Track your PDF tool activity'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm text-gray-600 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                        {language === 'ur' ? 'کل فائلیں' : 'Total Files'}
                      </p>
                      <p className="text-2xl font-bold text-pakistan-green-600">{stats.totalFiles}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-pakistan-green-100 to-pakistan-green-200 rounded-lg flex items-center justify-center">
                      <Files className="w-6 h-6 text-pakistan-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm text-gray-600 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                        {language === 'ur' ? 'کل ڈیٹا' : 'Total Data'}
                      </p>
                      <p className="text-2xl font-bold text-pakistan-green-600">{stats.totalSize} MB</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-pakistan-green-100 to-pakistan-green-200 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-pakistan-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm text-gray-600 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                        {language === 'ur' ? 'اس ماہ' : 'This Month'}
                      </p>
                      <p className="text-2xl font-bold text-pakistan-green-600">{stats.thisMonth}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-pakistan-green-100 to-pakistan-green-200 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-pakistan-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Files */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                  <FileText className="w-5 h-5 mr-2" />
                  {language === 'ur' ? 'حالیہ فائلیں' : 'Recent Files'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentFiles.length > 0 ? (
                  <div className="space-y-4">
                    {recentFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center mr-4">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{file.processed_filename}</h3>
                            <p className={`text-sm text-gray-500 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                              {formatToolName(file.tool_used)} • {new Date(file.processed_at).toLocaleDateString()} • {(file.file_size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => downloadFile(file.file_url, file.processed_filename)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 'ابھی تک کوئی فائل نہیں' : 'No files yet'}
                    </h3>
                    <p className={`text-gray-500 mb-6 ${language === 'ur' ? 'font-urdu' : 'font-inter'}`}>
                      {language === 'ur' ? 
                        'پی ڈی ایف ٹولز استعمال کرنا شروع کریں' : 
                        'Start using PDF tools to see your activity here'}
                    </p>
                    <Link to="/">
                      <Button className="bg-gradient-to-r from-pakistan-green-500 to-pakistan-green-600 hover:from-pakistan-green-600 hover:to-pakistan-green-700">
                        <span className={language === 'ur' ? 'font-urdu' : 'font-inter'}>
                          {language === 'ur' ? 'ٹولز دیکھیں' : 'Explore Tools'}
                        </span>
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
