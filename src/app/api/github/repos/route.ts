import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = getSetting('github_token');
  const org = getSetting('github_org') || 'xiaopengsvip';

  if (!token) {
    return NextResponse.json({ repos: [], error: 'No GitHub token configured' });
  }

  try {
    const repos: any[] = [];
    let page = 1;
    while (true) {
      const res = await fetch(`https://api.github.com/users/${org}/repos?per_page=100&page=${page}&sort=updated`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json' },
      });
      const data = await res.json();
      if (!data.length) break;
      repos.push(...data);
      if (data.length < 100) break;
      page++;
    }
    return NextResponse.json({ repos });
  } catch (e: any) {
    return NextResponse.json({ repos: [], error: e.message });
  }
}
