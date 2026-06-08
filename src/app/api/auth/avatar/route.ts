import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { query } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { image } = await request.json();
    if (!image || !image.startsWith('data:image/')) {
      return NextResponse.json({ error: '无效的图片数据' }, { status: 400 });
    }

    const matches = image.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches) return NextResponse.json({ error: '图片格式错误' }, { status: 400 });

    const ext = matches[1].replace('+', '');
    const data = Buffer.from(matches[2], 'base64');

    if (data.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '图片大小不能超过 10MB' }, { status: 400 });
    }

    const avatarDir = path.join(process.cwd(), 'public', 'avatars');
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

    const filename = `${user.id.substring(0, 8)}.${ext}`;
    const filepath = path.join(avatarDir, filename);
    fs.writeFileSync(filepath, data);

    const avatarUrl = `/avatars/${filename}`;
    await query('UPDATE users SET avatar_url = $1 WHERE id = $2', [avatarUrl, user.id]);

    return NextResponse.json({ success: true, avatar_url: avatarUrl });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
