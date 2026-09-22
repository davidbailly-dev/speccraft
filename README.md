# SpecCraft

SpecCraft est un outil de rédaction et de maintenance de cahiers des charges structurés pour des projets de développement informatique.

L'application s'appuie sur des données mockées : aucun backend réel n'est nécessaire pour la faire tourner, mais l'architecture est pensée pour en accueillir un par la suite.

## Fonctionnalités

- Créer, consulter, modifier et supprimer un cahier des charges
- Structurer le contenu en sections/sous-sections selon un template fixe
- Rechercher un cahier des charges par mot-clé
- Éditer une section (devient un brouillon) puis publier (valide les brouillons, incrémente la version)
- Exporter un cahier des charges au format Markdown

## Démarrer le projet

```bash
npm install
npm run dev
```

L'application est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

## Stack technique

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Faker](https://img.shields.io/badge/Faker-slategray?style=flat)

## Limites assumées

Les données sont générées en mémoire au démarrage du serveur et les modifications (brouillons, publications, créations, suppressions) vivent le temps du processus Next.js : elles sont réinitialisées à chaque redémarrage. Aucune donnée n'est persistée sur disque ou en base — c'est un choix délibéré pour une démo frontend-only.
