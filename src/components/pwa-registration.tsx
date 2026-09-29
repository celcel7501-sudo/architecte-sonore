import { useEffect } from "react";

export function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || import.meta.env.DEV) return;
    navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.warn("[architecte] service worker", error);
    });
  }, []);

  return null;
}
