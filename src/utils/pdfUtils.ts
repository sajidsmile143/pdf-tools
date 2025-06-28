
import { PDFDocument } from 'pdf-lib';

export const mergePDFs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
};

export const splitPDF = async (file: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const splitPdfs: Uint8Array[] = [];

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const pageIndices = [];
    
    for (let i = range.start - 1; i < range.end; i++) {
      if (i < pdf.getPageCount()) {
        pageIndices.push(i);
      }
    }
    
    const copiedPages = await newPdf.copyPages(pdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    splitPdfs.push(pdfBytes);
  }

  return splitPdfs;
};

export const compressPDF = async (file: File, quality: number = 0.5): Promise<Uint8Array> => {
  // Basic compression by reducing metadata and optimizing
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Remove metadata to reduce size
  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('PDFRide');
  pdf.setCreator('PDFRide');
  
  return await pdf.save({
    useObjectStreams: false,
    addDefaultPage: false,
  });
};

export const downloadPDF = (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
