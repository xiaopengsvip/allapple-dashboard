'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'zh' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Sidebar sections
  'section.overview': { zh: '总览', en: 'OVERVIEW' },
  'section.infrastructure': { zh: '基础设施', en: 'INFRASTRUCTURE' },
  'section.integrations': { zh: '平台集成', en: 'INTEGRATIONS' },
  'section.operations': { zh: '运维中心', en: 'OPERATIONS' },

  // Sidebar nav items
  'nav.dashboard': { zh: '仪表盘', en: 'Dashboard' },
  'nav.projects': { zh: '项目中心', en: 'Projects' },
  'nav.deployments': { zh: '部署中心', en: 'Deployments' },
  'nav.domains': { zh: '域名中心', en: 'Domains' },
  'nav.topology': { zh: '拓扑视图', en: 'Topology' },
  'nav.github': { zh: 'GitHub', en: 'GitHub' },
  'nav.vercel': { zh: 'Vercel', en: 'Vercel' },
  'nav.servers': { zh: '服务器', en: 'Servers' },
  'nav.logs': { zh: '日志中心', en: 'Logs' },
  'nav.settings': { zh: '系统设置', en: 'Settings' },
  'nav.profile': { zh: '个人资料', en: 'Profile' },

  // Sidebar footer
  'sidebar.not_logged_in': { zh: '未登录', en: 'Not logged in' },
  'sidebar.appearance': { zh: '外观', en: 'Theme' },
  'sidebar.light_mode': { zh: '浅色模式', en: 'Light Mode' },
  'sidebar.dark_mode': { zh: '深色模式', en: 'Dark Mode' },
  'sidebar.version': { zh: '版本', en: 'Version' },

  // Dashboard
  'dash.title': { zh: '仪表盘', en: 'Dashboard' },
  'dash.subtitle': { zh: 'Everett 运维总览', en: 'Everett Ops Overview' },
  'dash.total_projects': { zh: '项目总数', en: 'Total Projects' },
  'dash.total_domains': { zh: '域名总数', en: 'Total Domains' },
  'dash.github_repos': { zh: 'GitHub 仓库', en: 'GitHub Repos' },
  'dash.vercel_projects': { zh: 'Vercel 项目', en: 'Vercel Projects' },
  'dash.system_status': { zh: '系统状态', en: 'System Status' },
  'dash.all_healthy': { zh: '全部正常', en: 'All Healthy' },
  'dash.online': { zh: '在线', en: 'Online' },
  'dash.pm2_process': { zh: 'PM2 进程', en: 'PM2 Process' },
  'dash.server_resource': { zh: '服务器资源', en: 'Server Resources' },
  'dash.today_overview': { zh: '今日概览', en: 'Today Overview' },
  'dash.project_center': { zh: '项目中心', en: 'Project Center' },
  'dash.view_all': { zh: '查看全部', en: 'View All' },
  'dash.pm2_management': { zh: 'PM2 进程管理', en: 'PM2 Process Management' },
  'dash.event_stream': { zh: '实时事件流', en: 'Event Stream' },
  'dash.no_data': { zh: '暂无数据', en: 'No data' },
  'dash.no_pm2': { zh: '暂无 PM2 数据', en: 'No PM2 data' },
  'dash.no_events': { zh: '暂无事件记录', en: 'No events' },
  'dash.loading': { zh: '加载中...', en: 'Loading...' },
  'dash.cpu': { zh: 'CPU', en: 'CPU' },
  'dash.memory': { zh: '内存', en: 'Memory' },
  'dash.disk': { zh: '磁盘', en: 'Disk' },
  'dash.cores': { zh: '核', en: 'cores' },

  // Project
  'proj.name': { zh: '项目名称', en: 'Project Name' },
  'proj.category': { zh: '分类', en: 'Category' },
  'proj.platform': { zh: '部署平台', en: 'Platform' },
  'proj.domain': { zh: '域名', en: 'Domain' },
  'proj.status': { zh: '状态', en: 'Status' },
  'proj.actions': { zh: '操作', en: 'Actions' },
  'proj.new': { zh: '新建项目', en: 'New Project' },
  'proj.search': { zh: '搜索项目...', en: 'Search projects...' },
  'proj.filter': { zh: '筛选', en: 'Filter' },
  'proj.running': { zh: '运行中', en: 'Online' },
  'proj.developing': { zh: '开发中', en: 'Dev' },
  'proj.all': { zh: '全部', en: 'All' },
  'proj.brand': { zh: '品牌官网', en: 'Branding' },
  'proj.workspace': { zh: '工作台', en: 'Workspace' },
  'proj.ai': { zh: 'AI应用', en: 'AI Apps' },
  'proj.dataviz': { zh: '数据可视化', en: 'Data Viz' },
  'proj.tools': { zh: '工具', en: 'Tools' },
  'proj.media': { zh: '媒体', en: 'Media' },
  'proj.education': { zh: '教育', en: 'Education' },
  'proj.create': { zh: '创建', en: 'Create' },
  'proj.cancel': { zh: '取消', en: 'Cancel' },
  'proj.description': { zh: '描述', en: 'Description' },
  'proj.github_repo': { zh: 'GitHub 仓库名', en: 'GitHub Repo' },
  'proj.confirm_delete': { zh: '确定删除?', en: 'Confirm delete?' },
  'proj.has_github': { zh: '有 GitHub', en: 'Has GitHub' },
  'proj.dual_deploy': { zh: '双部署', en: 'Dual' },

  // Domains
  'domain.title': { zh: '域名中心', en: 'Domains' },
  'domain.subtitle': { zh: 'DNS 记录管理', en: 'DNS Record Management' },
  'domain.search': { zh: '搜索域名...', en: 'Search domains...' },
  'domain.refresh': { zh: '刷新', en: 'Refresh' },
  'domain.type': { zh: '类型', en: 'Type' },
  'domain.name': { zh: '域名', en: 'Domain' },
  'domain.target': { zh: '目标', en: 'Target' },
  'domain.proxy': { zh: '代理', en: 'Proxy' },
  'domain.no_data': { zh: '暂无数据，请在设置中配置 Cloudflare Token', en: 'No data. Configure Cloudflare Token in Settings' },

  // Servers
  'server.title': { zh: '服务器管理', en: 'Servers' },
  'server.subtitle': { zh: 'PM2 进程与系统资源', en: 'PM2 Processes & System Resources' },
  'server.pm2_process': { zh: 'PM2 进程', en: 'PM2 Processes' },
  'server.restart': { zh: '重启', en: 'Restart' },
  'server.stop': { zh: '停止', en: 'Stop' },
  'server.logs': { zh: '日志', en: 'Logs' },

  // GitHub
  'github.title': { zh: 'GitHub', en: 'GitHub' },
  'github.subtitle': { zh: '仓库管理', en: 'Repository Management' },
  'github.repos': { zh: '仓库', en: 'repos' },
  'github.search': { zh: '搜索仓库...', en: 'Search repos...' },
  'github.no_data': { zh: '暂无数据，请在设置中配置 GitHub Token', en: 'No data. Configure GitHub Token in Settings' },

  // Vercel
  'vercel.title': { zh: 'Vercel', en: 'Vercel' },
  'vercel.subtitle': { zh: 'Edge 部署管理', en: 'Edge Deployment Management' },
  'vercel.projects': { zh: '项目', en: 'projects' },
  'vercel.framework': { zh: 'Framework', en: 'Framework' },
  'vercel.last_update': { zh: '最近更新', en: 'Last Update' },
  'vercel.link': { zh: '链接', en: 'Link' },
  'vercel.no_data': { zh: '暂无数据，请在设置中配置 Vercel Token', en: 'No data. Configure Vercel Token in Settings' },

  // Deployments
  'deploy.title': { zh: '部署中心', en: 'Deployments' },
  'deploy.subtitle': { zh: '部署状态总览', en: 'Deployment Status Overview' },
  'deploy.vercel': { zh: 'Vercel 部署', en: 'Vercel Deployments' },
  'deploy.server': { zh: '服务器部署 (PM2)', en: 'Server Deployments (PM2)' },
  'deploy.success': { zh: '成功', en: 'Success' },

  // Topology
  'topo.title': { zh: '拓扑视图', en: 'Topology' },
  'topo.subtitle': { zh: '基础设施关联全景', en: 'Infrastructure Overview' },
  'topo.flow': { zh: '基础设施拓扑', en: 'Infrastructure Topology' },
  'topo.github_repos': { zh: 'GitHub 仓库', en: 'GitHub Repos' },
  'topo.vercel_projects': { zh: 'Vercel 项目', en: 'Vercel Projects' },
  'topo.server_pm2': { zh: '服务器 PM2', en: 'Server PM2' },
  'topo.domain_mapping': { zh: '域名映射', en: 'Domain Mapping' },

  // Logs
  'logs.title': { zh: '日志中心', en: 'Logs' },
  'logs.subtitle': { zh: '操作审计日志', en: 'Operation Audit Logs' },
  'logs.time': { zh: '时间', en: 'Time' },
  'logs.action': { zh: '操作', en: 'Action' },
  'logs.target': { zh: '目标', en: 'Target' },
  'logs.detail': { zh: '详情', en: 'Detail' },
  'logs.no_logs': { zh: '暂无日志', en: 'No logs' },

  // Settings
  'settings.title': { zh: '系统设置', en: 'Settings' },
  'settings.subtitle': { zh: 'API 密钥与系统配置', en: 'API Keys & System Config' },
  'settings.save': { zh: '保存', en: 'Save' },
  'settings.cancel': { zh: '取消', en: 'Cancel' },
  'settings.edit': { zh: '编辑', en: 'Edit' },
  'settings.saved': { zh: '已保存', en: 'Saved' },
  'settings.saving': { zh: '保存中...', en: 'Saving...' },
  'settings.configured': { zh: '已配置', en: 'Configured' },
  'settings.not_configured': { zh: '未配置', en: 'Not configured' },
  'settings.system_info': { zh: '系统信息', en: 'System Info' },
  'settings.version': { zh: '版本', en: 'Version' },
  'settings.framework': { zh: '框架', en: 'Framework' },
  'settings.database': { zh: '数据库', en: 'Database' },
  'settings.deployment': { zh: '部署', en: 'Deployment' },
  'settings.cf_desc': { zh: 'DNS 记录管理与域名解析', en: 'DNS record management' },
  'settings.vercel_desc': { zh: 'Edge 部署与项目管理', en: 'Edge deployment & projects' },
  'settings.gh_desc': { zh: '仓库管理与 Webhook 配置', en: 'Repo management & webhooks' },
  'settings.srv_desc': { zh: '腾讯云 Tokyo 实例连接', en: 'Tencent Cloud Tokyo instance' },
  'settings.auth_desc': { zh: 'JWT 令牌签发密钥', en: 'JWT token signing key' },

  // Profile
  'profile.title': { zh: '个人资料', en: 'Profile' },
  'profile.subtitle': { zh: '管理您的账户信息', en: 'Manage your account' },
  'profile.display_name': { zh: '显示名称', en: 'Display Name' },
  'profile.username': { zh: '用户名', en: 'Username' },
  'profile.registered': { zh: '注册时间', en: 'Registered' },
  'profile.save_profile': { zh: '保存资料', en: 'Save Profile' },
  'profile.change_password': { zh: '修改密码', en: 'Change Password' },
  'profile.current_password': { zh: '当前密码', en: 'Current Password' },
  'profile.new_password': { zh: '新密码', en: 'New Password' },
  'profile.confirm_password': { zh: '确认新密码', en: 'Confirm Password' },
  'profile.password_changed': { zh: '密码修改成功', en: 'Password changed' },
  'profile.uploading': { zh: '上传中...', en: 'Uploading...' },

  // Login
  'login.title': { zh: 'Everett Operations Center', en: 'Everett Operations Center' },
  'login.subtitle': { zh: '下一代企业级运维控制中心', en: 'Next-Gen Enterprise Ops Center' },
  'login.username': { zh: '用户名', en: 'Username' },
  'login.password': { zh: '密码', en: 'Password' },
  'login.submit': { zh: '登 录', en: 'Sign In' },
  'login.logging_in': { zh: '登录中...', en: 'Signing in...' },
  'login.enter_username': { zh: '请输入用户名', en: 'Enter username' },
  'login.enter_password': { zh: '请输入密码', en: 'Enter password' },

  // Logout modal
  'logout.confirm': { zh: '确认退出', en: 'Confirm Logout' },
  'logout.description': { zh: '退出后将清除登录状态\n需要重新输入密码登录', en: 'Logging out will clear your session.\nYou will need to log in again.' },
  'logout.confirm_btn': { zh: '确认退出', en: 'Log Out' },

  // Version modal
  'version.features': { zh: '功能亮点', en: 'Features' },
  'version.changelog': { zh: '更新日志', en: 'Changelog' },
  'version.first_release': { zh: '首次发布 — Liquid Glass 风格完整运维控制中心', en: 'First release — Liquid Glass style ops center' },
  'version.ui_redesign': { zh: 'UI 重设计 — 匹配 lyy.allapple.top 设计语言', en: 'UI redesign — matching lyy.allapple.top design language' },
  'version.auth_system': { zh: '登录系统 + JWT 认证 + 账号管理 + 退出确认', en: 'Auth system + JWT + account management + logout confirm' },

  // Common
  'common.search': { zh: '搜索项目、域名...', en: 'Search projects, domains...' },
  'common.notifications': { zh: '通知', en: 'Notifications' },
  'common.no_notifications': { zh: '暂无通知', en: 'No notifications' },
  'common.close': { zh: '关闭', en: 'Close' },
  'common.save': { zh: '保存', en: 'Save' },
  'common.cancel': { zh: '取消', en: 'Cancel' },
  'common.delete': { zh: '删除', en: 'Delete' },
  'common.edit': { zh: '编辑', en: 'Edit' },
  'common.loading': { zh: '加载中...', en: 'Loading...' },
  'common.error': { zh: '错误', en: 'Error' },
  'common.success': { zh: '成功', en: 'Success' },
  'common.records': { zh: '条记录', en: 'records' },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'zh',
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('eoc-locale') as Locale;
    if (saved === 'en' || saved === 'zh') setLocaleState(saved);
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('eoc-locale', l);
  };

  const t = (key: string): string => {
    return translations[key]?.[locale] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
