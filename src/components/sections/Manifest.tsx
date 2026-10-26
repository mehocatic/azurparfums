import { PERFUME_COUNT, PRICE_RANGE } from "@/lib/azur";
import { Eyebrow, Reveal } from "./Reveal";

const FACTS = [
  { value: "Extrait", label: "Najviša koncentracija" },
  { value: "50 ml", label: "Svaka bočica" },
  { value: PRICE_RANGE, label: "Cijene" },
  { value: `${Math.floor(PERFUME_COUNT / 10) * 10}+`, label: "Mirisa u ponudi" },
];

export function Manifest() {
  return (
    <section className="bg-ivory px-6 py-24 text-center text-navy md:py-36">
      <Reveal>
        <Eyebrow>Luksuzni mirisi dostupni po narudžbi</Eyebrow>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-5xl font-light italic leading-[1.05] md:text-8xl">
          Tvoj miris.
          <br />
          Tvoj potpis.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-navy/65 md:text-base">
          AZUR parfemi iz Sanskog Mosta, inspirisani niche svijetom: Xerjoff, Parfums de Marly, Amouage, Creed i drugim velikim kućama. Ženski i muški mirisi.
        </p>
      </Reveal>
      <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-y-10 md:grid-cols-4">
        {FACTS.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.08} className="border-gold/30 px-2 md:border-l md:first:border-l-0">
            <div className="font-display text-3xl md:text-4xl">{f.value}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-navy/50">{f.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
