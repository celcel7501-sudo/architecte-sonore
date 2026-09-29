import { cn } from "@/lib/utils";

export function ArchitectMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("text-fg", className)} fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="16.5" stroke="currentColor" strokeWidth="1" opacity="0.72" />
      <circle cx="24" cy="24" r="10.5" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <circle cx="24" cy="24" r="2.6" fill="currentColor" />
    </svg>
  );
}
