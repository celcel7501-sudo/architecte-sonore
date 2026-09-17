import type { HistoryItem } from "./types";

const KEY = "architecte-sonore-history";
const MAX = 24;

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      ...item,
      brief: { ...item.brief, hookMachine: item.brief?.hookMachine ?? "slogan" },
    }));
  } catch {
    return [];
  }
}

export function pushHistory(item: HistoryItem): HistoryItem[] {
  const next = [item, ...loadHistory().filter((h) => h.id !== item.id)].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}

export function removeHistory(id: string): HistoryItem[] {
  const next = loadHistory().filter((h) => h.id !== id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota */
  }
  return next;
}
