'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import TopBar from '@/components/TopBar';
import { Bell, Check, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const typeIcons: Record<string, any> = { info: Info, warning: AlertTriangle, success: CheckCircle2, error: XCircle };
const typeColors: Record<string, string> = { info: 'var(--accent)', warning: 'var(--warning)', success: 'var(--success)', error: 'var(--error)' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnread(data.unread || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id: string) => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    setUnread(Math.max(0, unread - 1));
  };

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mark_all: true }) });
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <AppShell>
      <TopBar title="Notifications" subtitle={`${unread} unread`} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell style={{ width: 18, height: 18, color: 'var(--accent)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{notifications.length} notifications</span>
            {unread > 0 && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'var(--error-soft)', color: 'var(--error)', fontWeight: 600 }}>{unread}</span>}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 10, fontSize: 12, background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <CheckCheck style={{ width: 14, height: 14 }} /> Mark all read
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || Info;
            const color = typeColors[n.type] || 'var(--accent)';
            return (
              <div key={n.id} style={{
                background: 'var(--bg-card)', borderRadius: 16, border: `1px solid ${n.read ? 'var(--border)' : 'rgba(77,127,255,0.2)'}`,
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
                transition: `all 150ms ${EASE}`, opacity: n.read ? 0.6 : 1,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}15`, flexShrink: 0 }}>
                  <Icon style={{ width: 18, height: 18, color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.message}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</span>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} style={{ padding: 6, borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent)' }}>
                      <Check style={{ width: 14, height: 14 }} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {notifications.length === 0 && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)', padding: 60, textAlign: 'center' }}>
              <Bell style={{ width: 40, height: 40, color: 'var(--text-muted)', marginBottom: 12, opacity: 0.3 }} />
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{loading ? 'Loading...' : 'No notifications'}</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
