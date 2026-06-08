import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const row = await queryOne('SELECT id, username, role, display_name, avatar_url, created_at FROM users WHERE id = $1', [user.id]);
  return NextResponse.json({ user: row || user });
}
