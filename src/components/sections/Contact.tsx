import { Instagram, Phone } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { CREDIT, INSTAGRAM, WHATSAPP, WHATSAPP_DISPLAY } from "@/lib/azur";
import { Eyebrow, Reveal } from "./Reveal";

// `withForm={false}` on pages that already have their own inquiry form (e.g. /mirisi's bottom sheet).
export function Contact({ withForm = true }: { withForm?: boolean }) {
  return (
    <footer
      id={withForm ? "upit" : undefined}
      className={`scroll-mt-4 px-5 pb-12 text-center text-navy-foreground ${withForm ? "pt-24 md:pt-32" : "pt-16"}`}
      style={{ background: "var(--gradient-navy)" }}
    >
      {withForm && (
        <>
          <Reveal>
            <Eyebrow>Naruči svoj AZUR</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-xl font-display text-5xl font-light italic leading-tight md:text-7xl">Pošaljite upit</h2>
            <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/65">
              Odaberite mirise, a mi vam se javljamo na WhatsApp-u sa cijenom i terminom preuzimanja.
            </p>
          </Reveal>
          {/* Plain div, not <Reveal>: a framer-motion transformed ancestor can leave the form unpainted on iOS Safari when the keyboard resizes the viewport. */}
          <div className="mx-auto mt-10 max-w-md rounded-3xl bg-ivory p-6 shadow-2xl md:p-8">
            <InquiryForm />
          </div>
        </>
      )}
      <div className={`flex flex-col items-center gap-3 text-sm text-navy-foreground/70 ${withForm ? "mt-10" : ""}`}>
        <a href={`tel:+${WHATSAPP}`} className="inline-flex items-center gap-2 font-display text-2xl tracking-wide text-navy-foreground transition-colors hover:text-gold">
          <Phone className="h-4 w-4" strokeWidth={1.5} />
          {WHATSAPP_DISPLAY}
        </a>
        <a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-gold">
          <Instagram className="h-4 w-4" strokeWidth={1.5} />@{INSTAGRAM}
        </a>
      </div>
      <div className="mx-auto mt-16 max-w-3xl border-t border-navy-foreground/10 pt-8">
        <div className="font-display text-3xl tracking-[0.25em]">AZUR</div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-navy-foreground/45">
          Extrait de Parfum · Ženski i muški mirisi · Sanski Most
        </p>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 text-[11px] text-navy-foreground/40 sm:flex-row">
          <span>© {new Date().getFullYear()} AZUR. Sva prava zadržana.</span>
          {CREDIT.name && (
            <span>
              Dizajn i izrada:{" "}
              {CREDIT.url ? (
                <a href={CREDIT.url} target="_blank" rel="noreferrer" className="text-navy-foreground/70 underline-offset-4 transition-colors hover:text-gold hover:underline">
                  {CREDIT.name}
                </a>
              ) : (
                <span className="text-navy-foreground/70">{CREDIT.name}</span>
              )}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}
