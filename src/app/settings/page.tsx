'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Save, Eye, EyeOff, Shield, Key, Cloud, Zap, Server, Globe, CheckCircle2, Edit3, X } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const { t } = useTranslation();
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
    { key: 'cf', title: 'Cloudflare', desc: t('settings.cf_desc'), icon: Globe, color: '#F59E0B',
      fields: [{ key: 'cloudflare_api_token', label: 'API Token', placeholder: 'Cloudflare API Token...' }] },
    { key: 'vercel', title: 'Vercel', desc: t('settings.vercel_desc'), icon: Cloud, color: '#FFFFFF',
      fields: [{ key: 'vercel_token', label: 'Token', placeholder: 'Vercel Token...' }] },
    { key: 'gh', title: 'GitHub', desc: t('settings.gh_desc'), icon: Zap, color: '#F59E0B',
      fields: [
        { key: 'github_token', label: 'Token', placeholder: 'GitHub Token...' },
        { key: 'github_org', label: t('settings.server_address'), placeholder: 'xiaopengsvip' },
      ] },
    { key: 'srv', title: t('settings.server'), desc: t('settings.srv_desc'), icon: Server, color: '#4D7FFF',
      fields: [{ key: 'server_host', label: t('settings.server_address'), placeholder: '43.167.213.143' }] },
    { key: 'auth', title: 'JWT', desc: t('settings.auth_desc'), icon: Shield, color: '#A78BFA',
      fields: [{ key: 'jwt_secret', label: 'JWT Secret', placeholder: '••••••••' }] },
  ];

  const systemInfo = [
    { label: t('settings.version'), value: 'v1.0.0', icon: '🏷' },
    { label: t('settings.framework'), value: 'Next.js 16', icon: '⚡' },
    { label: t('settings.database'), value: 'SQLite', icon: '🗄' },
    { label: t('settings.deployment'), value: 'PM2 + Caddy', icon: '🚀' },
    { label: t('settings.server'), value: 'Tencent Cloud Tokyo', icon: '🖥' },
    { label: t('settings.domain_label'), value: 'dashboard.vios.top', icon: '🌐' },
  ];

  return (
    <AppShell>
      <TopBar title={t("settings.title")} subtitle={t("settings.subtitle")} />
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 8 }}>
                    {configured ? (
                      <><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 6px rgba(16,185,129,0.4)' }} /><span style={{ fontSize: 11, color: 'var(--success)' }}>{t("settings.configured")}</span></>
                    ) : (
                      <><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warning)' }} /><span style={{ fontSize: 11, color: 'var(--warning)' }}>{t("settings.not_configured")}</span></>
                    )}
                  </div>
                  {isEditing ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={cancelEdit} style={{
                        padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 500,
                        background: 'var(--bg-card)', color: 'var(--text-secondary)',
                        border: '1px solid var(--border)', cursor: 'pointer',
                        transition: `all 150ms ${EASE}`,
                      }}>{t("settings.cancel")}</button>
                      <button onClick={() => handleSave(section.key, section.fields)} disabled={saving} style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                        background: saved ? 'var(--success)' : 'var(--accent-gradient)',
                        color: '#fff', border: 'none', cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(77,127,255,0.2)',
                        opacity: saving ? 0.6 : 1, transition: `all 200ms ${EASE}`,
                      }}>
                        {saved ? <><CheckCircle2 style={{ width: 13, height: 13 }} /> {t("settings.saved")}</> : saving ? t("settings.saving") : <><Save style={{ width: 13, height: 13 }} /> {t("settings.save")}</>}
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
                      <Edit3 style={{ width: 13, height: 13 }} /> {t("settings.edit")}
                    </button>
                  )}
                </div>

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
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{t("settings.system_info")}</h2>
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
