import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ocean AI Platform",
  description: "대화형 AI 해양정보 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
