'use client';

import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { UploadCloud, File, AlertCircle, Maximize2, Sparkles, Loader2, X } from 'lucide-react';
import { extractTextFromPdf } from '../../lib/utils/pdf';
import { generateNotesAndSummary, AiSummaryResponse } from '../../lib/ai/client';

export default function ReaderPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [notesStatus, setNotesStatus] = useState('');
  const [notesData, setNotesData] = useState<AiSummaryResponse | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      setFileName(file.name);
      setPdfFile(file);
      setNotesData(null);
      setShowNotes(false);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  const handleGenerateNotes = async () => {
    if (!pdfFile) return;
    setGeneratingNotes(true);
    setShowNotes(true);
    setNotesStatus('Extracting text from PDF...');
    
    try {
      const text = await extractTextFromPdf(pdfFile, setNotesStatus);
      if (text.length < 20) {
        throw new Error('Not enough text extracted from the PDF.');
      }
      setNotesStatus('Synthesizing detailed notes with AI...');
      const data = await generateNotesAndSummary(text, 'detailed');
      setNotesData(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error generating notes.');
      setShowNotes(false);
    } finally {
      setGeneratingNotes(false);
      setNotesStatus('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090505] text-slate-900 dark:text-zinc-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-full max-w-2xl h-[300px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 mt-16 flex flex-col relative z-10">
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
            <div className="flex flex-wrap gap-2">
              {!notesData && !generatingNotes && (
                <button 
                  onClick={handleGenerateNotes}
                  className="flex items-center gap-2 text-xs font-bold bg-rose-600 text-white border border-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Detailed Notes
                </button>
              )}
              {notesData && !showNotes && (
                <button 
                  onClick={() => setShowNotes(true)}
                  className="flex items-center gap-2 text-xs font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 px-4 py-2 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  View Notes
                </button>
              )}
              <button 
                onClick={triggerUpload}
                disabled={generatingNotes}
                className="flex items-center gap-2 text-xs font-bold bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-4 py-2 rounded-lg hover:border-rose-500 transition-colors disabled:opacity-50"
              >
                Open New File
              </button>
            </div>
          )}
        </header>

        <div className="flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-elevated flex relative min-h-[600px]">
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
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              {/* PDF Viewer */}
              <div className="flex-1 relative flex flex-col h-full border-r border-slate-200 dark:border-zinc-800">
                <div className="bg-slate-100 dark:bg-zinc-950 p-2 flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 shrink-0">
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

              {/* Side Panel for Notes */}
              {showNotes && (
                <div className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-zinc-950 flex flex-col h-full shrink-0 border-l border-slate-200 dark:border-zinc-800 z-20">
                  <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-rose-500" />
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Detailed Notes</h2>
                    </div>
                    <button 
                      onClick={() => setShowNotes(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {generatingNotes ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <Loader2 className="h-8 w-8 text-rose-500 animate-spin" />
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium animate-pulse">{notesStatus}</p>
                      </div>
                    ) : notesData ? (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 text-rose-600 dark:text-rose-400">Abstract Summary</h3>
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                            {notesData.summary}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 text-rose-600 dark:text-rose-400">Key Takeaways</h3>
                          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                            {notesData.takeaways.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-slate-500 text-center">No notes generated yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
