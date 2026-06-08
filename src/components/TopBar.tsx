'use client';

import { Search, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const weekDay = ['日', '一', '二', '三', '四', '五', '六'];

  const fmtBJ = () => {
    const bj = new Date(now.getTime() + 8 * 3600000);
    const y = bj.getUTCFullYear();
    const mo = String(bj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(bj.getUTCDate()).padStart(2, '0');
    const w = weekDay[bj.getUTCDay()];
    const h = String(bj.getUTCHours()).padStart(2, '0');
    const mi = String(bj.getUTCMinutes()).padStart(2, '0');
    const s = String(bj.getUTCSeconds()).padStart(2, '0');
    return `${y}/${mo}/${d} 周${w} ${h}:${mi}:${s}`;
  };

  const fmtUTC = () => {
    const y = now.getUTCFullYear();
    const mo = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    const h = String(now.getUTCHours()).padStart(2, '0');
    const mi = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    return `UTC ${y}/${mo}/${d} ${h}:${mi}:${s}`;
  };

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
      <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[11px] font-mono font-medium" style={{ color: '#818CF8' }}>{fmtBJ()}</span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{fmtUTC()}</span>
        </div>
        <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
          <Bell className="w-[18px] h-[18px]" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--error)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
        </button>
      </div>
    </header>
  );
}
