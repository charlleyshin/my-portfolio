'use client';

import dynamic from "next/dynamic";

// deck.gl은 브라우저에서만 동작하므로 SSR 비활성화
const OceanMap = dynamic(() => import("@/components/OceanMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
      <div className="text-slate-400">지도 로딩 중...</div>
    </div>
  ),
});

export default function Home() {
  return <OceanMap />;
}
