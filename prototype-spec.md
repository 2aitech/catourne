# Prototype Spec - Casting Maroc (FR)

## 1) Objectif du prototype

Valider rapidement qu’une marketplace de casting locale peut:
- attirer des performeurs qui complètent leur profil,
- permettre à des recruteurs de publier des offres,
- générer des candidatures qualifiées avec un tri simple.

Le prototype doit être **utilisable de bout en bout** (pas seulement maquette).

## 2) Périmètre du prototype (in)

### 2.1 Rôles supportés
- `performer`
- `recruiter` (producteur/directeur de casting)
- `admin` (modération basique)

### 2.2 Fonctionnalités incluses
- Inscription/connexion email + mot de passe.
- Création/édition profil performeur.
- Création/édition/publish d’offre côté recruteur.
- Listing des offres publiques avec filtres simples.
- Candidature à une offre.
- Gestion statut candidature côté recruteur.
- Notifications email minimales (événements critiques).
- Back-office admin minimal (signalement + suspension).

### 2.3 IA incluse (version prototype)
- Suggestions textuelles de bio profil (assistées IA).
- Génération d’une première version de description d’offre.
- Modération texte basique (classification risque faible/moyen/élevé).

### 2.4 Hors périmètre (out)
- Paiements et abonnements.
- Messagerie riche temps réel.
- App mobile native.
- Matching IA avancé multi-critères en production.

## 3) Architecture prototype

### 3.1 Monorepo
- `packages/app`: SPA métier (performers + recruteurs + admin léger).
- `packages/api`: API REST, auth, logique métier, accès DB.
- `packages/www`: non implémenté dans ce prototype (landing plus tard).

### 3.2 Choix techniques
- Bun + TypeScript.
- DB relationnelle (PostgreSQL recommandé).
- Stockage médias simple (S3-compatible ou fallback local dev).
- IA via provider externe derrière un service API interne.

### 3.3 Environnements
- `local`: dev team.
- `staging`: démo partenaires/early users.

## 4) User flows à démontrer

### 4.1 Flow A - Performeur
1. Créer un compte performeur.
2. Compléter profil (minimum requis).
3. Parcourir les offres.
4. Candidater à une offre.
5. Voir statut évoluer.

Critère de succès:
- flow réalisable en moins de 7 minutes sans support.

### 4.2 Flow B - Recruteur
1. Créer un compte recruteur.
2. Publier une offre.
3. Recevoir des candidatures.
4. Passer un candidat en `shortlisted` ou `rejected`.

Critère de succès:
- obtenir une shortlist initiale en moins de 15 minutes après publication (avec seed data).

### 4.3 Flow C - Admin
1. Recevoir un signalement.
2. Voir le contenu signalé.
3. Appliquer une action (none/warn/suspend).

Critère de succès:
- décision traçable avec log admin.

## 5) Exigences détaillées du prototype

### 5.1 Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Règles:
- email unique,
- mot de passe min 8 caractères,
- rôle choisi à l’inscription (non modifiable sans admin).

### 5.2 Profil performeur (minimum requis)
Champs obligatoires:
- nom de scène,
- ville,
- spécialité principale,
- langues,
- 1 photo,
- bio courte.

Champs optionnels:
- taille, âge de jeu, compétences secondaires, vidéo.

Règle:
- candidature autorisée uniquement si profil >= 60% complété.

### 5.3 Offres de casting (minimum requis)
Champs obligatoires:
- titre,
- type projet,
- description,
- ville,
- date limite candidature.

Champs optionnels:
- budget/rémunération,
- tranche d’âge recherchée,
- langues requises.

### 5.4 Candidatures
- 1 candidature par performeur par offre.
- statut initial: `submitted`.
- transitions autorisées:
  - `submitted -> in_review`
  - `in_review -> shortlisted`
  - `in_review -> rejected`
  - `shortlisted -> selected | rejected`

