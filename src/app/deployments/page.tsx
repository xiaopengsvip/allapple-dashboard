'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Rocket, RefreshCw, ExternalLink, Play } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function DeploymentsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState<string | null>(null);
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/projects'); const data = await res.json(); setProjects(data.projects || []); } catch {} setLoading(false); };

  const handleDeploy = async (projectId: string, name: string) => {
    if (!confirm(`Deploy ${name}?`)) return;
    setDeploying(projectId);
    try {
      const res = await fetch('/api/deployments/trigger', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: projectId }) });
      const data = await res.json();
      alert(data.success ? `Deployed successfully (${data.duration}s)` : `Deploy failed: ${data.result}`);
      fetchData();
    } catch { alert('Deploy failed'); }
    setDeploying(null);
  };
  useEffect(() => { fetchData(); }, []);

  const vercelProjects = projects.filter(p => p.deploy_target === 'vercel' || p.deploy_target === 'both');
  const serverProjects = projects.filter(p => p.deploy_target === 'server' || p.deploy_target === 'both');

  return (
    <AppShell>
      <TopBar title={t("deployments.title")} subtitle={t("deployments.subtitle")} />
      <div style={{ padding: 24,  }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t("deployments.all_status")}</span>
          <button onClick={fetchData} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} /> {t("deployments.refresh")}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[{ title: t('deployments.vercel_deploy'), items: vercelProjects, color: '#4D7FFF', emptyMsg: t('deployments.no_vercel') }, { title: t('deployments.server_deploy'), items: serverProjects, color: '#10B981', emptyMsg: t('deployments.no_server') }].map(section => (
            <div key={section.title} style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{section.title}</h3>
              </div>
              {section.items.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{section.emptyMsg}</div>
              ) : section.items.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: p.status === 'active' ? 'var(--success)' : 'var(--warning)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.domain || p.pm2_name || '—'}</div>
                  </div>
                  {p.domain && <a href={`https://${p.domain}`} target="_blank" style={{ color: 'var(--accent)' }}><ExternalLink style={{ width: 14, height: 14 }} /></a>}
                  <button onClick={() => handleDeploy(p.id, p.name)} disabled={deploying === p.id} title="Deploy"
                    style={{ padding: 6, borderRadius: 8, background: 'var(--accent-soft)', border: 'none', cursor: 'pointer', color: 'var(--accent)', opacity: deploying === p.id ? 0.5 : 1 }}>
                    <Play style={{ width: 12, height: 12, animation: deploying === p.id ? 'spin 1s linear infinite' : 'none' }} />
                  </button>
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 600 }}>{t("deployments.success")}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
