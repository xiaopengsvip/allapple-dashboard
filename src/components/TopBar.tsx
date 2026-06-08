'use client';

import { Search, Bell, Sun, Moon, Command } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ title }: { title: string }) {
  const [time, setTime] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const bj = new Date(now.getTime() + 8 * 3600000);
      setTime(`${String(bj.getUTCHours()).padStart(2, '0')}:${String(bj.getUTCMinutes()).padStart(2, '0')}`);
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <header
      className="h-[72px] flex items-center px-6 gap-4 sticky top-0 z-40 glass"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {/* Page Title */}
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-[16px] font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      </div>

      <div className="flex-1" />

      {/* Global Search */}
      <div
        className="relative hidden lg:flex items-center w-[280px] px-3 py-2 rounded-[12px] cursor-pointer transition-all duration-200"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <Search className="w-3.5 h-3.5 mr-2 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
        <span className="text-[13px] flex-1" style={{ color: 'var(--text-muted)' }}>搜索项目、域名...</span>
        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          <Command className="w-2.5 h-2.5" />K
        </div>
      </div>

      {/* Status Indicators */}
      <div className="hidden md:flex items-center gap-1">
        <StatusPill icon="●" label="GitHub" color="var(--success)" />
        <StatusPill icon="●" label="Vercel" color="var(--success)" />
        <StatusPill icon="●" label="CF" color="var(--success)" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          className="relative p-2.5 rounded-[10px] transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Bell className="w-[18px] h-[18px]" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: 'var(--error)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-[10px] transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>
        <div className="ml-2 pl-3 flex items-center gap-3" style={{ borderLeft: '1px solid var(--border)' }}>
          <span className="text-[12px] font-mono font-medium" style={{ color: 'var(--text-muted)' }}>{time}</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--purple))' }}>
            E
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusPill({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 cursor-default"
      style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
    >
      <span style={{ color, fontSize: '6px' }}>{icon}</span>
      {label}
    </div>
  );
}
