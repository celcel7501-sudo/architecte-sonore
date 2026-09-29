export const HOOK_MACHINES = [
  { id: "slogan", label: "Slogan", hint: "4–8 mots, affirmation" },
  { id: "echo", label: "Écho", hint: "lead + reprise des 2 mots" },
  { id: "question", label: "Question", hint: "une question courte" },
  { id: "image", label: "Image-loi", hint: "une image qui fait loi" },
  { id: "voyelle", label: "Voyelle", hint: "voyelle tenue + 3 mots" },
  { id: "call", label: "Call", hint: "A lance, B répond" },
  { id: "tribune", label: "Tribune", hint: "slogan au pluriel nous" },
] as const;

export type HookMachineId = (typeof HOOK_MACHINES)[number]["id"];

export function machineForSchool(school: string): HookMachineId {
  const s = school.toLowerCase();
  if (s.includes("club") || s.includes("duel") || s.includes("r&b")) return "call";
  if (s.includes("tribune")) return "tribune";
  if (s.includes("intime")) return "question";
  if (s.includes("mélodie") || s.includes("melodie")) return "voyelle";
  if (s.includes("lyrique")) return "image";
  if (s.includes("velours")) return "echo";
  return "slogan";
}
