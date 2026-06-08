import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = execSync('pm2 jlist', { timeout: 5000 }).toString();
    const services = JSON.parse(raw);
    return NextResponse.json({ services });
  } catch (e: any) {
    return NextResponse.json({ services: [], error: e.message });
  }
}
