'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub: string;
  color?: string;
}

export default function StatsCard({ icon: Icon, label, value, sub, color = '#3b82f6' }: StatsCardProps) {
  return (
    <div className="bg-[#18181b] border border-[#ffffff08] rounded-xl p-5 hover:border-[#ffffff15] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
          <Icon className="w-[18px] h-[18px]" style={{ color }} />
        </div>
      </div>
      <div className="text-[28px] font-bold text-white tracking-tight leading-none mb-1">{value}</div>
      <div className="text-[12px] text-[#71717a]">{label}</div>
      <div className="text-[11px] text-[#3f3f46] mt-1">{sub}</div>
    </div>
  );
}
