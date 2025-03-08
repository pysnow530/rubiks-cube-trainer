import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "魔方练习工具",
  description: "基于 Next.js 和 Three.js 的 3D 魔方练习工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
