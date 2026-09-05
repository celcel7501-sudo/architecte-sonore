import type { Brief } from "./types";

export type School = {
  id: string;
  name: string;
  blurb: string;
  patch: Partial<Brief>;
};

export const schools: School[] = [
  {
    id: "finger",
    name: "Soul cinéma",
    blurb: "96, chops soul, nappes mineures.",
    patch: {
      school: "soul cinéma 90s",
      hookMachine: "slogan",
      genre: "soul cinéma 90s",
      era: "90s",
      bpm: "96",
      energy: 7,
      scratches: "subtils",
      ambience:
        "90s French golden-age rap, dry heavy kick, snappy snare, analog round bass, three-note soul chop, minor cinematic strings on chorus, vinyl heat, 96 BPM",
    },
  },
  {
    id: "grit-nyc",
    name: "Grit NYC",
    blurb: "Chops nets, scratches, poche sèche.",
    patch: {
      school: "grit NYC",
      hookMachine: "slogan",
      genre: "boom bap",
      era: "90s",
      bpm: "94",
      energy: 7,
      scratches: "très présents",
      ambience: "dry mid-tempo boom bap, hard kick and snare, short funk chops, rhythmic scratches, dusty punchy mix, 94 BPM",
    },
  },
  {
    id: "tribune",
    name: "Tribune FR",
    blurb: "Slogan nous, voix claire.",
    patch: {
      school: "tribune FR",
      hookMachine: "tribune",
      genre: "rap conscient",
      era: "hybride",
      bpm: "92",
      energy: 6,
      scratches: "subtils",
      performer: "homme, voix tribune, diction nette",
      ambience: "French conscious rap pocket 88–96, dry drums, clear lead voice, slogan hook, 92 BPM",
    },
  },
  {
    id: "lyrique",
    name: "Lyrique 90s",
    blurb: "Image + idée, baryton.",
    patch: {
      school: "lyrique 90s FR",
      hookMachine: "image",
      genre: "rap lyrique 90s",
      era: "90s",
      bpm: "93",
      energy: 5,
      scratches: "subtils",
      performer: "homme, baryton posé, diction lyrique 90s",
      ambience: "dusty 90s French lyric boom bap, dry drums, round bass, discreet jazz chop, 93 BPM",
    },
  },
  {
    id: "melodie",
    name: "Mélodie urbaine",
    blurb: "Half-time, refrain chanté.",
    patch: {
      school: "mélodie urbaine",
      hookMachine: "voyelle",
      genre: "rap mélodique",
      era: "contemporain",
      bpm: "128",
      energy: 6,
      scratches: "aucun",
      performer: "homme, rap mélodique, autotune musical",
      ambience: "French melodic rap, half-time 808 pocket ~128, minor night pads, musical autotune, short sung hook",
    },
  },
  {
    id: "duel",
    name: "R&B duel 98",
    blurb: "62, deux voix, harpe.",
    patch: {
      school: "R&B duel 98",
      hookMachine: "call",
      genre: "R&B duel",
      era: "90s",
      bpm: "62",
      energy: 5,
      scratches: "aucun",
      performer: "duo femme/femme, harmonies empilées",
      ambience: "late-90s sleek R&B, 62 BPM, rhythmic synth harp, Rhodes, round bass, stacked snare, swung hats, two female leads",
    },
  },
  {
    id: "club",
    name: "Club house 98",
    blurb: "124 four-on-the-floor.",
    patch: {
      school: "club house 98",
      hookMachine: "call",
      genre: "R&B club",
      era: "hybride",
      bpm: "124",
      energy: 7,
      scratches: "aucun",
      performer: "duo femme/femme, harmonies empilées",
      ambience: "French R&B club-house, 124 BPM, four-on-the-floor, stacked snare on 2 and 4, Rhodes stabs, harp motif, call-and-response",
    },
  },
  {
    id: "rer",
    name: "Rails RER",
    blurb: "90, snare-porte, quai.",
    patch: {
      school: "rails RER",
      hookMachine: "image",
      genre: "boom bap",
      era: "90s",
      bpm: "90",
      energy: 6,
      scratches: "subtils",
      ambience: "dusty boom bap 90 BPM, metallic rail texture as color, door-close snare, round bass, tunnel hiss, open center",
    },
  },
];
