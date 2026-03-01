import { db } from "./db";

// ── Wipe all tables (order matters due to foreign keys) ──
const tables = [
  "match_actions",
  "match_impressions",
  "admin_actions",
  "reports",
  "applications",
  "offers",
  "performer_gallery_images",
  "performer_profiles",
  "recruiter_profiles",
  "sessions",
  "users",
];

for (const t of tables) {
  db.exec(`DELETE FROM ${t};`);
}

console.log("[seed] All tables cleared.");

// ── Helpers ──
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
};
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const cities = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Ouarzazate",
  "Meknès",
  "Essaouira",
  "Tétouan",
];

const specialties = [
  "Acteur",
  "Actrice",
  "Figurant",
  "Figurante",
  "Mannequin",
  "Danseur",
  "Danseuse",
  "Chanteur",
  "Chanteuse",
  "Comédien",
  "Comédienne",
  "Cascadeur",
  "Doublure",
  "Voix-off",
  "Modèle photo",
  "Présentateur",
  "Présentatrice",
];

const allLanguages = ["francais", "arabe", "anglais", "amazigh", "espagnol"];

const projectTypes = [
  "Film",
  "Série TV",
  "Publicité",
  "Clip musical",
  "Court métrage",
  "Documentaire",
  "Théâtre",
  "Émission TV",
];

const genders = ["Homme", "Femme"];

// ── 1. Admin user ──
const adminId = uuid();
const adminHash = await Bun.password.hash("admin12345");
db.query(
  "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)",
).run(adminId, "admin@casting.ma", adminHash, now());
console.log("[seed] Admin created: admin@casting.ma / admin12345");

// ── 2. Performers ──
const performerData = [
  { first: "Yassine", last: "El Amrani", gender: "Homme" },
  { first: "Salma", last: "Benkirane", gender: "Femme" },
  { first: "Karim", last: "Ouazzani", gender: "Homme" },
  { first: "Nadia", last: "Chraibi", gender: "Femme" },
  { first: "Omar", last: "Tazi", gender: "Homme" },
  { first: "Fatima Zahra", last: "Bennani", gender: "Femme" },
  { first: "Mehdi", last: "Alaoui", gender: "Homme" },
  { first: "Imane", last: "Hassani", gender: "Femme" },
  { first: "Amine", last: "Rachidi", gender: "Homme" },
  { first: "Hajar", last: "Moussaoui", gender: "Femme" },
  { first: "Rachid", last: "Berrada", gender: "Homme" },
  { first: "Kenza", last: "El Fassi", gender: "Femme" },
  { first: "Adil", last: "Jabri", gender: "Homme" },
  { first: "Soukaina", last: "Lahlou", gender: "Femme" },
  { first: "Hamza", last: "Kettani", gender: "Homme" },
  { first: "Zineb", last: "Ouadghiri", gender: "Femme" },
  { first: "Zakaria", last: "Belhaj", gender: "Homme" },
  { first: "Meryem", last: "Skalli", gender: "Femme" },
  { first: "Ilyas", last: "Drissi", gender: "Homme" },
  { first: "Ghita", last: "Tahiri", gender: "Femme" },
];

const bios: Record<string, string[]> = {
  Homme: [
    "Acteur passionné avec 5 ans d'expérience dans le cinéma marocain. Spécialisé dans les rôles dramatiques et les personnages complexes.",
    "Jeune talent formé au conservatoire de Casablanca. À l'aise devant la caméra comme sur scène.",
    "Figurant expérimenté ayant participé à plus de 20 productions nationales et internationales.",
    "Comédien polyvalent maîtrisant l'improvisation et le théâtre classique. Disponible pour tout type de projet.",
    "Mannequin et acteur, je combine présence physique et jeu d'acteur pour des rôles variés.",
    "Passionné de cinéma depuis l'enfance, j'ai participé à plusieurs courts métrages primés dans des festivals.",
    "Cascadeur professionnel formé aux arts martiaux. Expérience dans les films d'action marocains et étrangers.",
    "Artiste complet : chant, danse et comédie. Diplômé de l'ISADAC de Rabat.",
    "Voix-off pour publicités radio et TV. Timbre grave et modulable, bilingue arabe-français.",
    "Présentateur TV avec une présence naturelle à l'écran. Expérience en direct et en plateau.",
  ],
  Femme: [
    "Actrice diplômée de l'ISADAC avec une passion pour les rôles féminins forts dans le cinéma marocain.",
    "Danseuse et comédienne, je mêle art corporel et jeu dramatique dans chaque performance.",
    "Mannequin professionnelle reconvertie dans le cinéma. Habituée aux shootings et aux plateaux de tournage.",
    "Chanteuse et actrice, ma double casquette me permet d'apporter une dimension unique à chaque rôle.",
    "Figurante passionnée rêvant de décrocher son premier rôle principal. Motivée et toujours ponctuelle.",
    "Comédienne spécialisée dans la comédie et le one-woman-show. J'adore faire rire le public.",
    "Jeune talent prometteuse avec des apparitions dans plusieurs séries TV marocaines à succès.",
    "Artiste engagée utilisant le théâtre et le cinéma pour porter des messages sociaux importants.",
    "Modèle photo et actrice, je suis à l'aise dans les rôles nécessitant une forte présence visuelle.",
    "Présentatrice et voix-off, j'ai une diction parfaite en arabe, français et anglais.",
  ],
};

