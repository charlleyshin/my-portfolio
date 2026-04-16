'use client';

import { useState } from 'react';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

const SUGGESTION_CHIPS = [
  {
    text: '해양 날씨 시각화',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z" />
      </svg>
    ),
  },
  {
    text: '실시간 선박 추적',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z" />
      </svg>
    ),
  },
  {
    text: '해양 보호구역 표시',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    text: '조류 흐름 분석',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.18.6-2.05.6v2c1.35 0 2.2-.42 2.95-.8.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6v-2c-.9 0-1.4.25-2.05.6-.75.38-1.6.8-2.95.8zm0-4.5c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.18.6-2.05.6v2c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6v-2c-.9 0-1.4.25-2.05.6-.75.38-1.6.8-2.95.8zm2.95-8.08C19.2 4.84 18.35 5.42 17 5.42c-1.35 0-2.2-.42-2.95-.8-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.32-1.18.6-2.05.6v2c1.35 0 2.2-.43 2.95-.8.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6v-2c-.9 0-1.4.25-2.1.61zM17 8.42c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.18.6-2.05.6v2c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6v-2c-.9 0-1.4.25-2.05.6-.75.38-1.6.8-2.95.8z" />
      </svg>
    ),
  },
  {
    text: '놀라운 발견',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z" />
      </svg>
    ),
  },
];

export default function OceanMap() {
  const [query, setQuery] = useState('');

  const handleChipClick = (text: string) => {
    setQuery(text);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    console.log('Submit:', query);
  };

  return (
    <div className="w-full h-full relative">
      {/* Background Map */}
      <Map
        initialViewState={{
          longitude: 127.5,
          latitude: 36.5,
          zoom: 5,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
      />

      {/* Prompt Panel Overlay - 중앙하단 배치 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[674px] max-w-[90vw]">
        <div className="bg-[linear-gradient(179.23deg,rgba(42,42,42,0.25)_56.97%,rgba(51,51,51,0.5)_92.84%)] backdrop-blur-[12px] rounded-3xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <h2 className="text-2xl font-normal text-white leading-8 mb-6 text-center">
              오늘은 어떤 지도가 필요하신가요?
            </h2>

            {/* Search Form - Brave style */}
            <div className="flex flex-col bg-white rounded-[30px] border border-outline shadow-[0_2px_2px_rgba(0,0,0,0.03)] overflow-hidden transition-shadow duration-[120ms] focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="주변 실시간 해양 기상 정보를 보여줘"
                className="w-full h-[120px] resize-none outline-none border-none bg-transparent text-foreground text-base font-normal leading-6 px-5 pt-4 pb-2 placeholder:text-placeholder"
              />
              <div className="flex justify-end items-center gap-3 px-3 pb-3">
                <button
                  type="submit"
                  className="flex items-center gap-1 h-9 pl-2 pr-3 bg-surface rounded-full cursor-pointer border border-transparent hover:bg-outline transition-[background] duration-[120ms]"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-muted">
                    <path d="M5.196.465a7.86 7.86 0 0 1 3.6-.409.843.843 0 0 1-.2 1.672 6.18 6.18 0 0 0-6.647 4.34 6.175 6.175 0 1 0 12.04 1.028.841.841 0 1 1 1.67-.209 7.86 7.86 0 0 1-1.68 5.902l1.775 1.774a.842.842 0 0 1-1.191 1.19l-1.775-1.774c-.546.44-1.15.804-1.799 1.086l-.1.043q-.15.063-.304.119l-.095.035-.046.018q-.03.01-.06.017a7.85 7.85 0 0 1-6.076-.427A7.86 7.86 0 0 1 2.16 2.448 7.9 7.9 0 0 1 5.196.465m2.667 3.61c.3 0 .563.204.636.495l.227.904a2.29 2.29 0 0 0 1.67 1.666l.906.226a.655.655 0 0 1 0 1.27l-.904.227a2.29 2.29 0 0 0-1.668 1.669l-.225.904a.656.656 0 0 1-1.273 0l-.226-.902a2.29 2.29 0 0 0-1.67-1.666l-.905-.226a.655.655 0 0 1-.001-1.27l.904-.227a2.3 2.3 0 0 0 1.668-1.669l.226-.904a.656.656 0 0 1 .635-.497m3.92-2.39c.171 0 .32.117.363.283l.128.515c.118.467.484.832.952.949l.515.128a.373.373 0 0 1 .001.724l-.515.128a1.3 1.3 0 0 0-.95.95l-.129.515a.373.373 0 0 1-.723.001l-.13-.514a1.31 1.31 0 0 0-.951-.95l-.516-.127a.373.373 0 0 1 0-.724l.515-.129c.468-.117.833-.483.95-.95l.128-.515a.374.374 0 0 1 .362-.283" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground leading-[22px]">물어보기</span>
                </button>
              </div>
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.text}
                  type="button"
                  onClick={() => handleChipClick(chip.text)}
                  className="bg-chip-bg text-chip-text text-sm border border-transparent rounded-3xl py-2.5 px-4 flex items-center gap-2 cursor-pointer whitespace-nowrap hover:bg-chip-hover hover:border-chip-border-hover transition-colors"
                >
                  {chip.icon}
                  {chip.text}
                </button>
              ))}
            </div>
          </form>

          {/* Disclaimer */}
          <p className="text-xs text-disclaimer leading-[18px] text-center p-2.5 mt-4">
            BlueEye AI를 활용합니다. 민감한 정보, 기밀 정보 또는 개인 정보를 입력하지 마세요.
          </p>
        </div>
      </div>
    </div>
  );
}
