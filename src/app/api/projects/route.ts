import { NextResponse } from 'next/server';
import db, { addLog } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    return NextResponse.json({ projects });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();
    db.prepare(`INSERT INTO projects (id, name, description, category, tech_stack, status, deploy_target, github_repo, domain, color, pm2_name, server_port) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, body.name, body.description || '', body.category || '工具',
      JSON.stringify(body.tech_stack || []), body.status || 'active',
      body.deploy_target || 'vercel', body.github_repo || null,
      body.domain || null, body.color || '#06d6a0',
      body.pm2_name || null, body.server_port || null
    );
    addLog('create', 'project', `Created project: ${body.name}`);
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    return NextResponse.json({ project }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
