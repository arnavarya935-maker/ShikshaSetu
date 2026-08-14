'use client';

import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { UploadCloud, File, AlertCircle, Maximize2 } from 'lucide-react';

export default function ReaderPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setFileName(file.name);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090505] text-slate-900 dark:text-zinc-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-full max-w-2xl h-[300px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 mt-16 flex flex-col relative z-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-rose-600 dark:text-rose-500">
              E-Book & PDF Reader
            </h1>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Read your study materials in a clean, distraction-free interface.
            </p>
          </div>
          {pdfUrl && (
            <button 
              onClick={triggerUpload}
              className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-lg hover:border-rose-500 transition-colors"
            >
              Open New File
            </button>
          )}
        </header>

        <div className="flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-elevated flex flex-col relative min-h-[600px]">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf"
            className="hidden"
          />

          {!pdfUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 m-8 rounded-2xl hover:border-rose-400 dark:hover:border-rose-500 transition-colors cursor-pointer" onClick={triggerUpload}>
              <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Upload a PDF to start reading</h2>
              <p className="text-xs text-slate-500 max-w-sm">
                Drag and drop your e-books, lecture slides, or past papers here. 
                They stay on your device for privacy.
              </p>
            </div>
          ) : (
            <div className="flex-1 relative flex flex-col h-full">
              <div className="bg-slate-100 dark:bg-zinc-950 p-2 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 px-2">
                  <File className="h-4 w-4 text-rose-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-md">{fileName}</span>
                </div>
                <button 
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-md transition-colors text-slate-500"
                  title="Fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
              <iframe 
                src={`${pdfUrl}#toolbar=0&navpanes=0`} 
                className="w-full h-full flex-1"
                title="PDF Reader"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
