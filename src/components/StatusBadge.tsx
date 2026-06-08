export default function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; dot: string; label: string }> = {
    active: { color: '#22c55e', dot: '#22c55e', label: '运行中' },
    running: { color: '#22c55e', dot: '#22c55e', label: '运行中' },
    online: { color: '#22c55e', dot: '#22c55e', label: '在线' },
    developing: { color: '#f59e0b', dot: '#f59e0b', label: '开发中' },
    stopped: { color: '#ef4444', dot: '#ef4444', label: '已停止' },
    error: { color: '#ef4444', dot: '#ef4444', label: '异常' },
    success: { color: '#22c55e', dot: '#22c55e', label: '成功' },
    failed: { color: '#ef4444', dot: '#ef4444', label: '失败' },
  };
  const c = configs[status] || configs.active;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#a1a1aa]">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
