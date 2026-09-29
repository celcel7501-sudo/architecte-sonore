import type { Score } from "./types";
import { isInstrumental } from "./types";

export function formatSunoPack(score: Score): string {
  const lyricsLabel = isInstrumental(score) ? "STRUCTURE" : "LYRICS";
  return `TITLE
${score.title}

HOOK
${score.hook}

STYLE OF MUSIC
${score.styleOfMusic}

EXCLUDE STYLES
${score.excludeStyles}

${lyricsLabel}
${score.lyrics}`;
}

export function formatFullScore(score: Score): string {
  return `${score.concept}

# ${score.title}
${score.hook}

${formatSunoPack(score)}`;
}
