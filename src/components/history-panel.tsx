import { useEffect } from "react";
import { Clock3, Trash2, X } from "lucide-react";
import type { HistoryItem } from "@/lib/types";

const skillLabels: Record<HistoryItem["score"]["skill"], string> = {
  chanson: "Chanson",
  lyrique: "Lyriques",
  "instrumental-rap-fr": "Instrumental",
  suno: "Suno",
  bot: "Bot",
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function HistoryPanel({
  items,
  onRestore,
  onRemove,
  onClose,
}: {
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm" onMouseDown={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-bg px-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-panel sm:px-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-line">
          <div>
            <p id="history-title" className="font-display text-2xl">Historique</p>
            <p className="text-xs text-subtle">Conservé sur cet appareil · 24 maximum</p>
          </div>
          <button
            type="button"
            aria-label="Fermer l’historique"
            className="grid size-10 place-items-center rounded-full border border-line text-muted hover:text-fg"
            onClick={onClose}
          >
            <X className="size-4" />
          </button>
        </div>

        <ul className="grid gap-3 overflow-y-auto py-5">
          {items.length === 0 ? (
            <li className="grid min-h-64 place-items-center rounded-xl border border-dashed border-line px-6 text-center">
              <div>
                <Clock3 className="mx-auto mb-4 size-7 text-subtle" />
                <p className="font-display text-xl">Aucune partition</p>
                <p className="mt-1 text-sm text-muted">Ta première composition apparaîtra ici.</p>
              </div>
            </li>
          ) : (
            items.map((item) => (
              <li key={item.id} className="group rounded-xl border border-line bg-surface p-4">
                <button type="button" className="w-full text-left" onClick={() => onRestore(item)}>
                  <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-semibold tracking-widest text-subtle uppercase">
                    <span>{skillLabels[item.score.skill] ?? item.score.skill}</span>
                    <time dateTime={new Date(item.createdAt).toISOString()}>{dateFormat.format(item.createdAt)}</time>
                  </div>
                  <p className="font-display text-xl leading-tight text-fg">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm italic text-muted">« {item.hook} »</p>
                </button>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <button type="button" className="text-xs font-semibold text-primary" onClick={() => onRestore(item)}>
                    Restaurer
                  </button>
                  <button
                    type="button"
                    aria-label={`Retirer ${item.title} de l’historique`}
                    className="inline-flex items-center gap-1.5 text-xs text-subtle hover:text-fg"
                    onClick={() => onRemove(item.id)}
                  >
                    <Trash2 className="size-3.5" />
                    Retirer
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </aside>
    </div>
  );
}
