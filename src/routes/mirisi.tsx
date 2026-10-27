import { Link, createFileRoute } from "@tanstack/react-router";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { AddToInquiry } from "@/components/AddToInquiry";
import { InquiryForm } from "@/components/InquiryForm";
import { ScrollTop } from "@/components/ScrollTop";
import { pageHead } from "@/lib/seo";
import { Contact } from "@/components/sections/Contact";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { HOUSES, PERFUMES, PERFUME_COUNT, searchPerfumes, type Gender } from "@/lib/azur";
import { useInquiry } from "@/lib/inquiry";

export const Route = createFileRoute("/mirisi")({
  head: () =>
    pageHead({
      title: `Svi mirisi (${PERFUME_COUNT}) | AZUR parfemi`,
      description: `Pretražite svih ${PERFUME_COUNT} AZUR mirisa: muški, ženski i unisex, inspirisani Xerjoff, Creed, Tom Ford, Dior… Dodajte mirise u upit i pošaljite na WhatsApp.`,
      path: "/mirisi",
    }),
  component: Mirisi,
});

const BY_NAME = [...HOUSES].sort((a, b) => a.brand.localeCompare(b.brand, "bs"));

type Filter = Gender | "Svi";
const FILTERS: Filter[] = ["Svi", "Muški", "Ženski", "Unisex"];
const COUNT: Record<Filter, number> = {
  Svi: PERFUMES.length,
  Muški: PERFUMES.filter((p) => p.gender === "Muški").length,
  Ženski: PERFUMES.filter((p) => p.gender === "Ženski").length,
  Unisex: PERFUMES.filter((p) => p.gender === "Unisex").length,
};
const matches = (p: { gender: Gender }, filter: Filter) => filter === "Svi" || p.gender === filter;

