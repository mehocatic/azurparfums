import { Link, createFileRoute } from "@tanstack/react-router";
import { easeInOut, easeOut, motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import hillsFront from "@/assets/hills-moss.webp";
import saffron from "@/assets/saffron.webp";
import rose from "@/assets/rose.webp";
import lavender from "@/assets/lavender.webp";
import vanilla from "@/assets/vanilla.webp";
import oud from "@/assets/oud.webp";
import amber from "@/assets/amber.webp";
import funnel from "@/assets/funnel-real.webp";
import bottle from "@/assets/azur-bottle-bare.webp";
import label from "@/assets/azur-label.webp";
import cap from "@/assets/azur-cap.webp";
import layton from "@/assets/bottles/layton.webp";
import { MarbleColumn, capHeight } from "@/components/Marble";
import { ScrollTop } from "@/components/ScrollTop";
import { HOME_DESCRIPTION, HOME_TITLE, STRUCTURED_DATA, pageHead } from "@/lib/seo";
import { Manifest } from "@/components/sections/Manifest";
import { Featured } from "@/components/sections/Featured";
import { Compare } from "@/components/sections/Compare";
import { Houses } from "@/components/sections/Houses";
import { Benefits } from "@/components/sections/Benefits";
import { Contact } from "@/components/sections/Contact";
import imagination from "@/assets/bottles/imagination.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }),
    scripts: [{ type: "application/ld+json", children: STRUCTURED_DATA }],
  }),
  component: Index,
});

// Each note is planted on a spot of the hills photo, given as the pixel where its base touches the ground in that
// image (HILLS_W × HILLS_H): d on wide screens, m on portrait ones, which only see the middle of the picture.
// lift: scroll progress at which it breaks free; plant: resting angle in degrees (default ±6°, high for a piece
// lying on its side); base: how far below the picture's centre the visible bottom is, in box heights (default 0.4);
// bury: half-width / half-height (in box sizes) of the patch of moss drawn back over its foot so it sits in the ground
const HILLS_W = 1748;
const HILLS_H = 899;
type Note = { name: string; src: string; d: [number, number]; m: [number, number]; lift: number; plant?: number; base?: number; bury?: [number, number] };
const ITEMS: Note[] = [
  { name: "Šafran", src: saffron, d: [337, 757], m: [707, 783], lift: 0.025, bury: [0.3, 0.28] },
  { name: "Ruža", src: rose, d: [707, 658], m: [707, 655], lift: 0.01 },
  { name: "Lavanda", src: lavender, d: [1413, 697], m: [1003, 587], lift: 0.035 },
  { name: "Vanilija", src: vanilla, d: [505, 896], m: [775, 801], lift: 0.045 },
  { name: "Oud", src: oud, d: [1168, 801], m: [968, 640], lift: 0.02, plant: 92, base: 0.27, bury: [0.5, 0.12] },
  { name: "Jantar", src: amber, d: [871, 632], m: [871, 606], lift: 0.04, bury: [0.42, 0.2] },
];

// The note's spot on screen in px: where its visible bottom touches the hill photo, which fills the screen
// object-cover, top-aligned (its sky is cut out). Item box = min(22vh, 28vw), drawn at 0.85×.
function groundPx(it: Note, W: number, H: number) {
  const k = Math.max(W / HILLS_W, H / HILLS_H);
  const [ix, iy] = W < H ? it.m : it.d;
  return { x: (W - HILLS_W * k) / 2 + ix * k, ground: iy * k, size: 0.85 * Math.min(0.22 * H, 0.28 * W) };
}

// Where (vw / vh of the parent centre) a note must sit for its base to touch its spot, with the label under it.
function plantSpot(it: Note, W: number, H: number) {
  const { x, ground, size } = groundPx(it, W, H);
  const labelH = W >= 768 ? 40 : 28;
  const y = ground - (it.base ?? 0.4) * size + 0.85 * (labelH / 2);
  return { hx: (x / W) * 100, hy: (y / H) * 100 };
}

