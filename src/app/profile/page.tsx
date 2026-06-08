'use client';

import { useState, useEffect, useRef } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Camera, Save, Lock, CheckCircle2, User, Shield, Calendar, Eye, EyeOff } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  // Avatar
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
    if (!currentPw || !newPw) { setPwError('请填写所有字段'); return; }
    if (newPw !== confirmPw) { setPwError('两次输入的新密码不一致'); return; }
    if (newPw.length < 6) { setPwError('新密码至少6位'); return; }
    setSavingPw(true);
    const res = await fetch('/api/auth/password', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_password: currentPw, new_password: newPw }) });
    const data = await res.json();
    setSavingPw(false);
    if (res.ok) {
      setPwSuccess(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setPwSuccess(false), 3000);
    } else {
      setPwError(data.error || '修改失败');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('图片大小不能超过 2MB'); return; }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch('/api/auth/avatar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: reader.result }) });
      const data = await res.json();
      if (data.success) {
        const updated = { ...user, avatar_url: data.avatar_url };
        setUser(updated);
        // 通知侧边栏刷新用户数据
        window.dispatchEvent(new CustomEvent('eoc-user-updated'));
      } else {
        alert(data.error || '上传失败');
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <AppShell><TopBar title="个人资料" /><div style={{ padding: 24, color: 'var(--text-muted)' }}>加载中...</div></AppShell>;

  return (
    <AppShell>
      <TopBar title="个人资料" subtitle="管理您的账户信息" />
      <div style={{ padding: 24, maxWidth: 780 }}>

        {/* Avatar + Basic Info */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            {/* Avatar */}
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
            {uploading && <span style={{ fontSize: 12, color: 'var(--accent)' }}>上传中...</span>}
          </div>

          {/* Display Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>显示名称</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="输入显示名称"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
          </div>

          {/* Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}><User style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />用户名</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</div>
            </div>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}><Calendar style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />注册时间</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '—'}</div>
            </div>
          </div>

          {/* Save Profile */}
          <button onClick={handleSaveProfile} disabled={savingProfile} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 14,
            fontSize: 14, fontWeight: 600, background: savedProfile ? 'var(--success)' : 'var(--accent-gradient)',
            color: '#fff', border: 'none', cursor: 'pointer', transition: `all 200ms ${EASE}`,
            boxShadow: '0 4px 16px rgba(77,127,255,0.25)', opacity: savingProfile ? 0.6 : 1,
          }}>
            {savedProfile ? <><CheckCircle2 style={{ width: 16, height: 16 }} /> 已保存</> : savingProfile ? '保存中...' : <><Save style={{ width: 16, height: 16 }} /> 保存资料</>}
          </button>
        </div>

        {/* Change Password */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Lock style={{ width: 18, height: 18, color: 'var(--accent)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>修改密码</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>当前密码</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="输入当前密码"
                  style={{ width: '100%', padding: '11px 40px 11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
                <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', padding: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>新密码</label>
              <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="至少6位"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>确认新密码</label>
              <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="再次输入新密码"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}` }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }} />
            </div>
          </div>

          {pwError && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>⚠ {pwError}</div>}
          {pwSuccess && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'var(--success-soft)', color: 'var(--success)', fontSize: 13 }}>✓ 密码修改成功</div>}

          <button onClick={handleChangePassword} disabled={savingPw} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 14,
            fontSize: 14, fontWeight: 600, background: 'var(--accent-gradient)',
            color: '#fff', border: 'none', cursor: 'pointer', marginTop: 20,
            boxShadow: '0 4px 16px rgba(77,127,255,0.25)', opacity: savingPw ? 0.6 : 1,
            transition: `all 200ms ${EASE}`,
          }}>
            {savingPw ? '修改中...' : <><Lock style={{ width: 16, height: 16 }} /> 修改密码</>}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
