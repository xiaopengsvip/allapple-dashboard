'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Package, Globe, GitFork, ExternalLink, Cloud, Server, Clock, ArrowLeft, Edit3, Save, X } from 'lucide-react';
import Link from 'next/link';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ProjectDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState<any>(null);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/projects/${params.id}`).then(r => r.json()).then(d => {
      setProject(d.project);
      setForm(d.project || {});
    });
    fetch('/api/deployments').then(r => r.json()).then(d => {
      const projDeployments = (d.deployment_history || []).filter((dep: any) => dep.project_id === params.id);
      setDeployments(projDeployments);
    });
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/projects/${params.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data.project) { setProject(data.project); setEditing(false); }
    setSaving(false);
  };

  if (!project) return <AppShell><TopBar title="Loading..." /><div style={{ padding: 24, color: 'var(--text-muted)' }}>Loading...</div></AppShell>;

  const statusColor = project.status === 'active' ? 'var(--success)' : 'var(--warning)';

  return (
    <AppShell>
      <TopBar title={project.name} subtitle={project.category} />
      <div style={{ padding: 24 }}>
        <Link href="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', marginBottom: 20 }}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Projects
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Project Info */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Project Info</h3>
              <button onClick={() => editing ? setEditing(false) : setEditing(true)} style={{ padding: '6px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'none', cursor: 'pointer' }}>
                {editing ? <><X style={{ width: 12, height: 12, display: 'inline' }} /> Cancel</> : <><Edit3 style={{ width: 12, height: 12, display: 'inline' }} /> Edit</>}
              </button>
            </div>

            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input value={form.domain || ''} onChange={e => setForm({...form, domain: e.target.value})} placeholder="Domain" style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input value={form.github_repo || ''} onChange={e => setForm({...form, github_repo: e.target.value})} placeholder="GitHub Repo" style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <select value={form.status || 'active'} onChange={e => setForm({...form, status: e.target.value})} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                  <option value="active">Active</option>
                  <option value="developing">Developing</option>
                  <option value="archived">Archived</option>
                </select>
                <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                  <Save style={{ width: 14, height: 14, display: 'inline', marginRight: 6 }} />{saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: project.color, background: `${project.color}15`, border: `1px solid ${project.color}25` }}>{project.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{project.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{project.category}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Status', value: project.status, color: statusColor },
                    { label: 'Deploy', value: project.deploy_target, color: 'var(--accent)' },
                    { label: 'Domain', value: project.domain || '—', color: 'var(--text-secondary)' },
                    { label: 'GitHub', value: project.github_repo || '—', color: 'var(--text-secondary)' },
                    { label: 'PM2', value: project.pm2_name || '—', color: 'var(--text-secondary)' },
                    { label: 'Port', value: project.server_port || '—', color: 'var(--text-secondary)' },
                  ].map(item => (
                    <div key={item.label} style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase' as const }}>{item.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {project.domain && <a href={`https://${project.domain}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'var(--accent-soft)', color: 'var(--accent)', textDecoration: 'none' }}><Globe style={{ width: 12, height: 12 }} /> Visit Site <ExternalLink style={{ width: 10, height: 10 }} /></a>}
                  {project.github_repo && <a href={`https://github.com/xiaopengsvip/${project.github_repo}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', textDecoration: 'none' }}><GitFork style={{ width: 12, height: 12 }} /> GitHub <ExternalLink style={{ width: 10, height: 10 }} /></a>}
                </div>
              </div>
            )}
          </div>

          {/* Deployment History */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Deployment History</h3>
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {deployments.length > 0 ? deployments.map((d, i) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < deployments.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.status === 'success' ? 'var(--success)' : d.status === 'failed' ? 'var(--error)' : 'var(--warning)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{d.environment} — {d.status}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.commit_message || d.trigger}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.duration ? `${d.duration}s` : ''}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(d.created_at).toLocaleString()}</span>
                </div>
              )) : (
                <div style={{ padding: 40, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>No deployment history</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
