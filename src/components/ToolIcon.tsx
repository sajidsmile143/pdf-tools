
import React from 'react';
import { 
  FileText, 
  Scissors, 
  Minimize2, 
  FileImage, 
  Image, 
  Edit3, 
  PenTool, 
  Droplets, 
  RotateCw, 
  Unlock, 
  Lock, 
  FolderOpen, 
  Hash, 
  Globe, 
  Eye, 
  Wrench, 
  Crop 
} from 'lucide-react';

interface ToolIconProps {
  type: string;
  className?: string;
}

const ToolIcon: React.FC<ToolIconProps> = ({ type, className = "w-8 h-8" }) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // Core tools
    merge: <FileText className={className} />,
    split: <Scissors className={className} />,
    compress: <Minimize2 className={className} />,
    
    // PDF conversion tools
    'pdf-to-word': <FileText className={className} />,
    'pdf-to-powerpoint': <FileText className={className} />,
    'pdf-to-excel': <FileText className={className} />,
    'word-to-pdf': <FileText className={className} />,
    'powerpoint-to-pdf': <FileText className={className} />,
    'excel-to-pdf': <FileText className={className} />,
    
    // Image tools
    'pdf-to-jpg': <FileImage className={className} />,
    'jpg-to-pdf': <Image className={className} />,
    
    // Advanced tools
    'edit-pdf': <Edit3 className={className} />,
    'sign-pdf': <PenTool className={className} />,
    'watermark-pdf': <Droplets className={className} />,
    'rotate-pdf': <RotateCw className={className} />,
    
    // Security tools
    'unlock-pdf': <Unlock className={className} />,
    'protect-pdf': <Lock className={className} />,
    
    // Organization tools
    'organize-pdf': <FolderOpen className={className} />,
    'page-numbers': <Hash className={className} />,
    
    // Utility tools
    'html-to-pdf': <Globe className={className} />,
    'ocr-pdf': <Eye className={className} />,
    'repair-pdf': <Wrench className={className} />,
    'crop-pdf': <Crop className={className} />,
    
    // Legacy support
    convert: <FileText className={className} />,
    ocr: <Eye className={className} />,
    esign: <PenTool className={className} />
  };

  return iconMap[type] || <FileText className={className} />;
};

export default ToolIcon;
