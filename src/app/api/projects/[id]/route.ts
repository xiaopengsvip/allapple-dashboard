import { NextResponse } from 'next/server';
import { queryOne, query, addLog } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await queryOne('SELECT * FROM projects WHERE id = $1', [id]);
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const existing = await queryOne('SELECT * FROM projects WHERE id = $1', [id]);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const fields = ['name', 'description', 'category', 'tech_stack', 'status', 'deploy_target', 'github_repo', 'domain', 'color', 'pm2_name', 'server_port'];
  const updates: string[] = [];
  const values: any[] = [];
  let idx = 1;
  for (const f of fields) {
    if (body[f] !== undefined) {
      updates.push(`${f} = $${idx}`);
      values.push(f === 'tech_stack' ? JSON.stringify(body[f]) : body[f]);
      idx++;
    }
  }
  if (updates.length > 0) {
    values.push(id);
    await query(`UPDATE projects SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx}`, values);
    await addLog('update', 'project', `Updated project: ${body.name || id}`);
  }
  const project = await queryOne('SELECT * FROM projects WHERE id = $1', [id]);
  return NextResponse.json({ project });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await queryOne('SELECT * FROM projects WHERE id = $1', [id]) as any;
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await query('DELETE FROM projects WHERE id = $1', [id]);
  await addLog('delete', 'project', `Deleted project: ${project.name}`);
  return NextResponse.json({ success: true });
}