const performerIds: string[] = [];
const passwordHash = await Bun.password.hash("password123");

const insertUser = db.query(
  "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
);
const insertPerformer = db.query(`
  INSERT INTO performer_profiles (
    user_id, stage_name, gender, city, bio, specialty, phone,
    height_cm, weight_kg, neck_circumference_cm, pant_length_cm,
    head_circumference_cm, chest_circumference_cm, shoe_size,
    languages_json, photo_url, completion_score, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of performerData) {
  const id = uuid();
  performerIds.push(id);
  const email = `${p.first.toLowerCase().replace(/ /g, "")}.${p.last.toLowerCase().replace(/ /g, "")}@example.com`;
  const stageName = `${p.first} ${p.last}`;
  const city = pick(cities);
  const specialty = pick(
    specialties.filter((s) =>
      p.gender === "Homme"
        ? !s.endsWith("e") || s === "Voix-off" || s === "Mannequin" || s === "Modèle photo"
        : s.endsWith("e") || s === "Mannequin" || s === "Voix-off" || s === "Modèle photo",
    ),
  );
  const bio = pick(bios[p.gender]);
  const langs = JSON.stringify(pickN(allLanguages, randomInt(2, 4)));
  const phone = `+2126${randomInt(10000000, 99999999)}`;
  const height = String(randomInt(155, 195));
  const weight = String(randomInt(50, 95));
  const neck = String(randomInt(34, 44));
  const pant = String(randomInt(95, 115));
  const head = String(randomInt(54, 60));
  const chest = String(randomInt(80, 110));
  const shoe = String(randomInt(36, 46));

  // completion_score: all fields filled = 100
  const completionScore = 100;

  insertUser.run(id, email, passwordHash, "performer", now());
  insertPerformer.run(
    id, stageName, p.gender, city, bio, specialty, phone,
    height, weight, neck, pant, head, chest, shoe,
    langs, "", completionScore, now(), now(),
  );
}

console.log(`[seed] ${performerData.length} performers created.`);

// ── 3. Recruiters ──
const recruiterData = [
  { company: "Atlas Films", desc: "Studio de production cinématographique basé à Ouarzazate, spécialisé dans les superproductions et coproductions internationales." },
  { company: "Casablanca Studios", desc: "Maison de production leader au Maroc, produisant films, séries TV et publicités de haute qualité." },
  { company: "Nour Production", desc: "Agence de production audiovisuelle spécialisée dans les contenus publicitaires et les clips musicaux." },
  { company: "Maghreb Art", desc: "Société de production artistique dédiée au théâtre, documentaires et événements culturels." },
  { company: "Sahara Creatives", desc: "Agence créative proposant des solutions complètes de casting et de production pour le cinéma et la TV." },
];

const recruiterIds: string[] = [];

const insertRecruiter = db.query(`
  INSERT INTO recruiter_profiles (user_id, company_name, description, verified, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const r of recruiterData) {
  const id = uuid();
  recruiterIds.push(id);
  const email = `contact@${r.company.toLowerCase().replace(/ /g, "")}.ma`;

  insertUser.run(id, email, passwordHash, "recruiter", now());
  insertRecruiter.run(id, r.company, r.desc, 1, now(), now());
}

console.log(`[seed] ${recruiterData.length} recruiters created.`);

// ── 4. Offers ──
const offerTemplates = [
  {
    title: "Recherche acteur principal pour long métrage",
    type: "Film",
    desc: "Nous recherchons un acteur principal (30-40 ans) pour incarner le rôle de Karim, un enseignant qui découvre un secret familial bouleversant. Le tournage aura lieu sur 6 semaines. Expérience cinéma requise.",
  },
  {
    title: "Casting figurants - Série historique",
    type: "Série TV",
    desc: "Grande campagne de casting pour figurants dans une série historique se déroulant au Maroc médiéval. Recherchons hommes et femmes de tous âges. Aucune expérience requise.",
  },
  {
    title: "Mannequin pour campagne publicitaire cosmétique",
    type: "Publicité",
    desc: "Marque internationale de cosmétiques recherche un mannequin femme (20-30 ans) pour une campagne print et vidéo. Bonne photogénie indispensable.",
  },
  {
    title: "Actrice pour court métrage festival",
    type: "Court métrage",
    desc: "Court métrage sélectionné pour le Festival du Court Métrage de Tanger. Recherchons une actrice (25-35 ans) pour le rôle principal. Scènes émotionnellement intenses.",
  },
  {
    title: "Danseurs pour clip musical - artiste international",
    type: "Clip musical",
    desc: "Artiste international tourne son prochain clip au Maroc. Recherchons 8 danseurs/danseuses maîtrisant le hip-hop et la danse contemporaine.",
  },
  {
    title: "Voix-off arabe et français pour documentaire",
    type: "Documentaire",
    desc: "Documentaire sur l'artisanat marocain nécessite une voix-off masculine bilingue arabe-français. Enregistrement en studio à Casablanca.",
  },
  {
    title: "Comédiens pour pièce de théâtre contemporain",
    type: "Théâtre",
    desc: "Troupe de théâtre contemporain recherche 4 comédiens (2H/2F) pour une nouvelle création. Représentations à Rabat et Casablanca pendant 3 mois.",
  },
  {
    title: "Présentatrice émission culturelle",
    type: "Émission TV",
    desc: "Chaîne TV nationale recherche une présentatrice pour une nouvelle émission culturelle hebdomadaire. Maîtrise de l'arabe et du français exigée.",
  },
  {
    title: "Cascadeurs pour film d'action",
    type: "Film",
    desc: "Film d'action coproduit avec un studio européen. Recherchons des cascadeurs professionnels avec expérience en arts martiaux et conduite sportive.",
  },
  {
    title: "Figurantes pour publicité télécom",
    type: "Publicité",
    desc: "Opérateur télécom recherche 10 figurantes (18-25 ans) pour une nouvelle campagne publicitaire TV et digital. Tournage d'une journée à Marrakech.",
  },
  {
    title: "Acteur bilingue pour série Netflix",
    type: "Série TV",
    desc: "Casting pour une série originale Netflix tournée au Maroc. Recherchons un acteur (25-40 ans) bilingue arabe-anglais pour un rôle secondaire récurrent.",
  },
  {
    title: "Modèles pour shooting mode été",
    type: "Publicité",
    desc: "Marque de prêt-à-porter marocaine recherche des modèles hommes et femmes pour le catalogue été. Shooting à Essaouira sur 3 jours.",
  },
  {
    title: "Doublure pour acteur international",
    type: "Film",
    desc: "Production internationale cherche une doublure pour un acteur principal. Homme, 1m80-1m85, corpulence moyenne. Tournage à Ouarzazate.",
  },
  {
    title: "Chanteurs pour comédie musicale",
    type: "Théâtre",
    desc: "Nouvelle comédie musicale marocaine recherche chanteurs et chanteuses avec formation vocale. Auditions ouvertes à Casablanca.",
  },
  {
    title: "Enfants acteurs pour téléfilm",
    type: "Série TV",
    desc: "Téléfilm familial recherche enfants acteurs (8-12 ans) pour des rôles importants. Les parents doivent être disponibles pendant le tournage.",
  },
];

const offerIds: string[] = [];

const insertOffer = db.query(`
  INSERT INTO offers (id, recruiter_user_id, title, project_type, description, city, deadline_at, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const o of offerTemplates) {
  const id = uuid();
  offerIds.push(id);
  const recruiterId = pick(recruiterIds);
  const city = pick(cities);
  // Deadline between 2 weeks and 3 months from now
  const deadline = new Date(
    Date.now() + randomInt(14, 90) * 24 * 60 * 60 * 1000,
  ).toISOString();
  const status = "published";
  const ts = now();

  insertOffer.run(id, recruiterId, o.title, o.type, o.desc, city, deadline, status, ts, ts);
}

console.log(`[seed] ${offerTemplates.length} offers created.`);

// ── 5. Applications ──
const applicationStatuses = [
  "submitted",
  "submitted",
  "submitted",
  "in_review",
  "in_review",
  "shortlisted",
  "rejected",
  "selected",
];

const motivations = [
  "Ce rôle correspond parfaitement à mon profil et à mon expérience. Je suis très motivé(e) et disponible immédiatement.",
  "J'ai toujours rêvé de participer à ce type de projet. Mon parcours artistique m'a préparé pour ce défi.",
  "Votre projet m'inspire beaucoup. J'apporterai ma passion et mon énergie à cette production.",
  "Avec mon expérience de 3 ans dans le domaine, je suis convaincu(e) de pouvoir apporter une réelle valeur ajoutée.",
  "Le rôle décrit correspond exactement à ce que je recherche pour développer ma carrière artistique.",
  "Je suis disponible pour toute la durée du tournage et prêt(e) à m'investir pleinement dans ce projet.",
  "Votre production a une excellente réputation et je serais honoré(e) d'y contribuer.",
  "Ce projet me permettrait de travailler avec des professionnels reconnus et d'enrichir mon expérience.",
];

const insertApplication = db.query(`
  INSERT INTO applications (id, offer_id, performer_user_id, motivation_text, status, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const appliedPairs = new Set<string>();
let appCount = 0;

// Each offer gets 3-8 applications from random performers
for (const offerId of offerIds) {
  const numApps = randomInt(3, 8);
  const applicants = pickN(performerIds, numApps);

  for (const perfId of applicants) {
    const pairKey = `${offerId}:${perfId}`;
    if (appliedPairs.has(pairKey)) continue;
    appliedPairs.add(pairKey);

    const appId = uuid();
    const status = pick(applicationStatuses);
    const motivation = pick(motivations);
    const ts = now();

    insertApplication.run(appId, offerId, perfId, motivation, status, ts, ts);
    appCount++;
  }
}

console.log(`[seed] ${appCount} applications created.`);

// ── 6. Reports ──
const reportReasons = [
  "Profil avec des informations fausses",
  "Photos inappropriées dans la galerie",
  "Comportement non professionnel lors du casting",
  "Offre suspecte / arnaque potentielle",
  "Contenu offensant dans la description",
];

const insertReport = db.query(`
  INSERT INTO reports (id, reporter_user_id, target_type, target_id, reason, status, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Create 5 reports
for (let i = 0; i < 5; i++) {
  const reportId = uuid();
  const reporterId = pick([...performerIds, ...recruiterIds]);
  const targetType = pick(["user", "offer"]);
  const targetId =
    targetType === "user" ? pick(performerIds) : pick(offerIds);
  const reason = pick(reportReasons);
  const status = i < 2 ? "resolved" : "open";

  insertReport.run(reportId, reporterId, targetType, targetId, reason, status, now());
}

console.log("[seed] 5 reports created.");

// ── 7. Admin actions for resolved reports ──
const resolvedReports = db
  .query("SELECT id FROM reports WHERE status = 'resolved'")
  .all() as { id: string }[];

const insertAdminAction = db.query(`
  INSERT INTO admin_actions (id, admin_user_id, report_id, action, note, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const report of resolvedReports) {
  insertAdminAction.run(
    uuid(),
    adminId,
    report.id,
    pick(["dismiss", "warn"]),
    "Signalement traité par l'administrateur.",
    now(),
  );
}

console.log(`[seed] ${resolvedReports.length} admin actions created.`);

// ── Done ──
console.log("\n[seed] Database seeded successfully!");
console.log("[seed] Credentials:");
console.log("  Admin:      admin@casting.ma / admin12345");
console.log("  Performers: <first>.<last>@example.com / password123");
console.log("  Recruiters: contact@<company>.ma / password123");
