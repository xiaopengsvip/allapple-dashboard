'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard, Package, Rocket, Globe, GitBranch,
  GitFork, Cloud, Server, Activity, Settings,
  ChevronLeft, ChevronRight, Sun, Moon, Languages,
  LogOut, X
} from 'lucide-react';

/* ─── Design Tokens ─── */
const SIDEBAR_W = 240;
const SIDEBAR_COLLAPSED_W = 64;
const LOGO_H = 76;
const MENU_H = 44;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const navSections = [
  {
    section: null,
    items: [
      { href: '/', icon: LayoutDashboard, label: '仪表盘', labelEn: 'Dashboard' },
    ],
  },
  {
    section: '基础设施',
    sectionEn: 'INFRASTRUCTURE',
    items: [
      { href: '/projects', icon: Package, label: '项目中心', labelEn: 'Projects' },
      { href: '/deployments', icon: Rocket, label: '部署中心', labelEn: 'Deployments' },
      { href: '/domains', icon: Globe, label: '域名中心', labelEn: 'Domains' },
      { href: '/relations', icon: GitBranch, label: '拓扑视图', labelEn: 'Topology' },
    ],
  },
  {
    section: '平台集成',
    sectionEn: 'INTEGRATIONS',
    items: [
      { href: '/github', icon: GitFork, label: 'GitHub', labelEn: 'GitHub' },
      { href: '/vercel', icon: Cloud, label: 'Vercel', labelEn: 'Vercel' },
      { href: '/servers', icon: Server, label: '服务器', labelEn: 'Servers' },
    ],
  },
  {
    section: '运维中心',
    sectionEn: 'OPERATIONS',
    items: [
      { href: '/logs', icon: Activity, label: '日志中心', labelEn: 'Logs' },
      { href: '/settings', icon: Settings, label: '系统设置', labelEn: 'Settings' },
    ],
  },
];

/* ─── Tooltip ─── */
function Tooltip({ text, show, targetRef }: { text: string; show: boolean; targetRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (show && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setPos({ top: rect.top + rect.height / 2 - 16, left: rect.right + 12 });
    }
  }, [show, targetRef]);
  if (!show) return null;
  return createPortal(
    <div className="fixed z-[9999] px-2.5 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap pointer-events-none"
      style={{
        top: pos.top, left: pos.left,
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateX(0)' : 'translateX(-4px)',
        transition: `opacity 150ms ${EASE}, transform 150ms ${EASE}`,
      }}>
      {text}
    </div>,
    document.body
  );
}

