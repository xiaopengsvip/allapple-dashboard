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
            color: collapsed ? '#4D7FFF' : (theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF'),
            transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
            transition: 'transform 250ms ' + EASE,
            animation: collapsed ? 'arrowPulse 2s ease-in-out infinite' : 'none',
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
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }} />
          <div className="relative w-full max-w-[420px]" style={{
            background: theme === 'dark' ? '#0D1320' : '#FFFFFF',
            borderRadius: 24,
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
            overflow: 'hidden',
          }} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setShowLogout(false)} style={{ position: 'absolute', top: 16, right: 16, padding: 8, borderRadius: 10, background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF', transition: `all 150ms ${EASE}`, zIndex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = theme === 'dark' ? '#FFFFFF' : '#111827'; }}
              onMouseLeave={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF'; }}>
              <X style={{ width: 16, height: 16 }} />
            </button>
            <div style={{ padding: '40px 36px 36px' }}>
              {/* Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.06)', border: `1px solid ${theme === 'dark' ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.1)'}` }}>
                  <LogOut style={{ width: 28, height: 28, color: '#EF4444' }} />
                </div>
              </div>
              {/* Text */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: theme === 'dark' ? '#FFFFFF' : '#111827', marginBottom: 10, letterSpacing: '-0.02em' }}>确认退出</h3>
                <p style={{ fontSize: 14, color: theme === 'dark' ? 'rgba(255,255,255,0.45)' : '#6B7280', lineHeight: 1.6 }}>退出后将清除登录状态<br />需要重新输入密码登录</p>
              </div>
              {/* User Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#FFFFFF', background: 'linear-gradient(135deg, #4D7FFF, #675BFF)', flexShrink: 0 }}>
                  {user ? user.username[0].toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme === 'dark' ? '#FFFFFF' : '#111827' }}>{user?.username || '—'}</div>
                  <div style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF', marginTop: 2 }}>{user?.role || '—'}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
              </div>
              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowLogout(false)} style={{
                  flex: 1, padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 600,
                  background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : '#6B7280',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                  cursor: 'pointer', transition: `all 150ms ${EASE}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}>取消</button>
                <button onClick={confirmLogout} style={{
                  flex: 1, padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(239,68,68,0.25)', transition: `all 150ms ${EASE}`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(239,68,68,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>确认退出</button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      {/* ═══ Version Modal ═══ */}
      {showVersion && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowVersion(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }} />
          <div className="relative w-full max-w-[520px]" style={{
            background: theme === 'dark' ? '#0D1320' : '#FFFFFF',
            borderRadius: 24,
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
            overflow: 'hidden',
            maxHeight: '85vh',
            overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {/* Close */}
            <button onClick={() => setShowVersion(false)} style={{ position: 'absolute', top: 16, right: 16, padding: 8, borderRadius: 10, background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: 'none', cursor: 'pointer', color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF', transition: `all 150ms ${EASE}`, zIndex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = theme === 'dark' ? '#FFFFFF' : '#111827'; }}
              onMouseLeave={e => { e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF'; }}>
              <X style={{ width: 16, height: 16 }} />
            </button>

            {/* Header */}
            <div style={{ padding: '36px 36px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <img src="/logo-128.png" alt="EOC" style={{ width: 56, height: 56, borderRadius: 16 }} />
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: theme === 'dark' ? '#FFFFFF' : '#111827', letterSpacing: '-0.02em' }}>Everett Operations Center</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, fontFamily: 'var(--font-mono)', fontWeight: 600, background: 'rgba(77,127,255,0.12)', color: '#4D7FFF' }}>v1.0.0</span>
                    <span style={{ fontSize: 12, color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#9CA3AF' }}>Build 2026.06</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
                {[
                  { value: '20', label: '项目', color: '#4D7FFF' },
                  { value: '77', label: '域名', color: '#A78BFA' },
                  { value: '33', label: '仓库', color: '#F59E0B' },
                  { value: '7', label: 'PM2', color: '#10B981' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 14, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div className="stat-value" style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#9CA3AF', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', margin: '0 36px' }} />

            {/* Changelog */}
            <div style={{ padding: '24px 36px 36px' }}>
              <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, color: theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#9CA3AF', marginBottom: 16 }}>更新日志</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { ver: 'v1.0.0', date: '2026-06-09', text: '首次发布 — Liquid Glass 风格完整运维控制中心', tags: ['仪表盘', '项目管理', '域名', 'PM2', '认证', '主题'] },
                  { ver: 'v0.9.0', date: '2026-06-08', text: 'UI 重设计 — 匹配 lyy.allapple.top 设计语言', tags: ['深色主题', '圆角卡片', '渐变侧边栏'] },
                  { ver: 'v0.8.0', date: '2026-06-08', text: '登录系统 + JWT 认证 + 账号管理 + 退出确认', tags: ['JWT', '粒子背景', '二次确认'] },
                ].map((log, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#4D7FFF' }}>{log.ver}</span>
                      <span style={{ fontSize: 11, color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF' }}>{log.date}</span>
                    </div>
                    <div style={{ fontSize: 13, color: theme === 'dark' ? 'rgba(255,255,255,0.8)' : '#374151', marginBottom: 10, lineHeight: 1.5 }}>{log.text}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {log.tags.map(t => (
                        <span key={t} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: theme === 'dark' ? 'rgba(255,255,255,0.45)' : '#6B7280', fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Stack */}
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Next.js 16', 'Tailwind v4', 'SQLite', 'JWT', 'TypeScript', 'PM2', 'Inter'].map(t => (
                  <span key={t} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#9CA3AF', border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </>
  );
}
