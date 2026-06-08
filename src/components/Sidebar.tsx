'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Globe, Rocket, GitBranch,
  GitFork, Cloud, Server, FileText, Settings, ChevronLeft,
  ChevronRight, Bell, Sun, Moon, Languages
} from 'lucide-react';

const navItems = [
  { section: '总览', items: [
    { href: '/', icon: LayoutDashboard, label: '仪表盘', labelEn: 'Dashboard' },
  ]},
  { section: '管理', items: [
    { href: '/projects', icon: Package, label: '项目管理', labelEn: 'Projects', badge: 27 },
    { href: '/domains', icon: Globe, label: '域名管理', labelEn: 'Domains', badge: 77 },
    { href: '/deployments', icon: Rocket, label: '部署管理', labelEn: 'Deployments' },
    { href: '/relations', icon: GitBranch, label: '关联视图', labelEn: 'Relations' },
  ]},
  { section: '平台', items: [
    { href: '/github', icon: GitFork, label: 'GitHub', labelEn: 'GitHub', badge: 33 },
    { href: '/vercel', icon: Cloud, label: 'Vercel', labelEn: 'Vercel', badge: 21 },
    { href: '/servers', icon: Server, label: '服务器', labelEn: 'Servers' },
  ]},
  { section: '系统', items: [
    { href: '/logs', icon: FileText, label: '操作日志', labelEn: 'Logs' },
    { href: '/settings', icon: Settings, label: '设置', labelEn: 'Settings' },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-[#12121a] border-r border-[#1e1e2e] flex flex-col flex-shrink-0 transition-all duration-300 h-screen sticky top-0`}>
      {/* Logo */}
      <div className="h-14 border-b border-[#1e1e2e] flex items-center px-4 gap-3">
        <img src="/favicon.png" alt="E" className="w-8 h-8 rounded-lg flex-shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-[#e4e4e7] truncate">Everett</div>
            <div className="text-[10px] text-[#71717a] truncate">运维中心 v1.0</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((section) => (
          <div key={section.section} className="mb-4">
            {!collapsed && (
              <div className="text-[10px] text-[#71717a] uppercase tracking-wider px-2 mb-1">
                {section.section}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                    isActive
                      ? 'bg-[#06d6a020] text-[#06d6a0]'
                      : 'text-[#71717a] hover:bg-[#1a1a25] hover:text-[#e4e4e7]'
                  }`}
                  title={collapsed ? (locale === 'zh' ? item.label : item.labelEn) : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{locale === 'zh' ? item.label : item.labelEn}</span>
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-[#06d6a030] text-[#06d6a0]' : 'bg-[#1a1a25] text-[#71717a]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#1e1e2e] p-2">
        <div className="flex items-center justify-between px-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#06d6a0] to-[#60a5fa]" />
              <div>
                <div className="text-xs font-medium">Everett</div>
                <div className="text-[10px] text-[#71717a]">管理员</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-[#1a1a25] text-[#71717a] hover:text-[#e4e4e7] transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
