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

            {/* Textarea with gradient border */}
            <div className="bg-[linear-gradient(93.41deg,rgb(121,179,255)_76.71%,rgb(229,37,146)_116.68%)] rounded-3xl p-px relative flex">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="주변 실시간 해양 기상 정보를 보여줘"
                className="bg-textarea-bg text-white text-sm font-sans rounded-[23px] py-3.5 pr-[60px] pl-5 w-full h-[190px] resize-none outline-none placeholder:text-placeholder"
              />
              <button
                type="submit"
                aria-label="제출"
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-submit border-0 flex items-center justify-center cursor-pointer hover:bg-submit-hover transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94l18.04-7.94a.75.75 0 0 0 0-1.41L3.478 2.405Z"
                    fill="white"
                  />
                </svg>
              </button>
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
