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
    execSync(`pm2 restart ${decoded}`, { timeout: 10000 });
    await addLog('restart', 'pm2', `Restarted PM2 process: ${decoded}`);
    return NextResponse.json({ success: true, message: `Restarted ${decoded}` });
  } catch (e: any) {
    await addLog('restart', 'pm2', `Failed to restart: ${e.message}`, 'failed');
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
