import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // 从数据库获取完整用户信息（JWT 里没有 avatar_url 等字段）
  const row = db.prepare('SELECT id, username, role, display_name, avatar_url, created_at FROM users WHERE id = ?').get(user.id) as any;
  return NextResponse.json({ user: row || user });
}
