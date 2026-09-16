# Suno V6 — Update Prestige (maj 16 sept. 2026)

Sources officielles (9 sept. 2026) :
- https://suno.com/release-notes/introducing-v6
- https://help.suno.com/en/articles/13924481 (v6 FAQ)

## Modèles (famille v6)
| Modèle | Accès | Rôle |
|--------|-------|------|
| **v6** | Pro / Premier | Flagship : fiable, précis, polished, suit mieux les instructions |
| **v6-wild** | Pro / Premier | Exploration : plus varié / texturé / ambitieux — ramener ensuite en v6 |
| **v6-mini** | Free + tous | Plus rapide / léger |

Tous les modèles **pré-v6 (v5 / v5.5…) sont retirés**. Bibliothèque ancienne intacte (écoute / share / remaster / cover). Nouvelles itérations = v6 only. Custom Models upgradés auto vers v6.

## Crédits
Génération v6 = **même coût** qu’avant : **2 songs / 10 crédits**. Multi-images/vidéos dans le prompt ↑ le coût. **Max Mode** = plus de crédits, pour tracks >2 min, covers fidèles, style transfer, cohérence voix/style.

## Contrôles UI importants
- **Simple Mode** : le modèle choisit le workflow (Cover / Remix / Extend…) ; multi-inputs OK (songs, playlists, audio, images, vidéo) en un shot.
- **Advanced / Create Custom** : packs Prestige (Style + Lyrics + Exclude).
- **Variety** : injecte de la variété dans le Style. Pour tags stricts Prestige → **Variety = 0**.
- **Max Mode** : qualité / longueur / fidélité cover — pas pour brouillon court.

## Nouveautés workflow (priorité Prestige)
1. **Edit section NL** — changer un passage sans tout casser  
   ex. `Change the chorus so it’s sung by a gospel choir`
2. **Single-lyric replace** — un mot / une ligne  
   ex. `Change the lyric from ‘love’ to ‘light’`
3. **Mashup multi-sources** — vocals X + drums Y + new lyrics + style
4. **Sample / isolate / beat** — ex. `Sample the riff at 0:45, isolate the guitar, build a beat around it`
5. **Vibe prompt** — `Make a song that feels like midnight on a rooftop`
6. **Multimodal** — texte + audio + image + vidéo → musique

Chaîne Prestige après gen : **Groove → Voix → Pont** (NL), pas full regen tout de suite.

## Scripts Prestige (inchangé + renforcé)
1. Create Custom → **Model: v6** (ligne obligatoire dans chaque `.txt`)
2. Style = HookGenius **5 parties** (genre/BPM → groove → motif ADN → voix → mix/arc/`Suno v6 precise instruction following`) **ou** paragraphe 70–130 mots
3. Jamais de noms d’artistes / producteurs / collectifs dans Style
4. Script `.txt` : TITLE / STYLE / EXCLUDE / COVER / LYRICS / AUDIO STRENGTH / ARC / **EDITS V6**
5. Audio Strength **0.6** défaut · **0.65–0.7** si bed chargé
6. Variety **0** si tags figés
7. Max Mode si cover fidèle / track long / cohérence duo

## Presets ADN (biblio locale)
| Preset | Fichier | BPM / pocket |
|--------|---------|--------------|
| Urban-pop clic | `adn-urban-pop-clic-v6.txt` | ~130 |
| Melodic trap 136 | `adn-melodic-trap-136-v6.txt` | 136 half-time |
| Club R&B 116 | `adn-club-rnb-116-v6.txt` | 116 |
| RnB FR banger | `adn-rnb-fr-banger-v6.txt` | ~90 |
| Finger boom-bap | `adn-djimi-finger-v6.txt` | ~96 |
| Tallac cold | `adn-tallac-empreinte-v1.txt` | ~90 |
| Syncopé futuriste | `adn-timbaland-v6.txt` | ~92–100 (abstrait) |
| HookGenius public | `PRESETS-HOOKGENIUS.md` | 12+ formules |

## Voix percutantes
Hard consonant attack, dry front-of-mix ; Exclude washed/buried.  
NL : `Make lead vocals more punchy and percussive, hard consonant attack, dry front-of-mix presence, less wet reverb, keep the same melody and lyrics`

## Arc L’onde
Montée ~0:29–1:12 · bridge explosif ~2:14–2:40

## Prestige defaults
Duo male + female **high tenor** · Cel-B ad-libs · C&R · FR diction nette

## Exports
- `COMPETENCE-GROK-SUNO.md`
- `PRESETS-INDEX.md` · `PRESETS-HOOKGENIUS.md`
- Skills : Architecte Sonore · HookGenius · Grok Suno compétence
