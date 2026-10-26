import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HOUSES, PERFUME_COUNT } from "@/lib/azur";
import { Eyebrow, Reveal } from "./Reveal";

const FAMOUS = ["Xerjoff", "Parfums de Marly", "Amouage", "Creed", "Tom Ford", "Kilian", "Louis Vuitton", "Dior", "Initio", "Roja", "Maison Francis Kurkdjian", "Byredo"];

// Landing teaser only; the full catalogue lives on /mirisi.
export function Houses() {
  const names = FAMOUS.filter((b) => HOUSES.some((h) => h.brand === b));
  return (
    <section className="overflow-hidden bg-ivory py-24 text-navy md:py-32">
      <Reveal className="px-6 text-center">
        <Eyebrow>Kuće koje nas inspirišu</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-light md:text-6xl">
          {PERFUME_COUNT} mirisa iz {HOUSES.length} kuća
        </h2>
      </Reveal>

      {/* two copies side by side so the strip loops seamlessly */}
      <div className="mt-12 flex w-max animate-[marquee_45s_linear_infinite] motion-reduce:animate-none" aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {names.map((n) => (
              <span key={n} className="flex items-center whitespace-nowrap font-display text-3xl italic text-navy/80 md:text-5xl">
                <span className="px-6 md:px-10">{n}</span>
                <span className="text-base text-gold">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="sr-only">{names.join(", ")}</p>

      {/* the key call to action on the page: solid navy pill with a gold ring and arrow */}
      <Reveal className="mt-14 px-6 text-center">
        <Link
          to="/mirisi"
          className="group inline-flex w-full max-w-sm items-center justify-between gap-4 rounded-full bg-navy py-3 pl-8 pr-3 text-navy-foreground shadow-xl shadow-navy/25 ring-2 ring-gold/70 ring-offset-4 ring-offset-ivory transition hover:-translate-y-0.5 hover:shadow-2xl md:max-w-md md:py-4"
        >
          <span className="text-left">
            <span className="block text-sm uppercase tracking-[0.25em] md:text-base">Pogledaj sve mirise</span>
            <span className="mt-0.5 block text-[11px] text-navy-foreground/60">Pretraga kroz svih {PERFUME_COUNT}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-navy transition-transform group-hover:translate-x-1 md:h-12 md:w-12">
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
