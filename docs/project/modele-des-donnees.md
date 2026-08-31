# Modèle de données

Schéma des entités et relations en base de données PostgreSQL. Mis à jour au fil des migrations (`backend/migrations/`).

## users

| Colonne | Type | Contraintes |
|---|---|---|
| id | serial | clé primaire |
| email | varchar(255) | unique, not null |
| password_hash | varchar(255) | not null |
| created_at | timestamp | not null, default now |