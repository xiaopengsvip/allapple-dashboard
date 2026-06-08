import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { queryAll, queryOne, query, addLog } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const users = await queryAll('SELECT id, username, role, display_name, avatar_url, created_at FROM users ORDER BY created_at DESC');
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { username, password, role } = await request.json();
  if (!username || !password) return NextResponse.json({ error: '用户名和密码必填' }, { status: 400 });

  const existing = await queryOne('SELECT id FROM users WHERE username = $1', [username]);
  if (existing) return NextResponse.json({ error: '用户名已存在' }, { status: 409 });

  const hash = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  await query('INSERT INTO users (id, username, password_hash, role) VALUES ($1, $2, $3, $4)', [id, username, hash, role || 'viewer']);
  await addLog('create', 'user', `Created user: ${username} (role: ${role || 'viewer'})`);
  return NextResponse.json({ user: { id, username, role: role || 'viewer' } });
}

export async function DELETE(request: Request) {
  const user = await getAuthUser();
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await request.json();
  if (id === user.id) return NextResponse.json({ error: '不能删除自己' }, { status: 400 });
  const target = await queryOne('SELECT username FROM users WHERE id = $1', [id]);
  await query('DELETE FROM users WHERE id = $1', [id]);
  await addLog('delete', 'user', `Deleted user: ${target?.username || id}`);
  return NextResponse.json({ success: true });
}
