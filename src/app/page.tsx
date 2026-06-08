'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import {
  Package, Globe, Cloud, Server, GitFork, ExternalLink, Activity,
  Shield, Rocket, Play, FileText, Link as LinkIcon, TrendingUp,
  CheckCircle2, AlertTriangle, Layers, Clock, ArrowUpRight, Cpu
} from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* ═══ Card Wrapper ═══ */
function Card({ children, className = '', delay = 0, style = {} }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <div className={`anim-fade-up ${className}`}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        transition: `box-shadow 250ms ${EASE}, border-color 250ms ${EASE}, transform 250ms ${EASE}`,
        animationDelay: `${delay * 0.04}s`,
        ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-card)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, pm2Res, statsRes] = await Promise.all([
          fetch('/api/projects').then(r => r.json()).catch(() => ({ projects: [] })),
          fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
          fetch('/api/server/stats').then(r => r.json()).catch(() => ({ stats: null })),
        ]);
        setData({ projects: projRes.projects || [], pm2: pm2Res.services || [], stats: statsRes.stats });
      } catch {}
      setTimeout(() => setLoaded(true), 50);
    };
    load();
  }, []);

  const projects = data?.projects || [];
  const pm2 = data?.pm2 || [];
  const sys = data?.stats;
  const vercelCount = projects.filter((p: any) => p.deploy_target === 'vercel' || p.deploy_target === 'both').length;
  const serverCount = pm2.filter((s: any) => s.status === 'online').length;
  const fmtBytes = (b: number) => b > 1e9 ? (b / 1e9).toFixed(1) + ' GB' : (b / 1e6).toFixed(0) + ' MB';
  const fmtUptime = (s: number) => { const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600); return `${d}d ${h}h`; };

  return (
    <AppShell>
      <TopBar title="仪表盘" subtitle="Everett 运维总览" />
      <div style={{ padding: 24, maxWidth: 1440, margin: '0 auto' }}>

        {/* ═══════ KPI Cards ═══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <KPICard delay={1} icon={Package} title="项目总数" value={loaded ? projects.length : '—'} sub="+2 本周新增" color="#4D7FFF" />
          <KPICard delay={2} icon={Globe} title="域名总数" value={loaded ? 77 : '—'} sub="+4 本月新增" color="#A78BFA" />
          <KPICard delay={3} icon={GitFork} title="GitHub 仓库" value={loaded ? 33 : '—'} sub="全部同步正常" color="#10B981" />
          <KPICard delay={4} icon={Cloud} title="Vercel 项目" value={loaded ? vercelCount : '—'} sub="部署成功率 99%" color="#F59E0B" />
        </div>

        {/* ═══════ System Status Grid ═══════ */}
        <Card delay={5} style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>系统状态</h3>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 600 }}>全部正常</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { name: 'GitHub API', status: 'ok', latency: '45ms' },
              { name: 'Vercel API', status: 'ok', latency: '32ms' },
              { name: 'Cloudflare', status: 'ok', latency: '28ms' },
              { name: '腾讯云服务器', status: 'ok', latency: '12ms' },
              { name: 'PM2 进程', status: 'ok', latency: '3ms' },
            ].map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px rgba(16,185,129,0.4)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>{s.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ═══════ Resources Row ═══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Server Resources */}
          <Card delay={6} style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, letterSpacing: 0.5 }}>服务器资源</h3>
            {sys && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <ResourceBar label="CPU" value={sys.cpu.loadAvg[0]} max={sys.cpu.cores} display={`${sys.cpu.loadAvg[0].toFixed(2)} / ${sys.cpu.cores} cores`} color="#4D7FFF" />
                <ResourceBar label="内存" value={sys.memory.used} max={sys.memory.total} display={`${fmtBytes(sys.memory.used)} / ${fmtBytes(sys.memory.total)}`} color="#A78BFA" />
                <ResourceBar label="磁盘" value={sys.disk.used} max={sys.disk.total} display={`${fmtBytes(sys.disk.used)} / ${fmtBytes(sys.disk.total)}`} color="#F59E0B" />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Uptime: {fmtUptime(sys.uptime)}</span>
                  <span>{sys.cpu.cores} cores · {sys.arch}</span>
                </div>
              </div>
            )}
          </Card>
          {/* Today */}
          <Card delay={7} style={{ padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, letterSpacing: 0.5 }}>今日概览</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <MiniStat label="部署次数" value="3" trend="+2" color="#10B981" />
              <MiniStat label="提交次数" value="12" trend="+5" color="#4D7FFF" />
              <MiniStat label="告警次数" value="0" color="#10B981" />
              <MiniStat label="证书过期" value="0" color="#10B981" />
            </div>
          </Card>
        </div>

        {/* ═══════ Project Center ═══════ */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>项目中心</h3>
            <button style={{ fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', border: 'none', cursor: 'pointer' }}>查看全部 →</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {projects.slice(0, 6).map((p: any, i: number) => (
              <ProjectCard key={p.id} project={p} delay={i + 1} />
            ))}
          </div>
        </div>

        {/* ═══════ PM2 + Events ═══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* PM2 */}
          <Card delay={5} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>PM2 进程管理</h3>
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 600 }}>{serverCount}/{pm2.length} 在线</span>
            </div>
            <div>
              {pm2.map((s: any, i: number) => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
                  borderBottom: i < pm2.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: `background 150ms ${EASE}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
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
            </div>
          </Card>

          {/* Event Timeline */}
          <Card delay={6} style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: 0.5 }}>实时事件流</h3>
            </div>
            <div>
              {[
                { time: '23:41', text: 'dashboard 重新部署成功', source: 'PM2', status: 'success' },
                { time: '23:38', text: 'Everett 运维中心 v1.0 构建完成', source: 'Build', status: 'success' },
                { time: '23:33', text: 'allapple-dashboard pushed to main', source: 'GitHub', status: 'info' },
                { time: '23:27', text: 'PM2 dashboard 进程启动成功', source: 'PM2', status: 'success' },
                { time: '23:22', text: '端口 3400 被占用，自动清理完成', source: 'Server', status: 'warning' },
              ].map((evt, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px',
                  borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                  transition: `background 150ms ${EASE}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', width: 42, flexShrink: 0 }}>{evt.time}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: evt.status === 'success' ? 'var(--success)' : evt.status === 'warning' ? 'var(--warning)' : 'var(--accent)', boxShadow: `0 0 6px ${evt.status === 'success' ? 'rgba(16,185,129,0.4)' : evt.status === 'warning' ? 'rgba(245,158,11,0.4)' : 'rgba(77,127,255,0.4)'}` }} />
                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>{evt.text}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontWeight: 500, flexShrink: 0 }}>{evt.source}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ═══════ Domain Overview ═══════ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { zone: 'allapple.top', count: 68, color: '#F59E0B', records: ['aios → A → 43.167.213.143', 'enxx → CNAME → vercel-dns', 'chat → A → 43.167.213.143'] },
            { zone: 'vios.top', count: 9, color: '#10B981', records: ['aios → A → 43.167.213.143', 'game → A → 43.167.213.143', 'dashboard → A → 76.76.21.21'] },
          ].map((d, di) => (
            <Card key={d.zone} delay={di + 1} style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <Globe style={{ width: 16, height: 16, color: d.color }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{d.zone}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 500 }}>{d.count} records</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {d.records.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'var(--bg-root)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    {r}
                  </div>
                ))}
                <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: '0 12px' }}>+{d.count - 3} more...</div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </AppShell>
  );
}

/* ═══ Components ═══ */

function KPICard({ delay, icon: Icon, title, value, sub, color }: { delay: number; icon: any; title: string; value: number | string; sub: string; color: string }) {
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
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          <TrendingUp style={{ width: 12, height: 12, color: 'var(--success)' }} />
          <span style={{ color: 'var(--success)' }}>{sub}</span>
        </div>
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

function MiniStat({ label, value, trend, color }: { label: string; value: string; trend?: string; color: string }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        <span className="stat-value" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</span>
        {trend && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--success)', marginBottom: 2 }}>+{trend}</span>}
      </div>
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
