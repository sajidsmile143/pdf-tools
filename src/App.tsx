
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import MergePDF from "./pages/MergePDF";
import SplitPDF from "./pages/SplitPDF";
import CompressPDF from "./pages/CompressPDF";
import PDFToWord from "./pages/PDFToWord";
import PDFToJPG from "./pages/PDFToJPG";
import JPGToPDF from "./pages/JPGToPDF";
import RotatePDF from "./pages/RotatePDF";
import WatermarkPDF from "./pages/WatermarkPDF";
import ConvertPDF from "./pages/ConvertPDF";
import OCRPDF from "./pages/OCRPDF";
import ESignPDF from "./pages/ESignPDF";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Core PDF tools */}
            <Route path="/merge" element={<MergePDF />} />
            <Route path="/split" element={<SplitPDF />} />
            <Route path="/compress" element={<CompressPDF />} />
            
            {/* PDF conversion tools */}
            <Route path="/pdf-to-word" element={<PDFToWord />} />
            <Route path="/pdf-to-powerpoint" element={<ConvertPDF />} />
            <Route path="/pdf-to-excel" element={<ConvertPDF />} />
            <Route path="/word-to-pdf" element={<ConvertPDF />} />
            <Route path="/powerpoint-to-pdf" element={<ConvertPDF />} />
            <Route path="/excel-to-pdf" element={<ConvertPDF />} />
            
            {/* Image tools */}
            <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
            <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
            
            {/* Advanced tools */}
            <Route path="/edit-pdf" element={<ConvertPDF />} />
            <Route path="/sign-pdf" element={<ESignPDF />} />
            <Route path="/watermark-pdf" element={<WatermarkPDF />} />
            <Route path="/rotate-pdf" element={<RotatePDF />} />
            
            {/* Security tools */}
            <Route path="/unlock-pdf" element={<ConvertPDF />} />
            <Route path="/protect-pdf" element={<ConvertPDF />} />
            
            {/* Organization tools */}
            <Route path="/organize-pdf" element={<ConvertPDF />} />
            <Route path="/page-numbers" element={<ConvertPDF />} />
            
            {/* Utility tools */}
            <Route path="/html-to-pdf" element={<ConvertPDF />} />
            <Route path="/ocr-pdf" element={<OCRPDF />} />
            <Route path="/repair-pdf" element={<ConvertPDF />} />
            <Route path="/crop-pdf" element={<ConvertPDF />} />
            
            {/* Legacy routes */}
            <Route path="/convert" element={<ConvertPDF />} />
            <Route path="/ocr" element={<OCRPDF />} />
            <Route path="/esign" element={<ESignPDF />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
