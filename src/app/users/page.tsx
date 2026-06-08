'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Users, Plus, Trash2, Shield, User, Eye } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const roleIcons: Record<string, any> = { admin: Shield, editor: User, viewer: Eye };
const roleColors: Record<string, string> = { admin: 'var(--accent)', editor: 'var(--success)', viewer: 'var(--text-muted)' };

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const { t } = useTranslation();
  const [showNew, setShowNew] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'viewer' });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.status === 401) { window.location.href = '/login'; return; }
      const data = await res.json();
      setUsers(data.users || []);
    } catch {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    setError('');
    const res = await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) });
    const data = await res.json();
    if (res.ok) {
      setUsers([data.user, ...users]);
      setShowNew(false);
      setNewUser({ username: '', password: '', role: 'viewer' });
    } else {
      setError(data.error || 'Failed');
    }
  };

  const handleDelete = async (id: string, username: string) => {
    if (!confirm(`Delete user "${username}"?`)) return;
    await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <AppShell>
      <TopBar title="User Management" subtitle="Manage dashboard users and roles" />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{users.length} users</span>
          <button onClick={() => setShowNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            <Plus style={{ width: 14, height: 14 }} /> Add User
          </button>
        </div>

        {showNew && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={() => setShowNew(false)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
            <div style={{ position: 'relative', background: 'var(--bg-surface)', borderRadius: 20, padding: 32, width: 400, border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Add User</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }} />
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                {error && <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 12 }}>{error}</div>}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowNew(false)} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>Cancel</button>
                  <button onClick={handleCreate} disabled={!newUser.username || !newUser.password} style={{ padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', opacity: (!newUser.username || !newUser.password) ? 0.4 : 1 }}>Create</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['User', 'Role', 'Display Name', 'Created', ''].map(h => <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 0.5, textTransform: 'uppercase' as const }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {users.map((u, i) => {
                const RoleIcon = roleIcons[u.role] || User;
                return (
                  <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', transition: `background 150ms ${EASE}` }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFF', background: 'linear-gradient(135deg, #4D7FFF, #675BFF)' }}>{u.username[0].toUpperCase()}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{u.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 10px', borderRadius: 8, background: `${roleColors[u.role]}12`, color: roleColors[u.role], fontWeight: 600 }}><RoleIcon style={{ width: 12, height: 12 }} />{u.role}</span></td>
                    <td style={{ padding: '14px 20px', fontSize: 12, color: 'var(--text-secondary)' }}>{u.display_name || '—'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 11, color: 'var(--text-muted)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '14px 20px' }}><button onClick={() => handleDelete(u.id, u.username)} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Trash2 style={{ width: 14, height: 14 }} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
