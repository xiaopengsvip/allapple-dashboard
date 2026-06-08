'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Save, Eye, EyeOff, Shield, Key, Cloud, Zap, Server, Globe, CheckCircle2, Edit3, X } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => setSettings(d.settings || {}));
  }, []);

  const startEdit = (sectionKey: string, fields: { key: string }[]) => {
    const draftData: Record<string, string> = {};
    fields.forEach(f => { draftData[f.key] = settings[f.key] || ''; });
    setDraft(draftData);
    setEditingSection(sectionKey);
    setSaved(false);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setDraft({});
  };

  const handleSave = async (sectionKey: string, fields: { key: string }[]) => {
    setSaving(true);
    const payload: Record<string, string> = {};
    fields.forEach(f => { payload[f.key] = draft[f.key]; });
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSettings({ ...settings, ...payload });
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditingSection(null); }, 1500);
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
            const isEditing = editingSection === section.key;
            const configured = section.fields.every(f => settings[f.key] && !settings[f.key].startsWith('***'));

            return (
              <div key={section.key} style={{
                background: 'var(--bg-card)', borderRadius: 20,
                border: `1px solid ${isEditing ? 'rgba(77,127,255,0.3)' : 'var(--border)'}`,
                overflow: 'hidden', boxShadow: 'var(--shadow-card)',
                transition: `border-color 200ms ${EASE}`,
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
                  {/* Action Buttons */}
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={cancelEdit} style={{
                        padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                        background: 'var(--bg-card)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border)', cursor: 'pointer',
                        transition: `all 150ms ${EASE}`,
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >取消</button>
                      <button onClick={() => handleSave(section.key, section.fields)} disabled={saving} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: saved ? 'var(--success)' : 'var(--accent-gradient)',
                        color: '#fff', border: 'none', cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(77,127,255,0.2)',
                        opacity: saving ? 0.6 : 1, transition: `all 200ms ${EASE}`,
                      }}>
                        {saved ? <><CheckCircle2 style={{ width: 13, height: 13 }} /> 已保存</> : saving ? '保存中...' : <><Save style={{ width: 13, height: 13 }} /> 保存</>}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(section.key, section.fields)} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                      background: 'var(--bg-card)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      transition: `all 150ms ${EASE}`,
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <Edit3 style={{ width: 13, height: 13 }} /> 编辑
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div style={{ padding: '16px 20px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {section.fields.map(f => (
                    <div key={f.key} style={{ flex: '1 1 280px', minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{f.label}</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showSecrets[f.key] ? 'text' : 'password'}
                          value={isEditing ? (draft[f.key] ?? '') : (settings[f.key] || '')}
                          onChange={e => isEditing && setDraft({ ...draft, [f.key]: e.target.value })}
                          readOnly={!isEditing}
                          placeholder={isEditing ? f.placeholder : '••••••••'}
                          style={{
                            width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12,
                            background: isEditing ? 'var(--bg-root)' : 'var(--bg-elevated)',
                            border: `1px solid ${isEditing ? 'rgba(77,127,255,0.3)' : 'var(--border)'}`,
                            color: 'var(--text-primary)', fontSize: 13, fontFamily: 'var(--font-mono)',
                            outline: 'none', cursor: isEditing ? 'text' : 'default',
                            opacity: isEditing ? 1 : 0.7,
                            transition: `all 150ms ${EASE}`,
                          }}
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
