import { memo, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/field";
import { HOOK_MACHINES } from "@/lib/hook-machines";
import { PRESET_FAMILIES, familyOf, presets, type PresetFamilyId } from "@/lib/presets";
import { schools } from "@/lib/schools";
import type { Brief, StudioSkill } from "@/lib/types";
import { defaultBrief, defaultInstrumentalBrief, isInstrumental } from "@/lib/types";
import { cn } from "@/lib/utils";

const SKILLS: { id: StudioSkill; label: string; short: string }[] = [
  { id: "chanson", label: "Chanson", short: "Banger vocal" },
  { id: "lyrique", label: "Lyriques", short: "Plume rap FR" },
  { id: "instrumental-rap-fr", label: "Instrumental", short: "Beat sans voix" },
  { id: "suno", label: "Suno", short: "Pack trois champs" },
  { id: "bot", label: "Bot", short: "Direction complète" },
];

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-10 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-line bg-transparent text-muted hover:border-[#5b5548] hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

function SectionTitle({ number, title, detail }: { number: string; title: string; detail?: string }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-lg italic text-primary">{number}</span>
        <h2 className="text-xs font-semibold tracking-[0.18em] text-fg uppercase">{title}</h2>
      </div>
      {detail ? <p className="text-right text-[11px] text-subtle">{detail}</p> : null}
    </div>
  );
}

function Field({ children }: { children: ReactNode }) {
  return <div className="grid gap-2">{children}</div>;
}

export const BriefForm = memo(function BriefForm({
  brief,
  onChange,
  onSubmit,
  generating,
  activePresetId,
  onPreset,
}: {
  brief: Brief;
  onChange: (next: Brief) => void;
  onSubmit: () => void;
  generating: boolean;
  activePresetId: string | null;
  onPreset: (id: string) => void;
}) {
  const [family, setFamily] = useState<PresetFamilyId | "tous">("tous");
  const beat = isInstrumental(brief);
  const set = (patch: Partial<Brief>) => onChange({ ...brief, ...patch });
  const visiblePresets = useMemo(
    () =>
      presets.filter((preset) => {
        if (isInstrumental(preset.brief) !== beat) return false;
        if (family === "tous") return true;
        return familyOf(preset) === family;
      }),
    [beat, family],
  );

  function switchSkill(skill: StudioSkill) {
    if (skill === brief.skill) return;
    const base = skill === "instrumental-rap-fr" ? defaultInstrumentalBrief : { ...defaultBrief, skill };
    onChange({
      ...base,
      theme: brief.theme,
      emotion: brief.emotion,
      mustInclude: brief.mustInclude,
    });
    setFamily("tous");
  }

  const submitLabel = beat
    ? "Composer le beat"
    : brief.skill === "suno"
      ? "Créer le pack Suno"
      : brief.skill === "bot"
        ? "Demander au bot"
        : brief.skill === "lyrique"
          ? "Écrire les lyriques"
          : "Composer le morceau";

  return (
    <form
      className="flex flex-col gap-10"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <header>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">Nouveau projet</p>
        <h1 className="mt-2 font-display text-4xl leading-none text-fg sm:text-5xl">Donne le cap.</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
          Pars d’une recette éprouvée ou règle le morceau au millimètre. Les zones vides seront tranchées par le studio.
        </p>
      </header>

      <section className="grid gap-5">
        <SectionTitle number="01" title="Mode de composition" detail="1 skill par passe" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SKILLS.map((skill) => {
            const selected = brief.skill === skill.id;
            return (
              <button
                key={skill.id}
                type="button"
                aria-pressed={selected}
                onClick={() => switchSkill(skill.id)}
                className={cn(
                  "min-h-[70px] rounded-xl border p-3 text-left transition-colors",
                  selected ? "border-primary bg-primary text-primary-foreground" : "border-line bg-surface hover:border-[#5b5548]",
                )}
              >
                <span className="block text-xs font-semibold">{skill.label}</span>
                <span className={cn("mt-1 block text-[10px]", selected ? "text-primary-foreground/70" : "text-subtle")}>
                  {skill.short}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5">
        <SectionTitle number="02" title="Point de départ" detail={`${visiblePresets.length} recettes`} />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Chip selected={family === "tous"} onClick={() => setFamily("tous")}>Tous</Chip>
          {PRESET_FAMILIES.map((item) => (
            <Chip key={item.id} selected={family === item.id} onClick={() => setFamily(item.id)}>
              {item.label}
            </Chip>
          ))}
        </div>
        {visiblePresets.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {visiblePresets.map((preset) => {
              const selected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onPreset(preset.id)}
                  className={cn(
                    "min-h-[92px] rounded-xl border p-3.5 text-left transition-colors",
                    selected ? "border-primary bg-elevated" : "border-line bg-surface hover:border-[#5b5548]",
                  )}
                >
                  <span className="font-display text-base leading-tight text-fg">{preset.name}</span>
                  <span className="mt-1.5 block text-[11px] leading-4 text-muted">{preset.blurb}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line p-5 text-sm text-muted">
            Aucun preset instrumental dans cette famille. Choisis « Tous » ou une autre famille.
          </p>
        )}
      </section>

      <section className="grid gap-5">
        <SectionTitle number="03" title={beat ? "Univers du beat" : "Histoire du morceau"} detail="Le cœur du brief" />
        <Field>
          <FieldLabel htmlFor="theme" hint="Qui, où, bascule">{beat ? "Univers" : "Thème"}</FieldLabel>
          <Textarea
            id="theme"
            rows={6}
            value={brief.theme}
            onChange={(event) => set({ theme: event.target.value })}
            placeholder={beat ? "Une texture, un lieu, un mouvement…" : "Qui parle, où sommes-nous, qu’est-ce qui change ?"}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="emotion">Émotion</FieldLabel>
            <Input id="emotion" value={brief.emotion} onChange={(event) => set({ emotion: event.target.value })} placeholder="Lucide, fier, nocturne…" />
          </Field>
          <Field>
            <FieldLabel htmlFor="genre">Genre</FieldLabel>
            <Input id="genre" value={brief.genre} onChange={(event) => set({ genre: event.target.value })} placeholder="Rap soul, boom bap…" />
          </Field>
        </div>
      </section>

      <section className="grid gap-5">
        <SectionTitle number="04" title="École sonore" detail="Poche + langage" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {schools.map((school) => {
            const selected = brief.school === school.patch.school;
            return (
              <button
                key={school.id}
                type="button"
                aria-pressed={selected}
                onClick={() => set({ ...school.patch })}
                className={cn(
                  "min-h-[82px] rounded-xl border p-3 text-left transition-colors",
                  selected ? "border-primary bg-elevated" : "border-line bg-surface hover:border-[#5b5548]",
                )}
              >
                <span className="block text-xs font-semibold text-fg">{school.name}</span>
                <span className="mt-1 block text-[10px] leading-4 text-muted">{school.blurb}</span>
              </button>
            );
          })}
        </div>

        {!beat ? (
          <div className="grid gap-3 rounded-xl border border-line bg-surface p-4">
            <div>
              <p className="text-xs font-semibold text-fg">Machine de hook</p>
              <p className="mt-1 text-[11px] text-subtle">Une seule mécanique par morceau.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {HOOK_MACHINES.map((machine) => (
                <Chip
                  key={machine.id}
                  selected={brief.hookMachine === machine.id}
                  onClick={() => set({ hookMachine: machine.id })}
                >
                  {machine.label}
                </Chip>
              ))}
            </div>
            <p className="text-xs italic text-muted">
              {HOOK_MACHINES.find((machine) => machine.id === brief.hookMachine)?.hint ?? "4–8 mots, criable."}
            </p>
          </div>
        ) : null}
      </section>

      <details className="group rounded-2xl border border-line bg-surface/50" open>
        <summary className="flex min-h-14 list-none items-center justify-between gap-4 px-4 sm:px-5">
          <span>
            <span className="text-xs font-semibold tracking-[0.15em] text-fg uppercase">Réglages de studio</span>
            <span className="ml-2 text-[11px] text-subtle">BPM, voix, contraintes</span>
          </span>
          <ChevronDown className="size-4 text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="grid gap-5 border-t border-line p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="era">Époque</FieldLabel>
              <Select id="era" value={brief.era} onChange={(event) => set({ era: event.target.value })}>
                <option value="90s">90s</option>
                <option value="hybride">Hybride</option>
                <option value="contemporain">Contemporain</option>
                <option value="intemporel">Intemporel</option>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="bpm" hint="ou « choisis »">BPM</FieldLabel>
              <Input id="bpm" value={brief.bpm} onChange={(event) => set({ bpm: event.target.value })} inputMode="numeric" />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="energy" hint={`${brief.energy}/10`}>Énergie</FieldLabel>
            <input
              id="energy"
              className="range-gold h-8 w-full"
              type="range"
              min="1"
              max="10"
              step="1"
              value={brief.energy}
              onChange={(event) => set({ energy: Number(event.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-subtle"><span>Intime</span><span>Frontal</span></div>
          </Field>

          {!beat ? (
            <Field>
              <FieldLabel htmlFor="performer">Interprète</FieldLabel>
              <Input id="performer" value={brief.performer} onChange={(event) => set({ performer: event.target.value })} placeholder="Voix, tessiture, diction…" />
            </Field>
          ) : null}

          <Field>
            <FieldLabel htmlFor="ambience" hint="Palette et mix">Ambiance</FieldLabel>
            <Textarea id="ambience" rows={3} value={brief.ambience} onChange={(event) => set({ ambience: event.target.value })} placeholder="Poche, batterie, matière, espace…" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="scratches">Scratches</FieldLabel>
              <Select id="scratches" value={brief.scratches} onChange={(event) => set({ scratches: event.target.value })}>
                <option value="aucun">Aucun</option>
                <option value="subtils">Subtils</option>
                <option value="présents">Présents</option>
                <option value="très présents">Très présents</option>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="language">Langue</FieldLabel>
              <Input id="language" value={brief.language} onChange={(event) => set({ language: event.target.value })} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="duration">Durée</FieldLabel>
              <Input id="duration" value={brief.duration} onChange={(event) => set({ duration: event.target.value })} />
            </Field>
            <Field>
              <FieldLabel htmlFor="goal">Objectif</FieldLabel>
              <Input id="goal" value={brief.goal} onChange={(event) => set({ goal: event.target.value })} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="must-include">À inclure</FieldLabel>
            <Textarea id="must-include" rows={2} value={brief.mustInclude} onChange={(event) => set({ mustInclude: event.target.value })} placeholder="Mot, image, instrument ou contrainte obligatoire…" />
          </Field>
          <Field>
            <FieldLabel htmlFor="avoid">À éviter</FieldLabel>
            <Textarea id="avoid" rows={2} value={brief.avoid} onChange={(event) => set({ avoid: event.target.value })} />
          </Field>
        </div>
      </details>

      <div className="rounded-2xl border border-primary/25 bg-primary/[0.045] p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-primary/25 text-primary">
            <WandSparkles className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-fg">Prêt pour une passe complète</p>
            <p className="mt-1 text-xs leading-5 text-muted">Titre, hook, arrangement, variations et pack Style / Exclude / Lyrics.</p>
          </div>
        </div>
        <Button type="submit" disabled={generating} className="w-full gap-2">
          <Sparkles className="size-4" />
          {generating ? "Le studio compose…" : submitLabel}
        </Button>
      </div>
    </form>
  );
});
