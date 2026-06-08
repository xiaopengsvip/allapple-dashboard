'use client';
import { useTranslation } from 'react-i18next';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function LoginPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState('');
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('eoc-theme') || 'dark';
    setTheme(saved as 'dark' | 'light');
    document.documentElement.setAttribute('data-theme', saved);
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.3 + 0.1 });
    }
    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(77, 127, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(77, 127, 255, ${p.a})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/');
      } else {
        setError(data.error || '登录失败');
      }
    } catch { setError('网络错误'); }
    setLoading(false);
  };

  const isDark = theme === 'dark';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: isDark ? 'var(--bg-root)' : 'var(--bg-root)', position: 'relative', overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: isDark ? 1 : 0.3 }} />

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(77,127,255,0.08), transparent)', filter: 'blur(100px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(103,91,255,0.06), transparent)', filter: 'blur(80px)', zIndex: 0 }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%', maxWidth: 400, padding: 16,
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: `all 600ms ${EASE}`,
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
            <img src="/logo-128.png" alt="EOC" style={{ width: 72, height: 72, borderRadius: 20 }} />
            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, borderRadius: '50%', background: 'var(--success)', border: '3px solid var(--bg-root)', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 6 }}>Everett Operations Center</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>下一代企业级运维控制中心</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 24,
          border: '1px solid var(--border)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '32px 28px 28px' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>用户名</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="请输入用户名" autoComplete="username"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}`, boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>密码</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" autoComplete="current-password"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 14, background: 'var(--bg-root)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: 14, outline: 'none', transition: `border-color 150ms ${EASE}`, boxSizing: 'border-box' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }} />
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>⚠</span> {error}
                </div>
              )}

              <button type="submit" disabled={loading || !username || !password} style={{
                width: '100%', padding: '13px 0', borderRadius: 14, fontSize: 14, fontWeight: 600,
                color: '#FFFFFF', border: 'none', cursor: loading ? 'wait' : 'pointer',
                background: 'var(--accent-gradient)', boxShadow: '0 4px 20px rgba(77,127,255,0.25)',
                opacity: (!username || !password) ? 0.4 : 1,
                transition: `all 200ms ${EASE}`, marginTop: 4,
              }}
                onMouseEnter={e => { if (!loading && username && password) { e.currentTarget.style.boxShadow = '0 6px 28px rgba(77,127,255,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(77,127,255,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    登录中...
                  </span>
                ) : '登 录'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Everett Operations Center v1.0.0</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, opacity: 0.5 }}>© 2026 Everett · AllApple.top</p>
        </div>

        {/* Theme toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button onClick={() => {
            const next = isDark ? 'light' : 'dark';
            setTheme(next);
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('eoc-theme', next);
          }} style={{
            padding: '6px 14px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', transition: `all 150ms ${EASE}`,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            {isDark ? '☀ 浅色模式' : '🌙 深色模式'}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
    </div>
  );
}
