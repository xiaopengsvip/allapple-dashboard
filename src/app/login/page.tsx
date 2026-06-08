'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // 粒子背景动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5, a: Math.random() * 0.5 + 0.1,
      });
    }

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // 粒子
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.a})`;
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-root)' }}>
      {/* 粒子背景 */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* 背景光效 */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] z-0"
        style={{ background: 'radial-gradient(circle, #4F46E5, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] z-0"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />

      {/* 登录卡片 */}
      <div className={`relative z-10 w-full max-w-[400px] mx-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img src="/logo-128.png" alt="EOC" className="w-20 h-20 rounded-2xl mx-auto" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2"
              style={{ background: '#10B981', borderColor: 'var(--bg-root)', boxShadow: '0 0 10px rgba(16,185,129,0.6)' }} />
          </div>
          <h1 className="text-[24px] font-bold text-white tracking-tight">Everett Operations Center</h1>
          <p className="text-[13px] mt-1.5" style={{ color: 'var(--text-muted)' }}>下一代企业级运维控制中心</p>
        </div>

        {/* 表单卡片 */}
        <div className="rounded-2xl p-7 backdrop-blur-xl"
          style={{
            background: 'rgba(22, 24, 32, 0.85)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.05)',
          }}>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>用户名</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入用户名"
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl text-[14px] text-white outline-none transition-all duration-200"
                style={{
                  background: 'rgba(11, 13, 20, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>密码</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl text-[14px] text-white outline-none transition-all duration-200"
                style={{
                  background: 'rgba(11, 13, 20, 0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div className="text-[12px] px-4 py-2.5 rounded-xl flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-all duration-200 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.3)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  登录中...
                </span>
              ) : '登 录'}
            </button>
          </form>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Everett Operations Center v1.0.0</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>© 2026 Everett · AllApple.top</p>
        </div>
      </div>
    </div>
  );
}
