'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Save, Eye, EyeOff, Shield, Key, Cloud, Zap, Server, Globe, CheckCircle2 } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      setSettings(d.settings || {});
      setOriginal(d.settings || {});
    });
  }, []);

  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });

  const isDirty = (fields: { key: string }[]) => fields.some(f => settings[f.key] !== original[f.key]);

  const handleSaveSection = async (sectionKey: string, fields: { key: string }[]) => {
    setSavingSection(sectionKey);
    const payload: Record<string, string> = {};
    fields.forEach(f => { payload[f.key] = settings[f.key]; });
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setOriginal({ ...original, ...payload });
    setSavingSection(null);
    setSavedSection(sectionKey);
    setTimeout(() => setSavedSection(null), 2000);
  };

  const sections = [
    { key: 'cf', title: 'Cloudflare', desc: 'DNS 记录管理与域名解析', icon: Globe, color: '#F59E0B',
      fields: [{ key: 'cloudflare_api_token', label: 'API Token', placeholder: '输入 Cloudflare API Token...' }] },
    { key: 'vercel', title: 'Vercel', desc: 'Edge 部署与项目管理', icon: Cloud, color: '#FFFFFF',
      fields: [{ key: 'vercel_token', label: 'Token', placeholder: '输入 Vercel Token...' }] },
    { key: 'gh', title: 'GitHub', desc: '仓库管理与 Webhook 配置', icon: Zap, color: '#F59E0B',
      fields: [
        { key: 'github_token', label: 'Token', placeholder: '输入 GitHub Token...' },
        { key: 'github_org', label: '组织/用户', placeholder: 'xiaopengsvip' },
      ] },
    { key: 'srv', title: '服务器', desc: '腾讯云 Tokyo 实例连接', icon: Server, color: '#4D7FFF',
      fields: [{ key: 'server_host', label: '服务器地址', placeholder: '43.167.213.143' }] },
    { key: 'auth', title: '认证', desc: 'JWT 令牌签发密钥', icon: Shield, color: '#A78BFA',
      fields: [{ key: 'jwt_secret', label: 'JWT 密钥', placeholder: '自动生成的密钥' }] },
  ];

  const systemInfo = [
    { label: '版本', value: 'v1.0.0', icon: '🏷' },
    { label: '框架', value: 'Next.js 16', icon: '⚡' },
    { label: '数据库', value: 'SQLite', icon: '🗄' },
    { label: '部署', value: 'PM2 + Caddy', icon: '🚀' },
    { label: '服务器', value: '腾讯云 Tokyo', icon: '🖥' },
    { label: '域名', value: 'dashboard.vios.top', icon: '🌐' },
  ];

  return (
    <AppShell>
      <TopBar title="系统设置" subtitle="API 密钥与系统配置" />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {sections.map((section) => {
            const Icon = section.icon;
            const dirty = isDirty(section.fields);
            const saving = savingSection === section.key;
            const saved = savedSection === section.key;
            const configured = section.fields.every(f => settings[f.key] && !settings[f.key].startsWith('***'));

            return (
              <div key={section.key} style={{
                background: 'var(--bg-card)', borderRadius: 20, border: `1px solid ${dirty ? 'rgba(77,127,255,0.3)' : 'var(--border)'}`,
                overflow: 'hidden', boxShadow: 'var(--shadow-card)', transition: `border-color 200ms ${EASE}`,
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
                  borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${section.color}12`, flexShrink: 0 }}>
                    <Icon style={{ width: 18, height: 18, color: section.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{section.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{section.desc}</div>
                  </div>
                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
                    {configured ? (
                      <><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px rgba(16,185,129,0.4)' }} /><span style={{ fontSize: 11, color: 'var(--success)' }}>已配置</span></>
                    ) : (
                      <><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)' }} /><span style={{ fontSize: 11, color: 'var(--warning)' }}>未配置</span></>
                    )}
                  </div>
                  {/* Save button per section */}
                  <button
                    onClick={() => handleSaveSection(section.key, section.fields)}
                    disabled={!dirty || saving}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                      background: saved ? 'var(--success)' : dirty ? 'var(--accent-gradient)' : 'var(--bg-card)',
                      color: saved ? '#fff' : dirty ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${dirty ? 'transparent' : 'var(--border)'}`,
                      cursor: dirty ? 'pointer' : 'default',
                      opacity: dirty && !saving ? 1 : 0.5,
                      transition: `all 200ms ${EASE}`,
                      boxShadow: dirty ? '0 2px 8px rgba(77,127,255,0.2)' : 'none',
                    }}
                  >
                    {saved ? <><CheckCircle2 style={{ width: 13, height: 13 }} /> 已保存</> : saving ? '保存中...' : <><Save style={{ width: 13, height: 13 }} /> 保存</>}
                  </button>
                </div>

                {/* Fields */}
                <div style={{ padding: '16px 20px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {section.fields.map(f => (
                    <div key={f.key} style={{ flex: '1 1 280px', minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{f.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showSecrets[f.key] ? 'text' : 'password'}
                          value={settings[f.key] || ''}
                          onChange={e => update(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          style={{
                            width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12,
                            background: 'var(--bg-root)', border: `1px solid ${settings[f.key] !== original[f.key] ? 'rgba(77,127,255,0.4)' : 'var(--border)'}`,
                            color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-mono)',
                            outline: 'none', transition: `border-color 150ms ${EASE}`,
                          }}
                          onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                          onBlur={e => { e.currentTarget.style.borderColor = settings[f.key] !== original[f.key] ? 'rgba(77,127,255,0.4)' : 'var(--border)'; }}
                        />
                        <button onClick={() => setShowSecrets({ ...showSecrets, [f.key]: !showSecrets[f.key] })}
                          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                          {showSecrets[f.key] ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* System Info */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Shield style={{ width: 18, height: 18, color: '#A78BFA' }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>系统信息</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
            {systemInfo.map(s => (
              <div key={s.label} style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{s.icon} {s.label}</div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
