'use client';

import { Search, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [now, setNow] = useState(new Date());
  const [hovered, setHovered] = useState<'bj' | 'utc' | null>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const weekDay = ['日', '一', '二', '三', '四', '五', '六'];

  const fmtFull = (offset: number, prefix: string) => {
    const d = new Date(now.getTime() + offset * 3600000);
    const y = d.getUTCFullYear();
    const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const w = weekDay[d.getUTCDay()];
    const h = String(d.getUTCHours()).padStart(2, '0');
    const mi = String(d.getUTCMinutes()).padStart(2, '0');
    const s = String(d.getUTCSeconds()).padStart(2, '0');
    return `${prefix} ${y}/${mo}/${day} 周${w} ${h}:${mi}:${s}`;
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
        <div className="flex flex-col items-end gap-0.5 relative">
          {/* 北京时间 */}
          <span
            className="text-[11px] font-mono font-medium cursor-default relative"
            style={{ color: '#818CF8' }}
            onMouseEnter={() => setHovered('bj')}
            onMouseLeave={() => setHovered(null)}
          >
            {fmtFull(8, 'BJT')}
            {/* 浮窗 */}
            {hovered === 'bj' && (
              <div className="absolute top-full right-0 mt-2 z-[9999] pointer-events-none">
                <div className="rounded-xl px-4 py-3 whitespace-nowrap"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <div className="text-[11px] font-semibold text-white mb-1">北京时间 (UTC+8)</div>
                  <div className="text-[10px] font-mono" style={{ color: '#818CF8' }}>{fmtFull(8, '')}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>中国 · 新加坡 · 马来西亚</div>
                </div>
              </div>
            )}
          </span>
          {/* UTC */}
          <span
            className="text-[10px] font-mono cursor-default relative"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={() => setHovered('utc')}
            onMouseLeave={() => setHovered(null)}
          >
            {fmtFull(0, 'UTC')}
            {/* 浮窗 */}
            {hovered === 'utc' && (
              <div className="absolute top-full right-0 mt-2 z-[9999] pointer-events-none">
                <div className="rounded-xl px-4 py-3 whitespace-nowrap"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <div className="text-[11px] font-semibold text-white mb-1">协调世界时 (UTC+0)</div>
                  <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{fmtFull(0, '')}</div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>伦敦 · 冰岛 · 西非</div>
                </div>
              </div>
            )}
          </span>
        </div>
        <button className="relative p-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}>
          <Bell className="w-[18px] h-[18px]" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--error)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
        </button>
      </div>
    </header>
  );
}
