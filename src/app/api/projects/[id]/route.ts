import { NextResponse } from 'next/server';
import db, { addLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const fields = ['name', 'description', 'category', 'tech_stack', 'status', 'deploy_target', 'github_repo', 'domain', 'color', 'pm2_name', 'server_port'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) {
    if (body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(f === 'tech_stack' ? JSON.stringify(body[f]) : body[f]);
    }
  }
  if (updates.length > 0) {
    values.push(id);
    db.prepare(`UPDATE projects SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
    addLog('update', 'project', `Updated project: ${body.name || id}`);
  }
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return NextResponse.json({ project });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  addLog('delete', 'project', `Deleted project: ${project.name}`);
  return NextResponse.json({ success: true });
}
