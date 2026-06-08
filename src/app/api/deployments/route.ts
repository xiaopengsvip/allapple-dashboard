import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'dashboard.db');

export async function GET() {
  try {
    const db = new Database(dbPath, { readonly: true });
    const projects = db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all();
    const logs = db.prepare("SELECT * FROM operation_logs WHERE action LIKE '%deploy%' OR action LIKE '%push%' ORDER BY created_at DESC LIMIT 50").all();
    db.close();

    const deployments = projects.map((p: any) => ({
      project_id: p.id,
      project_name: p.name,
      deploy_target: p.deploy_target,
      domain: p.domain,
      pm2_name: p.pm2_name,
      server_port: p.server_port,
      github_repo: p.github_repo,
      status: p.status,
      updated_at: p.updated_at,
    }));

    return NextResponse.json({ deployments, recent_logs: logs });
  } catch (e: any) {
    return NextResponse.json({ deployments: [], recent_logs: [], error: e.message });
  }
}
