# SpecCraft

## Description

Application de création et de maintenance de cahiers des charges pour des projets de développement informatiques.

## 1. Contexte & objectif

### Contexte

Un projet de développement informatique (application, backend, frontend, etc) demande la rédaction d'un cahier des charges structuré et suivi. Une rédaction classique peut amener à oublier des sections, amener à des structures différentes entre les cahiers des charges et rendre difficile le suivi des modifications.

### Objectif

Le but est d'apporter plusieurs avantages à un cahier des charges :
- Faciliter la rédaction
- Accélérer la rédaction via des suggestions IA
- Faciliter la maintenance et le suivi grâce à une traçabilité des modifications
- Rendre la lecture plus rapide, homogène et plus lisible pour une équipe

## 2. Périmètre

### Hypothèse

- L'application est utilisée par une équipe de développeurs et non développeurs
- La rédaction au format texte suffit pour un cahier des charges
- Le template est fixe et défini une fois

### Inclus

- Permet la rédaction d'un cahier des charges sous forme de sections et sous-sections
- La structure d'un cahier des charges est définie dans le fichier `template.md` de ce dossier

### N'inclus pas

- Aucune image ou autre document n'est intégrable. Le document doit rester simple, léger, pragmatique et concis.
- Le modèle de structure d'un cahier des charges n'est pas modifiable

## 3. Besoins fonctionnels

### Priorité haute

- Un utilisateur doit être authentifié
- Un utilisateur ne peut consulter, modifier et supprimer que ses propres cahiers des charges, sauf partage explicite (cf. priorité basse)
- Créer, lire, modifier et supprimer un cahier des charges
- Lister les cahiers des charges existants
- Rechercher un cahier des charges par des mots clés
- Exporter un cahier des charges au format MarkDown

### Priorité moyenne

- Chaque section modifiée devient un brouillon
- Chaque section enregistrée reste un brouillon jusqu'à publication de la nouvelle version du cahier des charges
- Un cahier des charges publié valide les brouillons, le numéro de version du cahier des charges est incrémenté

### Priorité basse

- Proposer un exemple de cahier des charges pré-rempli à la création, pour guider l'utilisateur
- Permettre la prévisualisation en lecture seule d'un autre cahier des charges existant, en vue comparative (page divisée en deux), accessible via une icône "œil" depuis la liste (Navigation)
- Permettre à un utilisateur de partager un cahier des charges avec un autre utilisateur (droits de consultation ou de modification), y compris les brouillons en cours

## 4. Besoins non fonctionnels

- Développement en local
- Déploiement en ligne
- Base de données hébergée en ligne (développement et déploiement)
- Versionning du code en suivant la méthode `GitFlow` manuellement (pas de plugin `git`)
- Utilisation de TypeScript dans tout le projet
- Code source (variables, fonctions, noms de colonnes en base) rédigé en anglais
- Performance : temps de réponse < 500ms pour les opérations CRUD, pas de contrainte de montée en charge (usage individuel)
- Disponibilité : pas de SLA formel, sauvegardes régulières de la base PostgreSQL
- Accessibilité : interface responsive (desktop + mobile), support des dernières versions de Chrome/Firefox/Edge
- Sécurité :
    - Gestion de la session via un cookie `httpOnly`, `Secure` et `SameSite`
    - Validation des données d'entrée de l'API et limitation du nombre de tentatives de connexion (rate limiting) contre le bruteforce
    - CORS restreint au domaine du frontend, avec support des credentials (cookies)
- Gestion des secrets : variables d'environnement (`.env`), jamais commitées dans le dépôt
- Observabilité : logging applicatif en production, consultable via les logs Render

## 5. Contraintes & dépendances

- Runtime : NodeJS v24
- Gestionnaire de paquets : `npm`
- Base de données : PostgreSQL
- Versionning : git et GitHub
- CI/CD : GitHub Actions
- Hébergement déploiement : `Render`

## 6. Parcours utilisateur

- Page Login : authentification uniquement, sans navigation ni contenu applicatif
- Dashboard (post-authentification) :
    - Navigation :
        - Créer un nouveau cahier des charges
        - Lister les cahiers des charges de l'utilisateur
        - Rechercher un cahier des charges par mot clé
    - Page cahier des charges :
        - Informations :
            - Nom
            - Version
            - Date de création
            - Date de dernière publication
        - Contenu :
            - Sections / Sous-sections
        - Bouton enregistrer (enregistre les brouillons)
        - Bouton publier (publie les modifications)

## 7. Architecture & aspects techniques

### Backend

- Runtime : NodeJS
- Framework : Express
- Base de données : PostgreSQL (en ligne)
- Documentation API : swagger-jsdoc + swagger-ui-express

### Frontend

- Runtime : NodeJS
- Frameworks : React/NextJS
- UI : shadcn/TailWindCSS

### Tests
- Qualité : Lint
- Compilation : Build
- Tests unitaires :
    - Backend : Jest
    - Frontend : Vitest
- Tests d'intégration backend : Supertest
- Tests E2E : Playwright
- Orchestration CI/CD : GitHub Actions

## 8. Livrables & validation

- Livrables :
    - Dépôt GitHub (code source, historique GitFlow)
    - README (installation, lancement, présentation du projet)
    - Application déployée et accessible en ligne (Render)
    - Documentation (cahier des charges, ADR, modèle de données, documentation API)
- Définition de terminé : pour chaque Pull Request, les tests CI/CD (lint, build, tests unitaires/intégration/E2E) passent

## 9. Planning & suivi

Suivi assuré via GitHub Issues / Project :
- Un GitHub Milestone par jalon, regroupant les issues correspondantes
- Un GitHub Project (board Kanban : À faire / En cours / Terminé) pour la vue d'ensemble

- Jalons :
    0. Mise en place du projet :
        - initialisation du dépôt Git/GitHub (branches `main`/`develop` selon GitFlow)
        - structure backend/frontend
        - configuration TypeScript/lint
        - connexion PostgreSQL
        - pipeline CI/CD (lint, build, tests)
        - déploiement initial sur Render
        - rédaction d'une première version du README
    1. Authentification : permettre à un utilisateur de créer un compte et de se connecter de façon sécurisée
        - migration de la table `users` (node-pg-migrate)
        - configuration de la session (express-session + connect-pg-simple)
        - inscription, connexion, déconnexion (API)
        - middleware d'authentification + utilisateur courant
        - page Login (frontend)
        - protection des routes selon l'état d'authentification
        - dashboard minimal protégé (placeholder)
    2. CRUD cahier des charges : permettre de créer, consulter, modifier et supprimer ses cahiers des charges
    3. Listing + recherche par mots clés : permettre de retrouver rapidement un cahier des charges dans sa liste
    4. Export MarkDown : permettre d'exporter un cahier des charges au format MarkDown
    5. Brouillons & publication (versionning) : introduire la notion de brouillon et de publication versionnée d'un cahier des charges
- Une branche `feature/*` (GitFlow) par jalon, liée aux issues correspondantes
- Chaque jalon fonctionnel se découpe en sous-tâches backend puis frontend (via les issues GitHub)
- Le découpage en issues d'un jalon se fait au fur et à mesure du développement, juste avant de l'attaquer, et non à l'avance pour tous les jalons : les choix techniques faits sur un jalon peuvent influencer le découpage des jalons suivants, et une planification trop détaillée en amont risquerait de devenir obsolète

## 10. Annexes

- `template.md` : structure d'un cahier des charges
- `modele-des-donnees.md` : schéma des entités et relations en base de données
- `docs/adr/` : ADR (Architecture Decision Record) justifiant les choix techniques structurants