import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  
  if (!filename) {
    return new NextResponse('Fichier non spécifié', { status: 400 });
  }

  try {
    const filePath = path.join('/tmp', filename);
    const file = fs.readFileSync(filePath);
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/*',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error) {
    return new NextResponse('Fichier non trouvé', { status: 404 });
  }
}