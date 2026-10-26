import { PRICE_RANGE } from "@/lib/azur";
import { Eyebrow, Reveal } from "./Reveal";

export function Compare() {
  return (
    <section className="px-6 py-24 text-navy md:py-32" style={{ background: "var(--gradient-finale)" }}>
      <Reveal className="text-center">
        <Eyebrow>Isti mirisni doživljaj</Eyebrow>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl font-light md:text-6xl">Znatno povoljnija cijena</h2>
      </Reveal>
      <div className="mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2 md:gap-0">
        <Reveal className="rounded-3xl border border-navy/10 bg-ivory/50 p-8 text-center md:rounded-r-none md:border-r-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-navy/50">Original</p>
          <p className="mt-3 font-display text-2xl">Yves Saint Laurent Y</p>
          <p className="mt-1 text-xs text-navy/50">Eau de Parfum · 100 ml</p>
          <p className="mt-6 font-display text-4xl text-navy/45 line-through decoration-1">250–320 KM</p>
        </Reveal>
        <Reveal delay={0.1} className="rounded-3xl border border-gold/50 bg-navy p-8 text-center text-navy-foreground shadow-xl md:rounded-l-none">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">AZUR</p>
          <p className="mt-3 font-display text-2xl">Inspirisan YSL Y</p>
          <p className="mt-1 text-xs text-navy-foreground/60">Extrait de Parfum · 50 ml</p>
          <p className="mt-6 font-display text-5xl text-gold">{PRICE_RANGE}</p>
        </Reveal>
      </div>
      <Reveal className="mt-8 text-center">
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-navy/55">
          Extrait de Parfum ima veću koncentraciju mirisnih ulja od Eau de Parfum.
        </p>
      </Reveal>
    </section>
  );
}