/* ─── Main Sidebar ─── */
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const hoverRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setUser(d.user);
    }).catch(() => {});
  }, [pathname]);

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); };
  const toggleTheme = () => { const n = theme === 'dark' ? 'light' : 'dark'; setTheme(n); document.documentElement.setAttribute('data-theme', n); };

  return (
    <>
      <aside
        className="flex flex-col flex-shrink-0 h-screen sticky top-0"
        style={{
          width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W,
          background: theme === 'dark' ? 'var(--bg-surface)' : '#FFFFFF',
          borderRight: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          transition: `width 250ms ${EASE}`,
          overflow: 'hidden',
        }}
      >
        {/* ═══ Logo ═══ */}
        <div className="flex-shrink-0 flex items-center cursor-pointer"
          style={{
            height: LOGO_H, padding: '0 16px', gap: collapsed ? 0 : 14,
            borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            justifyContent: 'center',
            transition: 'padding 250ms ' + EASE,
          }}
          onClick={() => setCollapsed(!collapsed)}
          onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <img src="/logo-128.png" alt="EOC" className="flex-shrink-0"
            style={{ width: 36, height: 36, borderRadius: 10 }} />
          <div style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', transition: `opacity 200ms ${EASE}, width 250ms ${EASE}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme === 'dark' ? '#FFFFFF' : '#111827', letterSpacing: '-0.02em' }}>EOC</div>
            <div style={{ fontSize: 10, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF', marginTop: 1 }}>Everett Operations Center</div>
          </div>
          {/* 折叠/展开箭头 */}
          <ChevronRight className="flex-shrink-0" style={{
            width: 16, height: 16,
            color: collapsed ? '#4D7FFF' : (theme === 'dark' ? 'rgba(255,255,255,0.25)' : '#9CA3AF'),
            transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
            transition: 'transform 250ms ' + EASE,
            animation: collapsed ? 'arrowPulse 2s ease-in-out infinite' : 'none',
            opacity: collapsed ? 1 : 0,
          }} />
        </div>

        {/* ═══ Navigation ═══ */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: collapsed ? '12px 8px' : '12px 12px', transition: 'padding 250ms ' + EASE }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              {/* Section Title */}
              {section.section && (
                <div style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: 1,
                  color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF',
                  padding: collapsed ? '0 0 8px' : '0 12px 8px',
                  textAlign: collapsed ? 'center' : 'left',
                  opacity: collapsed ? 0 : 1, height: collapsed ? 0 : 'auto', overflow: 'hidden',
                  transition: `opacity 200ms ${EASE}, height 250ms ${EASE}, padding 250ms ${EASE}`,
                  textTransform: 'uppercase' as const,
                }}>
                  {locale === 'zh' ? section.section : section.sectionEn}
                </div>
              )}
              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  const label = locale === 'zh' ? item.label : item.labelEn;
                  return (
                    <Link key={item.href} href={item.href}
                      ref={el => { hoverRefs.current[item.href] = el; }}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: 'flex', alignItems: 'center',
                        height: MENU_H,
                        padding: collapsed ? 0 : '0 14px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? 0 : 14,
                        borderRadius: 12,
                        fontSize: 13, fontWeight: isActive ? 600 : 500,
                        color: isActive
                          ? '#FFFFFF'
                          : theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#6B7280',
                        background: isActive
                          ? 'linear-gradient(135deg, #4D7FFF, #675BFF)'
                          : 'transparent',
                        boxShadow: isActive ? '0 0 12px rgba(91,140,255,0.25)' : 'none',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        transition: `background 150ms ${EASE}, color 150ms ${EASE}, box-shadow 150ms ${EASE}`,
                      }}
                      onMouseOver={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
                          e.currentTarget.style.color = theme === 'dark' ? '#FFFFFF' : '#111827';
                        }
                      }}
                      onMouseOut={e => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#6B7280';
                        }
                      }}
                    >
                      <Icon style={{ width: 22, height: 22, flexShrink: 0, strokeWidth: 2, color: isActive ? '#FFFFFF' : theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }} />
                      <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', transition: `opacity 200ms ${EASE}, width 250ms ${EASE}` }}>{label}</span>
                      <Tooltip text={label} show={collapsed && hoveredItem === item.href} targetRef={{ current: hoverRefs.current[item.href] }} />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* ═══ Footer ═══ */}
        <div className="flex-shrink-0" style={{
          borderTop: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          padding: collapsed ? '12px 8px' : '12px 14px',
          transition: 'padding 250ms ' + EASE,
        }}>
          {/* User */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: collapsed ? '6px 0' : '6px 0',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 12, marginBottom: 8,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#FFFFFF',
              background: 'linear-gradient(135deg, #4D7FFF, #675BFF)',
              cursor: 'pointer',
            }}>
              {user ? user.username[0].toUpperCase() : '?'}
            </div>
            <div style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, transition: `opacity 200ms ${EASE}, width 250ms ${EASE}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme === 'dark' ? '#FFFFFF' : '#111827' }}>{user?.username || '未登录'}</div>
              <div style={{ fontSize: 11, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF', marginTop: 1 }}>{user?.role || '—'}</div>
            </div>
            {!collapsed && (
              <button onClick={handleLogout} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF', flexShrink: 0, transition: `all 150ms ${EASE}`, opacity: collapsed ? 0 : 1 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = theme === 'dark' ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
                title="退出登录">
                <LogOut style={{ width: 15, height: 15 }} />
              </button>
            )}
          </div>

          {/* Theme + Language (同一行) */}
          {collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 8 }}>
              <button onClick={toggleTheme} style={{ padding: 8, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#6B7280', transition: `all 150ms ${EASE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                title={theme === 'dark' ? '浅色模式' : '深色模式'}>
                {theme === 'dark' ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
              </button>
              <button onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')} style={{ padding: 8, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#6B7280', transition: `all 150ms ${EASE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                title={locale === 'zh' ? 'English' : '中文'}>
                <Languages style={{ width: 18, height: 18 }} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <button onClick={toggleTheme} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                height: 34, borderRadius: 10, border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 500,
                color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#6B7280',
                transition: `all 150ms ${EASE}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
              >
                {theme === 'dark' ? <Sun style={{ width: 14, height: 14 }} /> : <Moon style={{ width: 14, height: 14 }} />}
                <span>{theme === 'dark' ? '外观' : '外观'}</span>
              </button>
              <button onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                height: 34, borderRadius: 10, border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 500,
                color: theme === 'dark' ? 'rgba(255,255,255,0.55)' : '#6B7280',
                transition: `all 150ms ${EASE}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
              >
                <Languages style={{ width: 14, height: 14 }} />
                <span>{locale === 'zh' ? '中文' : 'EN'}</span>
              </button>
            </div>
          )}

          {/* Version */}
          <button onClick={() => setShowVersion(true)} style={{
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8, width: '100%', padding: '4px 0', height: 28,
            borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 10, fontFamily: 'var(--font-mono)',
            color: theme === 'dark' ? 'rgba(255,255,255,0.25)' : '#9CA3AF',
            transition: `background 150ms ${EASE}, color 150ms ${EASE}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#6B7280'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.25)' : '#9CA3AF'; }}
          >
            <span>v1.0.0</span>
            {!collapsed && <span>Build 2026.06</span>}
          </button>
        </div>
      </aside>

      {/* ═══ Logout Modal ═══ */}
      {showLogout && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowLogout(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
          <div className="relative w-full max-w-[400px] rounded-2xl overflow-hidden"
            style={{ background: theme === 'dark' ? 'var(--bg-surface)' : '#FFFFFF', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #4D7FFF, #675BFF)' }} />
            <div className="p-8 pb-7 relative">
              <button onClick={() => setShowLogout(false)} className="absolute top-5 right-5 p-1.5 rounded-lg"
                style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
              <div className="flex justify-center mb-6">
                <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(91,140,255,0.1)' }}>
                  <LogOut style={{ width: 28, height: 28, color: '#4D7FFF' }} />
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: theme === 'dark' ? '#FFFFFF' : '#111827', marginBottom: 8 }}>确认退出</h3>
                <p style={{ fontSize: 13, color: theme === 'dark' ? 'rgba(255,255,255,0.45)' : '#6B7280', lineHeight: 1.6 }}>退出后将清除登录状态，需要重新输入密码登录</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowLogout(false)} className="flex-1 py-3 rounded-xl text-[13px] font-semibold"
                  style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#6B7280', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, cursor: 'pointer' }}>取消</button>
                <button onClick={confirmLogout} className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(239,68,68,0.2)' }}>确认退出</button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      {/* ═══ Version Modal ═══ */}
      {showVersion && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowVersion(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
          <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden"
            style={{ background: theme === 'dark' ? 'var(--bg-surface)' : '#FFFFFF', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #4D7FFF, #675BFF, #06B6D4)' }} />
            <div className="p-8 relative">
              <button onClick={() => setShowVersion(false)} className="absolute top-5 right-5 p-1.5 rounded-lg"
                style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <img src="/logo-128.png" alt="EOC" style={{ width: 52, height: 52, borderRadius: 14 }} />
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: theme === 'dark' ? '#FFFFFF' : '#111827' }}>Everett Operations Center</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 6, fontFamily: 'monospace', background: 'rgba(91,140,255,0.12)', color: '#4D7FFF' }}>v1.0.0</span>
                    <span style={{ fontSize: 11, color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>Build 2026.06</span>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#9CA3AF', marginBottom: 12 }}>功能亮点</h3>
                <div className="grid grid-cols-2" style={{ gap: 10 }}>
                  {[
                    { icon: Package, text: '20 个项目统一管理', color: '#06B6D4' },
                    { icon: Globe, text: '77 条 DNS 记录', color: '#A78BFA' },
                    { icon: Server, text: '7 个 PM2 进程监控', color: '#10B981' },
                    { icon: GitFork, text: '33 个 GitHub 仓库', color: '#F59E0B' },
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                      <f.icon style={{ width: 16, height: 16, flexShrink: 0, color: f.color }} />
                      <span style={{ fontSize: 11, color: theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#9CA3AF', marginBottom: 12 }}>更新日志</h3>
                {[
                  { ver: 'v1.0.0', date: '2026-06-09', text: '首次发布 — 完整运维控制中心' },
                  { ver: 'v0.9.0', date: '2026-06-08', text: 'UI 重设计 — Liquid Glass 风格' },
                  { ver: 'v0.8.0', date: '2026-06-08', text: '登录系统 + 账号管理' },
                ].map((log, i) => (
                  <div key={i} style={{ padding: '10px 14px', borderRadius: 12, marginBottom: 8, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: '#4D7FFF' }}>{log.ver}</span>
                      <span style={{ fontSize: 10, color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF' }}>{log.date}</span>
                    </div>
                    <div style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#374151' }}>{log.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
