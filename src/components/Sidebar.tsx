'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard, Package, Globe, Rocket, GitBranch,
  GitFork, Cloud, Server, FileText, Settings, ChevronLeft,
  ChevronRight, Activity, Sun, Moon, Languages, LogOut,
  CheckCircle2, Zap, Shield, Code2, Palette, X
} from 'lucide-react';

const navItems = [
  { section: null, items: [
    { href: '/', icon: LayoutDashboard, label: '仪表盘' },
  ]},
  { section: '基础设施', items: [
    { href: '/projects', icon: Package, label: '项目中心' },
    { href: '/deployments', icon: Rocket, label: '部署中心' },
    { href: '/domains', icon: Globe, label: '域名中心' },
    { href: '/relations', icon: GitBranch, label: '拓扑视图' },
  ]},
  { section: '平台集成', items: [
    { href: '/github', icon: GitFork, label: 'GitHub' },
    { href: '/vercel', icon: Cloud, label: 'Vercel' },
    { href: '/servers', icon: Server, label: '服务器' },
  ]},
  { section: '运维中心', items: [
    { href: '/logs', icon: Activity, label: '日志中心' },
    { href: '/settings', icon: Settings, label: '系统设置' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showVersionInfo, setShowVersionInfo] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setUser(d.user);
    }).catch(() => {});
  }, [pathname]);

  const handleLogout = () => { setShowLogoutConfirm(true); };
  const confirmLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); };
  const toggleTheme = () => { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); document.documentElement.setAttribute('data-theme', next); };

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-screen sticky top-0 relative overflow-hidden"
      style={{
        width: collapsed ? 68 : 250,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Logo + 折叠按钮 */}
      <div
        className="h-[60px] flex items-center px-3 gap-2 flex-shrink-0 cursor-pointer"
        style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <img src="/logo-128.png" alt="EOC"
          className="w-8 h-8 rounded-lg flex-shrink-0"
          style={{ transition: 'all 0.3s', ...(collapsed ? { animation: 'logoGlow 2.5s ease-in-out infinite' } : {}) }}
        />
        <div className="flex-1 min-w-0 overflow-hidden" style={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 200, transition: 'opacity 0.2s, max-width 0.3s' }}>
          <div className="text-[14px] font-bold text-white tracking-tight whitespace-nowrap">EOC</div>
          <div className="text-[9px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>Operations Center</div>
        </div>
        <div className="flex-shrink-0">
          <ChevronRight className="w-4 h-4"
            style={{
              transition: 'transform 0.3s',
              transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
              color: collapsed ? '#818CF8' : 'var(--text-muted)',
              animation: collapsed ? 'arrowBounce 1.5s ease-in-out infinite' : 'none',
            }} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((section, si) => (
          <div key={si} className="mb-5">
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
              style={{ color: 'var(--text-muted)', opacity: collapsed ? 0 : 1, height: collapsed ? 0 : 'auto', marginBottom: collapsed ? 0 : undefined, transition: 'opacity 0.2s, height 0.3s, margin 0.3s', overflow: 'hidden' }}>
              {section.section}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap"
                    style={{
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-gradient)' : 'transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                      transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" style={{ color: isActive ? '#fff' : 'var(--text-muted)' }} />
                    <span className="overflow-hidden" style={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 200, transition: 'opacity 0.2s, max-width 0.3s', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ maxHeight: collapsed ? 148 : 280, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)' }}>
          {/* 展开状态 */}
          <div className="px-3 pb-4 pt-3 space-y-1"
            style={{ opacity: collapsed ? 0 : 1, pointerEvents: collapsed ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                {user ? user.username[0].toUpperCase() : '?'}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="text-[12px] font-medium text-white truncate">{user?.username || '未登录'}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{user?.role || '—'}</div>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                title="退出登录"><LogOut className="w-3.5 h-3.5" /></button>
            </div>
            <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[12px] transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
            </button>
            <button onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[12px] transition-colors" style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              <Languages className="w-4 h-4" />
              <span>{locale === 'zh' ? '中文' : 'English'}</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{locale === 'zh' ? 'EN' : '中'}</span>
            </button>
            <button onClick={() => setShowVersionInfo(true)} className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-[10px] transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
              <span>v1.0.0 · 2026-06-09</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          {/* 收起状态 */}
          <div className="py-3 space-y-1.5 flex flex-col items-center"
            style={{ opacity: collapsed ? 1 : 0, pointerEvents: collapsed ? 'auto' : 'none', transition: 'opacity 0.2s 0.1s' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'var(--accent-gradient)' }}>
              {user ? user.username[0].toUpperCase() : '?'}
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              title={theme === 'dark' ? '浅色模式' : '深色模式'}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')} className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              title={locale === 'zh' ? 'English' : '中文'}>
              <Languages className="w-4 h-4" />
            </button>
            <button onClick={() => setShowVersionInfo(true)} className="p-2 rounded-lg transition-colors text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              title="v1.0.0">v1</button>
          </div>
        </div>
      </div>

      {/* 退出确认弹窗 */}
      {showLogoutConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }} />
          <div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 16px 64px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
            <div className="p-8 pb-7 relative">
              <button onClick={() => setShowLogoutConfirm(false)} className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <X className="w-4 h-4" />
              </button>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <LogOut className="w-8 h-8" style={{ color: '#EF4444' }} />
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-[18px] font-bold text-white mb-3">确认退出</h3>
                <p className="text-[13px] leading-relaxed max-w-[280px] mx-auto" style={{ color: 'var(--text-muted)' }}>退出后将清除登录状态，需要重新输入密码登录</p>
              </div>
              <div className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0" style={{ background: 'var(--accent-gradient)' }}>
                  {user ? user.username[0].toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{user?.username || '—'}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.role || '—'}</div>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>取消</button>
                <button onClick={confirmLogout} className="flex-1 py-3.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', boxShadow: '0 4px 16px rgba(239,68,68,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(239,68,68,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.2)'; }}>确认退出</button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      {/* 版本信息弹窗 */}
      {showVersionInfo && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowVersionInfo(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }} />
          <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 16px 64px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #4F46E5, #7C3AED, #06B6D4)' }} />
            <div className="p-8 relative">
              <button onClick={() => setShowVersionInfo(false)} className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <img src="/logo-128.png" alt="EOC" className="w-14 h-14 rounded-2xl" />
                <div>
                  <h2 className="text-[18px] font-bold text-white">Everett Operations Center</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[12px] px-2 py-0.5 rounded-md font-mono" style={{ background: 'var(--accent-soft)', color: '#818CF8' }}>v1.0.0</span>
                    <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>2026-06-09</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>功能亮点</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { icon: Package, text: '20 个项目统一管理', color: '#06B6D4' },
                    { icon: Globe, text: '77 条 DNS 记录', color: '#A78BFA' },
                    { icon: Server, text: '7 个 PM2 进程监控', color: '#10B981' },
                    { icon: GitFork, text: '33 个 GitHub 仓库', color: '#F59E0B' },
                    { icon: Shield, text: 'JWT 安全认证', color: '#6366F1' },
                    { icon: Palette, text: '深色/浅色主题', color: '#818CF8' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <f.icon className="w-4 h-4 flex-shrink-0" style={{ color: f.color }} />
                      <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>更新日志</h3>
                <div className="space-y-2.5">
                  {[
                    { ver: 'v1.0.0', date: '2026-06-09', text: '首次发布 — 完整运维控制中心', tags: ['仪表盘', '项目管理', '域名', 'PM2', '认证'] },
                    { ver: 'v0.9.0', date: '2026-06-08', text: 'UI 重设计 — 匹配 lyy.allapple.top 风格', tags: ['深色主题', '圆角卡片', '渐变侧边栏'] },
                    { ver: 'v0.8.0', date: '2026-06-08', text: '登录系统 + 账号管理 + 退出确认', tags: ['JWT', '粒子背景', '二次确认'] },
                  ].map((log, i) => (
                    <div key={i} className="px-4 py-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-semibold" style={{ color: '#818CF8' }}>{log.ver}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{log.date}</span>
                      </div>
                      <div className="text-[12px] text-white mb-2">{log.text}</div>
                      <div className="flex flex-wrap gap-1">{log.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{t}</span>)}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {['Next.js 16', 'Tailwind v4', 'SQLite', 'JWT', 'TypeScript', 'PM2', 'Inter'].map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </aside>
  );
}
