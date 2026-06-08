'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { GitFork, Cloud, Server, Globe, ExternalLink, ArrowRight, ArrowDown } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function RelationsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => { fetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || [])); }, []);

  const vercelProjects = projects.filter(p => p.deploy_target === 'vercel' || p.deploy_target === 'both');
  const serverProjects = projects.filter(p => p.deploy_target === 'server' || p.deploy_target === 'both');
  const githubProjects = projects.filter(p => p.github_repo);
  const domains = projects.filter(p => p.domain);

  return (
    <AppShell>
      <TopBar title="拓扑视图" subtitle="基础设施关联全景" />
      <div style={{ padding: 24 }}>

        {/* Flow Diagram */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)',
          padding: 28, marginBottom: 24, boxShadow: 'var(--shadow-card)',
        }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5, marginBottom: 24 }}>基础设施拓扑</h3>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* GitHub */}
            <FlowNode icon={GitFork} title="GitHub" count={githubProjects.length} subtitle="仓库" color="#F59E0B"
              items={githubProjects.slice(0, 5).map(p => ({ name: p.github_repo, tag: p.domain }))} />

            {/* Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 40 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>CI/CD</div>
              <ArrowRight style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
            </div>

            {/* Deploy Targets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <FlowNode icon={Cloud} title="▲ Vercel" count={vercelProjects.length} subtitle="Edge" color="#FFFFFF"
                items={vercelProjects.slice(0, 3).map(p => ({ name: p.name, tag: p.domain }))} />
              <FlowNode icon={Server} title="🖥 服务器" count={serverProjects.length} subtitle="PM2" color="#4D7FFF"
                items={serverProjects.slice(0, 3).map(p => ({ name: p.name, tag: `:${p.server_port}` }))} />
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 40 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>DNS</div>
              <ArrowRight style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
            </div>

            {/* Domains */}
            <FlowNode icon={Globe} title="☁ Cloudflare" count={domains.length} subtitle="域名" color="#F59E0B"
              items={domains.slice(0, 5).map(p => ({ name: p.domain, tag: p.name }))} />
          </div>
        </div>

        {/* Detail Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {/* GitHub Detail */}
          <DetailCard title="GitHub 仓库" count={githubProjects.length} icon={GitFork} color="#F59E0B"
            items={githubProjects.map(p => ({
              name: p.github_repo,
              sub: p.domain,
              link: `https://github.com/xiaopengsvip/${p.github_repo}`,
              dotColor: '#10B981',
            }))} />

          {/* Vercel Detail */}
          <DetailCard title="Vercel 项目" count={vercelProjects.length} icon={Cloud} color="#FFFFFF"
            items={vercelProjects.map(p => ({
              name: p.name,
              sub: p.domain,
              link: p.domain ? `https://${p.domain}` : undefined,
              dotColor: '#A78BFA',
            }))} />

          {/* Server Detail */}
          <DetailCard title="服务器 PM2" count={serverProjects.length} icon={Server} color="#4D7FFF"
            items={serverProjects.map(p => ({
              name: p.name,
              sub: p.pm2_name ? `${p.pm2_name} :${p.server_port}` : p.domain,
              link: p.domain ? `https://${p.domain}` : undefined,
              dotColor: '#4D7FFF',
            }))} />

          {/* Domains Detail */}
          <DetailCard title="域名映射" count={domains.length} icon={Globe} color="#F59E0B"
            items={domains.map(p => ({
              name: p.domain,
              sub: p.name,
              link: `https://${p.domain}`,
              dotColor: '#F59E0B',
            }))} />
        </div>
      </div>
    </AppShell>
  );
}

/* Flow Node - for the topology diagram */
function FlowNode({ icon: Icon, title, count, subtitle, color, items }: {
  icon: any; title: string; count: number; subtitle: string; color: string;
  items: { name: string; tag?: string }[];
}) {
  return (
    <div style={{
      background: 'var(--bg-root)', borderRadius: 16, border: '1px solid var(--border)',
      padding: 16, minWidth: 200, maxWidth: 240,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon style={{ width: 16, height: 16, color }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, marginLeft: 'auto' }}>{count}</span>
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{subtitle}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
            borderRadius: 8, fontSize: 11, background: 'var(--bg-card)', border: '1px solid var(--border)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
            {item.tag && <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{item.tag}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Detail Card - for the bottom grid */
function DetailCard({ title, count, icon: Icon, color, items }: {
  title: string; count: number; icon: any; color: string;
  items: { name: string; sub?: string; link?: string; dotColor: string }[];
}) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)',
      overflow: 'hidden', boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
      }}>
        <Icon style={{ width: 16, height: 16, color }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color, marginLeft: 'auto' }}>{count}</span>
      </div>
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
            transition: `background 150ms ${EASE}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.dotColor, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
              {item.sub && <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>}
            </div>
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <ExternalLink style={{ width: 12, height: 12 }} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
