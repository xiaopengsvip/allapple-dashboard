'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Globe, Rocket, GitBranch,
  GitFork, Cloud, Server, FileText, Settings, ChevronLeft,
  ChevronRight, Search, Bell, Languages
} from 'lucide-react';

const navItems = [
  { section: '总览', items: [
    { href: '/', icon: LayoutDashboard, label: '仪表盘', labelEn: 'Dashboard' },
  ]},
  { section: '管理', items: [
    { href: '/projects', icon: Package, label: '项目管理', labelEn: 'Projects' },
    { href: '/domains', icon: Globe, label: '域名管理', labelEn: 'Domains' },
    { href: '/deployments', icon: Rocket, label: '部署管理', labelEn: 'Deployments' },
    { href: '/relations', icon: GitBranch, label: '关联视图', labelEn: 'Relations' },
  ]},
  { section: '平台', items: [
    { href: '/github', icon: GitFork, label: 'GitHub', labelEn: 'GitHub' },
    { href: '/vercel', icon: Cloud, label: 'Vercel', labelEn: 'Vercel' },
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

  return (
    <aside className={`${collapsed ? 'w-[68px]' : 'w-[240px]'} bg-[#0f0f12] border-r border-[#ffffff0a] flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out h-screen sticky top-0`}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 gap-3 border-b border-[#ffffff08]">
        <img src="/favicon.png" alt="E" className="w-8 h-8 rounded-lg flex-shrink-0" />
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <div className="text-[15px] font-semibold text-white tracking-tight">Everett</div>
            <div className="text-[11px] text-[#71717a]">运维中心</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-[#ffffff0a] text-[#52525b] hover:text-[#a1a1aa] transition-colors flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {navItems.map((section) => (
          <div key={section.section} className="mb-5">
            {!collapsed && (
              <div className="text-[11px] font-medium text-[#3f3f46] uppercase tracking-wider px-3 mb-2">
                {section.section}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 group ${
                      isActive
                        ? 'bg-[#ffffff0c] text-white font-medium'
                        : 'text-[#71717a] hover:bg-[#ffffff06] hover:text-[#d4d4d8]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-white' : 'text-[#52525b] group-hover:text-[#a1a1aa]'}`} />
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

      {/* Footer */}
      <div className="border-t border-[#ffffff08] p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
            E
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-[13px] font-medium text-[#d4d4d8] truncate">Everett</div>
              <div className="text-[11px] text-[#52525b]">管理员</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
