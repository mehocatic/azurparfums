import { useSyncExternalStore } from "react";

// Perfumes picked for the WhatsApp inquiry, shared by the landing page and /mirisi and kept for the browser session.
export type Picked = { name: string; brand?: string | undefined };

export const MAX_PICKED = 5;
const KEY = "azur-upit";
const EMPTY: Picked[] = [];

let picked: Picked[] = load();
const listeners = new Set<() => void>();

function load(): Picked[] {
  try {
    if (typeof window === "undefined") return EMPTY;
    const v = JSON.parse(window.sessionStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.slice(0, MAX_PICKED) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function set(next: Picked[]) {
  picked = next;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // private mode / blocked storage: selection just isn't remembered
  }
  listeners.forEach((l) => l());
}

const same = (a: Picked, b: Picked) => a.name === b.name && (a.brand ?? "") === (b.brand ?? "");

export const inquiry = {
  has: (p: Picked) => picked.some((x) => same(x, p)),
  add: (p: Picked) => {
    if (!p.name.trim() || picked.length >= MAX_PICKED || inquiry.has(p)) return;
    set([...picked, { name: p.name.trim(), brand: p.brand }]);
  },
  remove: (p: Picked) => set(picked.filter((x) => !same(x, p))),
  toggle: (p: Picked) => (inquiry.has(p) ? inquiry.remove(p) : inquiry.add(p)),
  clear: () => set([]),
};

export function useInquiry(): Picked[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => picked,
    () => EMPTY,
  );
}

export function scrollToInquiry() {
  document.getElementById("upit")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
