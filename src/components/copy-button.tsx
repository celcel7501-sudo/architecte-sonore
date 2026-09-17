import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.focus();
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("copy failed");
}

export function CopyButton({
  text,
  label,
  className,
  compact = false,
}: {
  text: string;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      aria-label={done ? `${label} copié` : `Copier ${label}`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border border-line bg-transparent text-xs font-semibold text-muted transition-colors hover:border-[#5b5548] hover:text-fg",
        compact ? "size-9 px-0" : "h-10 px-3.5",
        className,
      )}
      onClick={async () => {
        try {
          await copyText(text);
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        } catch {
          toast.error("La copie a échoué. Sélectionne le texte manuellement.");
        }
      }}
    >
      {done ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
      {compact ? <span className="sr-only">{done ? "Copié" : label}</span> : done ? "Copié" : label}
    </button>
  );
}
