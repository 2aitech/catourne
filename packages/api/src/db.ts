import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Database } from "bun:sqlite";

const defaultPath = `${import.meta.dir}/../data/dev.db`;
const dbPath = process.env.DATABASE_PATH ?? defaultPath;

mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath, { create: true });

db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('performer', 'recruiter', 'admin')),
  is_suspended INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS performer_profiles (
  user_id TEXT PRIMARY KEY,
  stage_name TEXT DEFAULT '',
  city TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  specialty TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  height_cm TEXT DEFAULT '',
  weight_kg TEXT DEFAULT '',
  neck_circumference_cm TEXT DEFAULT '',
  pant_length_cm TEXT DEFAULT '',
  head_circumference_cm TEXT DEFAULT '',
  chest_circumference_cm TEXT DEFAULT '',
  shoe_size TEXT DEFAULT '',
  languages_json TEXT DEFAULT '[]',
  photo_url TEXT DEFAULT '',
  completion_score INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS performer_gallery_images (
  id TEXT PRIMARY KEY,
  performer_user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (performer_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recruiter_profiles (
  user_id TEXT PRIMARY KEY,
  company_name TEXT DEFAULT '',
  description TEXT DEFAULT '',
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  recruiter_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  project_type TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  deadline_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'closed')) DEFAULT 'draft',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (recruiter_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL,
  performer_user_id TEXT NOT NULL,
  motivation_text TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('submitted', 'in_review', 'shortlisted', 'rejected', 'selected')) DEFAULT 'submitted',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (offer_id, performer_user_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (performer_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  reporter_user_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL,
  FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id TEXT PRIMARY KEY,
  admin_user_id TEXT NOT NULL,
  report_id TEXT NOT NULL,
  action TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS match_impressions (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL,
  recruiter_user_id TEXT NOT NULL,
  performer_user_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  rule_score REAL NOT NULL,
  ml_score REAL,
  final_score REAL NOT NULL,
  model_version TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (recruiter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (performer_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_match_impressions_offer_created
  ON match_impressions (offer_id, created_at DESC);

CREATE TABLE IF NOT EXISTS match_actions (
  id TEXT PRIMARY KEY,
  impression_id TEXT,
  offer_id TEXT NOT NULL,
  recruiter_user_id TEXT NOT NULL,
  performer_user_id TEXT NOT NULL,
  action TEXT NOT NULL CHECK (
    action IN ('viewed', 'in_review', 'shortlisted', 'rejected', 'selected')
  ),
  created_at TEXT NOT NULL,
  FOREIGN KEY (impression_id) REFERENCES match_impressions(id) ON DELETE SET NULL,
  FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE,
  FOREIGN KEY (recruiter_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (performer_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_match_actions_offer_created
  ON match_actions (offer_id, created_at DESC);
`);

const performerProfileColumns = new Set(
  (
    db.query("PRAGMA table_info(performer_profiles)").all() as Array<{
      name: string;
    }>
  ).map((column) => column.name),
);

const performerProfileExtraColumns: Array<[string, string]> = [
  ["phone", "TEXT DEFAULT ''"],
  ["height_cm", "TEXT DEFAULT ''"],
  ["weight_kg", "TEXT DEFAULT ''"],
  ["neck_circumference_cm", "TEXT DEFAULT ''"],
  ["pant_length_cm", "TEXT DEFAULT ''"],
  ["head_circumference_cm", "TEXT DEFAULT ''"],
  ["chest_circumference_cm", "TEXT DEFAULT ''"],
  ["shoe_size", "TEXT DEFAULT ''"],
];

for (const [name, definition] of performerProfileExtraColumns) {
  if (!performerProfileColumns.has(name)) {
    db.exec(`ALTER TABLE performer_profiles ADD COLUMN ${name} ${definition};`);
  }
}

const userCount = db.query("SELECT COUNT(*) AS count FROM users").get() as {
  count: number;
};

if (userCount.count === 0) {
  const now = new Date().toISOString();
  const adminId = crypto.randomUUID();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@casting.ma";
  const passwordHash = await Bun.password.hash(adminPassword);

  db.query(
    "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)",
  ).run(adminId, adminEmail, passwordHash, now);

  console.log(
    `[api] admin seed: email=${adminEmail} password=${adminPassword} (change in production)`,
  );
}
