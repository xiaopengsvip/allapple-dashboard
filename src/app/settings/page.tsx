'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Save, Eye, EyeOff, Shield, Key } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {})); }, []);

  const handleSave = async () => { setSaving(true); await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) }); setSaving(false); };

  const fields = [
    { key: 'cloudflare_api_token', label: 'Cloudflare API Token', icon: '☁️', desc: '用于管理 DNS 记录' },
    { key: 'vercel_token', label: 'Vercel Token', icon: '▲', desc: '用于查看 Vercel 项目和部署' },
    { key: 'github_token', label: 'GitHub Token', icon: '⚡', desc: '用于查看仓库和管理 Webhook' },
    { key: 'github_org', label: 'GitHub 组织/用户', icon: '👤', desc: 'GitHub 用户名或组织名' },
    { key: 'server_host', label: '服务器地址', icon: '🖥', desc: '用于 API 代理' },
    { key: 'jwt_secret', label: 'JWT 密钥', icon: '🔑', desc: '用于签发认证 Token' },
  ];

  return (
    <AppShell>
      <TopBar title="系统设置" subtitle="API 密钥与系统配置" />
      <div style={{ padding: 24, maxWidth: 680, margin: '0 auto' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Key style={{ width: 18, height: 18, color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>API 密钥管理</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                  <span>{f.icon}</span> {f.label}
                </label>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{f.desc}</p>
                <div style={{ position: 'relative' }}>
                  <input type={showSecrets[f.key] ? 'text' : 'password'} value={settings[f.key] || ''} onChange={e => setSettings({...settings, [f.key]: e.target.value})}
                    placeholder={`输入 ${f.label}...`}
                    style={{ width: '100%', padding: '10px 40px 10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none' }} />
                  <button onClick={() => setShowSecrets({...showSecrets, [f.key]: !showSecrets[f.key]})}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showSecrets[f.key] ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
              <Save style={{ width: 16, height: 16 }} /> {saving ? '保存中...' : '保存设置'}
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Shield style={{ width: 18, height: 18, color: '#A78BFA' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>系统信息</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ l: '版本', v: 'v1.0.0' }, { l: '框架', v: 'Next.js 16' }, { l: '数据库', v: 'SQLite' }, { l: '部署', v: '服务器 PM2' }].map(s => (
              <div key={s.l} style={{ padding: 14, borderRadius: 14, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
