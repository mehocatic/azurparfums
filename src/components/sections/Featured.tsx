import althair from "@/assets/bottles/althair.webp";
import decisions from "@/assets/bottles/decisions.webp";
import imagination from "@/assets/bottles/imagination.webp";
import layton from "@/assets/bottles/layton.webp";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AddToInquiry } from "@/components/AddToInquiry";
import { PERFUME_COUNT } from "@/lib/azur";
import { Eyebrow, Reveal } from "./Reveal";

const FEATURED = [
  {
    name: "Layton",
    house: "Parfums de Marly",
    src: layton,
    notes: ["Bergamot, jabuka", "Lavanda, ljubičica, jasmin", "Vanilija, kardamom, jantar"],
  },
  {
    name: "Althair",
    house: "Parfums de Marly",
    src: althair,
    notes: ["Citrus, cimet", "Praline", "Vanilija bourbon, tonka, jantar"],
  },
  {
    name: "Decisions",
    house: "Amouage",
    src: decisions,
    notes: ["Smokva, šafran", "Olibanum, kožne note", "Sandalovina, pačuli, cedar"],
  },
  {
    name: "Imagination",
    house: "Louis Vuitton",
    src: imagination,
    notes: ["Bergamot, mandarina", "Narandžin cvijet", "Crni čaj, drvo"],
  },
];
const TIERS = ["Vrh", "Srce", "Baza"];

export function Featured() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // phones only: which card is centred, and step to a neighbour
  const cardStep = () => {
    const el = rail.current;
    const first = el?.children[0] as HTMLElement | undefined;
    const second = el?.children[1] as HTMLElement | undefined;
    return first && second ? second.offsetLeft - first.offsetLeft : 1;
  };
  const go = (i: number) => {
    const n = Math.max(0, Math.min(FEATURED.length - 1, i));
    rail.current?.scrollTo({ left: n * cardStep(), behavior: "smooth" });
  };

  return (
    <section className="bg-ivory pb-24 text-navy md:pb-36">
      <Reveal className="px-6 text-center">
        <Eyebrow>Izdvojeni mirisi</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-light md:text-6xl">Najtraženiji</h2>
      </Reveal>

      {/* phones: swipeable row with arrows + dots; desktop: four columns */}
      <div className="relative">
        <div
          ref={rail}
          onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / cardStep()))}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[12vw] pb-4 md:mx-auto md:grid md:max-w-6xl md:grid-cols-4 md:gap-8 md:overflow-visible md:px-6"
        >
          {FEATURED.map((f, i) => (
            <Reveal
              key={f.name}
              delay={i * 0.08}
              className="w-[76vw] max-w-xs shrink-0 snap-center md:w-auto md:max-w-none"
            >
              <article className="flex h-full flex-col items-center text-center">
                <div className="relative flex h-72 w-full items-end justify-center md:h-80">
                  <div className="absolute bottom-1 h-5 w-36 rounded-[50%] bg-navy/20 blur-md" />
                  <img
                    src={f.src}
                    alt={`AZUR ${f.name}`}
                    loading="lazy"
                    className="relative h-full w-auto object-contain"
                  />
                </div>
                <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-gold">
                  Inspirisan · {f.house}
                </p>
                <h3 className="mt-2 font-display text-3xl">{f.name}</h3>
                <dl className="mt-5 w-full max-w-[16rem] space-y-2 border-t border-gold/30 pt-4 text-left">
                  {f.notes.map((n, k) => (
                    <div
                      key={k}
                      className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-3"
                    >
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-gold">
                        {TIERS[k]}
                      </dt>
                      <dd className="font-display text-base leading-snug">{n}</dd>
                    </div>
                  ))}
                </dl>
                {/* pinned to the card bottom so the buttons line up even when a note wraps */}
                <div className="mt-auto pt-6">
                  <AddToInquiry perfume={{ name: f.name, brand: f.house }} scroll />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        {([-1, 1] as const).map((d) => {
          const disabled = d < 0 ? active === 0 : active === FEATURED.length - 1;
          return (
            <button
              key={d}
              type="button"
              onClick={() => go(active + d)}
              disabled={disabled}
              aria-label={d < 0 ? "Prethodni miris" : "Sljedeći miris"}
              className={`absolute top-[10.5rem] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/60 bg-ivory/90 text-navy shadow-lg backdrop-blur transition-opacity disabled:pointer-events-none disabled:opacity-0 md:hidden ${d < 0 ? "left-2" : "right-2"}`}
            >
              {d < 0 ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 md:hidden" aria-hidden>
        {FEATURED.map((f, i) => (
          <button
            key={f.name}
            type="button"
            tabIndex={-1}
            onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-gold" : "w-1.5 bg-navy/20"}`}
          />
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <Link
          to="/mirisi"
          className="inline-flex items-center gap-2 border-b border-gold pb-1 text-[11px] uppercase tracking-[0.3em] text-navy transition-colors hover:text-gold"
        >
          Ili pogledajte svih {PERFUME_COUNT} mirisa{" "}
          <ArrowRight className="h-3.5 w-3.5 text-gold" />
        </Link>
      </Reveal>
    </section>
  );
}
