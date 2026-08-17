'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { Sparkles, Camera } from 'lucide-react';

export default function GalleryPage() {
  // Generate 54 image placeholders using loremflickr with education/technology keywords
  const images = Array.from({ length: 54 }).map((_, i) => ({
    id: i,
    url: `https://loremflickr.com/800/${600 + (i % 3) * 100}/education,technology,future?lock=${i + 100}`,
    alt: `Shiksha Setu visual ${i + 1}`,
  }));

  return (
    <main className="bg-white dark:bg-[#090505] min-h-screen text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-full max-w-3xl h-[400px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 relative z-10">
        
        {/* Header */}
        <AnimatedSection className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-900 px-4 py-1.5 text-xs font-mono font-medium tracking-[0.18em] uppercase text-rose-600 dark:text-rose-400">
            <Camera className="h-4 w-4" />
            <span>Visuals</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">Learning</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
            Explore a visual journey of the Shiksha Setu platform. A glimpse into next-generation classrooms, AI integrations, and student success.
          </p>
        </AnimatedSection>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {images.map((img, index) => (
            <AnimatedSection 
              key={img.id} 
              className="break-inside-avoid"
            >
              <div className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900">
                {/* Glow behind image on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/40 via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-auto object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                
                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 flex flex-col justify-end">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-2xl">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-white" />
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Vision {index + 1}</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
