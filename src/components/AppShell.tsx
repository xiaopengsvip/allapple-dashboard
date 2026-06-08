'use client';

import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-root)' }}>
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        zIndex: isMobile ? 51 : 'auto',
        left: isMobile ? (mobileMenuOpen ? 0 : -280) : 0,
        transition: 'left 250ms cubic-bezier(0.22, 1, 0.36, 1)',
        height: '100vh',
      }}>
        <Sidebar onNavigate={() => isMobile && setMobileMenuOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ minWidth: 0 }}>
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(true)}
            style={{
              position: 'fixed', top: 12, left: 12, zIndex: 45,
              width: 40, height: 40, borderRadius: 12,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
}
