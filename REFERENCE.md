# L'Architecte Sonore — export Manus

Studio francophone Suno v5.5. Ce dossier est le **code métier** (UI + prompts + presets), sans la plomberie Grok App Builder (auth, PWA injectée, preview bridge).

## Contenu

```
src/components/     UI (brief, partition, onglets, install)
src/lib/            generate.ts, presets, écoles, hooks, history, types
src/routes/         page unique /
src/styles.css      tokens
public/skills/      skill bot Architecte
MANUS.md            prompt à coller dans Manus
```

## Dépendances utiles

`react` `react-dom` `lucide-react` `sonner` `clsx` `tailwind-merge` `tailwindcss` `@tanstack/react-router` (ou équivalent)

Variable serveur : `XAI_API_KEY` pour `src/lib/generate.ts`.

## Manus

1. Ouvre un nouveau projet Manus.
2. Colle le contenu de `MANUS.md`.
3. Dépose cette archive (ou le dossier `src/`).
4. Demande : « Reconstruis l'app à partir de ces fichiers et fais-la tourner. »
