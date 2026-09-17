# 0001 - Passage au pattern BFF pour l'authentification cross-domaine

## Statut

Acceptée

## Contexte

Le frontend et le backend sont déployés sur deux sous-domaines `onrender.com` distincts (pas de domaine personnalisé partagé). La session utilisateur repose sur un cookie posé par le backend (`express-session`).

Cette séparation d'origines a deux conséquences constatées :

1. **Le cookie de session ne peut pas être lu côté serveur Next.js.** `getCurrentUser()` tente de relayer au backend le cookie reçu sur la requête entrante du frontend (`cookies()` de `next/headers`). Or ce cookie est scellé au domaine du backend, jamais à celui du frontend — le navigateur ne l'envoie donc jamais aux requêtes faites vers le frontend. En production, cela provoque une redirection systématique vers `/auth/login` après une connexion pourtant réussie (constaté via une réponse `307` sur `/dashboard`). En local, le bug n'apparaît pas : les cookies sont scellés au nom d'hôte (`localhost`) indépendamment du port, donc partagés de fait entre le frontend et le backend en dev.

2. **La configuration `sameSite: 'none'` nécessaire pour que le cookie soit envoyé en cross-site désactive la protection CSRF que `SameSite` est censé apporter.** Le cahier des charges demande un cookie `httpOnly`, `Secure` et `SameSite` — `none` respecte la lettre de cette exigence mais pas son intention : il ne protège plus contre rien.

Le premier point est un bug bloquant, le second un compromis de sécurité déjà présent en production indépendamment de ce bug. Les deux ont la même cause racine : le navigateur communique directement avec deux origines différentes pour une même session.

## Options considérées

- **Domaine personnalisé partagé** (ex. `app.domaine.xyz` / `api.domaine.xyz`), permettant un cookie avec `Domain=.domaine.xyz` partagé entre sous-domaines. Écartée : ajoute une dépendance externe (achat de domaine, DNS) hors du périmètre déclaré au cahier des charges (section 5 : Render, Neon, GitHub uniquement).
- **Authentification par token** (JWT en header `Authorization` plutôt que cookie de session). Écartée : contredit directement l'exigence du cahier des charges d'une session gérée via cookie `httpOnly`/`Secure`/`SameSite`.
- **Pattern BFF (Backend For Frontend)** : le navigateur ne communique qu'avec le domaine du frontend ; celui-ci relaie les appels vers le backend côté serveur. Retenue.

## Décision

Le frontend Next.js devient le seul point de contact du navigateur pour tous les appels à l'API. Les requêtes vers `/auth/*` (et plus généralement vers le backend) passent par des rewrites Next.js (`next.config.js`), qui les relaient côté serveur vers le backend Express.

Cette couche existe déjà : le frontend tourne comme serveur Node (`next start`) pour les besoins des Server Actions — aucun service ni conteneur supplémentaire n'est ajouté à l'infrastructure Render. Le backend Express n'est pas modifié.

Conséquence directe : du point de vue du navigateur, les appels API deviennent same-origin. Le cookie de session peut à nouveau être scellé au domaine du frontend, et `sameSite: 'lax'` redevient possible et effectif en production (plus besoin de `none`).

## Conséquences

**Positif :**
- Résout le bug de redirection (`getCurrentUser()` lira un cookie effectivement présent sur la requête entrante).
- Restaure une protection CSRF réelle en production (`sameSite: 'lax'` au lieu de `'none'`).
- Aucune nouvelle brique d'infrastructure ni dépendance externe.

**À surveiller :**
- Le serveur Next.js devient un intermédiaire réseau pour chaque appel API (latence marginale ajoutée par le relais).
- `client.ts` doit être adapté pour appeler une URL relative au frontend plutôt que l'URL absolue du backend (`NEXT_PUBLIC_BACKEND_URL` n'a alors plus vocation à être exposée au navigateur).
- La configuration CORS du backend (`FRONTEND_ORIGIN`) devient inutile pour ce flux (les appels ne sont plus cross-origin) mais peut rester en place si le backend doit encore être appelable directement pour d'autres besoins.
