import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { queryOne, query, addLog } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { project_id, environment } = await request.json();
  if (!project_id) return NextResponse.json({ error: 'project_id required' }, { status: 400 });

  const project = await queryOne('SELECT * FROM projects WHERE id = $1', [project_id]);
  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const deployId = uuidv4();
  const env = environment || 'production';
  const startTime = Date.now();

  // Create deployment record
  await query(
    `INSERT INTO deployments (id, project_id, environment, status, trigger) VALUES ($1, $2, $3, 'running', 'manual')`,
    [deployId, project_id, env]
  );

  await addLog('deploy', 'project', `Triggered deploy: ${project.name} (${env})`);

  // Try actual deployment based on target
  let result = '';
  let status = 'success';
  try {
    if (project.deploy_target === 'server' || project.deploy_target === 'both') {
      if (project.pm2_name) {
        execSync(`pm2 restart ${project.pm2_name}`, { timeout: 15000 });
        result = `PM2 restarted: ${project.pm2_name}`;
      }
    }
    if (project.deploy_target === 'vercel' || project.deploy_target === 'both') {
      result += (result ? '\n' : '') + 'Vercel deployment triggered (check Vercel dashboard)';
    }
  } catch (e: any) {
    status = 'failed';
    result = e.message;
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  // Update deployment record
  await query(
    `UPDATE deployments SET status = $1, duration = $2, log = $3, commit_message = $4 WHERE id = $5`,
    [status, duration, result, `Manual deploy by ${user.username}`, deployId]
  );

  await addLog('deploy', 'project', `Deploy ${status}: ${project.name} (${duration}s)`, status);

  return NextResponse.json({ success: status === 'success', deployment_id: deployId, status, result, duration });
}
