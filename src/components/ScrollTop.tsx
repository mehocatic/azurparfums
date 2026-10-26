import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Small round "back to top" button, shown once the visitor has scrolled past `after` (px, or a function of the page).
// `raised` lifts it above a bottom bar (e.g. the inquiry bar on /mirisi).
export function ScrollTop({ after = 800, raised = false }: { after?: number | (() => number); raised?: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > (typeof after === "function" ? after() : after));
    f();
    window.addEventListener("scroll", f, { passive: true });
    window.addEventListener("resize", f);
    return () => {
      window.removeEventListener("scroll", f);
      window.removeEventListener("resize", f);
    };
  }, [after]);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Nazad na vrh stranice"
      tabIndex={show ? 0 : -1}
      className={`fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-gold/70 bg-navy text-gold shadow-xl shadow-navy/30 transition-all duration-300 hover:-translate-y-0.5 md:right-8 ${raised ? "bottom-24 md:bottom-28" : "bottom-5 md:bottom-8"} ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
