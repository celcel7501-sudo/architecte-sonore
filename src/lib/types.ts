import type { HookMachineId } from "./hook-machines";

export type StudioSkill = "chanson" | "instrumental-rap-fr" | "suno" | "bot" | "lyrique";

export type Brief = {
  skill: StudioSkill;
  school: string;
  hookMachine: HookMachineId;
  theme: string;
  emotion: string;
  genre: string;
  era: string;
  performer: string;
  energy: number;
  bpm: string;
  ambience: string;
  scratches: string;
  language: string;
  mustInclude: string;
  avoid: string;
  duration: string;
  goal: string;
};

export type ArrangementRow = {
  section: string;
  energy: string;
  musical: string;
  vocal: string;
};

export type Variation = {
  name: string;
  bpm: string;
  instruments: string;
  voice: string;
  energy: string;
  arrangement: string;
};

export type QualityRow = {
  criterion: string;
  score: number;
  correction: string;
};

export type Score = {
  skill: StudioSkill;
  concept: string;
  title: string;
  hook: string;
  hookAlts: string[];
  styleOfMusic: string;
  excludeStyles: string;
  lyrics: string;
  arrangement: ArrangementRow[];
  variations: Variation[];
  quality: QualityRow[];
};

export type HistoryItem = {
  id: string;
  createdAt: number;
  title: string;
  hook: string;
  brief: Brief;
  score: Score;
};

export const defaultBrief: Brief = {
  skill: "chanson",
  school: "",
  hookMachine: "slogan",
  theme: "",
  emotion: "",
  genre: "rap français narratif",
  era: "hybride",
  performer: "homme, tessiture ténor / baryton",
  energy: 6,
  bpm: "choisis",
  ambience: "",
  scratches: "subtils",
  language: "français",
  mustInclude: "",
  avoid: "clichés de luxe, name-dropping d'artistes, anglicismes gratuits, parodie",
  duration: "environ 3:00",
  goal: "tube radio",
};

export const defaultInstrumentalBrief: Brief = {
  skill: "instrumental-rap-fr",
  school: "",
  hookMachine: "slogan",
  theme: "",
  emotion: "",
  genre: "boom bap",
  era: "90s",
  performer: "instrumental — aucune voix",
  energy: 6,
  bpm: "92",
  ambience: "",
  scratches: "subtils",
  language: "français",
  mustInclude: "",
  avoid: "voix chantée, rap vocal, autotune, trap hats excessifs, EDM drop, pop",
  duration: "environ 3:00",
  goal: "beat / mix radio",
};

export function isInstrumental(value: { skill?: string } | null | undefined): boolean {
  return value?.skill === "instrumental-rap-fr";
}

export function isSunoPack(value: { skill?: string } | null | undefined): boolean {
  return value?.skill === "suno";
}
