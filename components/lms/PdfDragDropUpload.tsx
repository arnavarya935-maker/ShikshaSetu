'use client';

import { useState, useRef, DragEvent } from 'react';
import { UploadCloud, File, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type PdfDragDropUploadProps = {
  onTextExtracted: (text: string, filename: string) => void;
  className?: string;
};

export default function PdfDragDropUpload({ onTextExtracted, className }: PdfDragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successFile, setSuccessFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to load PDF.js dynamically
  const loadPdfJs = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }

      // Check if script is already injected
      let script = document.querySelector('script[src*="pdf.min.js"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
        document.head.appendChild(script);
      }

      script.onload = () => {
        const pdfjs = (window as any).pdfjsLib;
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        resolve(pdfjs);
      };
      script.onerror = () => reject(new Error('Failed to load PDF.js parser.'));
    });
  };

  // Process the uploaded PDF file
  const processPdfFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessFile(null);
    setProgress('Loading PDF engine...');

    try {
      const pdfjs = await loadPdfJs();
      
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        try {
          setProgress('Reading file bytes...');
          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
          
          let extractedText = '';
          const totalPages = pdf.numPages;

          for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            setProgress(`Extracting text... Page ${pageNum} of ${totalPages}`);
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            extractedText += pageText + '\n';
          }

          const cleanedText = extractedText.trim();
          if (cleanedText.length < 10) {
            setError('Could not extract sufficient text from the PDF. Is it a scanned image PDF?');
            setLoading(false);
            return;
          }

          setSuccessFile(file.name);
          // Return the first 6000 chars to fit prompt guidelines cleanly
          onTextExtracted(cleanedText.substring(0, 6000), file.name);
        } catch (err: any) {
          console.error(err);
          setError(err.message || 'Error parsing PDF structure.');
        } finally {
          setLoading(false);
        }
      };

      fileReader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to initialize parser.');
      setLoading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (loading) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processPdfFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processPdfFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (loading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-violet-400 bg-violet-500/10'
            : successFile
            ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
            : 'border-slate-800 bg-slate-900/40 hover:border-violet-500/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          <div className="space-y-3 py-4">
            <Loader2 className="mx-auto h-10 w-10 text-violet-400 animate-spin" />
            <p className="text-xs font-semibold text-white">{progress}</p>
          </div>
        ) : successFile ? (
          <div className="space-y-2 py-2">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
            <p className="text-xs font-bold text-white">Successfully Extracted!</p>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[250px] mx-auto">{successFile}</p>
            <p className="text-[9px] text-violet-400">Click or Drop another PDF to replace</p>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <UploadCloud className="mx-auto h-10 w-10 text-slate-400 group-hover:text-violet-400" />
            <p className="text-xs font-semibold text-slate-200">
              Drag & Drop PDF or <span className="text-violet-400 underline">Browse files</span>
            </p>
            <p className="text-[10px] text-slate-500">Supports standard textual PDF files up to 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-left">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-[11px] text-rose-200 leading-normal">{error}</p>
        </div>
      )}
    </div>
  );
}
