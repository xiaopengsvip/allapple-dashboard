import { NextResponse } from 'next/server';
import { queryAll } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const pattern = `%${q}%`;

  const [projects, domains, logs] = await Promise.all([
    queryAll('SELECT id, name, domain, category, status FROM projects WHERE name ILIKE $1 OR domain ILIKE $1 LIMIT 10', [pattern]),
    queryAll('SELECT id, name, domain, category FROM projects WHERE domain ILIKE $1 LIMIT 10', [pattern]),
    queryAll('SELECT id, action, target, detail, created_at FROM operation_logs WHERE action ILIKE $1 OR target ILIKE $1 OR detail ILIKE $1 ORDER BY created_at DESC LIMIT 10', [pattern]),
  ]);

  return NextResponse.json({
    results: [
      ...projects.map((p: any) => ({ type: 'project', id: p.id, title: p.name, subtitle: p.domain || p.category, status: p.status })),
      ...domains.filter((d: any) => d.domain && !projects.find((p: any) => p.id === d.id)).map((d: any) => ({ type: 'domain', id: d.id, title: d.domain, subtitle: d.name })),
      ...logs.map((l: any) => ({ type: 'log', id: l.id, title: l.action, subtitle: l.detail || l.target, time: l.created_at })),
    ],
  });
}
