export default function HeroSection() {
  return (
    <section className="bg-blue-900 text-stone-100 py-16 px-6 text-center">
      <p className="text-amber-400 tracking-[0.3em] text-sm mb-6 font-light">
        SINCE 2024
      </p>
      <h1
        className="text-6xl font-bold mb-6 text-white"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        charlley de Cafe
      </h1>
      <p className="text-stone-400 text-lg font-light max-w-md mx-auto leading-relaxed">
        한 잔의 여유가 만드는 특별한 순간.
        <br />
        매일 아침, 정성을 담아 내립니다.
      </p>
    </section>
  );
}
