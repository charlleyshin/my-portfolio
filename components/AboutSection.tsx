import Image from "next/image";

interface AboutSectionProps {
  profileImage: string;
  greeting: string;
  description: string;
  highlights: string[];
}

export default function AboutSection({
  profileImage,
  greeting,
  description,
  highlights,
}: AboutSectionProps) {
  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-semibold text-center mb-16"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 프로필 이미지 */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-lg relative">
              <Image
                src={profileImage}
                alt="Profile"
                fill
                quality={80}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* 장식 요소 */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-100 rounded-2xl -z-10" />
          </div>

          {/* 소개 텍스트 */}
          <div>
            <p className="text-amber-500 font-medium mb-2">{greeting}</p>
            <p className="text-neutral-600 leading-relaxed mb-6">
              {description}
            </p>

            {/* 하이라이트 */}
            <div className="space-y-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full" />
                  <span className="text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
