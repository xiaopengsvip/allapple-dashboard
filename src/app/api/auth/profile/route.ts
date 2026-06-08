import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const row = db.prepare('SELECT id, username, role, display_name, avatar_url, created_at FROM users WHERE id = ?').get(user.id) as any;
  return NextResponse.json({ user: row });
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { display_name } = body;
  db.prepare('UPDATE users SET display_name = ? WHERE id = ?').run(display_name || '', user.id);
  const row = db.prepare('SELECT id, username, role, display_name, avatar_url, created_at FROM users WHERE id = ?').get(user.id) as any;
  return NextResponse.json({ user: row });
}
