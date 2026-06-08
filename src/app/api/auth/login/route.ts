import { NextResponse } from 'next/server';
import { authenticateUser, signToken } from '@/lib/auth';
import { addLog } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const user = authenticateUser(username, password);
    if (!user) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }
    const token = signToken(user);
    addLog('login', 'auth', `User ${username} logged in`);
    const res = NextResponse.json({ success: true, user, token });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600,
      path: '/',
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
