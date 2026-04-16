"use client";

import Image from "next/image";

interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

interface PhotoGridProps {
  id: string;
  title: string;
  subtitle: string;
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export default function PhotoGrid({
  id,
  title,
  subtitle,
  photos,
  onPhotoClick,
}: PhotoGridProps) {
  return (
    <section id={id} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-semibold text-center mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        <p className="text-neutral-500 text-center mb-12">{subtitle}</p>

        {/* 사진 그리드 - 반응형 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => onPhotoClick(photo)}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                quality={75}
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center z-10">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to view
                </span>
              </div>
              {/* 캡션 */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 z-10">
                  <p className="text-white text-sm">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
