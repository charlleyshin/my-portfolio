export default function InfoSection() {
  return (
    <section className="bg-stone-900 text-stone-300 py-16 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-12 text-center text-sm">
        <div>
          <h4 className="text-amber-400 tracking-widest text-xs mb-3">LOCATION</h4>
          <p className="leading-relaxed">
            경기도 안양구 동안구 학의로 282
            <br />
            금강펜테리움 IT타워 A동 1508호
          </p>
        </div>
        <div>
          <h4 className="text-amber-400 tracking-widest text-xs mb-3">HOURS</h4>
          <p className="leading-relaxed">
            매일 08:00 - 18:00
            <br />
            토요일 10:00 - 15:00
          </p>
        </div>
        <div>
          <h4 className="text-amber-400 tracking-widest text-xs mb-3">CONTACT</h4>
          <p className="leading-relaxed">
            02-1234-5678
            <br />
            hello@maison.cafe
          </p>
        </div>
      </div>
    </section>
  );
}
