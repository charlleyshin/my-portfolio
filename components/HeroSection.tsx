import Image from "next/image";

interface HeroSectionProps {
  name: string;
  tagline: string;
  backgroundImage: string;
}

export default function HeroSection({
  name,
  tagline,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* 배경 이미지 - Next.js Image로 최적화 */}
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        priority
        quality={75}
        className="object-cover"
        sizes="100vw"
      />

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* 콘텐츠 */}
      <div className="relative z-20 text-center text-white px-6">
        <p className="text-amber-400 tracking-[0.3em] text-sm mb-4 font-light uppercase">
          Welcome
        </p>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-md mx-auto font-light">
          {tagline}
        </p>
      </div>
    </section>
  );
}
