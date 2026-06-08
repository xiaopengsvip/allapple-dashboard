import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Everett 运维中心",
  description: "Everett 项目管理运维中心 - 统一管理 GitHub / Vercel / Cloudflare / 服务器",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="icon" href="/favicon.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="bg-[#0a0a0f] text-[#e4e4e7] antialiased">
        {children}
      </body>
    </html>
  );
}
