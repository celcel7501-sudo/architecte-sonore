import { FileText, Music2, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

export type MobilePane = "brief" | "score" | "install";

const TABS: { id: MobilePane; label: string; icon: typeof FileText }[] = [
  { id: "brief", label: "Brief", icon: FileText },
  { id: "score", label: "Partition", icon: Music2 },
  { id: "install", label: "App", icon: Smartphone },
];

export function AppTabBar({
  active,
  onChange,
}: {
  active: MobilePane;
  onChange: (pane: MobilePane) => void;
}) {
  return (
    <nav
      aria-label="Navigation du studio"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="grid grid-cols-3 px-2 py-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-current={selected ? "page" : undefined}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition-colors",
                selected ? "bg-elevated text-primary" : "text-subtle hover:text-muted",
              )}
            >
              <Icon className="size-5" strokeWidth={selected ? 2.2 : 1.7} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
