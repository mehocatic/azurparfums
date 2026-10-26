# AZUR parfemi

Web stranica za AZUR, Extrait de Parfum mirise (50 ml) sa preuzimanjem u Sanskom Mostu i narudžbom putem WhatsApp-a.

- `/`: scroll priča o nastanku mirisa, izdvojeni mirisi, usporedba cijena, prednosti i forma za upit
- `/mirisi`: svih 888 mirisa sa pretragom i filterima, upit putem WhatsApp-a

Dizajn i izrada: [Meho Catic](https://mehocatic.com)

## Tehnologije

TanStack Start (React 19, SSR), Vite, Tailwind CSS 4, Framer Motion, Nitro za produkcijski server.

## Pokretanje

Potreban je Node.js 22+.

```sh
npm install
npm run dev       # razvoj na http://localhost:8080
npm test          # testovi
npm run build     # produkcijski build u .output/
npm run preview   # pregled builda
```

Nitro sam bira ciljnu platformu (Vercel, Netlify, Cloudflare…) kad se build pokrene na njoj, a lokalno pravi Node server (`node .output/server/index.mjs`). Platforma se može i zadati: `NITRO_PRESET=cloudflare-module npm run build`.

## Gdje je šta

| Šta | Fajl |
| --- | --- |
| Kontakt, WhatsApp broj, Instagram, cijene, potpis | `src/lib/azur.ts` |
| Lista mirisa | `src/data/perfumes.json` |
| Scroll animacija (brdo, lijevak, bočica, finale) | `src/routes/index.tsx` |
| Sekcije naslovne | `src/components/sections/` |
| Forma za upit | `src/components/InquiryForm.tsx` |
| Boje i fontovi | `src/styles.css` |
