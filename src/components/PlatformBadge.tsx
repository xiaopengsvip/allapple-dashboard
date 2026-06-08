export default function PlatformBadge({ target }: { target: string }) {
  const configs: Record<string, { bg: string; color: string; label: string; icon: string }> = {
    vercel: { bg: '#ffffff10', color: '#ffffff', label: 'Vercel', icon: '▲' },
    server: { bg: '#60a5fa20', color: '#60a5fa', label: '服务器', icon: '🖥️' },
    both: { bg: '#a78bfa20', color: '#a78bfa', label: '双部署', icon: '🔗' },
  };
  const c = configs[target] || configs.server;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px]" style={{ background: c.bg, color: c.color }}>
      {c.icon} {c.label}
    </span>
  );
}
