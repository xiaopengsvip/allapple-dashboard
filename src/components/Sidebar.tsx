'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard, Package, Rocket, Globe, GitBranch,
  GitFork, Cloud, Server, Activity, Settings,
  ChevronLeft, ChevronRight, Sun, Moon, Languages,
  LogOut, X
} from 'lucide-react';

const SIDEBAR_W = 240;
const SIDEBAR_COLLAPSED_W = 64;
const LOGO_H = 76;
const MENU_H = 44;
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const navSections = [
  { section: null, sectionEn: null, items: [
    { href: '/', icon: LayoutDashboard, label: 'sidebar.dashboard', labelEn: 'Dashboard' },
  ]},
  { section: 'sidebar.infrastructure', sectionEn: 'INFRASTRUCTURE', items: [
    { href: '/projects', icon: Package, label: 'sidebar.projects', labelEn: 'Projects' },
    { href: '/deployments', icon: Rocket, label: 'sidebar.deployments', labelEn: 'Deployments' },
    { href: '/domains', icon: Globe, label: 'sidebar.domains', labelEn: 'Domains' },
    { href: '/relations', icon: GitBranch, label: 'sidebar.topology', labelEn: 'Topology' },
  ]},
  { section: 'sidebar.integrations', sectionEn: 'INTEGRATIONS', items: [
    { href: '/github', icon: GitFork, label: 'GitHub', labelEn: 'GitHub' },
    { href: '/vercel', icon: Cloud, label: 'Vercel', labelEn: 'Vercel' },
    { href: '/servers', icon: Server, label: 'sidebar.servers', labelEn: 'Servers' },
  ]},
  { section: 'sidebar.operations', sectionEn: 'OPERATIONS', items: [
    { href: '/logs', icon: Activity, label: 'sidebar.logs', labelEn: 'Logs' },
    { href: '/settings', icon: Settings, label: 'sidebar.settings', labelEn: 'Settings' },
  ]},
];

