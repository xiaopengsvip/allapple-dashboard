'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { FileText, RefreshCw, Clock } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs?limit=100');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const statusColor: Record<string, string> = { success: '#34d399', failed: '#f87171', warning: '#fb923c' };

  return (
    <AppShell>
      <TopBar title="操作日志" titleEn="Logs" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="text-sm text-[#71717a]">{logs.length} 条记录</div>
          <button onClick={fetchLogs} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">时间</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">操作</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">目标</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">详情</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">状态</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b border-[#1e1e2e] hover:bg-[#1a1a25]">
                  <td className="px-4 py-2 text-xs text-[#71717a] font-mono"><Clock className="w-3 h-3 inline mr-1" />{new Date(l.created_at).toLocaleString('zh-CN')}</td>
                  <td className="px-4 py-2 text-xs font-medium">{l.action}</td>
                  <td className="px-4 py-2 text-xs text-[#71717a]">{l.target}</td>
                  <td className="px-4 py-2 text-xs text-[#71717a] max-w-xs truncate">{l.detail}</td>
                  <td className="px-4 py-2"><span className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${statusColor[l.status] || '#71717a'}20`, color: statusColor[l.status] || '#71717a' }}>{l.status}</span></td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-[#71717a]">{loading ? '加载中...' : '暂无日志'}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
