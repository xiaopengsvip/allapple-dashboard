'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Settings, Save, Eye, EyeOff, Shield, Key } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false);
  };

  const fields = [
    { key: 'cloudflare_api_token', label: 'Cloudflare API Token', icon: '☁️', desc: '用于管理 DNS 记录' },
    { key: 'vercel_token', label: 'Vercel Token', icon: '▲', desc: '用于查看 Vercel 项目和部署' },
    { key: 'github_token', label: 'GitHub Token', icon: '⚡', desc: '用于查看仓库和管理 Webhook' },
    { key: 'github_org', label: 'GitHub 组织/用户', icon: '👤', desc: 'GitHub 用户名或组织名' },
    { key: 'server_host', label: '服务器地址', icon: '🖥️', desc: '用于 API 代理' },
    { key: 'jwt_secret', label: 'JWT 密钥', icon: '🔑', desc: '用于签发认证 Token' },
  ];

  return (
    <AppShell>
      <TopBar title="设置" />
      <div className="p-6 max-w-2xl">
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-5 h-5 text-[#06d6a0]" />
            <h2 className="text-lg font-semibold">API 密钥管理</h2>
          </div>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <span>{f.icon}</span> {f.label}
                </label>
                <p className="text-[11px] text-[#71717a]">{f.desc}</p>
                <div className="relative">
                  <input
                    type={showSecrets[f.key] ? 'text' : 'password'}
                    value={settings[f.key] || ''}
                    onChange={e => setSettings({...settings, [f.key]: e.target.value})}
                    placeholder={`输入 ${f.label}...`}
                    className="w-full px-3 py-2 pr-10 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-sm font-mono"
                  />
                  <button onClick={() => setShowSecrets({...showSecrets, [f.key]: !showSecrets[f.key]})} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#e4e4e7]">
                    {showSecrets[f.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#06d6a0] text-black font-medium text-sm hover:bg-[#05c490] disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#a78bfa]" />
            <h2 className="text-lg font-semibold">系统信息</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0a0a0f]"><span className="text-[#71717a]">版本</span><div className="font-mono mt-1">v1.0.0</div></div>
            <div className="p-3 rounded-lg bg-[#0a0a0f]"><span className="text-[#71717a]">框架</span><div className="font-mono mt-1">Next.js 15</div></div>
            <div className="p-3 rounded-lg bg-[#0a0a0f]"><span className="text-[#71717a]">数据库</span><div className="font-mono mt-1">SQLite</div></div>
            <div className="p-3 rounded-lg bg-[#0a0a0f]"><span className="text-[#71717a]">部署</span><div className="font-mono mt-1">Vercel</div></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
