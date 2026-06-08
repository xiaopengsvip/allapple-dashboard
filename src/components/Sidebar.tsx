'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, Globe, Rocket, GitBranch,
  GitFork, Cloud, Server, FileText, Settings, ChevronLeft,
  ChevronRight, Shield, Activity, Bell, AlertTriangle, Cpu
} from 'lucide-react';

const navItems = [
  { section: null, items: [
    { href: '/', icon: LayoutDashboard, label: '仪表盘', labelEn: 'Dashboard' },
  ]},
  { section: '基础设施', items: [
    { href: '/projects', icon: Package, label: '项目中心', labelEn: 'Projects' },
    { href: '/deployments', icon: Rocket, label: '部署中心', labelEn: 'Deployments' },
    { href: '/domains', icon: Globe, label: '域名中心', labelEn: 'Domains' },
    { href: '/relations', icon: GitBranch, label: '拓扑视图', labelEn: 'Topology' },
  ]},
  { section: '平台集成', items: [
    { href: '/github', icon: GitFork, label: 'GitHub', labelEn: 'GitHub' },
    { href: '/vercel', icon: Cloud, label: 'Vercel', labelEn: 'Vercel' },
    { href: '/servers', icon: Server, label: '服务器', labelEn: 'Servers' },
  ]},
  { section: '运维中心', items: [
    { href: '/logs', icon: Activity, label: '日志中心', labelEn: 'Logs' },
    { href: '/settings', icon: Settings, label: '系统设置', labelEn: 'Settings' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <aside
      className={`${collapsed ? 'w-[72px]' : 'w-[260px]'} flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out`}
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo Area */}
      <div className="h-[72px] flex items-center px-5 gap-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative flex-shrink-0">
          <img src="/favicon.png" alt="EOC" className="w-9 h-9 rounded-[10px]" />
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2" style={{ background: 'var(--success)', borderColor: 'var(--bg-surface)', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
        </div>
        {!collapsed && mounted && (
          <div className="flex-1 min-w-0 animate-fade-in">
            <div className="text-[15px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>Everett</div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>Operations Center</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-all duration-200 flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((section, si) => (
          <div key={si} className="mb-6">
            {section.section && !collapsed && (
              <div className="px-3 mb-2 section-title">{section.section}</div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200 relative"
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--accent-soft)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-card)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full" style={{ background: 'var(--accent)' }} />
                    )}
                    <Icon
                      className="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                    />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="px-3 pb-4 flex-shrink-0">
        {!collapsed && mounted && (
          <div className="glass-card p-3 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <div className="status-dot online" />
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>系统运行正常</span>
            </div>
            <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <span>7 服务在线</span>
              <span>99.9% 可用</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="status-dot online" />
          </div>
        )}
      </div>
    </aside>
  );
}
