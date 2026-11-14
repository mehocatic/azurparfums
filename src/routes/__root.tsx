import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import cormorant300 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2?url";
import jost400 from "@fontsource/jost/files/jost-latin-400-normal.woff2?url";
import { HOME_DESCRIPTION, HOME_TITLE, SITE_NAME, pageHead } from "../lib/seo";

// Shared shell for the 404 and error screens, in the site's own look.
function Message({ code, title, text, children }: { code: string; title: string; text: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-6 text-center text-navy">
      <div className="max-w-md">
        <div className="font-display text-2xl tracking-[0.25em]">AZUR</div>
        <p className="mt-12 font-display text-7xl font-light italic text-gold">{code}</p>
        <h1 className="mt-4 font-display text-3xl font-light">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-navy/60">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

const primaryBtn = "rounded-full bg-navy px-6 py-3 text-xs uppercase tracking-[0.25em] text-gold transition hover:-translate-y-0.5";
const secondaryBtn = "rounded-full border border-navy/25 px-6 py-3 text-xs uppercase tracking-[0.25em] text-navy transition-colors hover:border-gold hover:text-gold";

function NotFoundComponent() {
  return (
    <Message code="404" title="Stranica nije pronađena" text="Stranica koju tražite ne postoji ili je premještena.">
      <Link to="/" className={primaryBtn}>
        Na početnu
      </Link>
      <Link to="/mirisi" className={secondaryBtn}>
        Svi mirisi
      </Link>
    </Message>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Message code="Ups" title="Stranica se nije učitala" text="Nešto je pošlo po zlu. Pokušajte ponovo ili se vratite na početnu.">
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className={primaryBtn}
      >
        Pokušaj ponovo
      </button>
      <a href="/" className={secondaryBtn}>
        Na početnu
      </a>
    </Message>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#13213b" },
      { name: "author", content: SITE_NAME },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "bs_BA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      // fallback for pages without their own; route heads override these
      ...pageHead({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" }).meta,
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // fonts used above the fold: fetched in parallel with the CSS instead of after it
      { rel: "preload", href: cormorant300, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "preload", href: jost400, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { rel: "icon", href: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
    scripts: [
      {
        // Netlify injects an HTML comment (and a newline) into <head>; React then fails to hydrate (error #418) and
        // re-renders the whole page on the client. Drop them before the app script runs.
        children: 'for(const n of [...document.head.childNodes])if((n.nodeType===8&&/Netlify/.test(n.data))||(n.nodeType===3&&!n.data.trim()))n.remove()',
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
