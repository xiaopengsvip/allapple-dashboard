import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = getSetting('vercel_token');
  if (!token) {
    return NextResponse.json({ projects: [], error: 'No Vercel token configured' });
  }

  try {
    const res = await fetch('https://api.vercel.com/v9/projects?limit=50&sort=updatedAt', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await res.json();
    return NextResponse.json({ projects: data.projects || [] });
  } catch (e: any) {
    return NextResponse.json({ projects: [], error: e.message });
  }
}
