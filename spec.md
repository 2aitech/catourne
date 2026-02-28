# Spécification Produit Détaillée - Marketplace de Casting (Maroc)

## 1) Contexte et vision

### 1.1 Problème
Le marché du casting au Maroc est fragmenté (WhatsApp, Instagram, Facebook, bouche-à-oreille), ce qui crée:
- faible visibilité des opportunités pour les artistes,
- perte de temps pour les producteurs/casting directors,
- manque de standardisation des profils et candidatures,
- risque élevé de fraude, spam, et contenus inappropriés.

### 1.2 Vision produit
Construire une plateforme de référence de casting au Maroc, inspirée de Backstage/Spotlight, qui connecte:
- producteurs, directeurs de casting, réalisateurs,
- acteurs, figurants, cascadeurs, danseurs, mannequins, voix off et autres performeurs.

Langue principale: **français** (phase 1).  
Évolutions possibles: arabe/darija/anglais.

### 1.3 Objectifs business (12-18 mois)
- Atteindre une masse critique de profils performeurs qualifiés.
- Devenir le canal principal de publication d’offres de casting locales.
- Réduire le temps moyen de sourcing et présélection côté production.
- Préparer une couche IA différenciante pour matching et qualité des candidatures.

## 2) Personas et besoins

### 2.1 Performeur
Exemples: acteur, figurant, cascadeur, danseur, mannequin, voix off.

Besoins:
- créer un profil professionnel crédible,
- trouver des offres pertinentes,
- candidater rapidement,
- suivre l’état des candidatures,
- recevoir des suggestions pour améliorer son profil.

### 2.2 Producteur / Directeur de casting / Réalisateur
Besoins:
- publier des offres structurées,
- filtrer des candidats efficacement,
- communiquer avec les profils shortlistés,
- réduire le bruit (candidatures non pertinentes).

### 2.3 Admin / Modérateur
Besoins:
- modérer contenus et utilisateurs,
- gérer signalements et fraude,
- maintenir la confiance de la marketplace.

## 3) Proposition de valeur

### 3.1 Pour les performeurs
- Profil standardisé et visible.
- Candidatures centralisées.
- Feedback IA pour améliorer le profil.

### 3.2 Pour les producteurs
- Publication d’offres plus rapide.
- Filtres puissants et matching intelligent.
- Pipeline de candidatures clair (reçu, shortlist, refus, confirmé).

### 3.3 Pour la plateforme
- Données structurées exploitables pour IA.
- Mécanismes de confiance (vérification, modération).

## 4) Périmètre fonctionnel

### 4.1 Fonctionnalités coeur (MVP+)
- Authentification et gestion des rôles.
- Profils performeurs (CV casting + médias).
- Profils recruteurs (société/production).
- Publication d’offres de casting.
- Recherche/filtrage des offres et profils.
- Candidature à une offre.
- Gestion d’un pipeline candidature côté recruteur.
- Notifications (email + in-app).
- Back-office admin minimal pour modération.

### 4.2 Fonctionnalités différenciantes IA (phase 2)
- Matching automatique offre/profil.
- Analyse qualité de profil avec recommandations.
- Génération assistée de descriptions (profil/offre).
- Autocomplétion intelligente des formulaires.
- Modération automatique de contenu (texte/image).

### 4.3 Hors périmètre initial
- Paiement intégré complexe (abonnements avancés).
- Application mobile native.
- Contrats électroniques complets.
- Marketplace internationale multi-pays.

## 5) Parcours utilisateurs clés

### 5.1 Performeur
1. Inscription et choix du rôle "performeur".
2. Création du profil (infos perso/pro, médias, compétences).
3. Découverte d’offres et filtres.
4. Candidature (message + pièces demandées).
5. Suivi du statut candidature.
6. Suggestions IA pour améliorer le taux de réponse.

### 5.2 Recruteur
1. Inscription et vérification organisation.
2. Création d’une offre de casting.
3. Réception et tri des candidatures.
4. Shortlist et prise de contact.
5. Clôture de l’offre + feedback.

### 5.3 Admin
1. Revue contenus signalés.
2. Validation/rejet et action compte.
3. Audit des performances de modération.

