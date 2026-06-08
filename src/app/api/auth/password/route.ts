import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { current_password, new_password } = await request.json();
  if (!current_password || !new_password) return NextResponse.json({ error: '请输入当前密码和新密码' }, { status: 400 });
  if (new_password.length < 6) return NextResponse.json({ error: '新密码至少6位' }, { status: 400 });

  const row = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(user.id) as any;
  if (!bcrypt.compareSync(current_password, row.password_hash)) {
    return NextResponse.json({ error: '当前密码错误' }, { status: 400 });
  }

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, user.id);
  return NextResponse.json({ success: true, message: '密码修改成功' });
}
