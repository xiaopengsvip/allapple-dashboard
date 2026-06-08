'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub: string;
  color?: string;
}

export default function StatsCard({ icon: Icon, label, value, sub, color = '#06d6a0' }: StatsCardProps) {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <div className="text-[22px] font-bold" style={{ color }}>{value}</div>
          <div className="text-[11px] text-[#71717a]">{label}</div>
        </div>
      </div>
      <div className="text-[10px] text-[#71717a] mt-2">{sub}</div>
    </div>
  );
}
