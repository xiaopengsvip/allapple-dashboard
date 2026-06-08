'use client';

import { Bell, Languages } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ title, titleEn }: { title: string; titleEn: string }) {
  const [locale, setLocale] = useState<'zh' | 'en'>('zh');
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const bj = new Date(now.getTime() + 8 * 3600000);
      const h = String(bj.getUTCHours()).padStart(2, '0');
      const m = String(bj.getUTCMinutes()).padStart(2, '0');
      const s = String(bj.getUTCSeconds()).padStart(2, '0');
      setTime(`BJT ${h}:${m}:${s}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 border-b border-[#1e1e2e] bg-[#12121a]/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#71717a]">Everett 运维中心</span>
        <span className="text-[#71717a]">/</span>
        <span className="text-[#e4e4e7] font-medium">{locale === 'zh' ? title : titleEn}</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#71717a] font-mono">{time}</span>
        <button className="p-2 rounded-lg hover:bg-[#1a1a25] text-[#71717a] hover:text-[#e4e4e7] transition-all">
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={() => setLocale(l => l === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-[#71717a] hover:text-[#e4e4e7] hover:bg-[#1a1a25] transition-all border border-[#1e1e2e]"
        >
          <Languages className="w-3 h-3" />
          {locale === 'zh' ? '中/EN' : 'EN/中'}
        </button>
      </div>
    </header>
  );
}
