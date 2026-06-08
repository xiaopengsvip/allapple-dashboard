import { NextResponse } from 'next/server';
import db, { getSetting, setSetting, addLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const keys = ['cloudflare_api_token', 'vercel_token', 'github_token', 'github_org', 'server_host', 'jwt_secret'];
  const settings: Record<string, string> = {};
  for (const k of keys) {
    const v = getSetting(k);
    settings[k] = v ? (k.includes('token') || k.includes('secret') ? '***' + v.slice(-4) : v) : '';
  }
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const body = await request.json();
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string' && !value.startsWith('***')) {
      setSetting(key, value);
    }
  }
  addLog('update', 'settings', 'Updated system settings');
  return NextResponse.json({ success: true });
}
