'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Server, RefreshCw, Play, Square, RotateCw, FileText, Cpu, HardDrive, MemoryStick, Clock } from 'lucide-react';

export default function ServersPage() {
  const [pm2, setPm2] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pm2Res, statsRes] = await Promise.all([
        fetch('/api/server/pm2').then(r => r.json()).catch(() => ({ services: [] })),
        fetch('/api/server/stats').then(r => r.json()).catch(() => ({ stats: null })),
      ]);
      setPm2(pm2Res.services || []);
      setStats(statsRes.stats);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const fmtBytes = (b: number) => {
    if (b > 1024*1024*1024) return (b/1024/1024/1024).toFixed(1) + 'GB';
    if (b > 1024*1024) return (b/1024/1024).toFixed(0) + 'MB';
    return (b/1024).toFixed(0) + 'KB';
  };

  const fmtUptime = (s: number) => {
    const d = Math.floor(s/86400); const h = Math.floor((s%86400)/3600);
    return d > 0 ? `${d}d ${h}h` : `${h}h`;
  };

  return (
    <AppShell>
      <TopBar title="服务器管理" titleEn="Servers" />
      <div className="p-6 space-y-6">
        {/* System Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-[#06d6a0]" /><span className="text-xs text-[#71717a]">CPU</span></div>
              <div className="text-lg font-bold text-[#06d6a0]">{stats.cpu.cores} cores</div>
              <div className="text-[10px] text-[#71717a]">Load: {stats.cpu.loadAvg.join(' / ')}</div>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><MemoryStick className="w-4 h-4 text-[#a78bfa]" /><span className="text-xs text-[#71717a]">内存</span></div>
              <div className="text-lg font-bold text-[#a78bfa]">{stats.memory.percent}%</div>
              <div className="text-[10px] text-[#71717a]">{fmtBytes(stats.memory.used)} / {fmtBytes(stats.memory.total)}</div>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><HardDrive className="w-4 h-4 text-[#60a5fa]" /><span className="text-xs text-[#71717a]">磁盘</span></div>
              <div className="text-lg font-bold text-[#60a5fa]">{stats.disk.percent}%</div>
              <div className="text-[10px] text-[#71717a]">{fmtBytes(stats.disk.used)} / {fmtBytes(stats.disk.total)}</div>
            </div>
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Clock className="w-4 h-4 text-[#fb923c]" /><span className="text-xs text-[#71717a]">Uptime</span></div>
              <div className="text-lg font-bold text-[#fb923c]">{fmtUptime(stats.uptime)}</div>
              <div className="text-[10px] text-[#71717a]">{stats.hostname} · {stats.arch}</div>
            </div>
          </div>
        )}

        {/* PM2 Services */}
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#60a5fa]" />
              <span className="text-sm font-semibold">PM2 服务</span>
              <span className="text-[11px] text-[#34d399]">{pm2.filter(s => s.pm2_env?.status === 'online').length}/{pm2.length} 在线</span>
            </div>
            <button onClick={fetchData} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
            </button>
          </div>
          <div className="space-y-2">
            {pm2.map(s => (
              <div key={s.name} className="flex items-center gap-4 px-4 py-3 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e]">
                <div className={`w-3 h-3 rounded-full ${s.pm2_env?.status === 'online' ? 'bg-[#34d399]' : 'bg-[#f87171]'}`}
                  style={s.pm2_env?.status === 'online' ? { boxShadow: '0 0 8px #34d399' } : {}} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{s.name}</span>
                    <span className="text-[10px] text-[#71717a]">v{s.pm2_env?.version || '?'}</span>
                  </div>
                  <div className="text-[11px] text-[#71717a] mt-0.5">
                    PID {s.pid} · {s.monit ? fmtBytes(s.monit.memory) : '?'} · CPU {s.monit?.cpu || 0}% · Uptime {s.pm2_env?.pm_uptime ? fmtUptime(Math.floor((Date.now() - s.pm2_env.pm_uptime)/1000)) : '?'}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#34d399]" title="重启"><RotateCw className="w-3.5 h-3.5" /></button>
                  <button className="p-2 rounded-lg hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#f87171]" title="停止"><Square className="w-3.5 h-3.5" /></button>
                  <button className="p-2 rounded-lg hover:bg-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]" title="日志"><FileText className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
            {pm2.length === 0 && <div className="text-center text-xs text-[#71717a] py-8">{loading ? '加载中...' : '暂无 PM2 服务'}</div>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
