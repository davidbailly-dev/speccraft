@AGENTS.md

# SpecCraft — Contexte projet pour Claude Code

## Contexte & objectif

Démo de rédaction et de maintenance de cahiers des charges structurés, **sans backend réel** : données mockées, mais architecture pensée pour accueillir un vrai backend plus tard. Projet destiné à être présenté à des recruteurs : chaque décision d'architecture ou de logique métier doit rester compréhensible et justifiable par David.

Repart de zéro depuis un projet précédent abandonné (`speccraft-old`, full-stack Express/PostgreSQL avec authentification, jamais terminé) : périmètre resserré pour cette démo (pas d'authentification, pas de partage, pas de vue de comparaison, pas de suggestions IA), stack alignée sur `salespulse` (projet de référence pour le pattern mock frontend-only : Zod comme source de vérité des types → générateur seedé → store en mémoire → Route Handlers Next.js → hooks TanStack Query → composants).

**Stack** : Next.js 16.3.5 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, Zod v4, @faker-js/faker, lucide-react, ESLint (config flat `eslint.config.mjs`).

## Périmètre fonctionnel

- CRUD cahiers des charges (nom, sections/sous-sections selon un template fixe)
- Recherche par mot-clé
- Brouillons par section + publication versionnée (incrémente la version, horodate la publication)
- Export Markdown

Hors périmètre, volontairement : authentification, partage entre utilisateurs, vue de comparaison côte à côte, suggestions IA — toutes liées à la notion de compte/multi-utilisateur ou à un vrai backend/IA, hors de portée d'une démo mockée.

Pas de notion d'utilisateur/propriétaire : un seul jeu de données mock partagé, pas de champ `userId` ajouté par anticipation.

## État d'avancement

- [x] Jalon 0 — Bootstrap projet (scaffold Next.js, dépendances, conventions)
- [ ] Jalon 1 — Pipeline données mock (catalogue, schémas Zod, générateur, store, Route Handlers de lecture)
- [ ] Jalon 2 — Liste + recherche
- [ ] Jalon 3 — Création & suppression
- [ ] Jalon 4 — Page détail (lecture)
- [ ] Jalon 5 — Édition & brouillon
- [ ] Jalon 6 — Publication
- [ ] Jalon 7 — Export Markdown
- [ ] Jalon 8 — Polish & déploiement

## Conventions strictes

- Code (fonctions, variables, types) en **anglais** ; seuls les commentaires et messages de log sont en **français**.
- `useQuery`/`useMutation` : isoler dans de petits composants `'use client'`, jamais convertir une page entière en client component.
- Toujours vérifier avec `npx tsc --noEmit` et `npm run lint` après chaque modification.
- Ne jamais créer de commit sans validation explicite préalable.

## Ce qui doit rester compréhensible et justifiable par moi en entretien

- La logique brouillon/publication (états, transitions, incrément de version).
- L'architecture mock → futur backend (pourquoi des Route Handlers plutôt qu'un autre mécanisme, ce qui change au branchement d'un vrai backend).
- La structure du catalogue de sections (slug stable, indépendant de l'ordre d'insertion en base).

## Git

Gitflow strict — **aucune exception, même pour un changement trivial** : toujours une branche `feature/*` depuis `develop`, jamais de commit direct sur `develop`/`main`.

**Conventional Commits.** Format `<type>(<portée facultative>): <description>`. Types retenus : `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`. Description en français, à l'impératif présent (« ajoute », « corrige »), sans majuscule initiale ni point final.

## Commits

Le découpage et le titre des commits sont proposés, mais jamais créés sans validation explicite préalable.
