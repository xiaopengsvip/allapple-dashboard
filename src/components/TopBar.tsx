'use client';

import { Bell, Languages, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopBar({ title }: { title: string }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const bj = new Date(now.getTime() + 8 * 3600000);
      const h = String(bj.getUTCHours()).padStart(2, '0');
      const m = String(bj.getUTCMinutes()).padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-14 bg-[#09090b]/80 backdrop-blur-xl border-b border-[#ffffff08] flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-[#52525b]">Everett</span>
        <span className="text-[#3f3f46]">/</span>
        <span className="text-[#e4e4e7] font-medium">{title}</span>
      </div>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525b]" />
        <input
          type="text"
          placeholder="搜索..."
          className="w-52 pl-9 pr-3 py-1.5 rounded-lg text-[13px] bg-[#18181b] border border-[#ffffff0a] text-[#d4d4d8] placeholder:text-[#3f3f46] focus:outline-none focus:border-[#3b82f6]/30 transition-colors"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#3f3f46] bg-[#27272a] px-1.5 py-0.5 rounded border border-[#ffffff08]">⌘K</kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <span className="text-[12px] text-[#52525b] font-mono mr-2">{time}</span>
        <button className="p-2 rounded-lg hover:bg-[#ffffff06] text-[#52525b] hover:text-[#a1a1aa] transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-lg hover:bg-[#ffffff06] text-[#52525b] hover:text-[#a1a1aa] transition-colors">
          <Languages className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
