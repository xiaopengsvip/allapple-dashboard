import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Everett 运维中心",
  description: "Everett 项目管理运维中心",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="bg-[#0a0a0f] text-[#e4e4e7] antialiased">
        {children}
      </body>
    </html>
  );
}
