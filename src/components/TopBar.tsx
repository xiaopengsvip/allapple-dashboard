'use client';

import { Search, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const weekDay = ['日', '一', '二', '三', '四', '五', '六'];
  const fmtBJ = () => {
    const bj = new Date(now.getTime() + 8 * 3600000);
    return `${bj.getUTCFullYear()}/${String(bj.getUTCMonth() + 1).padStart(2, '0')}/${String(bj.getUTCDate()).padStart(2, '0')} 周${weekDay[bj.getUTCDay()]} ${String(bj.getUTCHours()).padStart(2, '0')}:${String(bj.getUTCMinutes()).padStart(2, '0')}:${String(bj.getUTCSeconds()).padStart(2, '0')}`;
  };
  const fmtUTC = () => `UTC ${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}`;

  return (
    <header style={{
      height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 40,
      background: 'var(--bg-root)', borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div style={{ flex: 1 }} />
      <div className="hidden lg:flex" style={{
        display: 'flex', alignItems: 'center', width: 240, padding: '6px 12px', borderRadius: 12,
        background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer',
      }}>
        <Search style={{ width: 14, height: 14, marginRight: 8, color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 12, flex: 1, color: 'var(--text-muted)' }}>搜索...</span>
        <kbd style={{ fontSize: 9, padding: '2px 6px', borderRadius: 5, background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 500 }}>⌘K</kbd>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#4D7FFF' }}>{fmtBJ()}</span>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{fmtUTC()}</span>
        </div>
        <button style={{ position: 'relative', padding: 8, borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Bell style={{ width: 18, height: 18 }} />
          <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--error)', boxShadow: '0 0 6px rgba(239,68,68,0.5)' }} />
        </button>
      </div>
    </header>
  );
}
