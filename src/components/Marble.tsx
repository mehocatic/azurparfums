import { useId, type CSSProperties } from "react";

// Procedural marble, no image assets: thin stripes warped by turbulence become flowing veins
// (a bold set + a faint fine set) over cloudy stone.
type Variant = "white" | "green" | "black";

const PALETTE: Record<Variant, { base: string; cloud: string; vein: string; fine: string; seed: number }> = {
  white: { base: "#f2eee6", cloud: "#ddd5c6", vein: "#b58a3a", fine: "#b9b1a4", seed: 7 },
  green: { base: "#173f2e", cloud: "#2b6249", vein: "#cfe3d6", fine: "#6f9c84", seed: 23 },
  black: { base: "#121316", cloud: "#2a2c31", vein: "#dcdcdc", fine: "#5d6067", seed: 41 },
};

// colour every pixel `hex`, alpha = a·R + b (R = noise value)
function tint(hex: string, a: number, b: number) {
  const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return `0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${bl}  ${a} 0 0 0 ${b}`;
}

function Texture({ variant, angle = -28 }: { variant: Variant; angle?: number }) {
  const id = useId().replace(/:/g, "");
  const c = PALETTE[variant];
  // large slab so rotation never shows an edge, whatever the element size
  const slab = { x: -1500, y: -1500, width: 4500, height: 4500 };
  return (
    <svg className="absolute inset-0 h-full w-full" style={{ background: c.base }} aria-hidden>
      <defs>
        <filter id={`cloud${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.01" numOctaves={4} seed={c.seed} />
          <feColorMatrix values={tint(c.cloud, 1.6, -0.45)} />
        </filter>
        <filter id={`warp${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves={5} seed={c.seed + 1} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={220} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation={0.5} />
        </filter>
        <filter id={`glow${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves={5} seed={c.seed + 1} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={220} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation={3} />
        </filter>
        <filter id={`fine${id}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.016" numOctaves={4} seed={c.seed + 2} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={90} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id={`bold${id}`} width="10" height="170" patternUnits="userSpaceOnUse">
          <rect width="10" height="1.6" fill={c.vein} />
        </pattern>
        <pattern id={`thin${id}`} width="10" height="38" patternUnits="userSpaceOnUse">
          <rect width="10" height="0.7" fill={c.fine} />
        </pattern>
      </defs>
      <g transform={`rotate(${angle})`}>
        <rect {...slab} filter={`url(#cloud${id})`} />
        <rect {...slab} fill={`url(#thin${id})`} opacity={0.5} filter={`url(#fine${id})`} />
        <rect {...slab} fill={`url(#bold${id})`} opacity={0.35} filter={`url(#glow${id})`} />
        <rect {...slab} fill={`url(#bold${id})`} opacity={0.9} filter={`url(#warp${id})`} />
      </g>
    </svg>
  );
}

/** Height of the elliptical top face for a column of width `w`. */
export const capHeight = (w: number) => w * 0.2;

// Round marble column running to the floor: cylinder-shaded body plus an elliptical, lighter top face.
// Position it with `style` (left/top/width); the bottom is left to the parent (usually bottom: 0).
export function MarbleColumn({ variant, width, className = "", style }: { variant: Variant; width: number; className?: string; style?: CSSProperties }) {
  const e = capHeight(width);
  return (
    <div className={className} style={{ width, ...style }}>
      {/* body */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ top: e / 2, boxShadow: "0 0 6vh oklch(0.2 0.03 150 / 0.28)" }}
      >
        <Texture variant={variant} />
        {/* cylinder light: bright toward the middle-left, rolling into shadow at both edges */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, oklch(0 0 0 / .5), oklch(0 0 0 / .1) 18%, oklch(1 0 0 / .12) 40%, oklch(0 0 0 / .02) 60%, oklch(0 0 0 / .25) 85%, oklch(0 0 0 / .55))" }}
        />
        {/* shade just under the rim + fade toward the floor */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, oklch(0 0 0 / .28), transparent ${e * 1.4}px, transparent 55%, oklch(0 0 0 / .25))` }} />
      </div>
      {/* top face */}
      <div className="absolute inset-x-0 top-0 overflow-hidden rounded-[50%]" style={{ height: e }}>
        <Texture variant={variant} angle={-8} />
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 45% 40%, oklch(1 0 0 / .32), oklch(1 0 0 / .12) 55%, oklch(0 0 0 / .1))", boxShadow: "inset 0 -1px 1px oklch(1 0 0 / .45)" }}
        />
      </div>
    </div>
  );
}
