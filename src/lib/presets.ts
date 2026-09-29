import type { Brief } from "./types";
import { defaultBrief, defaultInstrumentalBrief, isInstrumental } from "./types";

export type Preset = {
  id: string;
  name: string;
  blurb: string;
  brief: Brief;
};

export const PRESET_FAMILIES = [
  { id: "90s", label: "Rap 90s" },
  { id: "conscient", label: "Conscient" },
  { id: "melodie", label: "Mélodie" },
  { id: "rnb", label: "R&B club" },
  { id: "hg", label: "Suno HG" },
  { id: "v55", label: "Top v5.5" },
] as const;

export type PresetFamilyId = (typeof PRESET_FAMILIES)[number]["id"];

export function familyOf(p: Preset): PresetFamilyId {
  const s = p.brief.school ?? "";
  if (s.startsWith("hg ") || p.id.startsWith("hg-")) return "hg";
  if (s.startsWith("v55 ") || p.id.startsWith("v55-")) return "v55";
  if (s.includes("tribune") || s.includes("intime") || p.brief.genre === "rap conscient" || p.brief.skill === "lyrique")
    return "conscient";
  if (s.includes("mélodie") || p.brief.genre === "rap mélodique") return "melodie";
  if (s.includes("R&B") || s.includes("club") || p.brief.genre.startsWith("R&B") || p.brief.genre === "rap soul")
    return "rnb";
  return "90s";
}

