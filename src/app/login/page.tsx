'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/');
      } else {
        setError(data.error || '登录失败');
      }
    } catch {
      setError('网络错误');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-root)' }}>
      <div className="w-full max-w-[380px] mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo-128.png" alt="EOC" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
          <h1 className="text-[22px] font-bold text-white">Everett Operations Center</h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>运维管理中心</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>用户名</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入用户名"
                className="w-full px-4 py-2.5 rounded-xl text-[13px] text-white outline-none transition-colors"
                style={{ background: 'var(--bg-root)', border: '1px solid var(--border)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full px-4 py-2.5 rounded-xl text-[13px] text-white outline-none transition-colors"
                style={{ background: 'var(--bg-root)', border: '1px solid var(--border)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
            </div>
            {error && (
              <div className="text-[12px] px-3 py-2 rounded-lg" style={{ background: 'var(--error-soft, rgba(239,68,68,0.12))', color: 'var(--error, #EF4444)' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 disabled:opacity-40"
              style={{ background: 'var(--accent-gradient, linear-gradient(135deg, #4F46E5, #7C3AED))' }}
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] mt-4" style={{ color: 'var(--text-muted)' }}>
          Everett Operations Center v1.0.0
        </p>
      </div>
    </div>
  );
}