/* Reusable style helpers */
const s = {
  text: 'var(--text-primary)',
  textSec: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  border: 'var(--border)',
  bgCard: 'var(--bg-card)',
  bgHover: 'var(--bg-card-hover)',
  accent: 'var(--accent)',
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const { t, i18n } = useTranslation();
  const locale = i18n.language as 'zh' | 'en';
  const setLocale = (l: string) => { i18n.changeLanguage(l); localStorage.setItem('eoc-locale', l); };
  const [user, setUser] = useState<any>(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const hoverRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const saved = localStorage.getItem('eoc-sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);
    setTimeout(() => setTransitionEnabled(true), 300);
    setMounted(true);
  }, []);

  useEffect(() => { if (mounted) localStorage.setItem('eoc-sidebar-collapsed', String(collapsed)); }, [collapsed, mounted]);

  const fetchUser = () => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setUser({ ...user, ...d.user });
    }).catch(() => {});
  };

  useEffect(() => {
    fetchUser();
    // 监听用户数据更新事件（头像上传等）
    window.addEventListener('eoc-user-updated', fetchUser);
    return () => window.removeEventListener('eoc-user-updated', fetchUser);
  }, [pathname]);

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/login'); };
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('eoc-theme', next);
  };

  return (
    <>
      <aside className="flex flex-col flex-shrink-0 h-screen sticky top-0" style={{
        width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W,
        background: 'var(--bg-surface)',
        borderRight: `1px solid ${s.border}`,
        transition: transitionEnabled ? `width 250ms ${EASE}` : 'none',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center cursor-pointer" style={{
          height: LOGO_H, padding: '0 16px', gap: collapsed ? 0 : 14,
          borderBottom: `1px solid ${s.border}`, justifyContent: 'center',
          transition: 'padding 250ms ' + EASE,
        }}
          onClick={() => setCollapsed(!collapsed)}
          onMouseEnter={e => { e.currentTarget.style.background = s.bgCard; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
          <img src="/logo-128.png" alt="EOC" className="flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 10 }} />
          <div style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', transition: `opacity 200ms ${EASE}, width 250ms ${EASE}` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: s.text, letterSpacing: '-0.02em' }}>EOC</div>
            <div style={{ fontSize: 10, color: s.textMuted, marginTop: 1 }}>Everett Operations Center</div>
          </div>
          <ChevronRight className="flex-shrink-0" style={{
            width: 16, height: 16,
            color: collapsed ? 'var(--accent)' : s.textMuted,
            transform: collapsed ? 'rotate(0)' : 'rotate(180deg)',
            transition: 'transform 250ms ' + EASE,
            animation: collapsed ? 'arrowPulse 2s ease-in-out infinite' : 'none',
          }} />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: collapsed ? '12px 8px' : '12px 12px', transition: 'padding 250ms ' + EASE }}>
          {navSections.map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              {section.section && (
                <div style={{
                  fontSize: 12, fontWeight: 600, letterSpacing: 1, color: s.textMuted,
                  padding: collapsed ? '0 0 8px' : '0 12px 8px', textAlign: collapsed ? 'center' : 'left',
                  opacity: collapsed ? 0 : 1, height: collapsed ? 0 : 'auto', overflow: 'hidden',
                  transition: `opacity 200ms ${EASE}, height 250ms ${EASE}`, textTransform: 'uppercase' as const,
                }}>{t(section.section)}</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  const label = t(item.label);
                  return (
                    <Link key={item.href} href={item.href}
                      ref={el => { hoverRefs.current[item.href] = el; }}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{
                        display: 'flex', alignItems: 'center', height: MENU_H,
                        padding: 0, justifyContent: collapsed ? 'center' : 'flex-start',
                        gap: collapsed ? 0 : 14, borderRadius: 12,
                        fontSize: 13, fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#FFFFFF' : s.textSec,
                        background: isActive ? 'linear-gradient(135deg, #4D7FFF, #675BFF)' : 'transparent',
                        boxShadow: isActive ? '0 0 12px rgba(77,127,255,0.25)' : 'none',
                        textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden',
                        transition: `background 150ms ${EASE}, color 150ms ${EASE}`,
                      }}
                      onMouseOver={e => { if (!isActive) { e.currentTarget.style.background = s.bgHover; e.currentTarget.style.color = s.text; } }}
                      onMouseOut={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = s.textSec; } }}>
                      <Icon style={{ width: 22, height: 22, flexShrink: 0, strokeWidth: 2, color: isActive ? '#FFFFFF' : s.textMuted }} />
                      <span style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', transition: `opacity 200ms ${EASE}, width 250ms ${EASE}` }}>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0" style={{ borderTop: `1px solid ${s.border}`, padding: collapsed ? '12px 8px' : '12px 14px', transition: 'padding 250ms ' + EASE }}>
          {/* User */}
          <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: 12, marginBottom: 8, textDecoration: 'none', cursor: 'pointer', transition: `background 150ms ${EASE}` }}
            onMouseEnter={e => { e.currentTarget.style.background = s.bgCard; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" style={{ width: 32, height: 32, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF', background: 'linear-gradient(135deg, #4D7FFF, #675BFF)' }}>
                {user ? user.username[0].toUpperCase() : '?'}
              </div>
            )}
            <div style={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, transition: `opacity 200ms ${EASE}, width 250ms ${EASE}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.text }}>{user?.username || t('sidebar.not_logged_in')}</div>
              <div style={{ fontSize: 11, color: s.textMuted, marginTop: 1 }}>{user?.role || '—'}</div>
            </div>
            {!collapsed && (
              <button onClick={handleLogout} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: s.textMuted, flexShrink: 0, transition: `all 150ms ${EASE}`, opacity: collapsed ? 0 : 1 }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--error)'; e.currentTarget.style.background = 'var(--error-soft)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = s.textMuted; e.currentTarget.style.background = 'transparent'; }}
                title="退出登录"><LogOut style={{ width: 15, height: 15 }} /></button>
            )}
          </Link>

          {/* Theme + Language */}
          {collapsed ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginBottom: 8 }}>
              <button onClick={toggleTheme} style={{ padding: 8, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: s.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: `all 150ms ${EASE}` }}
                onMouseEnter={e => { e.currentTarget.style.background = s.bgCard; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                title="切换主题"><Sun style={{ width: 18, height: 18 }} /></button>
              <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')} style={{ padding: 8, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', color: s.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: `all 150ms ${EASE}` }}
                onMouseEnter={e => { e.currentTarget.style.background = s.bgCard; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                title={locale === 'zh' ? 'English' : '中文'}><Languages style={{ width: 18, height: 18 }} /></button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <button onClick={toggleTheme} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                height: 34, borderRadius: 10, border: `1px solid ${s.border}`,
                background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 500,
                color: s.textSec, transition: `all 150ms ${EASE}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = s.bgHover; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = s.border; }}>
                <Sun style={{ width: 14, height: 14 }} /><span>{t('sidebar.appearance')}</span>
              </button>
              <button onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                height: 34, borderRadius: 10, border: `1px solid ${s.border}`,
                background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 500,
                color: s.textSec, transition: `all 150ms ${EASE}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = s.bgHover; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = s.border; }}>
                <Languages style={{ width: 14, height: 14 }} /><span>{locale === 'zh' ? '中文' : 'EN'}</span>
              </button>
            </div>
          )}

          {/* Version */}
          <button onClick={() => setShowVersion(true)} style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8, width: '100%', padding: '4px 0', height: 28,
            borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
            transition: `background 150ms ${EASE}, color 150ms ${EASE}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = s.bgCard; e.currentTarget.style.color = s.textSec; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            <span>v1.0.0</span>
            {!collapsed && <span>Build 2026.06</span>}
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogout && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowLogout(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }} />
          <div className="relative w-full max-w-[420px]" style={{ background: 'var(--bg-surface)', borderRadius: 24, border: `1px solid ${s.border}`, boxShadow: '0 24px 80px rgba(0,0,0,0.5)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLogout(false)} style={{ position: 'absolute', top: 16, right: 16, padding: 8, borderRadius: 10, background: s.bgCard, border: 'none', cursor: 'pointer', color: s.textMuted, transition: `all 150ms ${EASE}`, zIndex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.background = s.bgHover; e.currentTarget.style.color = s.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = s.bgCard; e.currentTarget.style.color = s.textMuted; }}>
              <X style={{ width: 16, height: 16 }} />
            </button>
            <div style={{ padding: '40px 36px 36px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--error-soft)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <LogOut style={{ width: 28, height: 28, color: 'var(--error)' }} />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: s.text, marginBottom: 10, letterSpacing: '-0.02em' }}>确认退出</h3>
                <p style={{ fontSize: 14, color: s.textSec, lineHeight: 1.6 }}>退出后将清除登录状态<br />需要重新输入密码登录</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: s.bgCard, border: `1px solid ${s.border}`, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#FFFFFF', background: 'linear-gradient(135deg, #4D7FFF, #675BFF)', flexShrink: 0 }}>
                  {user ? user.username[0].toUpperCase() : '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: s.text }}>{user?.username || '—'}</div>
                  <div style={{ fontSize: 12, color: s.textMuted, marginTop: 2 }}>{user?.role || '—'}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px rgba(16,185,129,0.4)' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 600, background: s.bgCard, color: s.textSec, border: `1px solid ${s.border}`, cursor: 'pointer', transition: `all 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.background = s.bgHover; }}
                  onMouseLeave={e => { e.currentTarget.style.background = s.bgCard; }}>取消</button>
                <button onClick={confirmLogout} style={{ flex: 1, padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 600, color: '#FFFFFF', background: 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(239,68,68,0.25)', transition: `all 150ms ${EASE}` }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(239,68,68,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(239,68,68,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>确认退出</button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}

      {/* Version Modal */}
      {showVersion && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowVersion(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)' }} />
          <div className="relative w-full max-w-[520px]" style={{ background: 'var(--bg-surface)', borderRadius: 24, border: `1px solid ${s.border}`, boxShadow: '0 24px 80px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowVersion(false)} style={{ position: 'absolute', top: 16, right: 16, padding: 8, borderRadius: 10, background: s.bgCard, border: 'none', cursor: 'pointer', color: s.textMuted, transition: `all 150ms ${EASE}`, zIndex: 1 }}
              onMouseEnter={e => { e.currentTarget.style.background = s.bgHover; e.currentTarget.style.color = s.text; }}
              onMouseLeave={e => { e.currentTarget.style.background = s.bgCard; e.currentTarget.style.color = s.textMuted; }}>
              <X style={{ width: 16, height: 16 }} />
            </button>
            <div style={{ padding: '36px 36px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <img src="/logo-128.png" alt="EOC" style={{ width: 56, height: 56, borderRadius: 16 }} />
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: s.text, letterSpacing: '-0.02em' }}>Everett Operations Center</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 8, fontFamily: 'var(--font-mono)', fontWeight: 600, background: 'var(--accent-soft)', color: 'var(--accent)' }}>v1.0.0</span>
                    <span style={{ fontSize: 12, color: s.textMuted }}>Build 2026.06</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
                {[
                  { value: '20', label: '项目', color: '#4D7FFF' },
                  { value: '77', label: '域名', color: '#A78BFA' },
                  { value: '33', label: '仓库', color: '#F59E0B' },
                  { value: '7', label: 'PM2', color: '#10B981' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 14, background: 'var(--bg-card)', border: `1px solid ${'var(--border)'}` }}>
                    <div className="stat-value" style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '0 36px' }} />
            <div style={{ padding: '24px 36px 36px' }}>
              <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: 16 }}>更新日志</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { ver: 'v1.0.0', date: '2026-06-09', text: '首次发布 — Liquid Glass 风格完整运维控制中心', tags: ['仪表盘', '项目管理', '域名', 'PM2', '认证', '主题'] },
                  { ver: 'v0.9.0', date: '2026-06-08', text: 'UI 重设计 — 匹配 lyy.allapple.top 设计语言', tags: ['深色主题', '圆角卡片', '渐变侧边栏'] },
                  { ver: 'v0.8.0', date: '2026-06-08', text: '登录系统 + JWT 认证 + 账号管理 + 退出确认', tags: ['JWT', '粒子背景', '二次确认'] },
                ].map((log, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--bg-card)', border: `1px solid ${'var(--border)'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent)' }}>{log.ver}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.date}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{log.text}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {log.tags.map(t => <span key={t} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontWeight: 500 }}>{t}</span>)}
                    </div>
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
