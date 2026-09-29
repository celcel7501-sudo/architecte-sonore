# L’Architecte Sonore

**L’Architecte Sonore** est un studio web mobile-first pour préparer des morceaux francophones dans **Suno v5.5 Custom / Advanced**. Un brief produit un titre, un hook, un arrangement et trois champs immédiatement copiables : **Style of Music**, **Exclude Styles** et **Lyrics**.

## Fonctions

L’application propose cinq modes de composition : chanson, lyriques rap français, instrumental sans voix, pack Suno et bot directeur. Le brief peut partir d’un preset, d’une école sonore et d’une machine de hook, puis être réglé par époque, BPM, énergie, interprète, ambiance et contraintes rédactionnelles.

La partition rend le pack Suno en trois cartes copiables séparément. Elle expose également le concept, les hooks alternatifs, l’arrangement, les variations, le contrôle qualité et les relances ciblées. L’historique est conservé uniquement dans `localStorage`, sous la clé `architecte-sonore-history`, avec un maximum de 24 compositions.

L’interface est une PWA installable. Sur mobile, la navigation utilise les onglets **Brief**, **Partition** et **App**. Sur écran large, le brief et la partition sont présentés côte à côte.

## Démarrage local

Prérequis : **Node.js 22 ou supérieur**.

```bash
npm install
cp .env.example .env
# Renseigner XAI_API_KEY dans .env
npm run dev
```

Le studio est ensuite disponible sur [http://localhost:3000](http://localhost:3000).

La clé xAI reste strictement côté serveur. Ne la préfixez jamais avec `VITE_`.

## Vérification et production

```bash
npm run check
npm run start
```

`npm run check` exécute le contrôle TypeScript puis le build de production. `npm run start` sert le bundle déjà construit via Vite Preview.

Le smoke test du parcours principal utilise Chromium installé localement :

```bash
node scripts/smoke-test.mjs
```

Il couvre l’application d’un preset, la fonction serveur, les onglets mobiles, la restauration de l’historique, les trois copies séparées et le manifeste PWA.

## Fichiers métier protégés

Les fichiers suivants sont repris **octet pour octet** depuis l’archive de référence et ne doivent pas être réécrits sans décision explicite :

| Fichier | Rôle |
| --- | --- |
| `src/lib/generate.ts` | Prompts, normalisation JSON et appels xAI |
| `src/lib/presets.ts` | Presets de composition |
| `src/lib/schools.ts` | Écoles sonores |
| `src/lib/hook-machines.ts` | Machines de hook |
| `src/lib/types.ts` | Types métier et valeurs par défaut |
| `public/skills/architecte-bot.SKILL.md` | Skill directeur |

Le schéma de sortie attendu par la génération reste : `concept`, `title`, `hook`, `hookAlts`, `styleOfMusic`, `excludeStyles`, `lyrics`, `arrangement`, `variations`, `quality`.

## Stack

React 19, TypeScript, TanStack Start, Vite 8, Tailwind CSS 4, Lucide et Sonner. Aucun compte utilisateur ni base SQL.
