import { createServerFn } from "@tanstack/react-start";
import { messageForStatus, parseApiErrorBody, type StudioErrorCode } from "./api-errors";
import type { Brief, Score, StudioSkill } from "./types";

const SONG_PROMPT = `Tu es L'ARCHITECTE SONORE. Morceau francophone ORIGINAL pour Suno v5.5 Custom.

RÈGLES
1. Original. Jamais de nom d'artiste dans styleOfMusic ni dans les paroles.
2. Français vivant, rimes naturelles, pas de remplissage.
3. BANGER : hook 4–8 mots, criable, dès après le couplet 1. Titre = hook ou 3 premiers mots. Dernier refrain plus grand.
4. BANGER : hook 4–8 mots. UNE machine — celle du brief (slogan, écho, question, image-loi, voyelle, call, tribune). Pas deux machines.
5. Couplets en 4 blocs : pose, détail, tour, sortie. V1 ≠ V2. 8–16 lignes selon l'école.
6. Balises [Intro] [Verse 1] [Pre-Chorus] [Chorus] [Verse 2] [Bridge] [Final Chorus] [Outro]. Texte chanté HORS crochets. Première ligne du Chorus = hook.
7. Brief incomplet : choisis, annonce dans concept.

styleOfMusic : UN paragraphe 70–130 mots, vecteur : genre → BPM → poche → kit 3–6 → voix → UN mood → mix. Zéro négation, zéro nom propre.
excludeStyles : une ligne, 6–15 items.

JSON uniquement, clés : concept, title, hook, hookAlts, styleOfMusic, excludeStyles, lyrics, arrangement, variations, quality.`;

const INSTRUMENTAL_PROMPT = `Tu es L'ARCHITECTE SONORE, skill instrumental rap FR. Beat ORIGINAL, AUCUNE voix lead.

lyrics = structure [DJ Intro] [Verse Bed] [Hook] [Verse Bed] [Hook] [Scratch Break] [Bridge] [Final Hook] [Outro] + 1–3 lignes de texture sous chaque balise, jamais de paroles.
Motif dès 4 mesures. styleOfMusic 70–130 mots, vecteur genre → BPM → poche → kit → mood → mix. Mention instrumental en fin.
excludeStyles inclut sung vocals, rapped vocals, choir, trap hats, EDM drop.

JSON uniquement, mêmes clés que la chanson. arrangement.vocal = aucune voix.`;

const LYRIC_PROMPT = `Tu es L'ARCHITECTE SONORE, skill GÉNÉRATEUR DE LYRIQUES RAP FRANÇAIS.

Priorité : les PAROLES. Originales, parlées, imagées. Jamais de nom d'artiste, jamais de citation.

ÉCRITURE
- Français de tous les jours + images nettes (guichet, quai, cousin, journal, dalle).
- Rimes naturelles, internes OK. Pas de remplissage, pas de flex luxe.
- BANGER : hook 4–8 mots. Machine = celle du brief uniquement.
- Couplets 12–16 lignes en 4 blocs : pose, détail, tour, sortie. V1 ≠ V2.
- Bridge 4–6 lignes qui change d'angle. Dernier refrain = hook + une ligne neuve.
- Balises [Verse 1] [Pre-Chorus] [Chorus] [Verse 2] [Bridge] [Final Chorus]. Texte HORS crochets. Première ligne du Chorus = hook.

styleOfMusic : 40–80 mots seulement (genre, BPM, poche, voix). excludeStyles : une ligne courte.

JSON : concept (2 phrases sur le choix d'écriture), title, hook, hookAlts, styleOfMusic, excludeStyles, lyrics, arrangement, variations, quality.`;

