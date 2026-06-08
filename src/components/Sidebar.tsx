'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Globe, Rocket, GitBranch,
  GitFork, Cloud, Server, FileText, Settings, ChevronLeft,
  ChevronRight, Activity, Sun, Moon, Languages
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
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <aside
      className={`${collapsed ? 'w-[68px]' : 'w-[250px]'} flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300`}
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div
        className="h-[72px] flex items-center px-5 gap-3 flex-shrink-0 cursor-pointer transition-colors"
        style={{ borderBottom: '1px solid var(--border)' }}
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <img src="/favicon.png" alt="EOC" className="w-9 h-9 rounded-xl flex-shrink-0" />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-white tracking-tight">EOC</div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Everett Operations Center</div>
          </div>
        )}
        <div className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${collapsed ? 'animate-pulse' : ''}`}
          style={{ color: 'var(--text-muted)' }}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((section, si) => (
          <div key={si} className="mb-5">
            {section.section && !collapsed && (
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {section.section}
              </div>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={{
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-gradient)' : 'transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                  >
                    <Icon className="w-[18px] h-[18px] flex-shrink-0" style={{ color: isActive ? '#fff' : 'var(--text-muted)' }} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1 flex-shrink-0">
        {!collapsed ? (
          <>
            <button onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[12px] transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
            </button>
            <div className="px-3 pt-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
              v1.0.0 · 2026-06-08
            </div>
          </>
        ) : (
          <button onClick={() => setCollapsed(false)}
            className="w-full flex justify-center py-2 rounded-xl transition-colors"
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            title="展开侧边栏"
          >
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--success)', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
          </button>
        )}
      </div>
    </aside>
  );
}
