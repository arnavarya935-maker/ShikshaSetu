'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { UploadCloud, File, AlertCircle, Maximize2, Sparkles, Loader2, X, Library, Clock, Tag, Trash2, ChevronLeft } from 'lucide-react';
import { extractTextFromPdf } from '../../lib/utils/pdf';
import { generateNotesAndSummary, AiSummaryResponse } from '../../lib/ai/client';
import { LibraryItem, saveToLibrary, getLibrary, updateLastRead, removeFromLibrary } from '../../lib/storage/library';

export default function ReaderPage() {
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [activeBook, setActiveBook] = useState<LibraryItem | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notes State
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [notesStatus, setNotesStatus] = useState('');
  const [notesData, setNotesData] = useState<AiSummaryResponse | null>(null);
  const [showNotes, setShowNotes] = useState(false);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const items = await getLibrary();
    setLibrary(items);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
      setUploadTitle(file.name.replace('.pdf', ''));
      setIsUploading(true);
    }
  };

  const confirmUpload = async () => {
    if (!uploadFile) return;
    const newItem = await saveToLibrary(uploadFile, uploadTitle, uploadSubject);
    await loadLibrary();
    setIsUploading(false);
    setUploadFile(null);
    setUploadTitle('');
    setUploadSubject('');
    openBook(newItem);
  };

  const cancelUpload = () => {
    setIsUploading(false);
    setUploadFile(null);
    setUploadTitle('');
    setUploadSubject('');
  };

  const openBook = async (book: LibraryItem) => {
    await updateLastRead(book.id);
    const url = URL.createObjectURL(book.blob);
    setPdfUrl(url);
    setActiveBook(book);
    setNotesData(null);
    setShowNotes(false);
    await loadLibrary(); // Refresh last read order
  };

  const closeBook = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setActiveBook(null);
    setNotesData(null);
    setShowNotes(false);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this book?')) {
      await removeFromLibrary(id);
      await loadLibrary();
    }
  };

  const handleGenerateNotes = async () => {
    if (!activeBook) return;
    setGeneratingNotes(true);
    setShowNotes(true);
    setNotesStatus('Extracting text from PDF...');
    
    try {
      const fileToExtract = new File([activeBook.blob], activeBook.title + '.pdf', { type: 'application/pdf' });
      const text = await extractTextFromPdf(fileToExtract, setNotesStatus);
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
        
        {/* Upload Modal */}
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-zinc-800">
              <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Add to Library</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Subject / Tag (Optional)</label>
                  <input 
                    type="text" 
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value)}
                    placeholder="e.g. Physics, Math, History..."
                    className="w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button onClick={cancelUpload} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Cancel</button>
                <button onClick={confirmUpload} className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-sm">Save & Open</button>
              </div>
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/pdf"
          className="hidden"
        />

        {/* READER VIEW */}
        {activeBook && pdfUrl ? (
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
                    {activeBook.subject}
                  </p>
                </div>
              </div>
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
              </div>
            </header>
            
            <div className="flex-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-elevated flex relative min-h-[600px]">
              <div className="flex-1 relative flex flex-col h-full border-r border-slate-200 dark:border-zinc-800">
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
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 text-sm font-bold bg-rose-600 text-white px-5 py-2.5 rounded-xl hover:bg-rose-700 transition-colors shadow-sm shadow-rose-500/20"
              >
                <UploadCloud className="h-4 w-4" />
                Upload New
              </button>
            </header>

            {library.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl hover:border-rose-400 dark:hover:border-rose-500 transition-colors cursor-pointer bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm" onClick={() => fileInputRef.current?.click()}>
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="h-8 w-8 text-rose-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Your library is empty</h2>
                <p className="text-sm text-slate-500 max-w-sm">
                  Upload PDFs to start building your personal, privacy-first library. Everything stays on your device.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Recently Read */}
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
                            <File className="h-8 w-8 text-slate-300 dark:text-zinc-700 group-hover:text-rose-400 transition-colors" />
                          </div>
                          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{book.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 truncate">{book.subject}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* All Books */}
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
                                <Tag className="h-3 w-3" /> {book.subject}
                              </span>
                            </div>
                            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-[10px] text-slate-400">
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
