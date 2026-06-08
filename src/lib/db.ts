import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'dashboard.db');

// Ensure data directory exists
import fs from 'fs';
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT DEFAULT '工具',
    tech_stack TEXT DEFAULT '[]',
    status TEXT DEFAULT 'active',
    deploy_target TEXT DEFAULT 'vercel',
    vercel_project_id TEXT,
    pm2_name TEXT,
    server_port INTEGER,
    github_repo TEXT,
    github_url TEXT,
    domain TEXT,
    preview_url TEXT,
    color TEXT DEFAULT '#00f5ff',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS operation_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    target TEXT,
    detail TEXT,
    status TEXT DEFAULT 'success',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default admin (ignore if exists)
import bcrypt from 'bcryptjs';
try {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT OR IGNORE INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(uuidv4(), 'admin', hash, 'admin');
} catch {}

// Seed default settings
const defaultSettings: Record<string, string> = {
  'cloudflare_api_token': '',
  'cloudflare_zone_allapple': '',
  'cloudflare_zone_vios': '',
  'vercel_token': '',
  'vercel_team_id': '',
  'github_token': '',
  'github_org': 'xiaopengsvip',
  'server_host': '43.167.213.143',
  'jwt_secret': uuidv4(),
};
for (const [key, value] of Object.entries(defaultSettings)) {
  const exists = db.prepare('SELECT key FROM settings WHERE key = ?').get(key);
  if (!exists && value) {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, value);
  }
}

// Seed projects from existing data
const projectCount = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as any).c;
if (projectCount === 0) {
  const seedProjects = [
    { name: 'AllApple 官网', category: '品牌官网', domain: 'allapple.top', github: 'allapple-website', deploy: 'vercel', status: 'active', color: '#0080ff', tech: '["React","Vite","Tailwind"]' },
    { name: 'Everett 主站 v2', category: '品牌官网', domain: 'hms.allapple.top', github: 'allapple.new', deploy: 'vercel', status: 'active', color: '#00f5ff', tech: '["React","Vite","Framer"]' },
    { name: 'ENXX 英语自学', category: '教育', domain: 'enxx.allapple.top', github: 'Enxx', deploy: 'both', status: 'active', color: '#10b981', tech: '["Next.js","Prisma","Tailwind"]', pm2: 'enxx-prod', port: 3000 },
    { name: 'AIOS 工作台', category: '工作台', domain: 'aios.vios.top', github: 'aios', deploy: 'server', status: 'active', color: '#8b5cf6', tech: '["Next.js","PM2"]', pm2: 'aios', port: 3100 },
    { name: 'Everett 运维中心', category: '数据可视化', domain: 'dashboard.vios.top', github: 'allapple-dashboard', deploy: 'vercel', status: 'active', color: '#06d6a0', tech: '["Next.js","Tailwind","SQLite"]' },
    { name: 'Hermes 管理后台', category: '工具', domain: 'chat.allapple.top', github: 'hermes-web-ui', deploy: 'server', status: 'active', color: '#ec4899', tech: '["React","Node.js"]', pm2: 'hermes-web-ui', port: 8650 },
    { name: 'Game 游戏平台', category: '媒体', domain: 'game.vios.top', deploy: 'server', status: 'active', color: '#f59e0b', tech: '["React","Node.js"]', pm2: 'game', port: 3300 },
    { name: 'LY 物流系统', category: '工具', domain: 'ly.allapple.top', deploy: 'server', status: 'active', color: '#3b82f6', tech: '["Next.js","Prisma"]', pm2: 'ly-logistics', port: 3200 },
    { name: 'AllApple Studio', category: '工作台', domain: 'show.allapple.top', github: 'allapple-studio', deploy: 'vercel', status: 'active', color: '#bf00ff', tech: '["React","D3","Recharts"]' },
    { name: 'GlassNote AI', category: 'AI应用', domain: 'notes.allapple.top', github: 'allapple-notes', deploy: 'vercel', status: 'active', color: '#ff00ff', tech: '["React","GenAI"]' },
    { name: '链接树', category: '工具', domain: 'linktr.allapple.top', github: 'allapple-linktr', deploy: 'vercel', status: 'active', color: '#00ff88', tech: '["React","Framer"]' },
    { name: '家谱平台', category: '数据可视化', domain: 'genealogy.allapple.top', github: 'allapple-genealogy', deploy: 'vercel', status: 'active', color: '#febc2e', tech: '["React","D3","GenAI"]' },
    { name: '沉浸式短视频', category: '媒体', domain: 'all.allapple.top', github: 'allapple-shorts', deploy: 'vercel', status: 'active', color: '#ff5f57', tech: '["React","Lucide"]' },
    { name: '庆典中心', category: '品牌官网', domain: 'new.allapple.top', github: 'allapple-celebration', deploy: 'vercel', status: 'active', color: '#28c840', tech: '["React","GenAI"]' },
    { name: '随心Vlog', category: '媒体', domain: 'vlog.allapple.top', github: 'allapple-vlog', deploy: 'vercel', status: 'active', color: '#00d4ff', tech: '["React","Framer"]' },
    { name: '大屏数据中心', category: '数据可视化', domain: 'dp.allapple.top', github: 'dp', deploy: 'vercel', status: 'developing', color: '#8b5cf6', tech: '["React","Vite"]' },
    { name: 'Omni 聊天', category: 'AI应用', domain: 'omni.allapple.top', github: 'Omni', deploy: 'vercel', status: 'active', color: '#ec4899', tech: '["React","MiMo"]' },
    { name: '学习网站', category: '教育', domain: 'everett.allapple.top', github: 'Everett', deploy: 'vercel', status: 'active', color: '#10b981', tech: '["React","Vite"]' },
    { name: 'OpenClaw AI', category: 'AI应用', domain: 'openclaw.allapple.top', github: 'allapple-openclaw', deploy: 'vercel', status: 'developing', color: '#06b6d4', tech: '["React","AI"]' },
    { name: 'DPS 数据处理', category: '工具', domain: 'dp.allapple.top', deploy: 'both', status: 'active', color: '#a78bfa', tech: '["Node.js","Python"]' },
  ];
  const insert = db.prepare(`INSERT INTO projects (id, name, category, domain, github_repo, deploy_target, status, color, tech_stack, pm2_name, server_port) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const p of seedProjects) {
    insert.run(uuidv4(), p.name, p.category, p.domain, p.github || null, p.deploy, p.status, p.color, p.tech, p.pm2 || null, p.port || null);
  }
}

export function getSetting(key: string): string {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any;
  return row?.value || '';
}

export function setSetting(key: string, value: string): void {
  db.prepare(`INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`).run(key, value);
}

export function addLog(action: string, target: string, detail: string, status = 'success'): void {
  db.prepare('INSERT INTO operation_logs (id, action, target, detail, status) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), action, target, detail, status);
}

export default db;
