import { NextResponse } from 'next/server';
import { queryAll, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await queryAll('SELECT * FROM projects ORDER BY updated_at DESC');
    const logs = await queryAll(
      "SELECT * FROM operation_logs WHERE action LIKE '%deploy%' OR action LIKE '%push%' ORDER BY created_at DESC LIMIT 50"
    );
    const deployments = await queryAll('SELECT d.*, p.name as project_name FROM deployments d LEFT JOIN projects p ON d.project_id = p.id ORDER BY d.created_at DESC LIMIT 50');

    const mapped = projects.map((p: any) => ({
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

    return NextResponse.json({ deployments: mapped, recent_logs: logs, deployment_history: deployments });
  } catch (e: any) {
    return NextResponse.json({ deployments: [], recent_logs: [], deployment_history: [], error: e.message });
  }
}
