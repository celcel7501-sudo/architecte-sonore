import { useEffect, useState } from "react";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import { ArchitectMark } from "@/components/mark";
import type { StudioSkill } from "@/lib/types";

export function EmptyScore({ skill }: { skill: StudioSkill }) {
  const beat = skill === "instrumental-rap-fr";
  const lyrique = skill === "lyrique";

  return (
    <div className="studio-grid flex min-h-[520px] flex-col justify-between rounded-2xl border border-line bg-surface/35 p-6 sm:p-10 lg:min-h-[calc(100dvh-132px)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-subtle uppercase">Partition vierge</p>
        <span className="rounded-full border border-line px-3 py-1 text-[10px] text-muted">Suno v5.5</span>
      </div>
      <div className="max-w-lg py-16">
        <ArchitectMark className="mb-8 size-16 text-primary/60" />
        <h1 className="font-display text-4xl leading-[1.02] text-fg sm:text-5xl">
          {beat ? "Le beat attend son architecture." : lyrique ? "Les mots attendent leur mesure." : "Tout commence par un brief."}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-6 text-muted">
          {beat
            ? "Choisis une école, règle la poche et pose l’univers. La sortie restera strictement instrumentale."
            : lyrique
              ? "Cadre la scène, l’émotion et la machine de hook. Le studio privilégiera les couplets et les images."
              : "Choisis un preset ou règle chaque paramètre. Tu recevras un titre, un hook, un arrangement et les trois champs prêts à coller dans Suno."}
        </p>
        <p className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-primary lg:hidden">
          <ArrowLeft className="size-4" />
          Commence dans l’onglet Brief
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-line pt-5 text-[10px] tracking-widest text-subtle uppercase">
        <span>Style</span>
        <span>Exclude</span>
        <span>Lyrics</span>
      </div>
    </div>
  );
}

const LINES = ["Trace le concept…", "Taille le hook…", "Écrit les couplets…", "Monte l’arrangement…"];

export function LoadingScore({ skill }: { skill: StudioSkill }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((value) => value + 1), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="studio-grid flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-line bg-surface/35 px-6 py-16 text-center lg:min-h-[calc(100dvh-132px)]">
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
        <ArchitectMark className="relative size-20 animate-spin-slow text-primary" />
      </div>
      <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-subtle uppercase">
        {skill === "instrumental-rap-fr" ? "Composition instrumentale" : "Composition en cours"}
      </p>
      <p className="mt-3 font-display text-3xl italic text-fg">{LINES[tick % LINES.length]}</p>
      <div className="mt-8 flex gap-2" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={`size-1.5 rounded-full bg-primary ${index === tick % 4 ? "opacity-100" : "opacity-20"}`} />
        ))}
      </div>
      <p className="mt-5 text-xs text-muted">La passe peut prendre jusqu’à deux minutes. Garde le studio ouvert.</p>
    </div>
  );
}

export function ErrorScore({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex min-h-[520px] flex-col justify-center rounded-2xl border border-line bg-surface/35 p-6 sm:p-10 lg:min-h-[calc(100dvh-132px)]">
      <span className="grid size-12 place-items-center rounded-full border border-line text-primary">
        <Sparkles className="size-5" />
      </span>
      <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-subtle uppercase">Passe interrompue</p>
      <h1 className="mt-2 font-display text-4xl text-fg">Le studio a perdu le fil.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-8 inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
      >
        <RefreshCw className="size-4" />
        Relancer la composition
      </button>
    </div>
  );
}
