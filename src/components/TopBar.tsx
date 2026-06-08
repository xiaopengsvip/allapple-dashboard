'use client';

import { Search, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [time, setTime] = useState('');

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

  return (
    <header className="h-[72px] flex items-center px-6 gap-4 sticky top-0 z-40" style={{ background: 'var(--bg-root)', borderBottom: '1px solid var(--border)' }}>
      <div className="min-w-0">
        <h1 className="text-[20px] font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      <div className="flex-1" />
      <div className="hidden lg:flex items-center w-[260px] px-3 py-2 rounded-xl cursor-pointer transition-colors"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <Search className="w-3.5 h-3.5 mr-2" style={{ color: 'var(--text-muted)' }} />
        <span className="text-[12px] flex-1" style={{ color: 'var(--text-muted)' }}>搜索...</span>
        <kbd className="text-[9px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>⌘K</kbd>
      </div>
      <div className="flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid var(--border)' }}>
        <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>{time}</span>
        <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
          <Bell className="w-[18px] h-[18px]" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--error)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
        </button>
      </div>
    </header>
  );
}
