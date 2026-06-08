'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard, Package, Globe, Rocket, GitBranch,
  GitFork, Cloud, Server, FileText, Settings, ChevronLeft,
  ChevronRight, Activity, Sun, Moon, Languages, LogOut
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
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setUser(d.user);
    }).catch(() => {});
  }, [pathname]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <aside
      className={`${collapsed ? 'w-[68px]' : 'w-[250px]'} flex flex-col flex-shrink-0 h-screen sticky top-0 transition-all duration-300 relative`}
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo + 折叠按钮 */}
      <div
        className="h-[60px] flex items-center px-3 gap-2 flex-shrink-0 cursor-pointer transition-colors"
        style={{ borderBottom: '1px solid var(--border)' }}
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
      >
        <img src="/logo-128.png" alt="EOC"
          className={`w-8 h-8 rounded-lg flex-shrink-0 transition-all duration-300 ${collapsed ? 'sidebar-collapsed-logo' : ''}`}
        />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-white tracking-tight">EOC</div>
            <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>Operations Center</div>
          </div>
        )}
        <div className={`flex-shrink-0 transition-all duration-200 ${collapsed ? 'sidebar-collapsed-arrow' : 'sidebar-expanded-arrow'}`}>
          <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`}
            style={{ color: collapsed ? '#818CF8' : 'var(--text-muted)' }} />
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
      <div className="px-3 pb-4 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        {!collapsed ? (
          <div className="pt-3 space-y-1">
            {/* 用户信息 */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{ background: 'var(--accent-gradient)' }}>
                {user ? user.username[0].toUpperCase() : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-white truncate">{user?.username || '未登录'}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{user?.role || '—'}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                title="退出登录"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* 主题切换 */}
            <button onClick={toggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[12px] transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
            </button>
            {/* 版本 */}
            <div className="px-3 text-[10px]" style={{ color: 'var(--text-muted)' }}>
              v1.0.0 · 2026-06-08
            </div>
          </div>
        ) : (
          <div className="pt-3 flex justify-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: 'var(--accent-gradient)' }}>
              {user ? user.username[0].toUpperCase() : '?'}
            </div>
          </div>
        )}
      </div>

      {/* 退出确认弹窗 — portal 到 body 最顶层 */}
      {showLogoutConfirm && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          {/* 遮罩 */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }} />
          {/* 弹窗 */}
          <div className="relative w-full max-w-[360px] rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 16px 64px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.05)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* 顶部装饰条 */}
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />

            <div className="p-6">
              {/* 图标 */}
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <LogOut className="w-7 h-7" style={{ color: '#EF4444' }} />
                </div>
              </div>

              {/* 文字 */}
              <div className="text-center mb-6">
                <h3 className="text-[17px] font-bold text-white mb-2">确认退出</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  退出后将清除登录状态，需要重新输入密码登录
                </p>
              </div>

              {/* 当前用户 */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--accent-gradient)' }}>
                  {user ? user.username[0].toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-white">{user?.username || '—'}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{user?.role || '—'}</div>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-200"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                >取消</button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-200"
                  style={{ background: 'linear-gradient(135deg, #DC2626, #EF4444)', boxShadow: '0 4px 16px rgba(239,68,68,0.25)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(239,68,68,0.25)'; }}
                >确认退出</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}
