export default function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    active: { bg: '#34d39920', color: '#34d399', dot: '#34d399', label: '运行中' },
    running: { bg: '#34d39920', color: '#34d399', dot: '#34d399', label: '运行中' },
    online: { bg: '#34d39920', color: '#34d399', dot: '#34d399', label: '在线' },
    developing: { bg: '#fb923c20', color: '#fb923c', dot: '#fb923c', label: '开发中' },
    stopped: { bg: '#f8717120', color: '#f87171', dot: '#f87171', label: '已停止' },
    error: { bg: '#f8717120', color: '#f87171', dot: '#f87171', label: '异常' },
    success: { bg: '#34d39920', color: '#34d399', dot: '#34d399', label: '成功' },
    failed: { bg: '#f8717120', color: '#f87171', dot: '#f87171', label: '失败' },
    pending: { bg: '#fb923c20', color: '#fb923c', dot: '#fb923c', label: '等待中' },
  };
  const c = configs[status] || configs.active;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px]" style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}
