import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { searchPerfumes } from "@/lib/azur";
import { MAX_PICKED, inquiry, useInquiry } from "@/lib/inquiry";

// Type-ahead over all perfumes; picked ones are listed above it as removable rows. Anything typed can also be added as-is.
export function PerfumePicker() {
  const picked = useInquiry();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const full = picked.length >= MAX_PICKED;

  const hits = useMemo(() => searchPerfumes(q, 8), [q]);
  // suggestions + a final "add what I typed" option
  const options = q.trim() ? [...hits.map((p) => ({ name: p.name, brand: p.brand, gender: p.gender })), { name: q.trim(), brand: undefined, gender: undefined }] : [];

  const choose = (i: number) => {
    const o = options[i];
    if (!o) return;
    inquiry.add({ name: o.name, brand: o.brand });
    setQ("");
    setActive(0);
  };

  return (
    <div>
      {picked.length > 0 && (
        <ul className="mb-2.5 divide-y divide-gold/20 overflow-hidden rounded-2xl border border-gold/40 bg-gold/[0.07]">
          {picked.map((p) => (
            <li key={`${p.name}|${p.brand ?? ""}`} className="flex items-center gap-3 py-2.5 pl-4 pr-2">
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg leading-tight">{p.name}</span>
                <span className="block truncate text-[10px] uppercase tracking-[0.18em] text-navy/45">{p.brand ? `Inspirisan · ${p.brand}` : "Upisano ručno"}</span>
              </span>
              <button type="button" onClick={() => inquiry.remove(p)} aria-label={`Ukloni ${p.name}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-navy/40 transition-colors hover:bg-navy/5 hover:text-navy">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" strokeWidth={2} />
        <input
          value={q}
          disabled={full}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(a + 1, options.length - 1)));
            else if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(a - 1, 0)));
            else if (e.key === "Enter" && options.length) (e.preventDefault(), choose(active));
            else if (e.key === "Escape") setOpen(false);
          }}
          placeholder={full ? `Najviše ${MAX_PICKED} mirisa po upitu` : picked.length ? "Dodaj još jedan miris…" : "Traži: Layton, Aventus, Sauvage…"}
          role="combobox"
          aria-expanded={open && options.length > 0}
          aria-controls={listId}
          aria-label="Miris"
          className="field pl-11 disabled:opacity-50"
        />
        {open && options.length > 0 && (
          <ul id={listId} role="listbox" className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-navy/10 bg-white py-1.5 shadow-2xl">
            {options.map((o, i) => (
              <li
                key={`${o.name}|${o.brand ?? "free"}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => (e.preventDefault(), choose(i))}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2 text-sm text-navy ${i === active ? "bg-gold/15" : ""}`}
              >
                {o.brand ? (
                  <>
                    <span className="min-w-0 truncate">
                      {o.name} <span className="text-navy/50">· {o.brand}</span>
                    </span>
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.15em] text-navy/40">{o.gender}</span>
                  </>
                ) : (
                  <span className="text-navy/70">
                    Dodaj „<span className="text-navy">{o.name}</span>”
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
