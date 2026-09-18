# Modèle de données

Schéma des entités et relations en base de données PostgreSQL. Mis à jour au fil des migrations (`backend/migrations/`).

## users

| Colonne | Type | Contraintes |
|---|---|---|
| id | serial | clé primaire |
| email | varchar(255) | unique, not null |
| password_hash | varchar(255) | not null |
| created_at | timestamp | not null, default now |

## specifications

| Colonne | Type | Contraintes |
|---|---|---|
| id | serial | clé primaire |
| user_id | integer | clé étrangère vers `users.id`, not null, `ON DELETE CASCADE` |
| name | varchar(255) | not null |
| version | integer | not null, default 0 (incrémenté à chaque publication) |
| created_at | timestamp | not null, default now |
| published_at | timestamp | nullable, renseigné à la publication |

## sections

Le catalogue des slugs valides (aligné sur `docs/project/template.md`) et leur validation à l'insertion vivent côté code, pas en base.

| Colonne | Type | Contraintes |
|---|---|---|
| id | serial | clé primaire |
| specification_id | integer | clé étrangère vers `specifications.id`, not null, `ON DELETE CASCADE` |
| slug | varchar(100) | not null |
| content | text | not null |
| created_at | timestamp | not null, default now |
| updated_at | timestamp | not null, default now, mis à jour automatiquement par trigger (`set_updated_at`) |

Contrainte d'unicité composite sur (`specification_id`, `slug`).

## session

Table technique gérée par `connect-pg-simple` (store de session Express).

| Colonne | Type | Contraintes |
|---|---|---|
| sid | varchar | clé primaire |
| sess | json | not null |
| expire | timestamp(6) | not null, indexée |