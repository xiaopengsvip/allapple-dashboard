import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import db from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { image } = await request.json();
    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({ error: '无效的图片数据' }, { status: 400 });
    }

    // Extract base64 data
    const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: '图片格式错误' }, { status: 400 });

    const ext = matches[1].replace('+', '');
    const data = Buffer.from(matches[2], 'base64');

    // Limit 2MB
    if (data.length > 2 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过 2MB' }, { status: 400 });
    }

    // Save file
    const avatarDir = path.join(process.cwd(), 'public', 'avatars');
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

    const filename = `${user.id.substring(0, 8)}.${ext}`;
    const filepath = path.join(avatarDir, filename);
    fs.writeFileSync(filepath, data);

    const avatarUrl = `/avatars/${filename}`;

    // Update DB
    db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatarUrl, user.id);

    return NextResponse.json({ success: true, avatar_url: avatarUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