function buildUserPrompt(brief: Brief): string {
  const instrumental = brief.skill === "instrumental-rap-fr";
  return `${instrumental ? "BRIEF INSTRUMENTAL" : "BRIEF DU MORCEAU"}
Skill : ${brief.skill}
Thème : ${brief.theme.trim() || "(choix professionnel dans concept)"}
Émotion : ${brief.emotion.trim() || "(à choisir)"}
Genre : ${brief.genre}
École : ${brief.school.trim() || "(aucune)"}
Machine de hook (OBLIGATOIRE, une seule) : ${brief.hookMachine || "slogan"}
Époque : ${brief.era}
${instrumental ? "Voix : aucune" : `Interprète : ${brief.performer}`}
Énergie : ${brief.energy}/10
BPM : ${brief.bpm.trim() || "choisis"}
Ambiance : ${brief.ambience.trim() || "(aucune)"}
Scratches : ${brief.scratches}
Langue : ${brief.language}
Obligatoire : ${brief.mustInclude.trim() || "(aucun)"}
Éviter : ${brief.avoid.trim() || "(aucun)"}
Durée : ${brief.duration}
Objectif : ${brief.goal}`;
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  let raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Réponse illisible");
  raw = raw.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
  return JSON.parse(raw) as unknown;
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 9): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeScore(raw: unknown, skill: StudioSkill): Score {
  if (!raw || typeof raw !== "object") throw new Error("Score incomplet");
  const o = raw as Record<string, unknown>;
  const arrangement = Array.isArray(o.arrangement)
    ? o.arrangement.map((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return {
          section: asString(r.section),
          energy: asString(r.energy),
          musical: asString(r.musical),
          vocal: asString(r.vocal),
        };
      })
    : [];
  const variations = Array.isArray(o.variations)
    ? o.variations.map((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return {
          name: asString(r.name),
          bpm: asString(r.bpm),
          instruments: asString(r.instruments),
          voice: asString(r.voice),
          energy: asString(r.energy),
          arrangement: asString(r.arrangement),
        };
      })
    : [];
  const quality = Array.isArray(o.quality)
    ? o.quality.map((row) => {
        const r = (row ?? {}) as Record<string, unknown>;
        return {
          criterion: asString(r.criterion),
          score: asNumber(r.score),
          correction: asString(r.correction),
        };
      })
    : [];
  const hookAlts = Array.isArray(o.hookAlts)
    ? o.hookAlts.map((h) => asString(h)).filter(Boolean)
    : [];
  const score: Score = {
    skill,
    concept: asString(o.concept).trim(),
    title: asString(o.title).trim(),
    hook: asString(o.hook).trim(),
    hookAlts,
    styleOfMusic: asString(o.styleOfMusic).trim(),
    excludeStyles: asString(o.excludeStyles).trim(),
    lyrics: asString(o.lyrics).trim(),
    arrangement,
    variations,
    quality,
  };
  if (!score.title || !score.hook || !score.lyrics || !score.styleOfMusic) {
    throw new Error("Champs essentiels manquants");
  }
  return score;
}

export type GenerateResult =
  | { ok: true; score: Score }
  | { ok: false; error: string; code: StudioErrorCode };

async function callStudio(
  apiKey: string,
  system: string,
  user: string,
  maxTokens: number,
): Promise<{ ok: true; text: string } | { ok: false; error: string; code: StudioErrorCode; status?: number }> {
  let res: Response;
  try {
    res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        temperature: 0.8,
        max_tokens: maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      return { ok: false, error: "La composition a dépassé le temps. Relance.", code: "timeout" };
    }
    return { ok: false, error: "Pas de liaison avec le studio. Relance.", code: "network" };
  }

  if (!res.ok) {
    let detail = "";
    try {
      detail = parseApiErrorBody(await res.text());
    } catch {
      detail = "";
    }
    console.error("[architecte] xAI", res.status, detail);
    const mapped = messageForStatus(res.status, detail);
    return { ok: false, error: mapped.error, code: mapped.code, status: res.status };
  }

  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content ?? "";
  if (!text) return { ok: false, error: "Réponse vide. Relance une passe.", code: "empty" };
  return { ok: true, text };
}

