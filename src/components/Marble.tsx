import type { CSSProperties } from "react";
import whiteBody from "@/assets/marble/white-body.webp";
import whiteTop from "@/assets/marble/white-top.webp";
import greenBody from "@/assets/marble/green-body.webp";
import greenTop from "@/assets/marble/green-top.webp";
import blackBody from "@/assets/marble/black-body.webp";
import blackTop from "@/assets/marble/black-top.webp";

// Marble textures are pre-baked webp images (veins = warped stripes over cloudy stone). They used to be live
// SVG turbulence filters, which were far too heavy for phones (iOS Safari stuttered while the columns moved).
type Variant = "white" | "green" | "black";

const TEXTURE: Record<Variant, { body: string; top: string; base: string }> = {
  white: { body: whiteBody, top: whiteTop, base: "#f2eee6" },
  green: { body: greenBody, top: greenTop, base: "#173f2e" },
  black: { body: blackBody, top: blackTop, base: "#121316" },
};

/** Height of the elliptical top face for a column of width `w`. */
export const capHeight = (w: number) => w * 0.2;

// Round marble column running to the floor: cylinder-shaded body plus an elliptical, lighter top face.
// Position it with `style` (left/top/width); the bottom is left to the parent (usually bottom: 0).
export function MarbleColumn({ variant, width, className = "", style }: { variant: Variant; width: number; className?: string; style?: CSSProperties }) {
  const e = capHeight(width);
  const t = TEXTURE[variant];
  return (
    <div className={className} style={{ width, ...style }}>
      {/* body */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          top: e / 2,
          backgroundColor: t.base,
          backgroundImage: [
            // cylinder light: bright toward the middle-left, rolling into shadow at both edges
            "linear-gradient(to right, oklch(0 0 0 / .5), oklch(0 0 0 / .1) 18%, oklch(1 0 0 / .12) 40%, oklch(0 0 0 / .02) 60%, oklch(0 0 0 / .25) 85%, oklch(0 0 0 / .55))",
            // shade just under the rim + fade toward the floor
            `linear-gradient(to bottom, oklch(0 0 0 / .28), transparent ${e * 1.4}px, transparent 55%, oklch(0 0 0 / .25))`,
            `url(${t.body})`,
          ].join(", "),
          backgroundSize: "100% 100%, 100% 100%, cover",
          boxShadow: "0 0 6vh oklch(0.2 0.03 150 / 0.28)",
        }}
      />
      {/* top face */}
      <div
        className="absolute inset-x-0 top-0 rounded-[50%]"
        style={{
          height: e,
          backgroundColor: t.base,
          backgroundImage: `radial-gradient(ellipse at 45% 40%, oklch(1 0 0 / .32), oklch(1 0 0 / .12) 55%, oklch(0 0 0 / .1)), url(${t.top})`,
          backgroundSize: "100% 100%, cover",
          boxShadow: "inset 0 -1px 1px oklch(1 0 0 / .45)",
        }}
      />
    </div>
  );
}
