# SpecCraft

SpecCraft est un outil de rédaction et de maintenance de cahiers des charges structurés pour des projets de développement informatique.

**Démo en ligne :** [speccraft-ww9f.onrender.com](https://speccraft-ww9f.onrender.com)

L'application s'appuie sur des données mockées (aucun backend réel n'est nécessaire pour la faire tourner) mais l'architecture est pensée pour en accueillir un par la suite : schémas Zod comme source de vérité des types, Route Handlers Next.js jouant le rôle d'API, hooks TanStack Query côté client — remplacer le mock par un vrai backend ne demande de toucher qu'à la couche Route Handlers. Exception assumée : l'assistance IA à la rédaction (voir ci-dessous) appelle un vrai service externe, seule brique non mockée du projet.

Projet de démonstration : volontairement sans authentification ni notion de compte (un seul jeu de données mock partagé), pour rester focalisé sur le cœur de métier.

## Pages

- **Liste** (`/`) — les cahiers des charges existants, recherche par mot-clé, création et suppression
- **Détail** (`/specifications/[id]`) — informations du cahier des charges (nom, version, dates), édition de son contenu section par section, brouillon et publication, export au format Markdown

## Fonctionnalités

- Créer, consulter, modifier et supprimer un cahier des charges
- Structurer le contenu en sections/sous-sections selon un template fixe
- Rechercher un cahier des charges par mot-clé
- Éditer une section (devient un brouillon une fois enregistrée) puis publier (valide les brouillons en attente, incrémente la version)
- Exporter un cahier des charges au format Markdown
- Assistance IA à la rédaction (Gemini, quota gratuit) : génération section par section ou pré-remplissage de tout le cahier des charges à partir d'un brief projet, avec un format adapté par section (paragraphe, liste à puces ou étapes numérotées)

## Démarrer le projet

```bash
npm install
npm run dev
```

L'application est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

### Assistance IA (optionnel)

L'assistance IA à la rédaction appelle l'API Gemini (quota gratuit, aucune carte bancaire requise) :

1. Récupérer une clé API sur [aistudio.google.com](https://aistudio.google.com) (bouton « Get API key »).
2. Créer un fichier `.env.local` à la racine du projet :
   ```
   GEMINI_API_KEY=ta_clé
   ```
3. Redémarrer `npm run dev`.

Sans cette clé, le reste de l'application (CRUD, recherche, brouillon, publication, export) fonctionne normalement — seule la génération IA renvoie une erreur explicite.

## Stack technique

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Faker](https://img.shields.io/badge/Faker-slategray?style=flat)
![Lucide](https://img.shields.io/badge/Lucide-F56565?style=flat&logo=lucide&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-886FBF?style=flat)

## Déploiement

Un seul service web Render (`render.yaml` à la racine, plan gratuit), déployé automatiquement à chaque commit sur `main`. Variable d'environnement requise : `GEMINI_API_KEY` (clé API Gemini, saisie manuellement dans le dashboard Render — jamais commitée).

Le plan gratuit met le service en veille après 15 minutes d'inactivité (~1 minute pour redémarrer au prochain accès) : la donnée mockée étant régénérée en mémoire à chaque démarrage, ce comportement se combine naturellement avec la limite ci-dessous plutôt que de la contredire.

## Limites assumées

Les données sont générées en mémoire au démarrage du serveur et les modifications (brouillons, publications, créations, suppressions) vivent le temps du processus Next.js : elles sont réinitialisées à chaque redémarrage. Aucune donnée n'est persistée sur disque ou en base — c'est un choix délibéré pour une démo frontend-only.

L'assistance IA repose sur le tier gratuit de l'API Gemini (modèle `gemini-3.1-flash-lite` par défaut) : quota limité (15 requêtes/minute, 500/jour), et le modèle peut occasionnellement refuser une génération en cas de forte demande sur le tier gratuit. Le pré-remplissage global espace ses appels et continue sur les sections suivantes en cas d'échec ponctuel (sections en échec listées et relançables individuellement), mais reste soumis à cette limite. Le contenu généré atterrit toujours dans le brouillon de la section, jamais publié automatiquement.
