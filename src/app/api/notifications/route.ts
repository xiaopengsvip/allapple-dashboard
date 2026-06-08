import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { queryAll, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = await queryAll(
    'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
    [user.id]
  );
  const unread = await queryAll(
    'SELECT COUNT(*)::int as count FROM notifications WHERE user_id = $1 AND read = FALSE',
    [user.id]
  );
  return NextResponse.json({ notifications, unread: unread[0]?.count || 0 });
}

export async function PUT(request: Request) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, mark_all } = await request.json();
  if (mark_all) {
    await query('UPDATE notifications SET read = TRUE WHERE user_id = $1 AND read = FALSE', [user.id]);
  } else if (id) {
    await query('UPDATE notifications SET read = TRUE WHERE id = $1 AND user_id = $2', [id, user.id]);
  }
  return NextResponse.json({ success: true });
}