### 5.5 Admin/modération
- Création de signalement par utilisateur.
- Vue admin des signalements.
- Actions admin: `dismiss`, `warn`, `suspend`.

## 6) IA prototype (implémentation pragmatique)

### 6.1 Assistant bio profil
Entrée:
- brouillon utilisateur + spécialité + langues + expérience.

Sortie:
- 2 à 3 propositions de bio en français, ton professionnel.

### 6.2 Assistant description d’offre
Entrée:
- type projet, rôle recherché, lieu, contraintes.

Sortie:
- texte structuré prêt à éditer avant publication.

### 6.3 Modération texte
Entrée:
- contenu libre (bio, offre, message candidature).

Sortie:
- `risk_level` + catégorie + recommandation (`allow`, `review`, `block`).

Note:
- en prototype, la décision finale reste humaine pour les cas `review` et `block`.

## 7) Data model minimum

Tables minimales:
- `users(id, email, password_hash, role, created_at)`
- `performer_profiles(user_id, stage_name, city, bio, completion_score, created_at, updated_at)`
- `recruiter_profiles(user_id, company_name, description, verified, created_at, updated_at)`
- `offers(id, recruiter_user_id, title, project_type, description, city, deadline_at, status, created_at)`
- `applications(id, offer_id, performer_user_id, motivation_text, status, created_at, updated_at)`
- `reports(id, reporter_user_id, target_type, target_id, reason, status, created_at)`
- `admin_actions(id, admin_user_id, report_id, action, note, created_at)`

## 8) Écrans prototype (packages/app)

Minimum:
- `/auth/login`
- `/auth/register`
- `/performer/profile`
- `/offers`
- `/offers/:id`
- `/my-applications`
- `/recruiter/offers`
- `/recruiter/offers/new`
- `/recruiter/offers/:id/applications`
- `/admin/reports`

## 9) API endpoints minimum (packages/api)

- `POST /auth/register`
- `POST /auth/login`
- `GET /offers`
- `GET /offers/:id`
- `POST /offers` (recruiter)
- `PATCH /offers/:id` (recruiter owner)
- `POST /offers/:id/publish` (recruiter owner)
- `POST /offers/:id/apply` (performer)
- `GET /applications/me` (performer)
- `GET /offers/:id/applications` (recruiter owner)
- `PATCH /applications/:id/status` (recruiter owner)
- `POST /reports`
- `GET /admin/reports` (admin)
- `POST /admin/reports/:id/action` (admin)
- `POST /ai/suggest-profile-bio`
- `POST /ai/generate-offer-description`
- `POST /ai/moderate-text`

## 10) Plan de livraison recommandé (4-6 semaines)

### Semaine 1
- setup monorepo + auth + schéma DB initial.

### Semaine 2
- profils performeur/recruteur + upload image simple.

### Semaine 3
- offres + listing + filtres + publication.

### Semaine 4
- candidatures + pipeline statut recruteur.

### Semaine 5
- admin signalements + IA assistive de base.

### Semaine 6 (buffer + stabilisation)
- corrections, seed data démo, instrumentation minimale.

## 11) Critères d’acceptation prototype

- 3 flows complets (performeur, recruteur, admin) fonctionnent en staging.
- Au moins 30 offres seedées et 200 profils seedés pour démo.
- Temps de réponse acceptable sur parcours principal (< 1s perçu pour navigation standard).
- Journalisation des erreurs côté API.
- Documentation de démarrage pour équipe produit/dev.

## 12) Mesures de validation produit

- Taux de complétion profil (objectif prototype: > 50%).
- Taux de candidature par offre (objectif prototype: >= 5).
- Délai publication -> première candidature (objectif: < 48h en test réel).
- Taux d’utilisation des assistants IA (objectif: > 20% des formulaires).

---

Ce document définit le prototype exécutable court terme.  
Le cadrage complet et la vision long terme sont dans `spec.md`.
