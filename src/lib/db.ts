import { Pool, QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://eoc:eoc2026secure@localhost:5432/eoc_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Initialize schema
async function initSchema() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS operation_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        action TEXT NOT NULL,
        target TEXT,
        detail TEXT,
        status TEXT DEFAULT 'success',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        display_name TEXT DEFAULT '',
        avatar_url TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL DEFAULT 'info',
        title TEXT NOT NULL,
        message TEXT DEFAULT '',
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS deployments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        environment TEXT DEFAULT 'production',
        commit_sha TEXT,
        commit_message TEXT,
        status TEXT DEFAULT 'pending',
        trigger TEXT DEFAULT 'manual',
        duration INTEGER,
        log TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_logs_created ON operation_logs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_logs_action ON operation_logs(action);
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
      CREATE INDEX IF NOT EXISTS idx_deployments_project ON deployments(project_id, created_at DESC);
    `);
  } finally {
    client.release();
  }
}

// Seed default data
async function seedData() {
  const client = await pool.connect();
  try {
    // Seed admin user
    const bcrypt = require('bcryptjs');
    const hash = bcrypt.hashSync('admin123', 10);
    await client.query(
      `INSERT INTO users (id, username, password_hash, role)
       VALUES ($1, 'admin', $2, 'admin')
       ON CONFLICT (username) DO NOTHING`,
      [uuidv4(), hash]
    );

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
      if (value) {
        await client.query(
          `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
          [key, value]
        );
      }
    }

    // Seed projects if empty
    const { rows: [{ count }] } = await client.query('SELECT COUNT(*)::int as count FROM projects');
    if (count === 0) {
      const seedProjects = [
        { name: 'AllApple 官网', category: '品牌官网', domain: 'allapple.top', github: 'allapple-website', deploy: 'vercel', status: 'active', color: '#0080ff', tech: '["React","Vite","Tailwind"]' },
        { name: 'Everett 主站 v2', category: '品牌官网', domain: 'hms.allapple.top', github: 'allapple.new', deploy: 'vercel', status: 'active', color: '#00f5ff', tech: '["React","Vite","Framer"]' },
        { name: 'ENXX 英语自学', category: '教育', domain: 'enxx.allapple.top', github: 'Enxx', deploy: 'both', status: 'active', color: '#10b981', tech: '["Next.js","Prisma","Tailwind"]', pm2: 'enxx-prod', port: 3000 },
        { name: 'AIOS 工作台', category: '工作台', domain: 'aios.vios.top', github: 'aios', deploy: 'server', status: 'active', color: '#8b5cf6', tech: '["Next.js","PM2"]', pm2: 'aios', port: 3100 },
        { name: 'Everett 运维中心', category: '数据可视化', domain: 'dashboard.vios.top', github: 'allapple-dashboard', deploy: 'vercel', status: 'active', color: '#06d6a0', tech: '["Next.js","Tailwind","PostgreSQL"]' },
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
      for (const p of seedProjects) {
        await client.query(
          `INSERT INTO projects (id, name, category, domain, github_repo, deploy_target, status, color, tech_stack, pm2_name, server_port)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [uuidv4(), p.name, p.category, p.domain, p.github || null, p.deploy, p.status, p.color, p.tech, p.pm2 || null, p.port || null]
        );
      }
    }
  } finally {
    client.release();
  }
}

// Run init on module load
const initPromise = (async () => {
  await initSchema();
  await seedData();
})();

// Helper: ensure init is done before any query
async function ensureInit() {
  await initPromise;
}

// ─── Public API ───

/** Raw query helper */
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  await ensureInit();
  return pool.query(text, params);
}

/** Get a single row */
export async function queryOne(text: string, params?: any[]): Promise<any> {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/** Get all rows */
export async function queryAll(text: string, params?: any[]): Promise<any[]> {
  const result = await query(text, params);
  return result.rows;
}

/** Get a setting value */
export async function getSetting(key: string): Promise<string> {
  const row = await queryOne('SELECT value FROM settings WHERE key = $1', [key]);
  return row?.value || '';
}

/** Set a setting value (upsert) */
export async function setSetting(key: string, value: string): Promise<void> {
  await query(
    `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, value]
  );
}

/** Add an operation log */
export async function addLog(action: string, target: string, detail: string, status = 'success'): Promise<void> {
  await query(
    'INSERT INTO operation_logs (id, action, target, detail, status) VALUES ($1, $2, $3, $4, $5)',
    [uuidv4(), action, target, detail, status]
  );
}

/** Add a notification */
export async function addNotification(userId: string, type: string, title: string, message: string): Promise<void> {
  await query(
    'INSERT INTO notifications (id, user_id, type, title, message) VALUES ($1, $2, $3, $4, $5)',
    [uuidv4(), userId, type, title, message]
  );
}

export { pool };
export default pool;