## 6) Exigences fonctionnelles détaillées

### 6.1 Authentification et rôles
- Email + mot de passe (obligatoire).
- Social login (optionnel en phase 2).
- Rôles: `performer`, `producer`, `director`, `admin`.
- Contrôle d’accès par rôle sur toutes les routes.

### 6.2 Profil performeur
Champs principaux:
- identité publique (nom de scène, photo),
- localisation (ville, mobilité nationale/internationale),
- langues (français, arabe, darija, amazigh, anglais, autres),
- attributs casting (âge de jeu, taille, compétences),
- spécialités (acteur, figurant, cascade, danse, voix, etc.),
- expériences et crédits,
- médias (photos, bande démo, self-tapes),
- disponibilité,
- rémunération souhaitée (optionnelle).

Règles:
- score de complétion profil (0-100),
- sections obligatoires pour candidater.

### 6.3 Profil recruteur
- type d’entité (prod, agence, indépendant),
- description société,
- site/portfolio,
- preuve de crédibilité (option vérification manuelle).

### 6.4 Offres de casting
Champs:
- titre,
- type de projet (film, série, pub, clip, théâtre, digital),
- type de rôle recherché,
- description du rôle,
- lieu(x) et dates,
- conditions (rémunéré/non rémunéré),
- contraintes et compétences obligatoires,
- date limite de candidature,
- nombre de postes.

Workflow:
- brouillon,
- publié,
- fermé,
- archivé.

### 6.5 Candidatures
- application liée à `offer_id` + `performer_id`,
- message de motivation,
- pièces demandées (self-tape, photos, CV),
- statuts: `submitted`, `in_review`, `shortlisted`, `rejected`, `selected`.
- historique horodaté des changements.

### 6.6 Recherche et matching manuel
Filtres performeurs:
- ville, âge de jeu, langue, spécialité, disponibilité.

Filtres offres:
- ville, type de projet, rémunération, date limite.

Tri:
- date de publication,
- pertinence,
- profil complété.

### 6.7 Messagerie et notifications
- Notifications in-app pour événements critiques.
- Emails transactionnels (publication, candidature, changement statut).
- Messagerie interne simplifiée (phase 1.5) pour shortlistés.

### 6.8 Administration et modération
- dashboard de signalements,
- suspension temporaire/définitive,
- suppression de contenu,
- journal d’actions admin.

## 7) Exigences non fonctionnelles

### 7.1 Performance
- P95 API < 400ms sur endpoints read principaux.
- Pagination sur toutes les listes.
- Upload médias via URL signée.

### 7.2 Sécurité
- hash mot de passe robuste,
- JWT/session sécurisée,
- rate limiting,
- audit log sensible,
- protection OWASP Top 10.

### 7.3 Conformité et confidentialité
- RGPD-like + cadre marocain (ex: loi 09-08, à valider juridiquement).
- consentement explicite pour données sensibles.
- droit d’accès/suppression compte.

### 7.4 Fiabilité
- sauvegardes DB régulières,
- monitoring erreurs,
- stratégie de reprise incident.

### 7.5 Accessibilité
- conformité WCAG niveau AA (objectif progressif).

## 8) Architecture cible (monorepo)

### 8.1 Structure
- `packages/app`: application principale (produit casting).
- `packages/api`: backend API + auth + logique métier.
- `packages/www`: landing page marketing (phase ultérieure).

### 8.2 Stack recommandée
- Runtime: Bun.
- Frontend app: React + TypeScript.
- API: Bun server + routes REST (ou RPC léger).
- DB: PostgreSQL.
- Storage médias: S3 compatible.
- Cache/queues: Redis (pour jobs IA/modération/notifs).

### 8.3 Principes d’architecture
- séparation claire UI / API / jobs async,
- schémas de validation communs (types partagés),
- logs structurés,
- observabilité dès le début.

## 9) Modèle de données (version conceptuelle)

Entités principales:
- `users`
- `performer_profiles`
- `recruiter_profiles`
- `offers`
- `applications`
- `media_assets`
- `skills`
- `performer_skills`
- `offer_requirements`
- `notifications`
- `reports`
- `admin_actions`
- `ai_recommendations`

