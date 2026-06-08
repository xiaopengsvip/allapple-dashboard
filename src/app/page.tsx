'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import {
  Package, Globe, Cloud, Server, GitFork, ExternalLink, Activity,
  Shield, Rocket, Play, FileText, Link as LinkIcon, TrendingUp,
  CheckCircle2, AlertTriangle, Layers, Clock, ArrowUpRight, Cpu
} from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function Card({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <div className="anim-fade-up" style={{
      background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
      transition: `box-shadow 250ms ${EASE}, border-color 250ms ${EASE}, transform 250ms ${EASE}`,
      animationDelay: `${delay * 0.04}s`, ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</div>
  );
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const { t } = useTranslation();
  const [pm2, setPm2] = useState<any[]>([]);
  const [sys, setSys] = useState<any>(null);
  const [domains, setDomains] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, pm2Res, statsRes, domainsRes, logsRes, ghRes] = await Promise.all([
          fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
          fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
          fetch('/api/server/stats').then(r => r.json()).catch(() => ({ stats: null })),
          fetch('/api/domains').then(r => r.json()).catch(() => ({ records: [] })),
          fetch('/api/logs?limit=10').then(r => r.json()).catch(() => ({ logs: [] })),
          fetch('/api/github/repos').then(r => r.json()).catch(() => ({ repos: [] })),
        ]);
        setProjects(projRes.projects || []);
        setPm2(pm2Res.services || []);
        setSys(statsRes.stats);
        setDomains(domainsRes.records || []);
        setLogs(logsRes.logs || []);
        setGithubRepos(ghRes.repos || []);
      } catch {}
      setTimeout(() => setLoaded(true), 50);
    };
    load();
  }, []);

  const vercelCount = projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').length;
  const serverCount = pm2.filter((s: any) => s.status === 'online').length;
  const domainCount = domains.length;
  const githubCount = githubRepos.length || projects.filter((p: any) => p.github_repo).length;
  const fmtBytes = (b: number) => b > 1e9 ? (b / 1e9).toFixed(1) + ' GB' : (b / 1e6).toFixed(0) + ' MB';
  const fmtUptime = (s: number) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600); return `${d}d ${h}h`; };
  const fmtTime = (t: string) => { try { return new Date(t).toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); } catch { return t; } };

  // Compute health status
  const allHealthy = serverCount === pm2.length && pm2.length > 0;
  const sslCount = domains.filter((d: any) => d.proxied || d.type === 'CNAME').length;

  // Zone counts
  const allappleRecords = domains.filter((d: any) => d.zone_name === 'allapple.top');
  const viosRecords = domains.filter((d: any) => d.zone_name === 'vios.top');

  return (
    <AppShell>
      <TopBar title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />
      <div style={{ padding: 24 }}>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          <KPICard delay={1} icon={Package} title={t("dashboard.total_projects")} value={loaded ? projects.length : '—'} color="#4D7FFF" />
          <KPICard delay={2} icon={Globe} title={t("dashboard.total_domains")} value={loaded ? domainCount : '—'} color="#A78BFA" />
          <KPICard delay={3} icon={GitFork} title={t("dashboard.github_repos")} value={loaded ? githubCount : '—'} color="#F59E0B" />
          <KPICard delay={4} icon={Cloud} title={t("dashboard.vercel_projects")} value={loaded ? vercelCount : '—'} color="#FFFFFF" />
        </div>

        {/* System Status + Resources + Today */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* System Status */}
          <Card delay={5} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{t("dashboard.system_status")}</h3>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: allHealthy ? 'var(--success-soft)' : 'var(--warning-soft)', color: allHealthy ? 'var(--success)' : 'var(--warning)', fontWeight: 600 }}>
                {allHealthy ? '{t("dashboard.all_healthy")}' : `${serverCount}/${pm2.length} ${t('dashboard.online')}`}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: t('dashboard.pm2_process'), ok: serverCount === pm2.length && pm2.length > 0, detail: `${serverCount}/${pm2.length}` },
                { name: t('dashboard.cpu'), ok: !!sys, detail: sys ? `${sys.cpu.loadAvg[0].toFixed(1)} load` : '—' },
                { name: t('settings.database'), ok: true, detail: 'SQLite' },
                { name: t('dashboard.total_domains'), ok: domainCount > 0, detail: `${domainCount} records` },
                { name: t('dashboard.github_repos'), ok: githubCount > 0, detail: `${githubCount} repos` },
              ].map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.ok ? 'var(--success)' : 'var(--warning)', boxShadow: s.ok ? '0 0 8px rgba(16,185,129,0.4)' : 'none', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1, color: 'var(--text-secondary)' }}>{s.name}</span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.detail}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Server Resources */}
          <Card delay={6} style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, letterSpacing: 0.5 }}>{t("dashboard.server_resources")}</h3>
            {sys ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ResourceBar label="CPU" value={sys.cpu.loadAvg[0]} max={sys.cpu.cores} display={`${sys.cpu.loadAvg[0].toFixed(2)} / ${sys.cpu.cores} cores`} color="#4D7FFF" />
                <ResourceBar label="内存" value={sys.memory.used} max={sys.memory.total} display={`${fmtBytes(sys.memory.used)} / ${fmtBytes(sys.memory.total)}`} color="#A78BFA" />
                <ResourceBar label="磁盘" value={sys.disk.used} max={sys.disk.total} display={`${fmtBytes(sys.disk.used)} / ${fmtBytes(sys.disk.total)}`} color="#F59E0B" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Uptime: {fmtUptime(sys.uptime)}</span>
                  <span>{sys.cpu.cores} cores · {sys.arch}</span>
                </div>
              </div>
            ) : <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>{t("dashboard.loading")}</div>}
          </Card>

          {/* Today Overview */}
          <Card delay={7} style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, letterSpacing: 0.5 }}>{t("dashboard.today_overview")}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MiniStat label={t('dashboard.pm2_process')} value={String(pm2.length)} color="#4D7FFF" />
              <MiniStat label={t('dashboard.total_domains')} value={String(domainCount)} color="#A78BFA" />
              <MiniStat label={t('dashboard.total_projects')} value={String(projects.length)} color="#10B981" />
              <MiniStat label={t('dashboard.github_repos')} value={String(githubCount)} color="#F59E0B" />
            </div>
          </Card>
        </div>

        {/* Project Center */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{t("dashboard.project_center")}</h3>
            <button style={{ fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', border: 'none', cursor: 'pointer' }}>{t("dashboard.view_all")}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {projects.slice(0, 6).map((p: any, i: number) => (
              <ProjectCard key={p.id} project={p} delay={i + 1} />
            ))}
          </div>
        </div>

        {/* PM2 + Events */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* PM2 */}
          <Card delay={5} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{t("dashboard.pm2_management")}</h3>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 600 }}>{serverCount}/{pm2.length} {t("dashboard.online")}</span>
            </div>
            <div>
              {pm2.map((s: any, i: number) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < pm2.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: s.status === 'online' ? 'var(--success)' : 'var(--error)', boxShadow: s.status === 'online' ? '0 0 8px rgba(16,185,129,0.4)' : 'none' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>PID {s.pid} · {s.memory ? fmtBytes(s.memory) : '—'} · CPU {s.cpu || 0}%</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[Play, FileText].map((Icon, idx) => (
                      <button key={idx} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: `all 150ms ${EASE}` }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                        <Icon style={{ width: 14, height: 14 }} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {pm2.length === 0 && <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{t("dashboard.no_pm2")}</div>}
            </div>
          </Card>

          {/* Event Timeline - from logs API */}
          <Card delay={6} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>{t("dashboard.event_stream")}</h3>
            </div>
            <div>
              {logs.length > 0 ? logs.slice(0, 6).map((log: any, i: number) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', borderBottom: i < Math.min(logs.length, 6) - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 80, flexShrink: 0 }}>{fmtTime(log.created_at)}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: log.status === 'success' ? 'var(--success)' : log.status === 'warning' ? 'var(--warning)' : 'var(--accent)' }} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{log.detail || log.action}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontWeight: 500, flexShrink: 0 }}>{log.target || log.action}</span>
                </div>
              )) : (
                <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>{t("dashboard.no_events")}</div>
              )}
            </div>
          </Card>
        </div>

        {/* Domain Overview - dynamic from API */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
          {domainCount > 0 ? (
            <>
              {allappleRecords.length > 0 && (
                <Card delay={1} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <Globe style={{ width: 16, height: 16, color: '#F59E0B' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>allapple.top</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 500 }}>{allappleRecords.length} records</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {allappleRecords.slice(0, 4).map((r: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-root)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{r.name} → {r.type} → {r.content}</span>
                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: r.proxied ? 'var(--warning-soft)' : 'var(--bg-elevated)', color: r.proxied ? 'var(--warning)' : 'var(--text-muted)' }}>{r.proxied ? 'PROXY' : 'DNS'}</span>
                      </div>
                    ))}
                    {allappleRecords.length > 4 && <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: '0 12px' }}>+{allappleRecords.length - 4} more...</div>}
                  </div>
                </Card>
              )}
              {viosRecords.length > 0 && (
                <Card delay={2} style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <Globe style={{ width: 16, height: 16, color: '#10B981' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>vios.top</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 500 }}>{viosRecords.length} records</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {viosRecords.slice(0, 4).map((r: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-root)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{r.name} → {r.type} → {r.content}</span>
                        <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: r.proxied ? 'var(--warning-soft)' : 'var(--bg-elevated)', color: r.proxied ? 'var(--warning)' : 'var(--text-muted)' }}>{r.proxied ? 'PROXY' : 'DNS'}</span>
                      </div>
                    ))}
                    {viosRecords.length > 4 && <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: '0 12px' }}>+{viosRecords.length - 4} more...</div>}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card delay={1} style={{ padding: 20 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>{t("domains.no_data")}</div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

/* Components */
function KPICard({ delay, icon: Icon, title, value, color }: { delay: number; icon: any; title: string; value: number | string; color: string }) {
  return (
    <Card delay={delay} style={{ padding: '20px 22px', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>{title}</span>
        <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}10` }}>
          <Icon style={{ width: 16, height: 16, color }} />
        </div>
      </div>
      <div>
        <div className="stat-value" style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      </div>
    </Card>
  );
}

function ResourceBar({ label, value, max, display, color }: { label: string; value: number; max: number; display: string; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{display}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: color, transition: `width 1s ${EASE}` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      <span className="stat-value" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
    </div>
  );
}

function ProjectCard({ project: p, delay }: { project: any; delay: number }) {
  return (
    <Card delay={delay} style={{ padding: 18, cursor: 'pointer' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}18` }}>
            {p.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.category}</div>
          </div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.status === 'active' ? 'var(--success)' : 'var(--warning)', boxShadow: `0 0 6px ${p.status === 'active' ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}` }} />
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontWeight: 500 }}>{p.deploy_target === 'vercel' ? '▲ Vercel' : p.deploy_target === 'server' ? '🖥 Server' : '🔗 Both'}</span>
        {p.github_repo && <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontWeight: 500 }}>{p.github_repo}</span>}
      </div>
      {p.domain && (
        <a href={`https://${p.domain}`} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
          onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
        >{p.domain} <ExternalLink style={{ width: 10, height: 10 }} /></a>
      )}
    </Card>
  );
}
