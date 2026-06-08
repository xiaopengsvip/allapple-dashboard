export type Locale = 'zh' | 'en';

const translations: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.dashboard': { zh: '仪表盘', en: 'Dashboard' },
  'nav.projects': { zh: '项目管理', en: 'Projects' },
  'nav.domains': { zh: '域名管理', en: 'Domains' },
  'nav.deployments': { zh: '部署管理', en: 'Deployments' },
  'nav.relations': { zh: '关联视图', en: 'Relations' },
  'nav.github': { zh: 'GitHub', en: 'GitHub' },
  'nav.vercel': { zh: 'Vercel', en: 'Vercel' },
  'nav.cloudflare': { zh: 'Cloudflare', en: 'Cloudflare' },
  'nav.servers': { zh: '服务器', en: 'Servers' },
  'nav.logs': { zh: '操作日志', en: 'Logs' },
  'nav.settings': { zh: '设置', en: 'Settings' },
  // Dashboard
  'dash.totalProjects': { zh: '总项目', en: 'Total Projects' },
  'dash.totalDomains': { zh: '域名总数', en: 'Total Domains' },
  'dash.vercelProjects': { zh: 'Vercel', en: 'Vercel' },
  'dash.serverServices': { zh: '服务器服务', en: 'Server Services' },
  'dash.githubRepos': { zh: 'GitHub', en: 'GitHub' },
  'dash.allPlatforms': { zh: '全部平台', en: 'All Platforms' },
  'dash.domainSystems': { zh: '2 个域名体系', en: '2 Domain Zones' },
  'dash.edgeNetwork': { zh: 'Edge Network', en: 'Edge Network' },
  'dash.pm2Online': { zh: 'PM2 在线', en: 'PM2 Online' },
  'dash.relationMap': { zh: '项目关联全景图', en: 'Project Relations' },
  'dash.fullView': { zh: '完整视图', en: 'Full View' },
  'dash.serverStatus': { zh: '服务器状态', en: 'Server Status' },
  'dash.allOnline': { zh: '全部在线', en: 'All Online' },
  'dash.fullLog': { zh: '完整日志', en: 'Full Log' },
  // Project
  'proj.name': { zh: '项目名称', en: 'Project' },
  'proj.platform': { zh: '部署平台', en: 'Platform' },
  'proj.domain': { zh: '域名', en: 'Domain' },
  'proj.status': { zh: '状态', en: 'Status' },
  'proj.actions': { zh: '操作', en: 'Actions' },
  'proj.new': { zh: '新建项目', en: 'New Project' },
  'proj.filter': { zh: '筛选', en: 'Filter' },
  'proj.running': { zh: '运行中', en: 'Online' },
  'proj.developing': { zh: '开发中', en: 'Dev' },
  // Categories
  'cat.all': { zh: '全部', en: 'All' },
  'cat.brand': { zh: '品牌官网', en: 'Branding' },
  'cat.workspace': { zh: '工作台', en: 'Workspace' },
  'cat.ai': { zh: 'AI应用', en: 'AI Apps' },
  'cat.dataviz': { zh: '数据可视化', en: 'Data Viz' },
  'cat.tools': { zh: '工具', en: 'Tools' },
  'cat.media': { zh: '媒体', en: 'Media' },
  'cat.education': { zh: '教育', en: 'Education' },
  // Platform
  'plat.vercel': { zh: 'Vercel', en: 'Vercel' },
  'plat.server': { zh: '服务器', en: 'Server' },
  'plat.both': { zh: '双部署', en: 'Both' },
  'plat.hasGitFork': { zh: '有 GitHub', en: 'Has GitHub' },
  // Common
  'common.search': { zh: '搜索...', en: 'Search...' },
  'common.save': { zh: '保存', en: 'Save' },
  'common.cancel': { zh: '取消', en: 'Cancel' },
  'common.delete': { zh: '删除', en: 'Delete' },
  'common.edit': { zh: '编辑', en: 'Edit' },
  'common.loading': { zh: '加载中...', en: 'Loading...' },
  'common.noData': { zh: '暂无数据', en: 'No data' },
  'common.confirm': { zh: '确认', en: 'Confirm' },
  'common.refresh': { zh: '刷新', en: 'Refresh' },
  // Settings
  'settings.title': { zh: '系统设置', en: 'Settings' },
  'settings.apiKeys': { zh: 'API 密钥', en: 'API Keys' },
  'settings.cfToken': { zh: 'Cloudflare API Token', en: 'Cloudflare API Token' },
  'settings.vercelToken': { zh: 'Vercel Token', en: 'Vercel Token' },
  'settings.githubToken': { zh: 'GitHub Token', en: 'GitHub Token' },
  'settings.jwtSecret': { zh: 'JWT 密钥', en: 'JWT Secret' },
  // Auth
  'auth.login': { zh: '登录', en: 'Login' },
  'auth.username': { zh: '用户名', en: 'Username' },
  'auth.password': { zh: '密码', en: 'Password' },
  'auth.logout': { zh: '退出', en: 'Logout' },
  // Footer
  'footer.copyright': { zh: 'Everett 项目管理运维中心', en: 'Everett Ops Center' },
};

export function t(key: string, locale: Locale = 'zh'): string {
  return translations[key]?.[locale] || key;
}