export const presets: Preset[] = [
  {
    id: "lyrique-dalle",
    name: "Lyriques dalle",
    blurb: "16 lignes, slogan, cousin.",
    brief: {
      ...defaultBrief,
      skill: "lyrique",
      school: "lyrique 90s FR",
      theme:
        "Dalle encore chaude, cousin en bas. Hook slogan 5 mots. V1 la rue, V2 l'appart. Pas de flex.",
      emotion: "lucide, fier, posé",
      genre: "rap lyrique 90s",
      era: "90s",
      performer: "homme, baryton posé, diction lyrique 90s",
      energy: 6,
      bpm: "93",
      ambience: "dusty 90s French lyric boom bap, dry drums, 93 BPM",
      mustInclude: "dalle, cousin, refrain slogan",
      avoid: "trap, EDM, name-dropping, anglicismes",
      goal: "lyriques / clip",
    },
  },
  {
    id: "lyrique-guichet",
    name: "Lyriques tribune",
    blurb: "Guichet, journal, nous.",
    brief: {
      ...defaultBrief,
      skill: "lyrique",
      school: "tribune FR",
      theme:
        "File au guichet, journal plié. Refrain slogan nous. V1 la salle, V2 le bus du retour.",
      emotion: "ferme, collectif",
      genre: "rap conscient",
      era: "hybride",
      performer: "homme, voix tribune, diction nette",
      energy: 6,
      bpm: "92",
      ambience: "French conscious rap, dry 92 pocket, slogan hook",
      mustInclude: "guichet, journal, nous",
      avoid: "moraline, trap, EDM",
      goal: "lyriques / scène",
    },
  },
  {
    id: "finger",
    name: "Style Finger",
    blurb: "Soul cinéma 96, chop trois notes.",
    brief: {
      ...defaultBrief,
      school: "soul cinéma 90s",
      theme:
        "Fin d'après-midi, deux baffles sur une table. Fierté nette. Hook slogan dès la sortie du couplet 1. V1 la dalle, V2 le cousin.",
      emotion: "fierté, chaleur, head-nod",
      genre: "soul cinéma 90s",
      era: "90s",
      energy: 7,
      bpm: "96",
      ambience:
        "90s French golden-age rap, 96 BPM, dry heavy kick, snappy snare, analog bass, three-note soul chop, minor strings on chorus, vinyl heat",
      scratches: "subtils",
      mustInclude: "la dalle, le fil, refrain slogan",
      avoid: "trap, drill, EDM, name-dropping",
      goal: "tube radio",
    },
  },
  {
    id: "metro",
    name: "Dernier métro",
    blurb: "Grit NYC, correspondance manquée.",
    brief: {
      ...defaultBrief,
      school: "grit NYC",
      theme: "Dernière correspondance ratée. Hook image-loi. V1 le quai, V2 le bus de remplacement.",
      emotion: "lucide, froid, tendu",
      genre: "boom bap",
      era: "90s",
      energy: 6,
      bpm: "94",
      ambience: "dry boom bap 94, short chops, scratches, dusty punchy mix",
      scratches: "très présents",
      mustInclude: "quai, correspondance, dernière rame",
      avoid: "trap, EDM, flex luxe",
    },
  },
  {
    id: "tribune",
    name: "La tribune",
    blurb: "Slogan nous, scène de guichet.",
    brief: {
      ...defaultBrief,
      school: "tribune FR",
      theme: "Guichet, journal plié. Refrain slogan nous. Pas de leçon.",
      emotion: "ferme, lucide",
      genre: "rap conscient",
      era: "hybride",
      performer: "homme, voix tribune, diction nette",
      energy: 6,
      bpm: "92",
      ambience: "conscious French rap, dry 92 pocket, clear voice, slogan hook",
      mustInclude: "guichet, journal, nous",
      avoid: "moraline, trap, EDM",
    },
  },
  {
    id: "melodie",
    name: "Mélodie urbaine",
    blurb: "Half-time, hook chanté.",
    brief: {
      ...defaultBrief,
      school: "mélodie urbaine",
      theme: "Nuit d'autoroute périurbaine. Couplets talk-sung, refrain chanté court.",
      emotion: "nocturne, mélancolie claire",
      genre: "rap mélodique",
      era: "contemporain",
      performer: "homme, rap mélodique, autotune musical",
      energy: 6,
      bpm: "128",
      scratches: "aucun",
      ambience: "melodic French rap, half-time 808, night pads, musical autotune, 128 BPM",
      mustInclude: "autoroute, refrain tenu",
      avoid: "boom bap 90s, drill, EDM",
    },
  },
  {
    id: "clubhouse",
    name: "Club house 98",
    blurb: "R&B FR × piste 124.",
    brief: {
      ...defaultBrief,
      school: "club house 98",
      theme: "Salle trop basse. Deux voix, hook call. V1 l'entrée, V2 quatre heures.",
      emotion: "solaire nocturne",
      genre: "R&B club",
      era: "hybride",
      performer: "duo femme/femme, harmonies empilées",
      energy: 7,
      bpm: "124",
      scratches: "aucun",
      ambience: "French R&B club-house 124, four-on-the-floor, snare on 2 and 4, harp motif, stacked female leads",
      mustInclude: "la piste est à nous, réponds encore",
      avoid: "EDM drop, 808 glide, boom bap",
    },
  },
  {
    id: "duel98",
    name: "R&B duel 98",
    blurb: "Slow-jam 62, stacks.",
    brief: {
      ...defaultBrief,
      school: "R&B duel 98",
      theme: "Deux voix, manteau sur la chaise, dernier appel. Hook call.",
      emotion: "chic, tendu",
      genre: "R&B duel",
      era: "90s",
      performer: "duo femme/femme, harmonies empilées",
      energy: 5,
      bpm: "62",
      scratches: "aucun",
      ambience: "late-90s sleek R&B 62, harp motif, Rhodes, round bass, two female leads",
      mustInclude: "dernier appel, refrain en réponse",
      avoid: "trap, EDM, boom bap",
    },
  },
  {
    id: "hg-boombap",
    name: "HG Boom bap",
    blurb: "92 dusty piano chop.",
    brief: {
      ...defaultBrief,
      school: "hg boom bap",
      theme: "MC sur piano chop poussiéreux. Hook slogan. Ville de nuit.",
      emotion: "confiant, dusty",
      genre: "boom bap",
      era: "90s",
      energy: 7,
      bpm: "92",
      ambience: "boom bap, dusty jazz piano chop, punchy drums, vinyl, confident male rap, 92 BPM",
      mustInclude: "piano chop, vinyle",
      avoid: "trap, EDM, name-dropping",
    },
  },
  {
    id: "v55-golden",
    name: "v5.5 Golden 90",
    blurb: "MPC chops, snare punch.",
    brief: {
      ...defaultBrief,
      school: "v55 golden",
      theme: "Âge d'or boom bap. Chop MPC. Hook slogan. Quartier de nuit.",
      emotion: "brut, classique",
      genre: "boom bap",
      era: "90s",
      energy: 7,
      bpm: "90",
      ambience: "boom bap hip hop 90 BPM, MPC-style jazz chops, punchy snare, vinyl crackle, raw head-nod",
      mustInclude: "chop MPC, snare",
      avoid: "trap, EDM, name-dropping",
    },
  },
  {
    id: "finger-beat",
    name: "Finger beat",
    blurb: "96 cinéma, centre MC.",
    brief: {
      ...defaultInstrumentalBrief,
      school: "soul cinéma 90s",
      theme: "Lit soul cinéma 96. Chop trois notes dès la mesure 1. Aucune voix.",
      emotion: "chaud, head-nod",
      genre: "soul cinéma 90s",
      era: "90s",
      energy: 7,
      bpm: "96",
      ambience: "French golden-age boom bap instrumental, 96 BPM, soul chop motif, dry drums, open center, no vocals",
      mustInclude: "chop trois notes, centre ouvert",
      avoid: "voix, trap, EDM",
      goal: "fond de freestyle",
    },
  },
  {
    id: "rer-beat",
    name: "RER beat",
    blurb: "Quai, 90, snare-porte.",
    brief: {
      ...defaultInstrumentalBrief,
      school: "rails RER",
      theme: "Instrumental de correspondance. Motif métal court. Aucune voix.",
      emotion: "froid, lucide",
      genre: "boom bap",
      era: "90s",
      energy: 6,
      bpm: "90",
      ambience: "dusty boom bap 90, metallic motif, door-close snare, open center, no vocals",
      mustInclude: "motif métal, centre ouvert",
      avoid: "voix, field recording brute, trap",
      goal: "fond de freestyle",
    },
  },
  {
    id: "v55-lofi-beat",
    name: "v5.5 Lo-fi 80",
    blurb: "Rhodes, vinyle, zero voix.",
    brief: {
      ...defaultInstrumentalBrief,
      school: "v55 lofi",
      theme: "Lit étude 80. Rhodes, brushes, vinyle. Aucune voix.",
      emotion: "chill",
      genre: "jazz-rap dusty",
      era: "90s",
      energy: 3,
      bpm: "80",
      scratches: "aucun",
      ambience: "lo-fi boom bap instrumental, warm Rhodes, brushed drums, vinyl, 80 BPM, no vocals",
      mustInclude: "Rhodes, vinyle",
      avoid: "voix, trap, EDM",
      goal: "fond de freestyle",
    },
  },
];

export function presetsFor(beat: boolean, family: PresetFamilyId | "tous") {
  return presets.filter((p) => {
    if (isInstrumental(p.brief) !== beat) return false;
    if (family === "tous") return true;
    return familyOf(p) === family;
  });
}
