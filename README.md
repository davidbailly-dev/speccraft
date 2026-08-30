# SpecCraft

Application de création et de maintenance de cahiers des charges pour des projets de développement informatiques.

## Démo

- Frontend : https://speccraft-frontend-ebxd.onrender.com
- Backend (API) : https://speccraft-f41v.onrender.com
- Health check : https://speccraft-f41v.onrender.com/health

## Stack technique

- **Backend** : Node.js, Express, TypeScript, PostgreSQL
- **Frontend** : Node.js, Next.js, TypeScript, TailwindCSS

## Installation

### Prérequis

- Node.js v24
- npm
- Une base de données PostgreSQL

### Backend

```bash
cd backend
npm install
cp .env.example .env  # renseigner DATABASE_URL
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Qualité et tests

Dans chaque dossier (`backend/`, `frontend/`) :

```bash
npm run lint
npm run test
npm run build
```

## Documentation

- [Cahier des charges](docs/project/cahier-des-charges.md)
- [Modèle de données](docs/project/modele-des-donnees.md)
- ADR : `docs/adr/` (à venir)
