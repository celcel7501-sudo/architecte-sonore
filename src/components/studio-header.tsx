import { Clock3 } from "lucide-react";
import { ArchitectMark } from "@/components/mark";

export function StudioHeader({
  historyCount,
  onOpenHistory,
}: {
  historyCount: number;
  onOpenHistory: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <ArchitectMark className="size-9 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="truncate font-display text-xl leading-none text-fg">L’Architecte Sonore</p>
            <p className="mt-1.5 truncate text-[10px] font-semibold tracking-[0.18em] text-subtle uppercase">
              Studio francophone · Suno v5.5
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenHistory}
          aria-label={`Ouvrir l’historique, ${historyCount} composition${historyCount === 1 ? "" : "s"}`}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-line px-3.5 text-xs font-semibold text-muted transition-colors hover:border-[#5b5548] hover:text-fg"
        >
          <Clock3 className="size-4" />
          <span className="hidden sm:inline">Historique</span>
          <span className="min-w-5 rounded-full bg-elevated px-1.5 py-0.5 text-center text-[10px] text-primary">
            {historyCount}
          </span>
        </button>
      </div>
    </header>
  );
}
