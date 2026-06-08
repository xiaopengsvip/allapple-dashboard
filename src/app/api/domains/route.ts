import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = getSetting('cloudflare_api_token');
  if (!token) {
    // Return hardcoded data if no token
    return NextResponse.json({ records: getHardcodedRecords(), source: 'hardcoded' });
  }

  try {
    const zones = [
      { id: getSetting('cloudflare_zone_allapple'), name: 'allapple.top' },
      { id: getSetting('cloudflare_zone_vios'), name: 'vios.top' },
    ];

    const allRecords: any[] = [];
    for (const zone of zones) {
      if (!zone.id) continue;
      const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone.id}/dns_records?per_page=100`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        for (const r of data.result) {
          allRecords.push({ ...r, zone_name: zone.name });
        }
      }
    }
    return NextResponse.json({ records: allRecords, source: 'cloudflare' });
  } catch (e: any) {
    return NextResponse.json({ records: getHardcodedRecords(), error: e.message, source: 'fallback' });
  }
}

function getHardcodedRecords() {
  return [
    { id: '1', type: 'A', name: 'aios.allapple.top', content: '43.167.213.143', proxied: true, zone_name: 'allapple.top' },
    { id: '2', type: 'CNAME', name: 'enxx.allapple.top', content: 'cname.vercel-dns.com', proxied: false, zone_name: 'allapple.top' },
    { id: '3', type: 'A', name: 'chat.allapple.top', content: '43.167.213.143', proxied: true, zone_name: 'allapple.top' },
    { id: '4', type: 'CNAME', name: 'dashboard.allapple.top', content: 'cname.vercel-dns.com', proxied: false, zone_name: 'allapple.top' },
    { id: '5', type: 'A', name: 'tc.allapple.top', content: '43.167.213.143', proxied: true, zone_name: 'allapple.top' },
    { id: '6', type: 'CNAME', name: 'docs.allapple.top', content: 'cname.vercel-dns.com', proxied: false, zone_name: 'allapple.top' },
    { id: '7', type: 'A', name: 'aios.vios.top', content: '43.167.213.143', proxied: true, zone_name: 'vios.top' },
    { id: '8', type: 'A', name: 'game.vios.top', content: '43.167.213.143', proxied: true, zone_name: 'vios.top' },
    { id: '9', type: 'A', name: 'dashboard.vios.top', content: '76.76.21.21', proxied: false, zone_name: 'vios.top' },
    { id: '10', type: 'A', name: 'vios.top', content: '43.167.213.143', proxied: true, zone_name: 'vios.top' },
  ];
}
