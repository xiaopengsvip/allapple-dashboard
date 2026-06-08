import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const logs = db.prepare('SELECT * FROM operation_logs ORDER BY created_at DESC LIMIT ?').all(limit);
  return NextResponse.json({ logs });
}
