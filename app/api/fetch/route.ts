import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Try to fetch the URL
    // If it's a Google Drive link, we might need to transform it to the direct download link
    let fetchUrl = url;
    const gDriveMatch = url.match(/\/file\/d\/([^/]+)/);
    if (gDriveMatch && gDriveMatch[1]) {
      fetchUrl = `https://drive.google.com/uc?export=download&id=${gDriveMatch[1]}`;
    }

    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file. Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment; filename="downloaded_file"');

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers
    });
  } catch (error: any) {
    console.error('Fetch proxy error:', error);
    return NextResponse.json({ error: error.message || 'Failed to download file from URL' }, { status: 500 });
  }
}
