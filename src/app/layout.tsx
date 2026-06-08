import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Everett Operations Center",
  description: "Everett 项目管理运维中心 — 统一管理 GitHub, Vercel, Cloudflare, 服务器",
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = {
  themeColor: '#060B14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {/* Restore theme before paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('eoc-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}
