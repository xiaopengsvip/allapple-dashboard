'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { GitFork, Cloud, Server, Globe } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function RelationsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])); }, []);

  const vercelProjects = projects.filter(p => p.deploy_target === 'vercel' || p.deploy_target === 'both');
  const serverProjects = projects.filter(p => p.deploy_target === 'server' || p.deploy_target === 'both');
  const githubProjects = projects.filter(p => p.github_repo);

  const Section = ({ icon: Icon, title, count, color, items }: { icon: any; title: string; count: number; color: string; items: { name: string; tag?: string; dotColor: string }[] }) => (
    <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 20, boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <Icon style={{ width: 16, height: 16, color }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color }}>{count}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-root)', fontSize: 12, border: '1px solid var(--border)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.dotColor, flexShrink: 0 }} />
            <span style={{ flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{item.name}</span>
            {item.tag && <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{item.tag}</span>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AppShell>
      <TopBar title="拓扑视图" subtitle="项目关联全景" />
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Section icon={GitFork} title="GitHub" count={githubProjects.length} color="#F59E0B"
            items={githubProjects.slice(0, 6).map(p => ({ name: p.github_repo, tag: p.domain, dotColor: '#10B981' }))} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Section icon={Cloud} title="▲ Vercel" count={vercelProjects.length} color="#4D7FFF"
              items={vercelProjects.slice(0, 4).map(p => ({ name: p.name, dotColor: '#A78BFA' }))} />
            <Section icon={Server} title="🖥 服务器" count={serverProjects.length} color="#10B981"
              items={serverProjects.slice(0, 4).map(p => ({ name: p.name, tag: `:${p.server_port}`, dotColor: '#4D7FFF' }))} />
          </div>
          <Section icon={Globe} title="域名映射" count={projects.filter(p => p.domain).length} color="#F59E0B"
            items={projects.filter(p => p.domain).slice(0, 6).map(p => ({ name: p.domain, tag: p.name, dotColor: '#F59E0B' }))} />
        </div>
      </div>
    </AppShell>
  );
}
