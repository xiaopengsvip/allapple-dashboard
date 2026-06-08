import { NextResponse } from 'next/server';
import { queryAll } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const action = url.searchParams.get('action');
  const status = url.searchParams.get('status');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  let sql = 'SELECT * FROM operation_logs WHERE 1=1';
  const params: any[] = [];
  let idx = 1;

  if (action) { sql += ` AND action = $${idx}`; params.push(action); idx++; }
  if (status) { sql += ` AND status = $${idx}`; params.push(status); idx++; }
  if (from) { sql += ` AND created_at >= $${idx}`; params.push(from); idx++; }
  if (to) { sql += ` AND created_at <= $${idx}`; params.push(to); idx++; }

  sql += ` ORDER BY created_at DESC LIMIT $${idx}`;
  params.push(limit);

  const logs = await queryAll(sql, params);
  return NextResponse.json({ logs });
}
