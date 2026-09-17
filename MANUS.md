# Prompt Manus — L'Architecte Sonore

Colle ce bloc dans Manus, puis joins le dossier `src/` + `public/` de cette archive.

---

Reconstruis **L'Architecte Sonore**, studio francophone pour Suno v5.5 (Custom / Advanced).

## Produit
App web mobile-first (PWA installable) qui transforme un brief en pack collable :
**Style of Music · Exclude styles · Lyrics**, plus titre, hook, arrangement, variations.

Skills :
- `chanson` — banger vocal
- `lyrique` — couplets FR prioritaires
- `instrumental-rap-fr` — beat, aucune voix
- `suno` — pack 3 champs
- `bot` — skill directeur (voir `public/skills/architecte-bot.SKILL.md`)

## Stack cible
React + TypeScript + Tailwind v4. Tu peux rester en TanStack Start **ou** basculer sur Vite + React Router. Pas d'auth, pas de base SQL : historique dans `localStorage` (`architecte-sonore-history`, max 24).

## Génération
`src/lib/generate.ts` appelle `https://api.x.ai/v1/chat/completions` (clé `XAI_API_KEY` côté serveur). Si tu n'as pas xAI, remplace par l'API dont tu disposes **sans changer les prompts système** ni le JSON de sortie :

```
concept, title, hook, hookAlts, styleOfMusic, excludeStyles, lyrics, arrangement, variations, quality
```

Règles d'écriture (intouchables) :
- Original. Aucun nom d'artiste dans le Style ni les paroles.
- Hook 4–8 mots, criable. Une seule machine de hook par morceau.
- Couplets pose / détail / tour / sortie. V1 ≠ V2.
- Balises `[Intro] [Verse 1] [Pre-Chorus] [Chorus]…`. Première ligne du Chorus = hook.
- `styleOfMusic` : 70–130 mots, vecteur genre → BPM → poche → kit → voix → mood → mix. Zéro négation.
- Instrumental : aucune voix, exclude `sung vocals, rapped vocals, choir`.

## UI
Palette : fond `#141311`, texte `#f3efe6`, or `#e8d7a8`, surface `#1c1b18`.
Fonts : Figtree (ui) + Newsreader (titres).
Mobile : barre d'onglets Brief / Partition / App (installation écran d'accueil).
Desktop : 2 colonnes brief + partition.

## Fichiers fournis (source de vérité)
Garde la logique telle quelle. Ne réécris pas les presets, écoles, machines de hook ni les prompts.

## Hors scope
Pas de Play Store / APK. Installation = PWA « Ajouter à l'écran d'accueil ».
Pas de comptes utilisateurs.

Livrable : app qui tourne, formulaire brief, composition, copie Style / Exclude / Lyrics, historique, onglet installer.
