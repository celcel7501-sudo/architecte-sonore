export type StudioErrorCode =
  | "no_key"
  | "timeout"
  | "network"
  | "auth"
  | "rate"
  | "quota"
  | "server"
  | "empty"
  | "parse"
  | "unknown";

export function messageForStatus(status: number, apiMessage = ""): {
  code: StudioErrorCode;
  error: string;
} {
  const raw = apiMessage.toLowerCase();
  if (status === 401 || status === 403) {
    return { code: "auth", error: "Accès studio refusé. Réessaie dans un instant." };
  }
  if (status === 429 || raw.includes("rate")) {
    return { code: "rate", error: "Le studio est saturé. Attends quelques secondes puis relance." };
  }
  if (status === 402 || raw.includes("quota") || raw.includes("credit")) {
    return { code: "quota", error: "Quota studio atteint. Réessaie plus tard." };
  }
  if (status === 400 || status === 422) {
    return { code: "unknown", error: "Le brief n'a pas passé. Simplifie le thème et relance." };
  }
  if (status >= 500) {
    return { code: "server", error: "Le studio a un accroc. Relance dans une minute." };
  }
  return { code: "unknown", error: `Le studio a renvoyé une erreur (${status}).` };
}

export function parseApiErrorBody(text: string): string {
  try {
    const json = JSON.parse(text) as { error?: { message?: string } | string };
    if (typeof json.error === "string") return json.error;
    if (json.error && typeof json.error.message === "string") return json.error.message;
  } catch {
    /* plain */
  }
  return text.slice(0, 280);
}
