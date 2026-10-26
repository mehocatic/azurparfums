import { useState, type ReactNode } from "react";
import { Check, MapPin, MessageCircle, Truck } from "lucide-react";
import { buildInquiry, perfumeLabel, waLink, type Delivery } from "@/lib/azur";
import { MAX_PICKED, useInquiry } from "@/lib/inquiry";
import { PerfumePicker } from "./PerfumePicker";

const DELIVERY_OPTIONS: { id: Delivery; icon: typeof MapPin; title: string; sub: string }[] = [
  { id: "licno", icon: MapPin, title: "Lično preuzimanje", sub: "Sanski Most" },
  { id: "dostava", icon: Truck, title: "Dostava", sub: "Na vašu adresu" },
];

export function InquiryForm() {
  const picked = useInquiry();
  const [name, setName] = useState("");
  const [delivery, setDelivery] = useState<Delivery>("licno");
  const [note, setNote] = useState("");

  const missing = [!name.trim() && "ime", !picked.length && "barem jedan miris"].filter(Boolean);
  const href = missing.length ? undefined : waLink(buildInquiry({ name, perfumes: picked.map(perfumeLabel), delivery, note }));

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-7 text-left text-navy">
      <Step n={1} label="Vaše ime">
        <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ime i prezime" className="field" />
      </Step>

      <Step n={2} label="Mirisi" aside={`${picked.length} / ${MAX_PICKED}`} as="div">
        <PerfumePicker />
      </Step>

      <Step n={3} label="Preuzimanje" as="div">
        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Preuzimanje">
          {DELIVERY_OPTIONS.map(({ id, icon: Icon, title, sub }) => {
            const on = delivery === id;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setDelivery(id)}
                className={`relative flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition ${on ? "border-gold bg-gold/10 shadow-[0_0_0_3px_color-mix(in_oklab,var(--gold)_15%,transparent)]" : "border-navy/12 bg-white/60 hover:border-navy/30"}`}
              >
                <Icon className={`h-5 w-5 ${on ? "text-gold" : "text-navy/40"}`} strokeWidth={1.5} />
                <span>
                  <span className="block text-sm font-medium leading-tight">{title}</span>
                  <span className="mt-0.5 block text-xs text-navy/50">{sub}</span>
                </span>
                {on && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-navy">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Step>

      <Step n={4} label="Poruka" aside="opcionalno">
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Npr. poklon pakovanje, željeni termin…" className="field resize-none" />
      </Step>

      <div className="pt-1">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!href}
          className={`flex items-center justify-center gap-3 rounded-full py-4 text-xs uppercase tracking-[0.25em] transition ${href ? "bg-navy text-gold shadow-xl shadow-navy/25 hover:-translate-y-0.5" : "pointer-events-none bg-navy/10 text-navy/40"}`}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
          Pošalji upit na WhatsApp
        </a>
        <p className="mt-3 text-center text-xs leading-relaxed text-navy/55">
          {href ? "Otvara se WhatsApp sa gotovom porukom. Cijenu i termin dogovaramo u poruci." : `Još nedostaje: ${missing.join(" i ")}.`}
        </p>
      </div>
    </form>
  );
}

// Numbered step: gold serif numeral, small-caps label, optional hint on the right.
function Step({ n, label, aside, children, as = "label" }: { n: number; label: string; aside?: string; children: ReactNode; as?: "label" | "div" }) {
  const Tag = as;
  return (
    <Tag className="block">
      <span className="mb-2.5 flex items-baseline gap-3">
        <span className="font-display text-xl italic leading-none text-gold">{String(n).padStart(2, "0")}</span>
        <span className="text-[11px] uppercase tracking-[0.25em] text-navy/70">{label}</span>
        {aside && <span className="ml-auto text-[11px] text-navy/40">{aside}</span>}
      </span>
      {children}
    </Tag>
  );
}
