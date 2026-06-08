'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Camera, Save, Lock, CheckCircle2, User, Shield, Calendar, Eye, EyeOff } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/auth/profile').then(r => {
      if (r.status === 401) { window.location.href = '/login'; return null; }
      return r.json();
    }).then(d => {
      if (d?.user) {
        setUser(d.user);
        setDisplayName(d.user.display_name || '');
      }
    }).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const res = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_name: displayName }) });
    const data = await res.json();
    if (data.user) setUser(data.user);
    setSavingProfile(false);
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleChangePassword = async () => {
    setPwError('');
    setPwSuccess(false);
    if (!currentPw || !newPw) { setPwError(t('profile.fill_all_fields')); return; }
    if (newPw !== confirmPw) { setPwError(t('profile.password_mismatch')); return; }
    if (newPw.length < 6) { setPwError(t('profile.password_too_short')); return; }
    setSavingPw(true);
    const res = await fetch('/api/auth/password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_password: currentPw, new_password: newPw }) });
    const data = await res.json();
    setSavingPw(false);
    if (res.ok) {
      setPwSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSuccess(false), 3000);
    } else {
      setPwError(data.error || t('profile.change_failed'));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert(t('profile.image_too_large')); return; }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch('/api/auth/avatar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: reader.result }) });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, avatar_url: data.avatar_url };
        setUser(updated);
        window.dispatchEvent(new CustomEvent('eoc-user-updated'));
      } else {
        alert(data.error || t('profile.upload_failed'));
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <AppShell><TopBar title={t("profile.title")} /><div style={{ padding: 24, color: 'var(--text-muted)' }}>{t("profile.loading")}</div></AppShell>;

  return (
    <AppShell>
      <TopBar title={t("profile.title")} subtitle={t("profile.subtitle")} />
      <div style={{ padding: 24,  }}>

        {/* Avatar + Basic Info */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" style={{ width: 72, height: 72, borderRadius: 20, objectFit: 'cover', border: '2px solid var(--border)' }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#FFFFFF', background: 'linear-gradient(135deg, #4D7FFF, #675BFF)' }}>
                  {user.username[0].toUpperCase()}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', border: '2px solid var(--bg-card)', cursor: 'pointer' }}>
                <Camera style={{ width: 12, height: 12, color: '#FFFFFF' }} />
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{user.display_name || user.username}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>@{user.username}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Shield style={{ width: 12, height: 12, color: 'var(--accent)' }} />
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{user.role}</span>
              </div>
            </div>
            {uploading && <span style={{ fontSize: 12, color: 'var(--accent)' }}>{t("profile.uploading")}</span>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t("profile.display_name")}</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t("profile.enter_display_name")}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}><User style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />{t("profile.username")}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}><Calendar style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />{t("profile.registered")}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '—'}</div>
            </div>
          </div>

          <button onClick={handleSaveProfile} disabled={savingProfile} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 14,
            fontSize: 14, fontWeight: 600, background: savedProfile ? 'var(--success)' : 'var(--accent-gradient)',
            color: '#fff', border: 'none', cursor: 'pointer', transition: `all 200ms ${EASE}`,
            boxShadow: '0 4px 16px rgba(77,127,255,0.25)', opacity: savingProfile ? 0.6 : 1,
          }}>
            {savedProfile ? <><CheckCircle2 style={{ width: 16, height: 16 }} /> {t("profile.saved")}</> : savingProfile ? t("profile.saving") : <><Save style={{ width: 16, height: 16 }} /> {t("profile.save_profile")}</>}
          </button>
        </div>

        {/* Change Password */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Lock style={{ width: 18, height: 18, color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{t("profile.change_password")}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t("profile.current_password")}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder={t("profile.enter_current_pw")}
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t("profile.new_password")}</label>
              <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder={t("profile.min_6_chars")}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{t("profile.confirm_password")}</label>
              <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder={t("profile.enter_new_pw_again")}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            </div>
          </div>

          {pwError && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>⚠ {pwError}</div>}
          {pwSuccess && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'var(--success-soft)', color: 'var(--success)', fontSize: 13 }}>{t("profile.password_changed")}</div>}

          <button onClick={handleChangePassword} disabled={savingPw} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 14,
            fontSize: 14, fontWeight: 600, background: 'var(--accent-gradient)',
            color: '#fff', border: 'none', cursor: 'pointer', marginTop: 20,
            boxShadow: '0 4px 16px rgba(77,127,255,0.25)', opacity: savingPw ? 0.6 : 1,
            transition: `all 200ms ${EASE}`,
          }}>
            {savingPw ? t("profile.changing") : <><Lock style={{ width: 16, height: 16 }} /> {t("profile.change_btn")}</>}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