export const generateSong = createServerFn({ method: "POST" })
  .validator((input: Brief) => input)
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "La composition n'est pas disponible pour le moment.", code: "no_key" };
    }
    const skill: StudioSkill =
      data.skill === "instrumental-rap-fr"
        ? "instrumental-rap-fr"
        : data.skill === "suno"
          ? "suno"
          : data.skill === "bot"
            ? "bot"
            : data.skill === "lyrique"
              ? "lyrique"
              : "chanson";
    const system =
      skill === "instrumental-rap-fr"
        ? INSTRUMENTAL_PROMPT
        : skill === "suno"
          ? `${SONG_PROMPT}\n\nSKILL SUNO : trois champs d'abord (styleOfMusic vecteur, excludeStyles, lyrics). Première ligne du Chorus = hook.`
          : skill === "bot"
            ? `${SONG_PROMPT}

SKILL BOT — réponse d'assistant musical :
concept = 2 phrases max (ce que le bot dirait à l'utilisateur).
styleOfMusic / excludeStyles / lyrics = pack Suno collable.
Hook slogan dès le couplet 1. JSON strict, pas de markdown.`
          : skill === "lyrique"
            ? LYRIC_PROMPT
            : SONG_PROMPT;
    const user = buildUserPrompt({ ...data, skill });
    const maxTokens = skill === "instrumental-rap-fr" ? 4000 : 7000;

    let call = await callStudio(apiKey, system, user, maxTokens);
    if (!call.ok) {
      const code = call.code;
      if (code === "server" || code === "rate") {
        await new Promise((r) => setTimeout(r, code === "rate" ? 1600 : 800));
        call = await callStudio(apiKey, system, user, maxTokens);
      }
    }
    if (!call.ok) return { ok: false, error: call.error, code: call.code };

    try {
      return { ok: true, score: normalizeScore(extractJson(call.text), skill) };
    } catch {
      const retry = await callStudio(
        apiKey,
        system,
        `${user}\n\nRelance : JSON strict, mêmes clés, paroles compactes.`,
        maxTokens,
      );
      if (!retry.ok) return { ok: false, error: retry.error, code: retry.code };
      try {
        return { ok: true, score: normalizeScore(extractJson(retry.text), skill) };
      } catch {
        return { ok: false, error: "Le morceau est sorti illisible. Relance une passe.", code: "parse" };
      }
    }
  });

const PACK_PROMPT = `Tu es L'ARCHITECTE SONORE. On te donne des PAROLES déjà validées.
Tu NE réécris PAS title, hook, lyrics.
Tu produis seulement un pack Suno v5.5 :
- styleOfMusic : 70–130 mots, vecteur genre → BPM → poche → kit 3–6 → voix → un mood → mix. Zéro nom d'artiste, zéro négation.
- excludeStyles : une ligne, 6–15 items.
- concept : 1 phrase (ce que le pack change).
JSON clés : concept, styleOfMusic, excludeStyles.`;

export const packLyricsForSuno = createServerFn({ method: "POST" })
  .validator((input: { brief: Brief; score: Score }) => input)
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "La composition n'est pas disponible pour le moment.", code: "no_key" };
    }
    const user = `BRIEF
Genre : ${data.brief.genre}
École : ${data.brief.school}
Époque : ${data.brief.era}
Interprète : ${data.brief.performer}
BPM : ${data.brief.bpm}
Ambiance : ${data.brief.ambience}
Scratches : ${data.brief.scratches}
Éviter : ${data.brief.avoid}

TITRE
${data.score.title}

HOOK
${data.score.hook}

PAROLES (intouchables)
${data.score.lyrics}`;

    const call = await callStudio(apiKey, PACK_PROMPT, user, 2500);
    if (!call.ok) return { ok: false, error: call.error, code: call.code };
    try {
      const raw = extractJson(call.text) as Record<string, unknown>;
      return {
        ok: true,
        score: {
          ...data.score,
          skill: "suno",
          concept: asString(raw.concept, data.score.concept).trim() || data.score.concept,
          styleOfMusic: asString(raw.styleOfMusic).trim() || data.score.styleOfMusic,
          excludeStyles: asString(raw.excludeStyles).trim() || data.score.excludeStyles,
          title: data.score.title,
          hook: data.score.hook,
          lyrics: data.score.lyrics,
        },
      };
    } catch {
      return { ok: false, error: "Le pack Suno est illisible. Relance.", code: "parse" };
    }
  });

export type RewritePart = "hook" | "v2" | "version-c";