function Mirisi() {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const [filter, setFilter] = useState<Filter>("Svi");
  const hits = useMemo(() => searchPerfumes(dq).filter((p) => matches(p, filter)), [dq, filter]);
  const houses = useMemo(
    () =>
      BY_NAME.map((h) => ({
        ...h,
        perfumes: h.perfumes.filter((p) => matches(p, filter)),
      })).filter((h) => h.perfumes.length > 0),
    [filter],
  );
  const searching = dq.trim().length > 0;
  const picked = useInquiry();
  const listRef = useRef<HTMLElement>(null);
  // typing deep in the list: jump back up so the results are in view
  const backToList = () => {
    const top = (listRef.current?.offsetTop ?? 0) - 150;
    if (window.scrollY > top) window.scrollTo({ top });
  };
  const onSearch = (v: string) => {
    setQ(v);
    backToList();
  };
  const onFilter = (f: Filter) => {
    setFilter(f);
    backToList();
  };

  return (
    <main className="min-h-screen bg-ivory text-navy">
      <div className="mx-auto max-w-4xl px-5 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-xl tracking-[0.25em]"
        >
          <ArrowLeft className="h-4 w-4 text-gold" strokeWidth={1.5} />
          AZUR
        </Link>
        <p className="mt-10 text-[10px] uppercase tracking-[0.4em] text-gold">
          Extrait de Parfum · 50 ml · 55–85 KM
        </p>
        <h1 className="mt-3 font-display text-5xl font-light md:text-7xl">Svi AZUR mirisi</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-navy/60">
          {PERFUME_COUNT} mirisa iz {HOUSES.length} kuća. Pronađite svoj miris, dodajte ga u upit
          (+) i pošaljite na WhatsApp.
        </p>
      </div>

      {/* the search is the main tool on this page: big, gold-ringed, and it stays pinned while scrolling */}
      <div className="sticky top-0 z-30 bg-ivory/90 px-5 py-3 backdrop-blur md:py-4">
        <label className="relative mx-auto block max-w-4xl">
          <Search
            className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gold"
            strokeWidth={2}
          />
          <input
            type="search"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Traži miris ili kuću…"
            aria-label="Pretraga mirisa"
            enterKeyHint="search"
            className="h-14 w-full rounded-full border-2 border-gold bg-white pl-14 pr-12 text-base text-navy shadow-lg shadow-gold/15 outline-none transition placeholder:text-navy/40 focus:ring-4 focus:ring-gold/25 md:h-16 md:text-lg [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="Obriši pretragu"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-navy/50 hover:bg-navy/5"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </label>
        {/* gender filter; it also narrows the search results */}
        <div className="no-scrollbar mx-auto mt-3 flex max-w-4xl gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilter(f)}
              aria-pressed={filter === f}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs tracking-wide transition-colors ${filter === f ? "border-navy bg-navy text-navy-foreground" : "border-navy/15 bg-white/70 text-navy/70 hover:border-navy/40"}`}
            >
              {f}
              <span className={`text-[10px] ${filter === f ? "text-gold" : "text-navy/35"}`}>
                {COUNT[f]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <section ref={listRef} className="mx-auto max-w-4xl px-5 pb-28 pt-4">
        {searching ? (
          <div className="mt-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-navy/45">
              {hits.length
                ? `${hits.length} ${hits.length % 10 === 1 && hits.length % 100 !== 11 ? "rezultat" : "rezultata"}`
                : "Nema rezultata"}
            </p>
            {hits.length > 0 ? (
              <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
                {hits.map((p) => (
                  <Row
                    key={`${p.brand}|${p.name}`}
                    name={p.name}
                    brand={p.brand}
                    gender={p.gender}
                    showBrand
                  />
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-navy/60">
                Nema ga na listi? Upišite ga direktno u upit, provjerit ćemo za vas.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {houses.map((h) => {
              return (
                <div key={h.brand}>
                  <h2 className="flex items-baseline justify-between gap-4 border-b border-gold/40 pb-2">
                    <span className="font-display text-2xl md:text-3xl">{h.brand}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-navy/40">
                      {h.perfumes.length}
                    </span>
                  </h2>
                  <ul className="mt-1 grid gap-x-8 sm:grid-cols-2">
                    {h.perfumes.map((p) => (
                      <Row key={p.name} name={p.name} brand={h.brand} gender={p.gender} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <InquiryBar />
      <Contact withForm={false} />
      <ScrollTop after={600} raised={picked.length > 0} />
    </main>
  );
}

function Row({
  name,
  brand,
  gender,
  showBrand = false,
}: {
  name: string;
  brand: string;
  gender: Gender;
  showBrand?: boolean;
}) {
  const top = name.includes("(Top)");
  const clean = name.replace(/\s*\(Top\)/, "");
  return (
    <li className="flex items-center gap-3 border-b border-navy/5 py-2.5">
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm">
          {clean}
          {top && <span className="ml-2 text-[9px] uppercase tracking-[0.2em] text-gold">Top</span>}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.15em] text-navy/40">
          {showBrand ? `${brand} · ` : ""}
          {gender}
        </span>
      </span>
      <AddToInquiry perfume={{ name, brand }} variant="icon" />
    </li>
  );
}

// Sticky bottom bar once something is picked; opens the inquiry form in a bottom sheet.
function InquiryBar() {
  const picked = useInquiry();
  const [open, setOpen] = useState(false);
  if (!picked.length) return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:p-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto flex w-full max-w-md items-center justify-between rounded-full bg-navy px-6 py-4 text-navy-foreground shadow-2xl"
        >
          <span className="text-xs uppercase tracking-[0.25em]">
            Upit · {picked.length} {picked.length === 1 ? "miris" : "mirisa"}
          </span>
          <span className="text-xs uppercase tracking-[0.25em] text-gold">Pošalji →</span>
        </button>
      </div>
      <Drawer open={open} onOpenChange={setOpen} handleOnly shouldScaleBackground={false} repositionInputs={false}>
        <DrawerContent className="max-h-[92dvh] bg-ivory">
          <div className="mx-auto min-h-0 w-full max-w-md flex-1 overflow-y-auto overscroll-contain px-6 pb-8 pt-4">
            <DrawerTitle className="text-center font-display text-3xl font-light text-navy">
              Vaš upit
            </DrawerTitle>
            <DrawerDescription className="mt-1 text-center text-xs text-navy/55">
              Javljamo se na WhatsApp-u sa cijenom i terminom.
            </DrawerDescription>
            <div className="mt-6">
              <InquiryForm />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
