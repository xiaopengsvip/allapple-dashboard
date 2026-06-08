import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import os from 'os';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const uptime = os.uptime();

    let disk = { total: 0, used: 0, free: 0 };
    try {
      const df = execSync("df -B1 / | tail -1", { timeout: 3000 }).toString().trim();
      const parts = df.split(/\s+/);
      disk = { total: parseInt(parts[1]) || 0, used: parseInt(parts[2]) || 0, free: parseInt(parts[3]) || 0 };
    } catch {}

    let loadAvg = os.loadavg();

    return NextResponse.json({
      stats: {
        cpu: {
          model: cpus[0]?.model || 'Unknown',
          cores: cpus.length,
          loadAvg: loadAvg.map(l => Math.round(l * 100) / 100),
        },
        memory: {
          total: totalMem,
          free: freeMem,
          used: totalMem - freeMem,
          percent: Math.round(((totalMem - freeMem) / totalMem) * 100),
        },
        disk: {
          total: disk.total,
          used: disk.used,
          free: disk.free,
          percent: disk.total > 0 ? Math.round((disk.used / disk.total) * 100) : 0,
        },
        uptime,
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
