import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { addLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const decoded = decodeURIComponent(name);
    execSync(`pm2 stop ${decoded}`, { timeout: 10000 });
    await addLog('stop', 'pm2', `Stopped PM2 process: ${decoded}`);
    return NextResponse.json({ success: true, message: `Stopped ${decoded}` });
  } catch (e: any) {
    await addLog('stop', 'pm2', `Failed to stop: ${e.message}`, 'failed');
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
