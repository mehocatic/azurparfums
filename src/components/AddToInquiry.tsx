import { Check, Plus } from "lucide-react";
import { MAX_PICKED, inquiry, scrollToInquiry, useInquiry, type Picked } from "@/lib/inquiry";

// "Dodaj u upit" toggle. `variant="link"` for cards, `variant="icon"` for dense lists.
export function AddToInquiry({ perfume, variant = "link", scroll = false }: { perfume: Picked; variant?: "link" | "icon"; scroll?: boolean }) {
  const picked = useInquiry();
  const on = picked.some((p) => p.name === perfume.name && (p.brand ?? "") === (perfume.brand ?? ""));
  const full = !on && picked.length >= MAX_PICKED;
  const click = () => {
    inquiry.toggle(perfume);
    if (!on && scroll) scrollToInquiry();
  };

  if (variant === "icon")
    return (
      <button
        type="button"
        onClick={click}
        disabled={full}
        aria-pressed={on}
        aria-label={on ? `Ukloni ${perfume.name} iz upita` : `Dodaj ${perfume.name} u upit`}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-30 ${on ? "border-gold bg-gold text-navy" : "border-navy/20 text-navy/60 hover:border-gold hover:text-gold"}`}
      >
        {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>
    );

  return (
    <button
      type="button"
      onClick={click}
      disabled={full}
      aria-pressed={on}
      className={`border-b pb-1 text-[11px] uppercase tracking-[0.3em] transition-colors disabled:opacity-40 ${on ? "border-gold text-gold" : "border-navy/40 hover:border-gold hover:text-gold"}`}
    >
      {on ? "✓ U upitu" : "Dodaj u upit"}
    </button>
  );
}
