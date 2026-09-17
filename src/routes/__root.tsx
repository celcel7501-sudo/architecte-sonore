import type { ReactNode } from "react";
import { HeadContent, Navigate, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PwaRegistration } from "@/components/pwa-registration";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "L’Architecte Sonore · Studio Suno v5.5" },
      { name: "description", content: "Compose un pack Suno v5.5 francophone : style, exclusions, paroles, hook et arrangement." },
      { name: "theme-color", content: "#141311" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Architecte" },
      { property: "og:title", content: "L’Architecte Sonore" },
      { property: "og:description", content: "Studio francophone pour Suno v5.5." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,500&display=swap",
      },
    ],
  }),
  errorComponent: AppErrorComponent,
  notFoundComponent: () => <Navigate to="/" />,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <PwaRegistration />
      <Toaster theme="dark" position="top-center" richColors />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
