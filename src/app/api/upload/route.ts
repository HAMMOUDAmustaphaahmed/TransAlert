import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${uuidv4()}.${file.name.split('.').pop()}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  try {
    await writeFile(path.join(uploadDir, filename), buffer);
    return NextResponse.json({ filename });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement du fichier' }, { status: 500 });
  }
}