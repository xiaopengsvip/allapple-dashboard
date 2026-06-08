import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { queryOne, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const row = await queryOne('SELECT id, username, role, display_name, avatar_url, created_at FROM users WHERE id = $1', [user.id]);
  return NextResponse.json({ user: row });
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { display_name } = body;
  await query('UPDATE users SET display_name = $1 WHERE id = $2', [display_name || '', user.id]);
  const row = await queryOne('SELECT id, username, role, display_name, avatar_url, created_at FROM users WHERE id = $1', [user.id]);
  return NextResponse.json({ user: row });
}
