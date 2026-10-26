import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Eyebrow, Reveal } from "./Reveal";

// Hand-drawn AZUR line icons (48×48): each stroke draws itself in when the card scrolls into view.
const draw = (i: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true },
  transition: { pathLength: { duration: 1.4, delay: 0.2 + i * 0.12, ease: "easeInOut" as const }, opacity: { duration: 0.2, delay: 0.2 + i * 0.12 } },
});
const fill = (delay: number) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 48 48" className="h-14 w-14 text-gold" fill="none" stroke="currentColor" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

// the fleur-de-lis from the AZUR logo
const FleurDeLis = () => (
  <Icon>
    <motion.path d="M24 5 C19 11 18.5 18 24 26 C29.5 18 29 11 24 5 Z" {...draw(0)} />
    <motion.path d="M22 26 C15.5 27 10 23 10 17.5 C10 13 15.5 12 16.5 16 C17 18 15.5 19.5 14 19" {...draw(1)} />
    <motion.path d="M26 26 C32.5 27 38 23 38 17.5 C38 13 32.5 12 31.5 16 C31 18 32.5 19.5 34 19" {...draw(1)} />
    <motion.path d="M16.5 28.5 H31.5" {...draw(2)} />
    <motion.path d="M24 28.5 V35 M24 33 C21 34.5 19 37.5 20 41 M24 33 C27 34.5 29 37.5 28 41" {...draw(3)} />
  </Icon>
);

// the faceted AZUR bottle with its ribbed cap
const Bottle = () => (
  <Icon>
    <motion.path d="M19 5.5 H29 V12.5 H19 Z" {...draw(0)} />
    <motion.path d="M21.5 6.5 V11.5 M24 6.5 V11.5 M26.5 6.5 V11.5" strokeWidth={0.8} {...draw(1)} />
    <motion.path d="M21 12.5 V16 H27 V12.5" {...draw(1)} />
    <motion.path d="M12 17.5 H36 L39 20.5 V39.5 L36 42.5 H12 L9 39.5 V20.5 Z" {...draw(2)} />
    <motion.path d="M17 23.5 H31 V36 H17 Z" strokeWidth={0.9} {...draw(3)} />
    <motion.path d="M20.5 30 C22.5 28 25.5 32 27.5 30" strokeWidth={0.9} {...draw(4)} />
  </Icon>
);

const Hourglass = () => (
  <Icon>
    <motion.path d="M13 5.5 H35 M13 42.5 H35" {...draw(0)} />
    <motion.path d="M16 5.5 C16 15 21 19 24 24 C27 19 32 15 32 5.5" {...draw(1)} />
    <motion.path d="M16 42.5 C16 33 21 29 24 24 C27 29 32 33 32 42.5" {...draw(1)} />
    <motion.path d="M19.5 41 C21.5 37 26.5 37 28.5 41 Z" fill="currentColor" stroke="none" {...fill(1.2)} />
    <motion.path d="M24 26 V36" strokeWidth={0.8} strokeDasharray="1 2" {...fill(1.4)} />
  </Icon>
);

const Crown = () => (
  <Icon>
    <motion.path d="M9 36 L10.5 15.5 L18 25 L24 11 L30 25 L37.5 15.5 L39 36 Z" {...draw(0)} />
    <motion.path d="M9 40.5 H39" {...draw(1)} />
    <motion.path d="M14 31 H34" strokeWidth={0.8} {...draw(2)} />
    {[
      [10.5, 13.5],
      [24, 9],
      [37.5, 13.5],
    ].map(([cx, cy]) => (
      <motion.circle key={cx} cx={cx} cy={cy} r={1.6} fill="currentColor" stroke="none" {...fill(1.2)} />
    ))}
  </Icon>
);

const Gift = () => (
  <Icon>
    <motion.path d="M9.5 22 H38.5 V42 H9.5 Z" {...draw(0)} />
    <motion.path d="M7.5 16 H40.5 V22 H7.5 Z" {...draw(1)} />
    <motion.path d="M24 16 V42" {...draw(2)} />
    <motion.path d="M24 16 C20 8 12.5 8.5 14.5 13.5 C16 16.5 21.5 16 24 16" {...draw(3)} />
    <motion.path d="M24 16 C28 8 35.5 8.5 33.5 13.5 C32 16.5 26.5 16 24 16" {...draw(3)} />
  </Icon>
);

// glass dropper releasing a drop, as in the funnel scene
const Dropper = () => (
  <Icon>
    <motion.path d="M20 12 V7 C20 3.5 28 3.5 28 7 V12" {...draw(0)} />
    <motion.path d="M18.5 12 H29.5 V15.5 H18.5 Z" {...draw(1)} />
    <motion.path d="M21.5 15.5 V29 L24 33.5 L26.5 29 V15.5" {...draw(2)} />
    <motion.path d="M24 37.5 C22 40.5 21.8 42.5 24 44 C26.2 42.5 26 40.5 24 37.5 Z" fill="currentColor" stroke="none" {...fill(1.3)} />
  </Icon>
);

const BENEFITS = [
  { icon: FleurDeLis, title: "Inspirisani niche svijetom", text: "Mirisi velikih kuća u vlastitoj AZUR bočici." },
  { icon: Bottle, title: "Extrait de Parfum", text: "Najviša koncentracija mirisnih ulja, 50 ml." },
  { icon: Hourglass, title: "Dugotrajan miris", text: "Prati vas od jutra do kasnih sati." },
  { icon: Crown, title: "Povoljnija cijena", text: "Luksuzni doživljaj bez cijene originala." },
  { icon: Gift, title: "Idealan poklon", text: "Elegantna bočica i kutija, spremno za poklon." },
  { icon: Dropper, title: "Izrada po narudžbi", text: "Brza izrada i dostava, ili preuzimanje u Sanskom Mostu." },
];

export function Benefits() {
  return (
    <section className="px-6 py-24 text-navy md:py-32" style={{ background: "var(--gradient-finale)" }}>
      <Reveal className="text-center">
        <Eyebrow>Zašto AZUR</Eyebrow>
        <h2 className="mt-4 font-display text-4xl font-light md:text-6xl">Elegancija u svakom detalju</h2>
      </Reveal>
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-12">
        {BENEFITS.map(({ icon: Glyph, title, text }, i) => (
          <Reveal key={title} delay={(i % 3) * 0.08} className="flex flex-col items-center text-center">
            {/* arched niche, echoing the arches in AZUR's campaign imagery */}
            <div className="relative flex h-28 w-24 items-end justify-center pb-4">
              <svg viewBox="0 0 80 96" className="absolute inset-0 h-full w-full text-gold/60" fill="none" stroke="currentColor" strokeWidth={1} aria-hidden>
                <path d="M4 95 V40 A36 36 0 0 1 76 40 V95" />
                <path d="M9 95 V41 A31 31 0 0 1 71 41 V95" strokeWidth={0.5} />
              </svg>
              <Glyph />
            </div>
            <h3 className="mt-4 text-[11px] uppercase tracking-[0.2em]">{title}</h3>
            <p className="mx-auto mt-2 max-w-[15rem] text-sm leading-relaxed text-navy/60">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
