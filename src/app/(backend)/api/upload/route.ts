import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { FileS3 } from '@/server/modules/S3';

export const runtime = 'nodejs';
// Allow up to 60 s for large file uploads
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pathname = req.headers.get('x-s3-pathname');
  if (!pathname) {
    return NextResponse.json({ error: 'Missing x-s3-pathname header' }, { status: 400 });
  }

  const contentType = req.headers.get('content-type') || 'application/octet-stream';

  const buffer = Buffer.from(await req.arrayBuffer());

  const s3 = new FileS3();
  await s3.uploadBuffer(pathname, buffer, contentType);

  return NextResponse.json({ ok: true });
}
