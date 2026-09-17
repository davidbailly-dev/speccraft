# Template

Structure fixe d'un cahier des charges. Chaque section et sous-section est identifiée par un slug stable, servant de clé métier en base (table `sections`) : ajouter une section plus tard se fait en ajoutant une entrée à ce catalogue, sans renuméroter ni casser les cahiers des charges déjà créés.

| # | Slug | Section | Sous-section |
|---|---|---|---|
| 1 | `contexte-objectifs` | Contexte & objectifs | |
| 1.1 | `contexte` | | Contexte |
| 1.2 | `objectif` | | Objectif |
| 2 | `perimetre` | Périmètre | |
| 2.1 | `hypotheses` | | Hypothèses |
| 2.2 | `inclus` | | Inclus |
| 2.3 | `exclu` | | Exclu |
| 3 | `besoins-fonctionnels` | Besoins fonctionnels | |
| 3.1 | `priorite-haute` | | Priorité haute |
| 3.2 | `priorite-moyenne` | | Priorité moyenne |
| 3.3 | `priorite-basse` | | Priorité basse |
| 4 | `besoins-non-fonctionnels` | Besoins non fonctionnels | |
| 5 | `contraintes-dependances` | Contraintes & dépendances | |
| 6 | `parcours-utilisateur` | Parcours utilisateur | |
| 7 | `architecture-technique` | Architecture & aspects techniques | |
| 8 | `livrables-validation` | Livrables & validation | |
| 9 | `planning-suivi` | Planning & suivi | |
| 10 | `annexes` | Annexes | |

## Règles

- Le slug est la clé stable : renommer l'intitulé d'une section ne change pas son slug, ajouter une section crée un nouveau slug.
- L'ordre d'affichage est piloté par la position dans ce catalogue, pas par l'ordre d'insertion en base.
- Une section absente d'un cahier des charges existant (créé avant l'ajout de cette section au catalogue) s'affiche vide, sans erreur.
