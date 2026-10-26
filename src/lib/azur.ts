import raw from "@/data/perfumes.json";

export const WHATSAPP = "38762685993";
export const WHATSAPP_DISPLAY = "+387 62 685-993";
export const INSTAGRAM = "azur_luxury_fragrances";
export const PRICE_RANGE = "55–85 KM";

/** Website credit shown in the footer ("Dizajn i izrada: …"); hidden while `name` is empty. */
export const CREDIT: { name: string; url: string } = { name: "Meho Catic", url: "https://mehocatic.com" };

export function waLink(text: string, phone = WHATSAPP): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export const orderText = (perfume: string) => `Pozdrav! Želim naručiti AZUR ${perfume} (50 ml, Extrait de Parfum).`;

export type Gender = "Muški" | "Ženski" | "Unisex";
export type House = { brand: string; perfumes: { name: string; gender: Gender }[] };

// [brand, [[name, gender], ...]]: names already have the brand prefix stripped
export const HOUSES: House[] = (raw as [string, [string, Gender][]][])
  .map(([brand, list]) => ({ brand, perfumes: list.map(([name, gender]) => ({ name, gender })) }))
  .sort((a, b) => b.perfumes.length - a.perfumes.length || a.brand.localeCompare(b.brand));

export const PERFUME_COUNT = HOUSES.reduce((n, h) => n + h.perfumes.length, 0);

// lowercase, no diacritics, so "sauvage", "sauv" or "dzidzi" match regardless of how it was typed
export const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "dj");

export type Perfume = { name: string; brand: string; gender: Gender; key: string };

export const PERFUMES: Perfume[] = HOUSES.flatMap((h) =>
  h.perfumes.map((p) => ({ name: p.name, brand: h.brand, gender: p.gender, key: norm(`${p.name} ${h.brand}`) })),
);

export function searchPerfumes(query: string, limit = Infinity, list = PERFUMES): Perfume[] {
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const out: Perfume[] = [];
  for (const p of list) {
    if (words.every((w) => p.key.includes(w))) out.push(p);
    if (out.length >= limit) break;
  }
  return out;
}

/** How a perfume is written in the inquiry: "Layton (inspirisan Parfums de Marly)"; free-typed names stay as typed. */
export const perfumeLabel = (p: { name: string; brand?: string | undefined }) => (p.brand ? `${p.name} (inspirisan ${p.brand})` : p.name);

export type Delivery = "licno" | "dostava";
export const DELIVERY_LABEL: Record<Delivery, string> = { licno: "Lično u Sanskom Mostu", dostava: "Dostava" };

export function buildInquiry({ name, perfumes, delivery, note = "" }: { name: string; perfumes: string[]; delivery: Delivery; note?: string }): string {
  return [
    "Pozdrav AZUR!",
    `Ime: ${name.trim()}`,
    "Upit za (50 ml, Extrait de Parfum):",
    ...perfumes.map((p) => `• ${p}`),
    `Preuzimanje: ${DELIVERY_LABEL[delivery]}`,
    ...(note.trim() ? [`Poruka: ${note.trim()}`] : []),
  ].join("\n");
}
