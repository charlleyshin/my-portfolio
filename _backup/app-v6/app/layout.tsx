import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maison de Cafe",
  description: "A cup of comfort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-stone-50 text-stone-800" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
