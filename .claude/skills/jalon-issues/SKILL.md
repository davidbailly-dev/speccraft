---
name: jalon-issues
description: Prépare les issues GitHub d'un jalon SpecCraft (découpage, labels, descriptions Tâches/Critères d'acceptation) à partir du cahier des charges. Utiliser quand l'utilisateur veut préparer ou découper un jalon en issues.
---

# Préparation des issues d'un jalon

Ce skill prépare les issues GitHub d'un jalon du projet SpecCraft. Il ne crée jamais rien sans confirmation explicite de l'utilisateur à chaque étape.

## Déroulement

1. **Lecture du contexte**
   - Lire la ligne d'intention du jalon demandé dans `docs/project/cahier-des-charges.md` (section 9 "Planning & suivi").
   - Lire les besoins fonctionnels et non fonctionnels associés (sections 3 et 4) pour comprendre le périmètre réel du jalon.

2. **Détection des décisions techniques manquantes**
   - Si le jalon implique un choix structurant pas encore tranché (mécanisme technique, outil, librairie, etc.), le signaler et poser la question à l'utilisateur avec 2-3 options et une recommandation, avant d'aller plus loin. Ne pas supposer un choix à sa place.

3. **Vérification de l'existant**
   - Lister les issues déjà créées pour le jalon (`gh issue list --milestone <jalon>`).
   - Si elles existent déjà, ne pas proposer de nouveau découpage ni de création — passer directement à la rédaction des descriptions (étape 6) pour les issues existantes, par correspondance de titre.

4. **Proposition du découpage en issues**
   - Une tâche précise = une issue (pas de mega-issue avec plusieurs cases à cocher indépendantes).
   - Ordonner les issues backend puis frontend, dans l'ordre logique de dépendance.
   - Présenter la liste à l'utilisateur pour relecture et ajustement avant de continuer.

5. **Proposition des labels**
   - Vérifier les labels existants du dépôt (`gh label list`) avant d'en proposer un nouveau — ne jamais inventer un label sans le signaler explicitement à l'utilisateur.
   - Appliquer le système à deux dimensions déjà en place sur ce projet : nature (`chore`, `feature`, `docs`) + couche (`backend`, `frontend`).

6. **Rédaction des descriptions**
   - Pour chaque issue, structurer la description en 2 sections obligatoires :
     - `Tâches` : liste à cocher (`- [ ]`)
     - `Critères d'acceptation` : liste des conditions de validation de l'issue
   - Cette règle est définie dans `CLAUDE.md` et dans la section 9 du cahier des charges.

7. **Revue globale**
   - Afficher l'ensemble des issues proposées (titre, labels, description complète) avant toute action GitHub.

8. **Création (uniquement sur confirmation explicite)**
   - Proposer de créer les issues via `gh issue create` (titre, labels, milestone, corps), une par une ou en lot.
   - Si l'utilisateur préfère les créer lui-même, fournir le contenu prêt à copier dans la vue Kanban GitHub.
   - Ne jamais exécuter `gh issue create` sans validation explicite de l'utilisateur : c'est une action visible côté GitHub.
