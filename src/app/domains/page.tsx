'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Globe, RefreshCw, Plus, Search, ExternalLink, Shield } from 'lucide-react';

export default function DomainsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [zone, setZone] = useState('all');
  const [search, setSearch] = useState('');

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/domains');
      const data = await res.json();
      setRecords(data.records || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchDomains(); }, []);

  const filtered = records.filter(r => {
    if (zone !== 'all' && r.zone_name !== zone) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <TopBar title="域名管理" titleEn="Domains" />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex gap-1.5">
            {['all', 'allapple.top', 'vios.top'].map(z => (
              <button key={z} onClick={() => setZone(z)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${zone === z ? 'bg-[#06d6a020] border border-[#06d6a040] text-[#06d6a0]' : 'bg-[#12121a] border border-[#1e1e2e] text-[#71717a]'}`}>
                {z === 'all' ? '全部' : z} ({z === 'all' ? records.length : records.filter(r => r.zone_name === z).length})
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
            <input type="text" placeholder="搜索域名..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-[#12121a] border border-[#1e1e2e] text-[#e4e4e7] w-48" />
          </div>
          <button onClick={fetchDomains} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-[#1e1e2e] text-[#71717a] hover:text-[#e4e4e7]">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> 刷新
          </button>
        </div>

        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e1e2e]">
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">类型</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">域名</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">目标</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">代理</th>
                <th className="text-left px-4 py-3 text-[11px] text-[#71717a] font-medium">Zone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id || i} className="border-b border-[#1e1e2e] hover:bg-[#1a1a25] transition-colors">
                  <td className="px-4 py-2"><span className="text-[10px] px-2 py-0.5 rounded bg-[#06d6a015] text-[#06d6a0] font-mono">{r.type}</span></td>
                  <td className="px-4 py-2 text-xs font-mono text-[#e4e4e7]">{r.name}</td>
                  <td className="px-4 py-2 text-xs font-mono text-[#71717a]">{r.content}</td>
                  <td className="px-4 py-2"><span className={`text-[10px] px-2 py-0.5 rounded ${r.proxied ? 'bg-[#fb923c20] text-[#fb923c]' : 'bg-[#1a1a25] text-[#71717a]'}`}>{r.proxied ? 'PROXY' : 'DNS'}</span></td>
                  <td className="px-4 py-2 text-[11px] text-[#71717a]">{r.zone_name}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-[#71717a]">{loading ? '加载中...' : '暂无数据，请在设置中配置 Cloudflare Token'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
