import { memo, useMemo, type ReactNode } from "react";
import { ChevronDown, ListMusic, RefreshCw, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import type { RewritePart } from "@/lib/generate";
import { formatFullScore, formatSunoPack } from "@/lib/score-format";
import type { Score } from "@/lib/types";
import { isInstrumental } from "@/lib/types";

function PackField({
  number,
  label,
  text,
  large = false,
  children,
}: {
  number: string;
  label: string;
  text: string;
  large?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex min-h-14 items-center justify-between gap-4 border-b border-line px-4 sm:px-5">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg italic text-primary">{number}</span>
          <h2 className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">{label}</h2>
        </div>
        <CopyButton text={text} label={label} compact />
      </div>
      <div className={large ? "max-h-[620px] overflow-y-auto p-4 sm:p-5" : "p-4 sm:p-5"}>{children}</div>
    </section>
  );
}

function Detail({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <details className="group rounded-xl border border-line bg-surface/50">
      <summary className="flex min-h-14 list-none items-center justify-between gap-4 px-4">
        <span className="text-xs font-semibold text-fg">
          {title}
          {typeof count === "number" ? <span className="ml-2 text-subtle">{count}</span> : null}
        </span>
        <ChevronDown className="size-4 text-subtle transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-line p-4">{children}</div>
    </details>
  );
}

export const ScoreView = memo(function ScoreView({
  score,
  onPackSuno,
  packing,
  onRewrite,
  rewriting,
}: {
  score: Score;
  onPackSuno?: () => void;
  packing?: boolean;
  onRewrite?: (part: RewritePart) => void;
  rewriting?: RewritePart | null;
}) {
  const beat = isInstrumental(score);
  const pack = useMemo(() => formatSunoPack(score), [score]);
  const full = useMemo(() => formatFullScore(score), [score]);
  const busy = Boolean(packing || rewriting);
  const modeLabel = beat
    ? "Instrumental · Suno"
    : score.skill === "suno"
      ? "Pack Suno"
      : score.skill === "bot"
        ? "Réponse bot"
        : score.skill === "lyrique"
          ? "Lyriques rap FR"
          : "Partition complète";

  return (
    <article className="flex flex-col gap-6 pb-10 lg:pb-16">
      <header className="studio-grid overflow-hidden rounded-2xl border border-line bg-surface/45 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">
            <Sparkles className="size-3.5" />
            {modeLabel}
          </p>
          <span className="rounded-full border border-line bg-bg/40 px-3 py-1 text-[10px] text-muted">Prêt à coller · v5.5</span>
        </div>
        <h1 className="mt-8 max-w-3xl font-display text-5xl leading-[0.95] text-fg sm:text-6xl">{score.title}</h1>
        <p className="mt-4 font-display text-2xl italic text-primary sm:text-3xl">« {score.hook} »</p>
        <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">{score.concept}</p>

        {score.hookAlts.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {score.hookAlts.map((hook) => (
              <span key={hook} className="rounded-full border border-line bg-bg/35 px-3 py-1.5 text-[11px] text-muted">
                {hook}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-2 border-t border-line pt-5">
          <CopyButton text={pack} label="Copier le pack" className="border-primary/35 text-primary" />
          <CopyButton text={full} label="Copier tout" />
          {onPackSuno && !beat ? (
            <button
              type="button"
              onClick={onPackSuno}
              disabled={busy}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ListMusic className="size-4" />
              {packing ? "Construction…" : score.skill === "suno" ? "Repacker Suno" : "Packer pour Suno"}
            </button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-subtle uppercase">Pack Suno</p>
            <p className="mt-1 text-xs text-muted">Chaque champ se copie séparément.</p>
          </div>
          <span className="hidden text-[10px] tracking-widest text-subtle uppercase sm:block">Custom / Advanced</span>
        </div>

        <PackField number="01" label="Style of Music" text={score.styleOfMusic}>
          <p className="whitespace-pre-wrap text-sm leading-6 text-muted">{score.styleOfMusic}</p>
        </PackField>

        <PackField number="02" label="Exclude Styles" text={score.excludeStyles}>
          <p className="text-sm leading-6 text-muted">{score.excludeStyles}</p>
        </PackField>

        <PackField number="03" label={beat ? "Structure" : "Lyrics"} text={score.lyrics} large>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-fg">{score.lyrics}</pre>
        </PackField>
      </div>

      {(score.arrangement.length || score.variations.length || score.quality.length) ? (
        <section className="grid gap-3">
          <div className="px-1">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-subtle uppercase">Dossier de production</p>
          </div>

          {score.arrangement.length ? (
            <Detail title="Arrangement" count={score.arrangement.length}>
              <div className="grid gap-2">
                {score.arrangement.map((row, index) => (
                  <div key={`${row.section}-${index}`} className="grid gap-3 rounded-lg border border-line bg-bg/30 p-3 sm:grid-cols-[0.8fr_0.55fr_1.3fr_1.3fr]">
                    <p className="text-xs font-semibold text-primary">{row.section || `Section ${index + 1}`}</p>
                    <p className="text-xs text-muted"><span className="text-subtle sm:hidden">Énergie · </span>{row.energy}</p>
                    <p className="text-xs leading-5 text-muted"><span className="text-subtle sm:hidden">Musique · </span>{row.musical}</p>
                    <p className="text-xs leading-5 text-muted"><span className="text-subtle sm:hidden">Voix · </span>{row.vocal}</p>
                  </div>
                ))}
              </div>
            </Detail>
          ) : null}

          {score.variations.length ? (
            <Detail title="Variations" count={score.variations.length}>
              <div className="grid gap-3 sm:grid-cols-2">
                {score.variations.map((variation, index) => (
                  <div key={`${variation.name}-${index}`} className="rounded-lg border border-line bg-bg/30 p-4">
                    <p className="font-display text-lg text-fg">{variation.name || `Variation ${index + 1}`}</p>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs leading-5 text-muted">
                      <dt className="text-subtle">BPM</dt><dd>{variation.bpm}</dd>
                      <dt className="text-subtle">Instruments</dt><dd>{variation.instruments}</dd>
                      <dt className="text-subtle">Voix</dt><dd>{variation.voice}</dd>
                      <dt className="text-subtle">Énergie</dt><dd>{variation.energy}</dd>
                      <dt className="text-subtle">Forme</dt><dd>{variation.arrangement}</dd>
                    </dl>
                  </div>
                ))}
              </div>
            </Detail>
          ) : null}

          {score.quality.length ? (
            <Detail title="Contrôle qualité" count={score.quality.length}>
              <div className="grid gap-2">
                {score.quality.map((item, index) => (
                  <div key={`${item.criterion}-${index}`} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-line bg-bg/30 p-3">
                    <div>
                      <p className="text-xs font-semibold text-fg">{item.criterion}</p>
                      {item.correction ? <p className="mt-1 text-xs leading-5 text-muted">{item.correction}</p> : null}
                    </div>
                    <span className="font-display text-xl text-primary">{item.score}/10</span>
                  </div>
                ))}
              </div>
            </Detail>
          ) : null}
        </section>
      ) : null}

      {onRewrite && !beat ? (
        <section className="rounded-2xl border border-line bg-surface/50 p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-semibold text-fg">Relance ciblée</p>
              <p className="mt-1 text-[11px] leading-5 text-muted">Change une pièce sans repartir de zéro.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["hook", "Autre hook"],
                ["v2", "Autre V2"],
                ["version-c", "Version C"],
              ] as const
            ).map(([part, label]) => (
              <button
                key={part}
                type="button"
                disabled={busy}
                onClick={() => onRewrite(part)}
                className="min-h-11 rounded-lg border border-line px-2 text-xs font-semibold text-muted transition-colors hover:border-[#5b5548] hover:text-fg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rewriting === part ? "Relance…" : label}
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
});
