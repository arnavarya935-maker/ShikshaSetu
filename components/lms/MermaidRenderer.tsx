'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { AlertCircle } from 'lucide-react';

export default function MermaidRenderer({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      if (!chart || !containerRef.current) return;
      setError(null);
      setSvgContent(null);
      
      try {
        const id = `mermaid-svg-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        setSvgContent(svg);
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError('Failed to render mind map. The AI may have generated invalid syntax.');
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center bg-white dark:bg-zinc-900 rounded-2xl border border-rose-200/80 dark:border-zinc-800 p-6 overflow-auto">
      {error ? (
        <div className="flex flex-col items-center justify-center text-rose-500 gap-2">
          <AlertCircle className="h-6 w-6" />
          <p className="text-xs">{error}</p>
          <pre className="text-[10px] mt-2 bg-rose-500/10 p-2 rounded max-w-sm overflow-auto text-left">
            {chart}
          </pre>
        </div>
      ) : svgContent ? (
        <div 
          ref={containerRef} 
          dangerouslySetInnerHTML={{ __html: svgContent }} 
          className="w-full h-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
        />
      ) : (
        <p className="text-xs text-zinc-500 animate-pulse">Rendering mind map...</p>
      )}
    </div>
  );
}
