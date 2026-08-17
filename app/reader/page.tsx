'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  UploadCloud, File, Maximize2, Sparkles, Loader2, X, Library, Clock, Tag, Trash2, 
  ChevronLeft, Volume2, Type, Minus, Plus, Play, Pause, Square, GraduationCap, Target, FileText, Lightbulb,
  Camera, Link as LinkIcon, Layers
} from 'lucide-react';
import { extractTextFromPdf } from '../../lib/utils/pdf';
import { generateNotesAndSummary, AiSummaryResponse, generateExamPrepToolkit, ExamPrepResponse, performOCR } from '../../lib/ai/client';
import { LibraryItem, saveToLibrary, getLibrary, updateLastRead, removeFromLibrary } from '../../lib/storage/library';
import { PDFDocument } from 'pdf-lib';

export default function ReaderPage() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [activeBook, setActiveBook] = useState<LibraryItem | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Upload & Import State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'merge' | 'url' | 'camera' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  
  // Single/Merge Files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeInputRef = useRef<HTMLInputElement>(null);

  // URL Import
  const [importUrl, setImportUrl] = useState('');

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Notes State
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [notesStatus, setNotesStatus] = useState('');
  const [notesData, setNotesData] = useState<AiSummaryResponse | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  // Exam Prep State
  const [generatingExamPrep, setGeneratingExamPrep] = useState(false);
  const [examPrepData, setExamPrepData] = useState<ExamPrepResponse | null>(null);
  const [showExamPrep, setShowExamPrep] = useState(false);

  // Accessibility & Multi-format State
  const [isTextMode, setIsTextMode] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  
  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  useEffect(() => {
    loadLibrary();
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
    return () => {
      stopCamera();
    };
  }, []);

  const loadLibrary = async () => {
    const items = await getLibrary();
    setLibrary(items);
  };

  // --- Handlers for Input Modes ---

  const handleSingleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFiles([file]);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
      setUploadMode('single');
      setUploadModalOpen(true);
    }
  };

  const handleMergeFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setUploadTitle("Merged Document");
      setUploadMode('merge');
      setUploadModalOpen(true);
    }
  };

  const processSingleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    setProcessingStatus('Saving file...');
    const newItem = await saveToLibrary(selectedFiles[0], uploadTitle, uploadSubject);
    finalizeImport(newItem);
  };

  const processMergeUpload = async () => {
    if (selectedFiles.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }
    setIsProcessing(true);
    setProcessingStatus('Merging PDFs...');
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const mergedFile = new File([mergedBlob as any], `${uploadTitle}.pdf`, { type: 'application/pdf' });
      
      setProcessingStatus('Saving merged document...');
      const newItem = await saveToLibrary(mergedFile, uploadTitle, uploadSubject);
      finalizeImport(newItem);
    } catch (err) {
      console.error(err);
      alert('Failed to merge PDFs. Ensure all selected files are valid PDFs.');
      setIsProcessing(false);
    }
  };

  const processUrlImport = async () => {
    if (!importUrl) return;
    setIsProcessing(true);
    setProcessingStatus('Downloading file from URL...');
    try {
      const res = await fetch('/api/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl })
      });
      if (!res.ok) throw new Error('Failed to fetch file. Make sure the link is public.');
      
      const blob = await res.blob();
      const file = new File([blob], `${uploadTitle || 'Imported File'}.pdf`, { type: blob.type || 'application/pdf' });
      
      setProcessingStatus('Saving to library...');
      const newItem = await saveToLibrary(file, uploadTitle || 'Imported File', uploadSubject);
      finalizeImport(newItem);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to import from URL.');
      setIsProcessing(false);
    }
  };

  // --- Camera OCR ---
  const startCamera = async () => {
    setUploadMode('camera');
    setUploadModalOpen(true);
    setUploadTitle('Scanned Page');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureAndOCR = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);
    setProcessingStatus('Capturing image...');
    
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    
    // Set canvas dimensions to video feed
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Get base64 jpeg
    const base64DataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
    // Remove data:image/jpeg;base64, prefix for the API
    const base64Image = base64DataUrl.split(',')[1];
    
    stopCamera();
    setProcessingStatus('AI is analyzing and extracting text...');
    
    try {
      const extractedText = await performOCR(base64Image);
      if (!extractedText) throw new Error('No text found.');
      
      // Create a dummy PDF or a text file. Since our reader currently expects PDFs, 
      // we'll save it as a text file blob and handle it gracefully in the reader by jumping straight to Text Mode.
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const file = new File([blob], `${uploadTitle}.txt`, { type: 'text/plain' });
      
      const newItem = await saveToLibrary(file, uploadTitle, uploadSubject);
      finalizeImport(newItem);
    } catch (err) {
      console.error(err);
      alert('Failed to extract text from image.');
      setIsProcessing(false);
    }
  };

  const finalizeImport = async (newItem: LibraryItem) => {
    await loadLibrary();
    setIsProcessing(false);
    setUploadModalOpen(false);
    resetUploadState();
    openBook(newItem);
  };

  const resetUploadState = () => {
    setUploadMode(null);
    setSelectedFiles([]);
    setUploadTitle('');
    setUploadSubject('');
    setImportUrl('');
    stopCamera();
  };

  const closeUploadModal = () => {
    if (isProcessing) return;
    setUploadModalOpen(false);
    resetUploadState();
  };

  const executeUpload = () => {
    if (uploadMode === 'single') processSingleUpload();
    else if (uploadMode === 'merge') processMergeUpload();
    else if (uploadMode === 'url') processUrlImport();
    else if (uploadMode === 'camera') captureAndOCR();
  };

  // --- Reader Functions ---

  const openBook = async (book: LibraryItem) => {
    await updateLastRead(book.id);
    const url = URL.createObjectURL(book.blob);
    setPdfUrl(url);
    setActiveBook(book);
    
    // Reset sidebars
    setNotesData(null);
    setShowNotes(false);
    setExamPrepData(null);
    setShowExamPrep(false);
    
    // If it's a plain text file (like our OCR result), default to text mode immediately
    if (book.fileType === 'text/plain') {
      setIsTextMode(true);
      const text = await book.blob.text();
      setExtractedText(text);
    } else {
      setIsTextMode(false);
      setExtractedText(null);
    }
    
    stopSpeech();
    await loadLibrary();
  };

  const closeBook = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setActiveBook(null);
    setNotesData(null);
    setShowNotes(false);
    setExamPrepData(null);
    setShowExamPrep(false);
    setIsTextMode(false);
    setExtractedText(null);
    stopSpeech();
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      await removeFromLibrary(id);
      await loadLibrary();
    }
  };

  const toggleTextMode = async () => {
    if (isTextMode) {
      if (activeBook?.fileType === 'text/plain') return; // Cannot exit text mode for plain text files
      setIsTextMode(false);
      stopSpeech();
      return;
    }
    
    if (extractedText) {
      setIsTextMode(true);
      return;
    }

    if (!activeBook) return;
    
    setIsExtractingText(true);
    setIsTextMode(true);
    try {
      const text = await extractTextFromPdf(activeBook.blob);
      setExtractedText(text);
    } catch (error) {
      console.error(error);
      alert('Failed to extract text for accessible reading.');
      setIsTextMode(false);
    } finally {
      setIsExtractingText(false);
    }
  };

  const playSpeech = () => {
    if (!speechSynthesis || !extractedText) return;
    
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPlaying(true);
    } else {
      stopSpeech();
      const utterance = new SpeechSynthesisUtterance(extractedText);
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const pauseSpeech = () => {
    if (!speechSynthesis) return;
    speechSynthesis.pause();
    setIsPlaying(false);
  };

  const stopSpeech = () => {
    if (!speechSynthesis) return;
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleGenerateNotes = async () => {
    if (!activeBook) return;
    setShowExamPrep(false);
    setGeneratingNotes(true);
    setShowNotes(true);
    setNotesStatus('Extracting text...');
    
    try {
      let text = extractedText;
      if (!text) {
        if (activeBook.fileType === 'text/plain') text = await activeBook.blob.text();
        else text = await extractTextFromPdf(activeBook.blob, setNotesStatus);
        setExtractedText(text);
      }
      if (text.length < 20) throw new Error('Not enough text extracted.');
      
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

  const handleGenerateExamPrep = async () => {
    if (!activeBook) return;
    setShowNotes(false);
    setGeneratingExamPrep(true);
    setShowExamPrep(true);
    setNotesStatus('Extracting text...');
    
    try {
      let text = extractedText;
      if (!text) {
        if (activeBook.fileType === 'text/plain') text = await activeBook.blob.text();
        else text = await extractTextFromPdf(activeBook.blob, setNotesStatus);
        setExtractedText(text);
      }
      if (text.length < 20) throw new Error('Not enough text extracted.');
      
      setNotesStatus('Analyzing content for high-yield exam topics...');
      const data = await generateExamPrepToolkit(text);
      setExamPrepData(data);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error generating exam prep toolkit.');
      setShowExamPrep(false);
    } finally {
      setGeneratingExamPrep(false);
      setNotesStatus('');
    }
  };

  // Derived data
  const recentlyRead = [...library].sort((a, b) => b.lastRead - a.lastRead).slice(0, 4);
  const subjects = ['All', ...Array.from(new Set(library.map(b => b.subject)))].filter(Boolean);
  const filteredLibrary = selectedSubject === 'All' 
    ? library 
    : library.filter(b => b.subject === selectedSubject);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090505] text-slate-900 dark:text-zinc-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-full max-w-2xl h-[300px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 mt-16 flex flex-col relative z-10">
        
        {/* Unified Upload & Import Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {uploadMode === 'single' && 'Add to Library'}
                  {uploadMode === 'merge' && 'Merge PDFs'}
                  {uploadMode === 'url' && 'Import from Link'}
                  {uploadMode === 'camera' && 'Scan Page'}
                </h3>
                {!isProcessing && (
                  <button onClick={closeUploadModal} className="p-1 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full text-slate-400">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Loader2 className="h-12 w-12 animate-spin text-rose-500 mb-4" />
                  <p className="font-semibold text-sm">{processingStatus}</p>
                </div>
              ) : (
                <div className="space-y-5 overflow-y-auto scrollbar-hide">
                  
                  {uploadMode === 'camera' ? (
                    <div className="rounded-xl overflow-hidden bg-black aspect-[3/4] sm:aspect-video relative border border-slate-200 dark:border-zinc-800">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute inset-0 border-2 border-rose-500/50 m-8 rounded-lg pointer-events-none"></div>
                      <p className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs font-semibold drop-shadow-md">
                        Align page within the frame
                      </p>
                    </div>
                  ) : (
                    <>
                      {uploadMode === 'url' && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Public Document Link (e.g., Google Drive)</label>
                          <input 
                            type="url" 
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-rose-500 transition-colors"
                          />
                        </div>
                      )}

                      {uploadMode === 'merge' && selectedFiles.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-2">Files to Merge ({selectedFiles.length})</label>
                          <div className="space-y-2 max-h-32 overflow-y-auto p-2 bg-slate-50 dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800">
                            {selectedFiles.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                                <File className="h-3 w-3 shrink-0" /> <span className="truncate">{f.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Document Title</label>
                          <input 
                            type="text" 
                            value={uploadTitle}
                            onChange={(e) => setUploadTitle(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1">Subject (Optional)</label>
                          <input 
                            type="text" 
                            value={uploadSubject}
                            onChange={(e) => setUploadSubject(e.target.value)}
                            placeholder="e.g. Physics..."
                            className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 transition-colors"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!isProcessing && (
                <div className="flex gap-3 mt-8 justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <button onClick={closeUploadModal} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
                  <button 
                    onClick={executeUpload} 
                    className="px-5 py-2 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2"
                  >
                    {uploadMode === 'camera' ? <Camera className="h-4 w-4" /> : <UploadCloud className="h-4 w-4" />}
                    {uploadMode === 'camera' ? 'Capture & Extract' : 'Save to Library'}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleSingleFileSelect}
          accept="application/pdf,application/epub+zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
        />
        <input 
          type="file" 
          multiple
          ref={mergeInputRef}
          onChange={handleMergeFilesSelect}
          accept="application/pdf"
          className="hidden"
        />

        {activeBook && (pdfUrl || activeBook.fileType === 'text/plain') ? (
          <>
            <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={closeBook}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-slate-600 dark:text-zinc-400"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate max-w-sm">
                    {activeBook.title}
                  </h1>
                  <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-semibold bg-rose-50 dark:bg-rose-500/10 inline-block px-2 py-0.5 rounded-md">
                    {activeBook.subject || 'Uncategorized'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {activeBook.fileType !== 'text/plain' && (
                  <button 
                    onClick={toggleTextMode}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-colors border ${
                      isTextMode 
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' 
                        : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-800 hover:border-indigo-500 hover:text-indigo-600'
                    }`}
                  >
                    <Type className="h-4 w-4" />
                    {isTextMode ? 'Exit Text Mode' : 'Accessible Text Mode'}
                  </button>
                )}

                {!examPrepData && !generatingExamPrep && (
                  <button 
                    onClick={handleGenerateExamPrep}
                    className="flex items-center gap-2 text-xs font-bold bg-emerald-600 text-white border border-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <GraduationCap className="h-4 w-4" />
                    Exam Prep Toolkit
                  </button>
                )}
                {examPrepData && !showExamPrep && (
                  <button 
                    onClick={() => { setShowExamPrep(true); setShowNotes(false); }}
                    className="flex items-center gap-2 text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-4 py-2 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    <GraduationCap className="h-4 w-4" />
                    View Exam Toolkit
                  </button>
                )}

                {!notesData && !generatingNotes && (
                  <button 
                    onClick={handleGenerateNotes}
                    className="flex items-center gap-2 text-xs font-bold bg-rose-600 text-white border border-rose-600 px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate Notes
                  </button>
                )}
                {notesData && !showNotes && (
                  <button 
                    onClick={() => { setShowNotes(true); setShowExamPrep(false); }}
                    className="flex items-center gap-2 text-xs font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 px-4 py-2 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" />
                    View Notes
                  </button>
                )}
              </div>
            </header>
            
            <div className="flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-elevated flex flex-col relative min-h-[600px]">
              
              {isTextMode && (
                <div className="bg-slate-100/50 dark:bg-zinc-950/50 border-b border-slate-200 dark:border-zinc-800 p-3 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Font Size</span>
                    <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="p-1.5 bg-white dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"><Minus className="h-4 w-4" /></button>
                    <span className="text-sm font-semibold w-8 text-center">{fontSize}px</span>
                    <button onClick={() => setFontSize(f => Math.min(48, f + 2))} className="p-1.5 bg-white dark:bg-zinc-900 rounded border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"><Plus className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
                      <Volume2 className="h-4 w-4" /> Read Aloud
                    </span>
                    {!isPlaying ? (
                      <button onClick={playSpeech} className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"><Play className="h-4 w-4" /></button>
                    ) : (
                      <button onClick={pauseSpeech} className="p-1.5 bg-amber-50 text-amber-600 rounded border border-amber-200 hover:bg-amber-100"><Pause className="h-4 w-4" /></button>
                    )}
                    <button onClick={stopSpeech} className="p-1.5 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100"><Square className="h-4 w-4" /></button>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-row overflow-hidden relative">
                <div className="flex-1 relative flex flex-col h-full border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#090505] overflow-hidden">
                  {!isTextMode && activeBook.fileType !== 'text/plain' && pdfUrl ? (
                    <iframe 
                      src={`${pdfUrl}#toolbar=0&navpanes=0`} 
                      className="w-full h-full min-h-[600px] border-none"
                      style={{ height: '100%', minHeight: '600px' }}
                      title="PDF Reader"
                    />
                  ) : (
                    <div className="h-full overflow-y-auto p-8 md:p-12 scrollbar-thin">
                      {isExtractingText ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
                          <p>Preparing document...</p>
                        </div>
                      ) : (
                        <div 
                          className="max-w-3xl mx-auto text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-wrap"
                          style={{ fontSize: `${fontSize}px` }}
                        >
                          {extractedText}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Exam Prep Sidebar */}
                {showExamPrep && (
                  <div className="w-full md:w-[450px] lg:w-[500px] bg-white dark:bg-zinc-950 flex flex-col h-full shrink-0 border-l border-slate-200 dark:border-zinc-800 z-20">
                    <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-emerald-50/50 dark:bg-emerald-900/10">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Exam Prep Toolkit</h2>
                      </div>
                      <button onClick={() => setShowExamPrep(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                      {generatingExamPrep ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium animate-pulse">{notesStatus}</p>
                        </div>
                      ) : examPrepData ? (
                        <div className="space-y-8">
                          
                          <div>
                            <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-2">
                              <Target className="h-4 w-4" /> High-Yield Topics
                            </h3>
                            <div className="space-y-3">
                              {examPrepData.importantTopics.map((topic, i) => (
                                <div key={i} className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3">
                                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{topic.topic}</h4>
                                  <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 mt-1">{topic.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-2">
                              <FileText className="h-4 w-4" /> Formulas & Cheat Sheet
                            </h3>
                            <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
                              <table className="w-full text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400">
                                    <th className="px-3 py-2 font-bold w-1/3">Term/Formula</th>
                                    <th className="px-3 py-2 font-bold">Definition</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {examPrepData.formulas.map((item, i) => (
                                    <tr key={i} className="border-b last:border-0 border-slate-100 dark:border-zinc-800/50">
                                      <td className="px-3 py-2 font-mono font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-zinc-900/50">{item.term}</td>
                                      <td className="px-3 py-2 text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-900/50">{item.definition}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-2">
                              <Lightbulb className="h-4 w-4" /> Mock Past-Paper Questions
                            </h3>
                            <div className="space-y-4">
                              {examPrepData.sampleQuestions.map((q, i) => (
                                <div key={i} className="group">
                                  <div className="flex gap-2">
                                    <span className="text-amber-500 font-bold text-sm">Q{i+1}.</span>
                                    <div>
                                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{q.question}</p>
                                      <p className="text-[10px] uppercase font-bold text-amber-600/70 dark:text-amber-400/70 mt-1.5 inline-block px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-900/20">
                                        Cross-link: {q.relatedTopic}
                                      </p>
                                      <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2 p-2 rounded-lg bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <strong className="text-amber-600 dark:text-amber-500">Hint:</strong> {q.answerHint}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-xs text-slate-500 text-center">No toolkit generated yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes Sidebar */}
                {showNotes && (
                  <div className="w-full md:w-[400px] lg:w-[450px] bg-white dark:bg-zinc-950 flex flex-col h-full shrink-0 border-l border-slate-200 dark:border-zinc-800 z-20">
                    <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-rose-50/50 dark:bg-rose-900/10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-rose-500" />
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Detailed Notes</h2>
                      </div>
                      <button onClick={() => setShowNotes(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
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
            </div>
          </>
        ) : (
          /* LIBRARY VIEW */
          <>
            <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  <Library className="h-8 w-8 text-rose-500" />
                  My Library
                </h1>
                <p className="text-sm text-slate-600 dark:text-zinc-400 mt-2">
                  All your files stay on your device for privacy.
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 px-5 py-2.5 rounded-xl hover:border-rose-400 transition-colors shadow-sm"
                  title="Upload a single PDF"
                >
                  <File className="h-4 w-4" />
                  Upload
                </button>
                <button 
                  onClick={() => { setUploadMode('url'); setUploadModalOpen(true); }}
                  className="flex items-center justify-center p-2.5 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-rose-400 transition-colors shadow-sm"
                  title="Import from URL (e.g. Google Drive)"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => mergeInputRef.current?.click()}
                  className="flex items-center justify-center p-2.5 bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 rounded-xl hover:border-rose-400 transition-colors shadow-sm"
                  title="Merge multiple PDFs into one book"
                >
                  <Layers className="h-4 w-4" />
                </button>
                <button 
                  onClick={startCamera}
                  className="flex items-center gap-2 text-sm font-bold bg-rose-600 text-white px-5 py-2.5 rounded-xl hover:bg-rose-700 transition-colors shadow-sm shadow-rose-500/20"
                >
                  <Camera className="h-4 w-4" />
                  Scan Page
                </button>
              </div>
            </header>

            {library.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl hover:border-rose-400 dark:hover:border-rose-500 transition-colors cursor-pointer bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm" onClick={() => fileInputRef.current?.click()}>
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8 text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Your library is empty</h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  Upload PDFs, merge chapters, import from links, or scan physical pages to build your library.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {recentlyRead.length > 0 && (
                  <section>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-rose-500" /> Recently Read
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {recentlyRead.map(book => (
                        <div 
                          key={`recent-${book.id}`}
                          onClick={() => openBook(book)}
                          className="bg-white/70 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl cursor-pointer hover:border-rose-400 hover:shadow-lg transition-all group"
                        >
                          <div className="h-32 bg-slate-100 dark:bg-zinc-950 rounded-xl mb-3 flex items-center justify-center group-hover:bg-rose-50 dark:group-hover:bg-rose-500/5 transition-colors">
                            {book.fileType === 'text/plain' ? (
                              <Type className="h-8 w-8 text-slate-300 dark:text-zinc-700 group-hover:text-rose-400 transition-colors" />
                            ) : (
                              <File className="h-8 w-8 text-slate-300 dark:text-zinc-700 group-hover:text-rose-400 transition-colors" />
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{book.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 truncate">{book.subject}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Library className="h-5 w-5 text-rose-500" /> All Books
                    </h2>
                    
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                      {subjects.map(subject => (
                        <button
                          key={subject}
                          onClick={() => setSelectedSubject(subject)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                            selectedSubject === subject 
                            ? 'bg-rose-600 text-white' 
                            : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-rose-400'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredLibrary.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-sm">
                      No books found for this subject.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredLibrary.map(book => (
                        <div 
                          key={book.id}
                          className="bg-white/70 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl cursor-pointer hover:border-rose-400 hover:shadow-lg transition-all group flex flex-col"
                        >
                          <div 
                            className="flex-1"
                            onClick={() => openBook(book)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-1 rounded-md flex items-center gap-1">
                                <Tag className="h-3 w-3" /> {book.subject || 'Uncategorized'}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1">
                              {book.fileType === 'text/plain' ? <Camera className="h-3 w-3" /> : <File className="h-3 w-3" />}
                              Added {new Date(book.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/50 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => handleDelete(e, book.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                              title="Remove from library"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
