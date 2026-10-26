import { INSTAGRAM, PRICE_RANGE, WHATSAPP } from "@/lib/azur";

export const SITE_URL = "https://azurparfemi.com";
export const SITE_NAME = "AZUR parfemi";
export const HOME_TITLE = "AZUR parfemi | Extrait de Parfum mirisi · Sanski Most";
export const HOME_DESCRIPTION =
  "Luksuzni AZUR parfemi inspirisani Xerjoff, Parfums de Marly, Amouage i drugim kućama. 888 mirisa, Extrait de Parfum 50 ml, 55–85 KM. Narudžba putem WhatsApp-a.";
const OG_IMAGE = { url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "AZUR parfemi: logo i tri AZUR bočice Extrait de Parfum" };

// Per-page tags for Google and for link previews (WhatsApp, Instagram, Facebook, Viber).
export function pageHead({ title, description, path }: { title: string; description: string; path: string }) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE.url },
      { property: "og:image:width", content: String(OG_IMAGE.width) },
      { property: "og:image:height", content: String(OG_IMAGE.height) },
      { property: "og:image:alt", content: OG_IMAGE.alt },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE.url },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

// Structured data so Google knows this is a perfume store in Sanski Most, and what the site is called.
export const STRUCTURED_DATA = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: SITE_NAME,
    description: "Extrait de Parfum mirisi (50 ml) inspirisani svjetskim parfemskim kućama. Narudžba putem WhatsApp-a, preuzimanje u Sanskom Mostu ili dostava.",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-192.png`,
    image: OG_IMAGE.url,
    telephone: `+${WHATSAPP}`,
    priceRange: PRICE_RANGE,
    currenciesAccepted: "BAM",
    address: { "@type": "PostalAddress", addressLocality: "Sanski Most", addressCountry: "BA" },
    sameAs: [`https://instagram.com/${INSTAGRAM}`],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "AZUR",
    url: SITE_URL,
    inLanguage: "bs",
  },
]);