// Funnel geometry (vh): container height 80vh, bowl rim ≈ 5%, cone tip ≈ 51%, stem tip at 100%
const FUNNEL_H = 80;
const BOWL_CLIP = "polygon(2% 4%, 98% 4%, 55.5% 51%, 44.5% 51%)";

function Index() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // The track is 1200vh; everything up to the label sticking keeps its original ~850vh of scroll,
  // and the finale (p 0.945 → 1) gets the remaining ~250vh so the bottle can descend slowly.
  const p = useTransform(raw, [0, 0.773, 1], [0, 0.945, 1]);

  // backgrounds
  const heroBgOpacity = useTransform(p, [0.08, 0.2], [1, 0]);
  const labBgOpacity = useTransform(p, [0.4, 0.5], [0, 1]);

  // scene 1
  const hillsY = useTransform(p, [0, 0.2], ["0vh", "110vh"]);
  const titleY = useTransform(p, [0, 0.2], ["0vh", "40vh"]);
  const titleOpacity = useTransform(p, [0.05, 0.16], [1, 0]);

  // funnel: rises, parks (top at 16vh), lifts so the stem tip sits near the top, exits
  const funnelTop = useTransform(p, [0.42, 0.52, 0.7, 0.76, 0.86, 0.9], [150, 16, 16, -62, -62, -150]);
  const funnelY = useTransform(funnelTop, (v) => `${v}vh`);
  const vp = useViewport();
  const vpRef = useRef(vp);
  vpRef.current = vp;
  // Everything above the rim stays visible; below the rim only the bowl interior shows. Plain px and always a
  // polygon: iOS WebKit dropped the whole layer for a "none" → polygon switch built from calc(vw + vh).
  const insideClip = useTransform([p, funnelTop] as never, (v: number[]) => {
    const { W, H } = vpRef.current;
    const pv = v[0] ?? 0, t = v[1] ?? 0;
    if (pv < 0.5) return `polygon(${-W}px ${-H}px, ${2 * W}px ${-H}px, ${2 * W}px ${3 * H}px, ${-W}px ${3 * H}px)`;
    const vh = H / 100, cx = W / 2;
    const rim = (t + 3.6) * vh, tip = (t + 40.8) * vh, top = -H;
    const wide = 28.3 * vh, narrow = 3.2 * vh;
    return `polygon(${-W}px ${top}px, ${2 * W}px ${top}px, ${2 * W}px ${rim}px, ${cx + wide}px ${rim}px, ${cx + narrow}px ${tip}px, ${cx - narrow}px ${tip}px, ${cx - wide}px ${rim}px, ${-W}px ${rim}px)`;
  });
  const bigTextOpacity = useTransform(p, [0.48, 0.56, 0.7, 0.76], [0, 1, 1, 0]);
  const bigTextScale = useTransform(p, [0.48, 0.6], [0.92, 1]);
  const essence = useTransform(p, [0.6, 0.7], [0, 1]);
  const essenceClip = useTransform(essence, (v) => `inset(${100 - v * 55}% 0 0 0)`);

  // bottle + cap + finale
  // bottle group (body + cap): same bottle the drop falls into, then glides down onto the centre pedestal
  // lifts clear while the pedestals rise in (bottom edge above the empty centre stone), then settles onto it
  const L = useMemo(() => finaleLayout(vp.W, vp.H), [vp.W, vp.H]);
  // Finale: the bottle shrinks and sinks onto its stone. Its *top* (cap) is what's animated, and only ever moves
  // down; the group's y is derived from it, since the group scales from its bottom edge. Animating y directly made
  // the bottom edge race upward while shrinking, so the bottle looked like it jumped up.
  const groupScale = useTransform(p, [0.95, 0.973, 0.988], [1, L.hoverScale, L.scale], { ease: [easeInOut, easeOut] });
  const bottleTop = useTransform(p, [0.95, 0.973, 0.988], [L.startTop, L.hoverTop, L.landTop], { ease: [easeInOut, easeOut] });
  const groupY = useTransform([p, bottleTop, groupScale] as never, (v: number[]) => {
    const [pv = 0, top = 0, sc = 1] = v;
    if (pv < 0.95) return `${pv < 0.7 ? 105 : pv > 0.77 ? 45 : 105 - ((pv - 0.7) / 0.07) * 60}vh`;
    return `${top + sc * (BOTTLE_H + CAP_RISE) * L.H - BOTTLE_H * L.H}px`;
  });
  const capY = useTransform(p, [0.845, 0.88], ["-110vh", "-8.5vh"]);
  const capOpacity = useTransform(p, [0.845, 0.85], [0, 1]);
  // label slides in from the side, then "sticks" (squash + settle)
  const labelX = useTransform(p, [0.878, 0.925, 0.937], ["-140vw", "1vw", "0vw"]);
  const labelOpacity = useTransform(p, [0.874, 0.882], [0, 1]);
  const labelRot = useTransform(p, [0.878, 0.925, 0.937], [-22, 2, 0]);
  const labelSX = useTransform(p, [0.92, 0.929, 0.937], [1, 1.05, 1]);
  const labelShine = useTransform(p, [0.932, 0.948], ["-120%", "220%"]);
  // finale in three beats: the two side bottles + empty centre pedestal rise in, then our bottle descends onto it, then the heading
  // columns slide up from below the screen fully opaque (no see-through fade); the centre one trails slightly
  const trioOpacity = useTransform(p, [0.95, 0.97], [0, 1]);
  const sideRise = useTransform(p, [0.95, 0.97], [L.H * 0.75, 0], { ease: easeOut });
  const centerRise = useTransform(p, [0.953, 0.973], [L.H * 0.45, 0], { ease: easeOut });
  const contact = useTransform(p, [0.976, 0.988], [0, 1]);
  const headingOpacity = useTransform(p, [0.988, 0.998], [0, 1]);
  const headingY = useTransform(p, [0.988, 0.998], ["3vh", "0vh"]);
  const contactScale = useTransform(contact, [0, 1], [1.6, 1]);
  const reflOpacity = useTransform(contact, [0, 1], [0, 0.12]);
  // Funnel is ~0.74 × its 80vh height wide; shrink it (and what falls into it) on narrow phones.
  const fs = Math.min(1, vp.W / (vp.H * 0.62));

  return (
    <main className="bg-background text-foreground">
      <div ref={ref} className="relative" style={{ height: "1200vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Header />
          {/* backgrounds */}
          <div className="absolute inset-0" style={{ background: "var(--gradient-meadow)" }} />
          <motion.div className="absolute inset-0" style={{ background: "var(--gradient-sky)", opacity: heroBgOpacity }} />
          <motion.div className="absolute inset-0" style={{ background: "var(--gradient-lab)", opacity: labBgOpacity }} />
          {/* finale: soft ivory spotlight behind the pedestals instead of flat lab green */}
          <motion.div className="absolute inset-0" style={{ background: "var(--gradient-finale)", opacity: trioOpacity }} />

          {/* finale heading */}
          <motion.div className="pointer-events-none absolute inset-x-0 top-[17vh] z-20 px-6 text-center md:top-[11vh]" style={{ opacity: headingOpacity, y: headingY }}>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gold md:text-xs">Extrait de Parfum · 50 ml</p>
            <h2 className="mt-3 font-display text-5xl font-light italic text-navy md:text-7xl">Kolekcija AZUR</h2>
          </motion.div>

          {/* hero title: lower half sinks behind the hill line */}
          <motion.h1
            className="absolute inset-x-0 top-[29vh] md:top-[21vh] z-10 whitespace-nowrap text-center font-display font-light leading-none tracking-[0.14em]"
            style={{
              y: titleY, opacity: titleOpacity, fontSize: "clamp(2.4rem, 8.5vw, 9.5rem)",
              // light, widely spaced capitals in a deeper gold; a soft ivory halo keeps the thin strokes legible on the sky
              color: "oklch(0.55 0.12 72)",
              textShadow: "0 0 0.35em oklch(0.98 0.04 95 / 0.55)",
            }}
          >
            {/* brand name in the page's main heading for search engines and screen readers; visually unchanged */}
            <span className="sr-only">AZUR parfemi: </span>
            OSJETI NOTU
          </motion.h1>

          {/* big lab text behind funnel */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-[42vh] z-10 text-center font-display font-light leading-none tracking-[0.12em] text-primary-foreground"
            style={{ opacity: bigTextOpacity, scale: bigTextScale, fontSize: "clamp(5rem, 19vw, 18rem)" }}
          >
            MIRISI
          </motion.div>

          {/* finale stage: round marble columns rise from the floor (sides taller, behind; centre in front), side bottles on top */}
          <div className="pointer-events-none absolute inset-0 z-20">
            {([-1, 1] as const).map((side) => {
              const b = side < 0 ? L.left : L.right;
              return (
                <motion.div key={side} className="absolute inset-0" style={{ y: sideRise }}>
                  <MarbleColumn variant={side < 0 ? "green" : "black"} width={b.w} className="absolute bottom-0" style={{ left: b.x - b.w / 2, top: L.sideTop }} />
                  <SeatShadow x={b.x} y={L.sideSeat} w={L.sideBottleW} />
                  <img
                    src={side < 0 ? layton : imagination}
                    alt={`AZUR ${side < 0 ? "Layton" : "Imagination"}`}
                    className="absolute max-w-none"
                    style={{ height: L.sideBottleH, left: b.x, top: L.sideSeat - L.sideBottleH * 0.955, transform: "translateX(-50%)" }}
                  />
                </motion.div>
              );
            })}
            <motion.div className="absolute inset-0" style={{ y: centerRise }}>
              <MarbleColumn variant="white" width={L.center.w} className="absolute bottom-0" style={{ left: L.center.x - L.center.w / 2, top: L.centerTop }} />
            </motion.div>

            {/* main bottle + cap + label */}
            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2"
              style={{ y: groupY, scale: groupScale, height: "50vh", aspectRatio: "848 / 1264", transformOrigin: "50% 100%" }}
            >
              {/* contact shadow + polished-marble reflection */}
              <motion.div className="absolute left-1/2 -translate-x-1/2 rounded-[50%]" style={{ bottom: "-4.5%", width: "130%", height: "10%", opacity: contact, scaleX: contactScale, background: "radial-gradient(ellipse at center, oklch(0.08 0.02 150 / .7), transparent 70%)", filter: "blur(6px)" }} />
              <motion.div className="absolute left-1/2 -translate-x-1/2 rounded-[50%]" style={{ bottom: "-1.2%", width: "92%", height: "3%", opacity: contact, background: "oklch(0.06 0.02 150 / .75)", filter: "blur(3px)" }} />
              <motion.img src={bottle} alt="" aria-hidden className="absolute left-0 top-full h-full w-full" style={{ opacity: reflOpacity, scaleY: -1, transformOrigin: "50% 0%", maskImage: "linear-gradient(to bottom, black, transparent 22%)", WebkitMaskImage: "linear-gradient(to bottom, black, transparent 22%)" }} />
              {/* soft static shadow behind the glass instead of a drop-shadow filter (re-rasterised on every scale step) */}
              <div className="absolute inset-x-[8%] bottom-[2%] top-[18%] rounded-[12%] bg-[oklch(0.2_0.04_150/0.28)] blur-2xl" />
              <img src={bottle} alt="AZUR bočica" className="relative h-full w-full" />
              <motion.div className="absolute overflow-hidden" style={{ left: "19%", top: "33%", width: "60%", aspectRatio: "925 / 1186", borderRadius: "4%", x: labelX, opacity: labelOpacity, rotate: labelRot, scaleX: labelSX, boxShadow: "0 0.4vh 1.2vh oklch(0.2 0.03 80 / .25)" }}>
                <img src={label} alt="AZUR etiketa" className="h-full w-full" />
                <motion.div className="absolute inset-y-0 w-1/3 -skew-x-12" style={{ x: labelShine, background: "linear-gradient(90deg, transparent, oklch(1 0 0 / .7), transparent)" }} />
              </motion.div>
              <motion.img
                src={cap}
                alt="Zlatni čep AZUR bočice"
                className="absolute left-1/2 top-0 -translate-x-1/2 drop-shadow-xl"
                style={{ y: capY, opacity: capOpacity, width: "50%" }}
              />
            </motion.div>
          </div>

          {[0, 1, 2].map((k) => (
            <Drop key={k} p={p} k={k} fs={fs} />
          ))}

          <div className="pointer-events-none absolute inset-0 z-30" style={{ transform: `scale(${fs})`, transformOrigin: "50% 0" }}>

          {/* funnel back (glass) */}
          <motion.div className="absolute left-1/2 top-0 z-30 -translate-x-1/2" style={{ y: funnelY, height: `${FUNNEL_H}vh`, aspectRatio: "901 / 1222" }}>
            <motion.div className="absolute inset-0" style={{ clipPath: essenceClip, opacity: essence }}>
              <div className="h-full w-full" style={{ clipPath: BOWL_CLIP, background: "var(--gradient-essence)", opacity: 0.85 }} />
            </motion.div>
            <img src={funnel} alt="Stakleni lijevak" className="relative h-full w-full opacity-60" />
          </motion.div>

          {/* botanicals */}
          <motion.div className="pointer-events-none absolute inset-0 z-40" style={{ clipPath: insideClip, WebkitClipPath: insideClip }}>
            {ITEMS.map((item, i) => (
              <Botanical key={item.name} p={p} i={i} fs={fs} name={item.name} src={item.src} lift={item.lift} plant={item.plant} base={item.base} {...plantSpot(item, vp.W, vp.H)} />
            ))}
          </motion.div>

          {/* funnel front glass: blurs & tints everything inside the bowl */}
          <motion.div className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2" style={{ y: funnelY, height: `${FUNNEL_H}vh`, aspectRatio: "901 / 1222" }}>
            <div
              className="absolute inset-0 bg-primary-foreground/25"
              style={{ clipPath: BOWL_CLIP, WebkitClipPath: BOWL_CLIP }}
            />
            <img src={funnel} alt="" aria-hidden className="relative h-full w-full opacity-35 mix-blend-screen" />
          </motion.div>
          </div>

          {/* hills foreground: fills the screen, flowers in the lower half */}
          <motion.img
            src={hillsFront}
            alt="Mahovinasta brda s divljim cvijećem"
            className="absolute inset-0 z-20 h-full w-full max-w-none object-cover object-top"
            style={{ y: hillsY }}
          />
          {/* moss and grass drawn back over the foot of the notes that sit in it, so they don't hover on the photo */}
          {ITEMS.map((item) => item.bury && <Grounding key={item.name} p={p} hillsY={hillsY} it={item} W={vp.W} H={vp.H} />)}
        </div>
      </div>
      <Manifest />
      <Houses />
      <Featured />
      <Compare />
      <Benefits />
      <Contact />
      <ScrollTop after={pastStory} />
    </main>
  );
}

type BotanicalProps = { p: MotionValue<number>; i: number; fs: number; name: string; src: string; hx: number; hy: number; lift: number; plant?: number | undefined; base?: number | undefined };

function Botanical({ p, i, fs, name, src, hx, hy, lift, plant, base = 0.4 }: BotanicalProps) {
  const col = i % 3;
  const row = Math.floor(i / 3);
  // grid spot on screen (wider columns on phones), converted to the funnel wrapper's local coordinates
  const gx = 50 + (col - 1) * (fs < 1 ? 32 : 28); // vw
  const gy = 28 + row * 36; // vh
  const gxL = 50 + (gx - 50) / fs;
  const gyL = gy / fs;
  // planted spot, in the funnel wrapper's local (scaled by fs from 50% 0) coordinates so it lands on the hill on phones too
  const px = 50 + (hx - 50) / fs;
  const py = hy / fs;
  // rides down with the hill (hillsY: 0 → 110vh over p 0 → 0.2) until it breaks free
  const pyLift = (hy + (lift / 0.2) * 110) / fs;
  // cluster above the funnel opening (rim ≈ 20vh)
  const cx = 50 + (col - 1) * 6;
  const cy = 4 + row * 6;
  // deep inside the bowl, narrowing toward the stem
  const iy = 32 + row * 8;
  const ix = 50 + (col - 1) * (row ? 2 : 5);
  const d = i * 0.012;

  const x = useTransform(p, [0, lift, 0.3 + d, 0.42, 0.52, 0.6], [`${px}vw`, `${px}vw`, `${gxL}vw`, `${gxL}vw`, `${cx}vw`, `${ix}vw`]);
  const y = useTransform(p, [0, lift, 0.3 + d, 0.42, 0.52, 0.6, 0.7], [`${py}vh`, `${pyLift}vh`, `${gyL}vh`, `${gyL}vh`, `${cy}vh`, `${iy}vh`, `${iy + 4}vh`]);
  // hill + grid phases undo the wrapper's fs so they keep full size on phones; funnel phases stay local
  const scale = useTransform(p, [0, lift, 0.3 + d, 0.42, 0.52, 0.6], [0.85 / fs, 0.85 / fs, 1 / fs, 1 / fs, 0.62, 0.42]);
  const tilt = i % 2 ? -6 : 6;
  const rotate = useTransform(p, [0, lift, lift + 0.04, 0.3, 0.42, 0.52, 0.6], [plant ?? tilt, plant ?? tilt, -tilt * 2.5, 0, 0, i % 2 ? 12 : -12, i % 2 ? 30 : -30]);
  const opacity = useTransform(p, [0, 0.55, 0.62, 0.66, 0.71], [1, 1, 0.55, 0.55, 0]);
  const groundOpacity = useTransform(p, [lift, lift + 0.02], [1, 0]);
  const labelOpacity = useTransform(p, [0.28, 0.33, 0.4, 0.44], [0, 1, 1, 0]);

  return (
    <motion.div className="absolute left-0 top-0 z-40 flex flex-col items-center" style={{ x, y, scale, opacity, translateX: "-50%", translateY: "-50%" }}>
      {/* soft shadow on the moss while planted */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{ top: `calc(min(22vh, 28vw) * ${base + 0.46})`, width: "min(18vh, 23vw)", height: "min(4vh, 5vw)", opacity: groundOpacity, background: "radial-gradient(ellipse at center, oklch(0.18 0.04 140 / .6), transparent 70%)", filter: "blur(4px)" }}
      />
      {/* the tilt lives on an inner wrapper so the contact shadow stays flat on the ground */}
      <motion.div className="flex flex-col items-center" style={{ rotate }}>
        <img src={src} alt={name} className="object-contain" style={{ height: "min(22vh, 28vw)", width: "min(22vh, 28vw)" }} />
        <motion.span className="mt-2 whitespace-nowrap font-display text-sm tracking-[0.12em] text-foreground md:text-2xl md:tracking-[0.25em]" style={{ opacity: labelOpacity }}>
          {name.toUpperCase()}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// A copy of the hill photo laid exactly over the real one, masked to a soft, uneven patch around a note's foot and
// stacked above the notes, so the moss and grass in front of that spot cover it. Gone as soon as the note lifts off.
function Grounding({ p, hillsY, it, W, H }: { p: MotionValue<number>; hillsY: MotionValue<string>; it: Note; W: number; H: number }) {
  const opacity = useTransform(p, [it.lift, it.lift + 0.01], [1, 0]);
  const { x, ground, size } = groundPx(it, W, H);
  const [bw, bh] = it.bury ?? [0, 0];
  const rx = bw * size, ry = bh * size;
  // centred on the ground line; a few overlapping lobes for a grassy top
  const cy = ground;
  const lobe = (dx: number, dy: number, sx: number, sy: number) =>
    `radial-gradient(${rx * sx}px ${ry * sy}px at ${x + dx * rx}px ${cy + dy * ry}px, black 55%, transparent 100%)`;
  const mask = [lobe(0, 0.15, 1, 1), lobe(-0.45, -0.05, 0.5, 1.05), lobe(0.4, 0, 0.55, 1.1), lobe(0.05, -0.1, 0.35, 1.15)].join(", ");
  return (
    <motion.img
      src={hillsFront}
      alt=""
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-cover object-top"
      // above the notes' layer (z-30), below the header
      style={{ zIndex: 35, y: hillsY, opacity, maskImage: mask, WebkitMaskImage: mask, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat" }}
    />
  );
}

function Drop({ p, k, fs }: { p: MotionValue<number>; k: number; fs: number }) {
  // three drops: each forms at the stem tip (~15vh), swells, falls into the bottle mouth (45vh)
  const o = 0.78 + k * 0.022;
  const y = useTransform(p, [o, o + 0.008, o + 0.018], [`${18 * fs - 3}vh`, `${18 * fs - 0.5}vh`, "44vh"]);
  const opacity = useTransform(p, [o - 0.002, o + 0.002, o + 0.016, o + 0.019], [0, 1, 1, 0]);
  const scaleY = useTransform(p, [o, o + 0.008, o + 0.013, o + 0.018], [0.3, 1, 1.4, 0.8]);
  const scaleX = useTransform(p, [o, o + 0.008, o + 0.013, o + 0.018], [0.3, 1, 0.75, 1.2]);
  const ring = useTransform(p, [o + 0.017, o + 0.03], [0, 1]);
  const ringScale = useTransform(ring, [0, 1], [0.2, 2.4]);
  const ringOpacity = useTransform(ring, [0, 0.2, 1], [0, 0.9, 0]);
  const size = k === 1 ? 1.15 : k === 2 ? 0.85 : 1;
  return (
    <>
      <motion.div
        className="absolute left-1/2 top-0 z-[25] -translate-x-1/2"
        style={{
          y, opacity, scaleX, scaleY, height: `${2.6 * size}rem`, width: `${1.5 * size}rem`,
          borderRadius: "50% 50% 50% 50% / 65% 65% 35% 35%",
          background: "radial-gradient(circle at 35% 65%, oklch(0.97 0.05 90) 0%, oklch(0.82 0.15 85) 35%, oklch(0.62 0.15 70) 100%)",
          boxShadow: "var(--shadow-gold)",
          clipPath: "polygon(50% 0, 64% 28%, 100% 65%, 100% 100%, 0 100%, 0 65%, 36% 28%)",
        }}
      />
      <motion.div
        className="absolute left-1/2 top-[45vh] z-[24] h-3 w-10 -translate-x-1/2 rounded-[50%] border-2"
        style={{ scale: ringScale, opacity: ringOpacity, borderColor: "oklch(0.82 0.15 85)" }}
      />
    </>
  );
}

// Finale geometry in px from the viewport: a compact group of round marble columns sized to the bottles
// (white centre in front, taller green/black ones behind), all running to the floor. Also where the centre
// bottle hovers and lands.
const BOTTLE_H = 0.5; // centre bottle group is 50vh tall before scaling (origin at its bottom)
const CAP_RISE = 0.085; // the cap sits 8.5vh above the group's top
const BOTTLE_ASPECT = 848 / 1264; // centre bottle body image
const SIDE_ASPECT = 547 / 900; // cut-out side bottle images
const COLUMN = 1.55; // column width / bottle width

function finaleLayout(W: number, H: number) {
  // full visual height of our bottle incl. cap; on phones capped so both side bottles stay fully on screen
  // (side columns may still bleed off the edges)
  const total = Math.min(0.34 * H, 0.53 * W);
  const scale = total / ((BOTTLE_H + CAP_RISE) * H);
  const bottleW = BOTTLE_ASPECT * BOTTLE_H * H * scale;
  const cw = bottleW * COLUMN;
  const sideBottleH = total * 0.85;
  const sideBottleW = sideBottleH * SIDE_ASPECT;
  const sw = sideBottleW * COLUMN;

  // low enough that the landed bottle's cap ends below where the drop scene left it, so the move reads as a descent
  const centerTop = 0.73 * H;
  const sideTop = 0.65 * H;
  // bottles stand a little behind the middle of the elliptical top face
  const centerSeat = centerTop + capHeight(cw) * 0.72;
  const sideSeat = sideTop + capHeight(sw) * 0.72;
  const offset = cw / 2 + sw * 0.3;
  // hover never above the start (no upward hop) and never touching the rising column
  const startTop = (0.45 - CAP_RISE) * H;
  const hoverTop = Math.max(startTop, centerTop - 0.02 * H - total * 1.06);
  const hoverTotal = Math.min(total * 1.06, centerTop - 0.01 * H - hoverTop);
  return {
    centerTop, sideTop, sideSeat, scale, sideBottleH, sideBottleW,
    // cap-top positions: where the drop scene left it (45vh, full size), hovering just above the stone, landed
    startTop,
    hoverTop,
    landTop: centerSeat - total * 0.975,
    hoverScale: hoverTotal / ((BOTTLE_H + CAP_RISE) * H),
    H,
    center: { x: W / 2, w: cw },
    left: { x: W / 2 - offset, w: sw },
    right: { x: W / 2 + offset, w: sw },
  };
}

// Viewport size for the scroll scene. Height is the *large* viewport (100lvh, same as CSS vh), and it only updates
// when the width changes: on iPhone the address bar showing/hiding fires resize with a new innerHeight on every
// scroll direction change, and re-laying out the whole scene mid-scroll made it stutter.
function useViewport() {
  const [vp, setVp] = useState({ W: 1440, H: 900 });
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100lvh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const measure = () => ({ W: window.innerWidth, H: probe.offsetHeight || window.innerHeight });
    let last = measure();
    setVp(last);
    const f = () => {
      const next = measure();
      if (next.W !== last.W) setVp((last = next));
    };
    window.addEventListener("resize", f);
    return () => {
      window.removeEventListener("resize", f);
      probe.remove();
    };
  }, []);
  return vp;
}

// Soft contact shadow where a bottle meets the stone: a wide blurred pool plus a tight dark core.
function SeatShadow({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <>
      <div className="absolute rounded-[50%]" style={{ left: x, top: y, width: w * 1.3, height: w * 0.26, transform: "translate(-50%, -45%)", background: "radial-gradient(ellipse at center, oklch(0.08 0.02 150 / .7), transparent 70%)", filter: "blur(5px)" }} />
      <div className="absolute rounded-[50%]" style={{ left: x, top: y, width: w * 0.9, height: w * 0.08, transform: "translate(-50%, -50%)", background: "oklch(0.06 0.02 150 / .75)", filter: "blur(2px)" }} />
    </>
  );
}

// the back-to-top button only appears once the scroll story is over
const pastStory = () => ((document.querySelector("main > div.relative") as HTMLElement | null)?.offsetHeight ?? 0) - window.innerHeight / 2;

function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-[60] flex items-center justify-center px-3 py-5 md:px-12">
      <div className="font-display text-2xl tracking-[0.25em] md:text-4xl">AZUR</div>
      {/* shortcut past the scroll story for visitors who came to order */}
      <Link
        to="/mirisi"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-gold bg-ivory/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-navy shadow-sm backdrop-blur transition-colors hover:bg-gold md:right-12 md:px-5 md:py-2 md:text-xs"
      >
        Svi mirisi
      </Link>
    </header>
  );
}

