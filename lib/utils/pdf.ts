export const loadPdfJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject('Window undefined');
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

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

export const extractTextFromPdf = async (file: File, onProgress?: (msg: string) => void): Promise<string> => {
  try {
    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const typedarray = new Uint8Array(arrayBuffer);
    
    if (onProgress) onProgress('Loading PDF engine...');
    const pdf = await pdfjs.getDocument({ data: typedarray }).promise;
    
    let extractedText = '';
    const totalPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (onProgress) onProgress(`Extracting text... Page ${pageNum} of ${totalPages}`);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      extractedText += pageText + '\n';
    }

    return extractedText.trim().substring(0, 250000); // Limit size for Gemini
  } catch (err: any) {
    throw new Error(err.message || 'Error extracting text from PDF.');
  }
};
