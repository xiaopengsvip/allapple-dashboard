import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const decoded = decodeURIComponent(name);
    const logs = execSync(`pm2 logs ${decoded} --nostream --lines 100 2>&1`, { timeout: 10000 }).toString();
    return NextResponse.json({ logs, name: decoded });
  } catch (e: any) {
    return NextResponse.json({ logs: '', error: e.message }, { status: 500 });
  }
}