function sectionBody(lyrics: string, tag: string): string {
  const re = new RegExp(`\\[${tag}\\]\\s*([\\s\\S]*?)(?=\\n\\[|$)`, "i");
  return lyrics.match(re)?.[1]?.trim() ?? "";
}

function replaceSection(lyrics: string, tag: string, body: string): string {
  const re = new RegExp(`(\\[${tag}\\])\\s*[\\s\\S]*?(?=\\n\\[|$)`, "i");
  if (!re.test(lyrics)) return `${lyrics.trim()}\n\n[${tag}]\n${body.trim()}\n`;
  return lyrics.replace(re, `$1\n${body.trim()}\n`);
}

function replaceHookLines(lyrics: string, hook: string): string {
  let next = lyrics;
  for (const tag of ["Chorus", "Final Chorus", "Hook"]) {
    const body = sectionBody(next, tag);
    if (!body) continue;
    const lines = body.split("\n");
    lines[0] = hook;
    next = replaceSection(next, tag, lines.join("\n"));
  }
  return next;
}

const REWRITE_PROMPT = `Tu es L'ARCHITECTE SONORE. Relance PARTIELLE. Français original. Jamais de nom d'artiste.

Si part=hook : nouveau hook 4–8 mots + 2 hookAlts. Ne touche pas aux couplets.
Si part=v2 : uniquement un nouveau [Verse 2] 12–16 lignes (pose, détail, tour, sortie), angle différent de V1.
Si part=version-c : Version C — nouveau hook, nouveau V2, Chorus réécrit autour du hook. V1 INTERDIT de changer.

JSON selon part :
hook → { hook, hookAlts, chorusBody }
v2 → { verse2 }
version-c → { hook, hookAlts, verse2, chorusBody, concept }`;

export const rewriteScorePart = createServerFn({ method: "POST" })
  .validator((input: { brief: Brief; score: Score; part: RewritePart }) => input)
  .handler(async ({ data }): Promise<GenerateResult> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false, error: "La composition n'est pas disponible pour le moment.", code: "no_key" };
    }
    const v1 = sectionBody(data.score.lyrics, "Verse 1");
    const user = `PART : ${data.part}
Machine de hook imposée : ${data.brief.hookMachine || "slogan"}
Genre : ${data.brief.genre} · École : ${data.brief.school}
HOOK ACTUEL : ${data.score.hook}
V1 (à conserver) :
${v1 || "(absent)"}

PAROLES ACTUELLES
${data.score.lyrics}`;

    const call = await callStudio(apiKey, REWRITE_PROMPT, user, 3500);
    if (!call.ok) return { ok: false, error: call.error, code: call.code };
    try {
      const raw = extractJson(call.text) as Record<string, unknown>;
      let lyrics = data.score.lyrics;
      let hook = data.score.hook;
      let hookAlts = data.score.hookAlts;
      let title = data.score.title;
      let concept = data.score.concept;

      if (data.part === "hook" || data.part === "version-c") {
        const nextHook = asString(raw.hook).trim();
        if (nextHook) {
          hook = nextHook;
          title = nextHook.split(/\s+/).slice(0, 5).join(" ");
          lyrics = replaceHookLines(lyrics, nextHook);
        }
        const alts = Array.isArray(raw.hookAlts)
          ? raw.hookAlts.map((h) => asString(h)).filter(Boolean)
          : [];
        if (alts.length) hookAlts = alts;
        const chorus = asString(raw.chorusBody).trim();
        if (chorus) {
          lyrics = replaceSection(lyrics, "Chorus", chorus);
          lyrics = replaceSection(lyrics, "Final Chorus", chorus);
        }
      }
      if (data.part === "v2" || data.part === "version-c") {
        const verse2 = asString(raw.verse2).trim();
        if (verse2) lyrics = replaceSection(lyrics, "Verse 2", verse2);
      }
      if (data.part === "version-c") {
        const c = asString(raw.concept).trim();
        if (c) concept = c;
        if (v1) lyrics = replaceSection(lyrics, "Verse 1", v1);
      }

      return {
        ok: true,
        score: { ...data.score, title, hook, hookAlts, lyrics, concept },
      };
    } catch {
      return { ok: false, error: "La relance est illisible. Réessaie.", code: "parse" };
    }
  });