Relations clés:
- 1 user -> 0..1 performer_profile
- 1 user -> 0..1 recruiter_profile
- 1 recruiter_profile -> n offers
- 1 offer -> n applications
- 1 performer_profile -> n applications

## 10) API (v1 indicative)

### 10.1 Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### 10.2 Performers
- `GET /performers/:id`
- `PATCH /performers/me`
- `GET /performers` (search + filtres)

### 10.3 Recruiters
- `GET /recruiters/:id`
- `PATCH /recruiters/me`

### 10.4 Offers
- `POST /offers`
- `GET /offers`
- `GET /offers/:id`
- `PATCH /offers/:id`
- `POST /offers/:id/publish`
- `POST /offers/:id/close`

### 10.5 Applications
- `POST /offers/:id/apply`
- `GET /applications/me`
- `GET /offers/:id/applications`
- `PATCH /applications/:id/status`

### 10.6 Admin
- `GET /admin/reports`
- `POST /admin/reports/:id/resolve`
- `POST /admin/users/:id/suspend`

### 10.7 IA (phase 2)
- `POST /ai/profile-suggestions`
- `POST /ai/generate-offer-description`
- `POST /ai/moderate-content`
- `GET /ai/match-score?performer_id=&offer_id=`

## 11) Roadmap IA

### 11.1 Matching intelligent
Entrées:
- compétences, langues, localisation, expérience, disponibilité.

Sorties:
- score de compatibilité,
- raisons explicables (top facteurs),
- recommandations actionnables.

### 11.2 Optimisation profil
- détection de sections manquantes,
- suggestions de reformulation du bio/CV,
- recommandations de médias à ajouter.

### 11.3 Génération assistée
- autocomplétion description d’offre,
- aide à rédaction du message de candidature,
- templates contextualisés (film/pub/théâtre).

### 11.4 Modération IA
- toxicité/harcèlement/arnaque en texte,
- détection de contenu image non conforme (selon politique),
- score de risque + escalade humaine.

### 11.5 Gouvernance IA
- logs d’inférence et versionning prompts/modèles,
- possibilité de contestation décision automatique,
- validation humaine pour actions sensibles.

## 12) Analytics et KPIs

KPIs acquisition:
- nouveaux performeurs/semaine,
- nouveaux recruteurs/semaine.

KPIs marketplace:
- offres publiées/semaine,
- taux candidature/offre,
- délai moyen jusqu’à shortlist.

KPIs qualité:
- taux profils complétés > 80%,
- taux de spam/signalements,
- taux de conversion shortlist -> sélection.

KPIs IA:
- uplift du taux de matching accepté,
- adoption suggestions IA,
- précision modération (precision/recall).

## 13) Plan de livraison (macro)

### Phase 0 - Cadrage (1-2 semaines)
- finalisation spec produit,
- modèle de données v1,
- design system minimal FR.

### Phase 1 - Prototype fonctionnel (4-6 semaines)
- auth + profils + offres + candidatures,
- dashboard recruteur simplifié,
- admin modération de base.

### Phase 2 - Beta privée (4-8 semaines)
- notifications avancées,
- recherche performante,
- premiers modules IA assistifs.

### Phase 3 - Lancement public
- onboarding à échelle,
- instrumentation business complète,
- optimisation conversion.

## 14) Risques et mitigations

- Risque qualité des profils faible:
  - mitigation: onboarding guidé + score complétion + IA de suggestion.
- Risque spam/fraude:
  - mitigation: vérification recruteurs + modération hybride IA/humain.
- Risque cold-start offres/candidats:
  - mitigation: partenariats écoles/agences/prod locales.
- Risque légal données:
  - mitigation: revue juridique locale dès phase 1.

## 15) Questions ouvertes

- Modèle économique cible (freemium, abonnement recruteurs, crédits)?
- Niveau de vérification identité requis pour performeurs?
- Politique de contenu précise (nudité, mineurs, violence)?
- Priorité mobile web vs desktop?
- Intégration WhatsApp pour notifications?

---

Ce document sert de base produit et technique.  
Le document `prototype-spec.md` définit le périmètre exécutable court terme.
