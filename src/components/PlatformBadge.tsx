export default function PlatformBadge({ target }: { target: string }) {
  const configs: Record<string, { label: string; icon: string }> = {
    vercel: { label: 'Vercel', icon: '▲' },
    server: { label: '服务器', icon: '🖥' },
    both: { label: '双部署', icon: '🔗' },
  };
  const c = configs[target] || configs.server;
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[#a1a1aa]">
      <span>{c.icon}</span>
      <span>{c.label}</span>
    </span>
  );
}
