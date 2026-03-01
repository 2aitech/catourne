import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { db } from "./db";
import { buildMlFeatures, computeRuleMatch, type MatchOffer, type MatchPerformer } from "./matching";

type Role = "performer" | "recruiter" | "admin";

type AuthUser = {
  id: string;
  email: string;
  role: Role;
  is_suspended: number;
};

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,OPTIONS",
  "access-control-allow-headers": "authorization,content-type",
};

const UPLOADS_DIR = `${import.meta.dir}/../data/uploads`;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ML_SERVICE_URL = (process.env.ML_SERVICE_URL ?? "http://localhost:3010").replace(/\/+$/, "");
const ML_TIMEOUT_MS = Number(process.env.ML_TIMEOUT_MS ?? 700);

mkdirSync(UPLOADS_DIR, { recursive: true });

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function error(message: string, status = 400): Response {
  return json({ error: message }, status);
}

function nowIso(): string {
  return new Date().toISOString();
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseLanguages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asString).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
}

function parseStoredLanguages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asString).filter(Boolean);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map(asString).filter(Boolean);
      }
    } catch {
      return parseLanguages(value);
    }
  }
  return [];
}

function imageExtension(fileName: string, mimeType: string): string {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) {
    return ".jpg";
  }
  if (lowerName.endsWith(".png")) {
    return ".png";
  }
  if (lowerName.endsWith(".webp")) {
    return ".webp";
  }
  if (lowerName.endsWith(".gif")) {
    return ".gif";
  }
  if (mimeType === "image/jpeg") {
    return ".jpg";
  }
  if (mimeType === "image/png") {
    return ".png";
  }
  if (mimeType === "image/webp") {
    return ".webp";
  }
  if (mimeType === "image/gif") {
    return ".gif";
  }
  return ".jpg";
}

function validateImageFile(file: File, fieldName: string): string | null {
  if (file.size <= 0) {
    return `Fichier ${fieldName} vide.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return "Image trop lourde (max 5 MB).";
  }
  const mimeType = file.type.toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return "Format invalide. Utilisez JPG, PNG, WEBP ou GIF.";
  }
  return null;
}

function computePerformerCompletion(input: {
  stage_name: string;
  city: string;
  specialty: string;
  bio: string;
  photo_url: string;
  languages: string[];
}): number {
  const checks = [
    input.stage_name,
    input.city,
    input.specialty,
    input.bio,
    input.photo_url,
    input.languages.length > 0 ? "ok" : "",
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

async function readJson<T>(req: Request): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}

function getToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

function getAuthUser(req: Request): AuthUser | null {
  const token = getToken(req);
  if (!token) {
    return null;
  }
  const row = db
    .query(
      `
      SELECT u.id, u.email, u.role, u.is_suspended
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
      `,
    )
    .get(token) as AuthUser | null;

  if (!row || row.is_suspended) {
    return null;
  }
  return row;
}

function requireAuth(req: Request, roles?: Role[]): AuthUser | Response {
  const user = getAuthUser(req);
  if (!user) {
    return error("Authentification requise.", 401);
  }
  if (roles && !roles.includes(user.role)) {
    return error("Accès interdit pour ce rôle.", 403);
  }
  return user;
}

function ensurePerformerProfile(userId: string): void {
  const exists = db
    .query("SELECT user_id FROM performer_profiles WHERE user_id = ?")
    .get(userId) as { user_id: string } | null;
  if (exists) {
    return;
  }
  const now = nowIso();
  db.query(
    `
    INSERT INTO performer_profiles (
      user_id, stage_name, city, bio, specialty, languages_json, photo_url, completion_score, created_at, updated_at
    )
    VALUES (?, '', '', '', '', '[]', '', 0, ?, ?)
    `,
  ).run(userId, now, now);
}

function ensureRecruiterProfile(userId: string): void {
  const exists = db
    .query("SELECT user_id FROM recruiter_profiles WHERE user_id = ?")
    .get(userId) as { user_id: string } | null;
  if (exists) {
    return;
  }
  const now = nowIso();
  db.query(
    `
    INSERT INTO recruiter_profiles (user_id, company_name, description, verified, created_at, updated_at)
    VALUES (?, '', '', 0, ?, ?)
    `,
  ).run(userId, now, now);
}

function getPerformerProfile(userId: string) {
  const row = db
    .query(
      `
      SELECT
        user_id,
        stage_name,
        city,
        bio,
        specialty,
        phone,
        height_cm,
        weight_kg,
        neck_circumference_cm,
        pant_length_cm,
        head_circumference_cm,
        chest_circumference_cm,
        shoe_size,
        languages_json,
        photo_url,
        completion_score,
        created_at,
        updated_at
      FROM performer_profiles
      WHERE user_id = ?
      `,
    )
    .get(userId) as
    | {
        user_id: string;
        stage_name: string;
        city: string;
        bio: string;
        specialty: string;
        phone: string;
        height_cm: string;
        weight_kg: string;
        neck_circumference_cm: string;
        pant_length_cm: string;
        head_circumference_cm: string;
        chest_circumference_cm: string;
        shoe_size: string;
        languages_json: string;
        photo_url: string;
        completion_score: number;
        created_at: string;
        updated_at: string;
      }
    | null;

  if (!row) {
    return null;
  }
  return {
    ...row,
    languages: JSON.parse(row.languages_json || "[]") as string[],
  };
}

function getPerformerGallery(userId: string): string[] {
  const rows = db
    .query(
      `
      SELECT image_url
      FROM performer_gallery_images
      WHERE performer_user_id = ?
      ORDER BY created_at DESC
      `,
    )
    .all(userId) as Array<{ image_url: string }>;

  return rows.map((row) => row.image_url);
}

function getRecruiterProfile(userId: string) {
  return db
    .query(
      `
      SELECT user_id, company_name, description, verified, created_at, updated_at
      FROM recruiter_profiles
      WHERE user_id = ?
      `,
    )
    .get(userId) as
    | {
        user_id: string;
        company_name: string;
        description: string;
        verified: number;
        created_at: string;
        updated_at: string;
      }
    | null;
}

function canTransitionApplicationStatus(from: string, to: string): boolean {
  const transitions: Record<string, string[]> = {
    submitted: ["in_review"],
    in_review: ["shortlisted", "rejected"],
    shortlisted: ["selected", "rejected"],
    selected: [],
    rejected: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

type MlScoreResult = {
  ml_score: number;
  model_version: string;
  feature_contributions: Record<string, number>;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function blendScore(ruleScore: number, mlScore?: number): number {
  if (mlScore === undefined) {
    return clampScore(ruleScore);
  }
  return clampScore(ruleScore * 0.6 + mlScore * 0.4);
}

function asFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function asNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") {
    return {};
  }
  const entries = Object.entries(value as Record<string, unknown>)
    .map(([key, current]) => [key, asFiniteNumber(current)] as const)
    .filter(([, current]) => current !== null)
    .map(([key, current]) => [key, current as number] as const);
  return Object.fromEntries(entries);
}

function insertMatchImpression(input: {
  offer_id: string;
  recruiter_user_id: string;
  performer_user_id: string;
  source: string;
  rule_score: number;
  ml_score?: number;
  final_score: number;
  model_version?: string;
}): string {
  const impressionId = crypto.randomUUID();
  db.query(
    `
    INSERT INTO match_impressions (
      id, offer_id, recruiter_user_id, performer_user_id, source, rule_score, ml_score, final_score, model_version, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    impressionId,
    input.offer_id,
    input.recruiter_user_id,
    input.performer_user_id,
    input.source,
    input.rule_score,
    input.ml_score ?? null,
    input.final_score,
    input.model_version ?? "",
    nowIso(),
  );
  return impressionId;
}

function insertMatchAction(input: {
  impression_id?: string;
  offer_id: string;
  recruiter_user_id: string;
  performer_user_id: string;
  action: "viewed" | "in_review" | "shortlisted" | "rejected" | "selected";
}): string {
  const actionId = crypto.randomUUID();
  db.query(
    `
    INSERT INTO match_actions (
      id, impression_id, offer_id, recruiter_user_id, performer_user_id, action, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  ).run(
    actionId,
    input.impression_id ?? null,
    input.offer_id,
    input.recruiter_user_id,
    input.performer_user_id,
    input.action,
    nowIso(),
  );
  return actionId;
}

async function requestMlScore(
  offerId: string,
  performerUserId: string,
  ruleScore: number,
  features: Record<string, number>,
): Promise<MlScoreResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);

  try {
    const response = await fetch(`${ML_SERVICE_URL}/score`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        rule_score: ruleScore,
        features,
        context: {
          offer_id: offerId,
          performer_user_id: performerUserId,
        },
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as {
      ml_score?: unknown;
      model_version?: unknown;
      feature_contributions?: unknown;
    };
    const rawScore = asFiniteNumber(payload.ml_score);
    if (rawScore === null) {
      return null;
    }
    const modelVersion =
      typeof payload.model_version === "string" && payload.model_version.trim()
        ? payload.model_version
        : "unknown";

    return {
      ml_score: clampScore(rawScore),
      model_version: modelVersion,
      feature_contributions: asNumberRecord(payload.feature_contributions),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function getOfferForMatch(offerId: string) {
  return db
    .query(
      `
      SELECT id, recruiter_user_id, title, project_type, description, city, deadline_at, status
      FROM offers
      WHERE id = ?
      `,
    )
    .get(offerId) as
    | {
        id: string;
        recruiter_user_id: string;
        title: string;
        project_type: string;
        description: string;
        city: string;
        deadline_at: string;
        status: string;
      }
    | null;
}

function getPerformerForMatch(performerUserId: string): MatchPerformer | null {
  const profile = getPerformerProfile(performerUserId);
  if (!profile) {
    return null;
  }
  return {
    user_id: profile.user_id,
    stage_name: profile.stage_name,
    city: profile.city,
    bio: profile.bio,
    specialty: profile.specialty,
    languages: profile.languages ?? [],
    completion_score: profile.completion_score ?? 0,
  };
}

const port = Number(process.env.API_PORT ?? 3001);

Bun.serve({
  port,
  async fetch(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(req.url);
    const { pathname } = url;
    const method = req.method.toUpperCase();

    try {
      const uploadMatch = pathname.match(/^\/uploads\/([a-zA-Z0-9._-]+)$/);
      if (method === "GET" && uploadMatch) {
        const fileName = uploadMatch[1]!;
        const file = Bun.file(join(UPLOADS_DIR, fileName));
        if (!(await file.exists())) {
          return error("Fichier introuvable.", 404);
        }
        return new Response(file, {
          headers: {
            "access-control-allow-origin": "*",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      }

      if (method === "GET" && pathname === "/health") {
        return json({ ok: true, service: "casting-api", time: nowIso() });
      }

      if (method === "POST" && pathname === "/uploads/performer-photo") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }

        let formData: FormData;
        try {
          formData = await req.formData();
        } catch {
          return error("Body multipart/form-data invalide.");
        }

        const photo = formData.get("photo");
        if (!(photo instanceof File)) {
          return error("Champ requis: photo.");
        }
        const photoError = validateImageFile(photo, "photo");
        if (photoError) {
          return error(photoError);
        }

        const extension = imageExtension(photo.name, photo.type.toLowerCase());
        const fileName = `${auth.id}-${Date.now()}-${crypto.randomUUID()}${extension}`;
        const filePath = join(UPLOADS_DIR, fileName);
        await Bun.write(filePath, photo);

        ensurePerformerProfile(auth.id);
        const current = getPerformerProfile(auth.id);
        if (!current) {
          return error("Profil performeur introuvable.", 404);
        }

        const photoUrl = `${url.origin}/uploads/${fileName}`;
        const merged = {
          stage_name: current.stage_name,
          city: current.city,
          bio: current.bio,
          specialty: current.specialty,
          photo_url: photoUrl,
          languages: current.languages,
        };
        const completion = computePerformerCompletion(merged);
        const now = nowIso();

        db.query(
          `
          UPDATE performer_profiles
          SET photo_url = ?, completion_score = ?, updated_at = ?
          WHERE user_id = ?
          `,
        ).run(photoUrl, completion, now, auth.id);

        return json({
          photo_url: photoUrl,
          profile: getPerformerProfile(auth.id),
        });
      }

      if (method === "GET" && pathname === "/uploads/performer-gallery/me") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }
        return json({ images: getPerformerGallery(auth.id) });
      }

      if (method === "POST" && pathname === "/uploads/performer-gallery") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }

        let formData: FormData;
        try {
          formData = await req.formData();
        } catch {
          return error("Body multipart/form-data invalide.");
        }

        const files = formData
          .getAll("photos")
          .filter((entry): entry is File => entry instanceof File);
        if (files.length === 0) {
          return error("Champ requis: photos.");
        }
        if (files.length > 12) {
          return error("Maximum 12 images par import.");
        }

        const currentCountRow = db
          .query(
            `
            SELECT COUNT(*) AS count
            FROM performer_gallery_images
            WHERE performer_user_id = ?
            `,
          )
          .get(auth.id) as { count: number } | null;
        const currentCount = currentCountRow?.count ?? 0;
        if (currentCount + files.length > 20) {
          return error("La galerie est limitée à 20 images.");
        }

        const uploadedUrls: string[] = [];
        const createdAt = nowIso();
        for (const photo of files) {
          const photoError = validateImageFile(photo, "photo");
          if (photoError) {
            return error(photoError);
          }

          const extension = imageExtension(photo.name, photo.type.toLowerCase());
          const fileName = `${auth.id}-gallery-${Date.now()}-${crypto.randomUUID()}${extension}`;
          const filePath = join(UPLOADS_DIR, fileName);
          await Bun.write(filePath, photo);

          const imageUrl = `${url.origin}/uploads/${fileName}`;
          db.query(
            `
            INSERT INTO performer_gallery_images (id, performer_user_id, image_url, created_at)
            VALUES (?, ?, ?, ?)
            `,
          ).run(crypto.randomUUID(), auth.id, imageUrl, createdAt);
          uploadedUrls.push(imageUrl);
        }

        return json({
          uploaded_urls: uploadedUrls,
          gallery_urls: getPerformerGallery(auth.id),
        });
      }

      if (method === "POST" && pathname === "/auth/register") {
        const body = await readJson<{
          email?: string;
          password?: string;
          role?: Role;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }

        const email = asString(body.email).toLowerCase();
        const password = asString(body.password);
        const role = body.role;

        if (!email || !password || !role) {
          return error("Champs requis: email, password, role.");
        }
        if (!["performer", "recruiter", "admin"].includes(role)) {
          return error("Rôle invalide.");
        }
        if (password.length < 8) {
          return error("Le mot de passe doit contenir au moins 8 caractères.");
        }

        const existing = db
          .query("SELECT id FROM users WHERE email = ?")
          .get(email) as { id: string } | null;
        if (existing) {
          return error("Cet email existe déjà.", 409);
        }

        const now = nowIso();
        const userId = crypto.randomUUID();
        const passwordHash = await Bun.password.hash(password);
        db.query(
          `
          INSERT INTO users (id, email, password_hash, role, created_at)
          VALUES (?, ?, ?, ?, ?)
          `,
        ).run(userId, email, passwordHash, role, now);

        if (role === "performer") {
          ensurePerformerProfile(userId);
        }
        if (role === "recruiter") {
          ensureRecruiterProfile(userId);
        }

        const token = crypto.randomUUID();
        db.query(
          "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
        ).run(token, userId, now);

        return json(
          {
            token,
            user: {
              id: userId,
              email,
              role,
            },
          },
          201,
        );
      }

      if (method === "POST" && pathname === "/auth/login") {
        const body = await readJson<{ email?: string; password?: string }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }

        const email = asString(body.email).toLowerCase();
        const password = asString(body.password);
        if (!email || !password) {
          return error("Champs requis: email, password.");
        }

        const user = db
          .query(
            `
            SELECT id, email, role, password_hash, is_suspended
            FROM users
            WHERE email = ?
            `,
          )
          .get(email) as
          | {
              id: string;
              email: string;
              role: Role;
              password_hash: string;
              is_suspended: number;
            }
          | null;

        if (!user) {
          return error("Identifiants invalides.", 401);
        }
        if (user.is_suspended) {
          return error("Compte suspendu.", 403);
        }

        const valid = await Bun.password.verify(password, user.password_hash);
        if (!valid) {
          return error("Identifiants invalides.", 401);
        }

        const token = crypto.randomUUID();
        db.query(
          "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
        ).run(token, user.id, nowIso());

        return json({
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        });
      }

      if (method === "GET" && pathname === "/auth/me") {
        const auth = requireAuth(req);
        if (auth instanceof Response) {
          return auth;
        }
        return json({
          user: {
            id: auth.id,
            email: auth.email,
            role: auth.role,
          },
        });
      }

      if (method === "GET" && pathname === "/performers") {
        const rows = db.query(
          `SELECT pp.user_id, pp.stage_name, pp.city, pp.bio, pp.specialty,
                  pp.photo_url, pp.languages_json, pp.completion_score
           FROM performer_profiles pp
           JOIN users u ON u.id = pp.user_id
           WHERE u.is_suspended = 0
             AND pp.completion_score >= 60
           ORDER BY pp.updated_at DESC`
        ).all() as Array<Record<string, unknown>>;

        const performers = rows.map((r) => ({
          user_id: asString(r.user_id),
          stage_name: asString(r.stage_name),
          city: asString(r.city),
          bio: asString(r.bio),
          specialty: asString(r.specialty),
          photo_url: asString(r.photo_url),
          languages: parseStoredLanguages(r.languages_json),
          completion_score: Number(r.completion_score) || 0,
        }));

        return json({ performers });
      }

      if (method === "GET" && pathname === "/performers/me") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }
        ensurePerformerProfile(auth.id);
        const profile = getPerformerProfile(auth.id);
        return json({ profile });
      }

      if (method === "PATCH" && pathname === "/performers/me") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }
        const body = await readJson<{
          stage_name?: string;
          city?: string;
          bio?: string;
          specialty?: string;
          phone?: string;
          height_cm?: string;
          weight_kg?: string;
          neck_circumference_cm?: string;
          pant_length_cm?: string;
          head_circumference_cm?: string;
          chest_circumference_cm?: string;
          shoe_size?: string;
          photo_url?: string;
          languages?: string[] | string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }

        ensurePerformerProfile(auth.id);
        const current = getPerformerProfile(auth.id);
        if (!current) {
          return error("Profil performeur introuvable.", 404);
        }

        const merged = {
          stage_name: body.stage_name !== undefined ? asString(body.stage_name) : current.stage_name,
          city: body.city !== undefined ? asString(body.city) : current.city,
          bio: body.bio !== undefined ? asString(body.bio) : current.bio,
          specialty: body.specialty !== undefined ? asString(body.specialty) : current.specialty,
          phone: body.phone !== undefined ? asString(body.phone) : current.phone,
          height_cm: body.height_cm !== undefined ? asString(body.height_cm) : current.height_cm,
          weight_kg: body.weight_kg !== undefined ? asString(body.weight_kg) : current.weight_kg,
          neck_circumference_cm:
            body.neck_circumference_cm !== undefined
              ? asString(body.neck_circumference_cm)
              : current.neck_circumference_cm,
          pant_length_cm:
            body.pant_length_cm !== undefined
              ? asString(body.pant_length_cm)
              : current.pant_length_cm,
          head_circumference_cm:
            body.head_circumference_cm !== undefined
              ? asString(body.head_circumference_cm)
              : current.head_circumference_cm,
          chest_circumference_cm:
            body.chest_circumference_cm !== undefined
              ? asString(body.chest_circumference_cm)
              : current.chest_circumference_cm,
          shoe_size: body.shoe_size !== undefined ? asString(body.shoe_size) : current.shoe_size,
          photo_url: body.photo_url !== undefined ? asString(body.photo_url) : current.photo_url,
          languages:
            body.languages !== undefined
              ? parseLanguages(body.languages)
              : (current.languages as string[]),
        };

        const completion = computePerformerCompletion(merged);
        const now = nowIso();

        db.query(
          `
          UPDATE performer_profiles
          SET
            stage_name = ?,
            city = ?,
            bio = ?,
            specialty = ?,
            phone = ?,
            height_cm = ?,
            weight_kg = ?,
            neck_circumference_cm = ?,
            pant_length_cm = ?,
            head_circumference_cm = ?,
            chest_circumference_cm = ?,
            shoe_size = ?,
            photo_url = ?,
            languages_json = ?,
            completion_score = ?,
            updated_at = ?
          WHERE user_id = ?
          `,
        ).run(
          merged.stage_name,
          merged.city,
          merged.bio,
          merged.specialty,
          merged.phone,
          merged.height_cm,
          merged.weight_kg,
          merged.neck_circumference_cm,
          merged.pant_length_cm,
          merged.head_circumference_cm,
          merged.chest_circumference_cm,
          merged.shoe_size,
          merged.photo_url,
          JSON.stringify(merged.languages),
          completion,
          now,
          auth.id,
        );

        const updated = getPerformerProfile(auth.id);
        return json({ profile: updated });
      }

      const performerByIdMatch = pathname.match(/^\/performers\/([^/]+)$/);
      if (method === "GET" && performerByIdMatch) {
        const userId = performerByIdMatch[1]!;
        const profile = getPerformerProfile(userId);
        if (!profile) {
          return error("Profil introuvable.", 404);
        }
        return json({
          profile: {
            user_id: profile.user_id,
            stage_name: profile.stage_name,
            city: profile.city,
            bio: profile.bio,
            specialty: profile.specialty,
            phone: profile.phone,
            height_cm: profile.height_cm,
            weight_kg: profile.weight_kg,
            neck_circumference_cm: profile.neck_circumference_cm,
            pant_length_cm: profile.pant_length_cm,
            head_circumference_cm: profile.head_circumference_cm,
            chest_circumference_cm: profile.chest_circumference_cm,
            shoe_size: profile.shoe_size,
            photo_url: profile.photo_url,
            languages: profile.languages,
            completion_score: profile.completion_score,
          },
        });
      }

      if (method === "GET" && pathname === "/recruiters/me") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        ensureRecruiterProfile(auth.id);
        return json({ profile: getRecruiterProfile(auth.id) });
      }

      if (method === "PATCH" && pathname === "/recruiters/me") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const body = await readJson<{ company_name?: string; description?: string }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        ensureRecruiterProfile(auth.id);
        const current = getRecruiterProfile(auth.id);
        if (!current) {
          return error("Profil recruteur introuvable.", 404);
        }
        const companyName =
          body.company_name !== undefined ? asString(body.company_name) : current.company_name;
        const description =
          body.description !== undefined ? asString(body.description) : current.description;
        db.query(
          `
          UPDATE recruiter_profiles
          SET company_name = ?, description = ?, updated_at = ?
          WHERE user_id = ?
          `,
        ).run(companyName, description, nowIso(), auth.id);

        return json({ profile: getRecruiterProfile(auth.id) });
      }

      if (method === "GET" && pathname === "/offers") {
        const city = asString(url.searchParams.get("city"));
        const projectType = asString(url.searchParams.get("project_type"));
        const status = asString(url.searchParams.get("status"));
        const mine = url.searchParams.get("mine") === "1";

        const conditions: string[] = [];
        const params: string[] = [];
        const auth = getAuthUser(req);

        if (mine) {
          if (!auth || auth.role !== "recruiter") {
            return error("Accès réservé aux recruteurs.", 403);
          }
          conditions.push("o.recruiter_user_id = ?");
          params.push(auth.id);
        } else {
          conditions.push("o.status = 'published'");
        }

        if (status) {
          const allowed = ["draft", "published", "closed"];
          if (!allowed.includes(status)) {
            return error("Statut invalide.");
          }
          if (!mine) {
            if (status !== "published") {
              return error("Seules les offres publiées sont visibles publiquement.", 403);
            }
          } else {
            conditions.push("o.status = ?");
            params.push(status);
          }
        }

        if (city) {
          conditions.push("o.city = ?");
          params.push(city);
        }
        if (projectType) {
          conditions.push("o.project_type = ?");
          params.push(projectType);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const rows = db
          .query(
            `
            SELECT
              o.id,
              o.recruiter_user_id,
              o.title,
              o.project_type,
              o.description,
              o.city,
              o.deadline_at,
              o.status,
              o.created_at,
              o.updated_at,
              (
                SELECT COUNT(*)
                FROM applications a
                WHERE a.offer_id = o.id
              ) AS applications_count
            FROM offers o
            ${where}
            ORDER BY o.created_at DESC
            `,
          )
          .all(...params) as Array<Record<string, unknown>>;

        return json({ offers: rows });
      }

      const offerIdMatch = pathname.match(/^\/offers\/([^/]+)$/);
      if (offerIdMatch && method === "GET") {
        const offerId = offerIdMatch[1]!;
        const offer = db
          .query(
            `
            SELECT id, recruiter_user_id, title, project_type, description, city, deadline_at, status, created_at, updated_at
            FROM offers
            WHERE id = ?
            `,
          )
          .get(offerId) as
          | {
              id: string;
              recruiter_user_id: string;
              title: string;
              project_type: string;
              description: string;
              city: string;
              deadline_at: string;
              status: string;
              created_at: string;
              updated_at: string;
            }
          | null;
        if (!offer) {
          return error("Offre introuvable.", 404);
        }

        if (offer.status !== "published") {
          const auth = requireAuth(req);
          if (auth instanceof Response) {
            return auth;
          }
          if (auth.role !== "admin" && auth.id !== offer.recruiter_user_id) {
            return error("Accès interdit.", 403);
          }
        }

        return json({ offer });
      }

      if (method === "POST" && pathname === "/offers") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const body = await readJson<{
          title?: string;
          project_type?: string;
          description?: string;
          city?: string;
          deadline_at?: string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const title = asString(body.title);
        const projectType = asString(body.project_type);
        const description = asString(body.description);
        const city = asString(body.city);
        const deadlineAt = asString(body.deadline_at);

        if (!title || !projectType || !description || !city || !deadlineAt) {
          return error("Champs requis: title, project_type, description, city, deadline_at.");
        }

        const offerId = crypto.randomUUID();
        const now = nowIso();
        db.query(
          `
          INSERT INTO offers (
            id, recruiter_user_id, title, project_type, description, city, deadline_at, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)
          `,
        ).run(
          offerId,
          auth.id,
          title,
          projectType,
          description,
          city,
          deadlineAt,
          now,
          now,
        );

        return json(
          {
            offer: {
              id: offerId,
              recruiter_user_id: auth.id,
              title,
              project_type: projectType,
              description,
              city,
              deadline_at: deadlineAt,
              status: "draft",
              created_at: now,
              updated_at: now,
            },
          },
          201,
        );
      }

      if (offerIdMatch && method === "PATCH") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const offerId = offerIdMatch[1]!;
        const existing = db
          .query(
            `
            SELECT id, recruiter_user_id, title, project_type, description, city, deadline_at, status
            FROM offers
            WHERE id = ?
            `,
          )
          .get(offerId) as
          | {
              id: string;
              recruiter_user_id: string;
              title: string;
              project_type: string;
              description: string;
              city: string;
              deadline_at: string;
              status: string;
            }
          | null;
        if (!existing) {
          return error("Offre introuvable.", 404);
        }
        if (existing.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }

        const body = await readJson<{
          title?: string;
          project_type?: string;
          description?: string;
          city?: string;
          deadline_at?: string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }

        const next = {
          title: body.title !== undefined ? asString(body.title) : existing.title,
          project_type:
            body.project_type !== undefined ? asString(body.project_type) : existing.project_type,
          description:
            body.description !== undefined ? asString(body.description) : existing.description,
          city: body.city !== undefined ? asString(body.city) : existing.city,
          deadline_at:
            body.deadline_at !== undefined ? asString(body.deadline_at) : existing.deadline_at,
        };

        if (!next.title || !next.project_type || !next.description || !next.city || !next.deadline_at) {
          return error("Les champs obligatoires de l'offre ne peuvent pas être vides.");
        }

        const updatedAt = nowIso();
        db.query(
          `
          UPDATE offers
          SET title = ?, project_type = ?, description = ?, city = ?, deadline_at = ?, updated_at = ?
          WHERE id = ?
          `,
        ).run(
          next.title,
          next.project_type,
          next.description,
          next.city,
          next.deadline_at,
          updatedAt,
          offerId,
        );

        return json({
          offer: {
            ...existing,
            ...next,
            updated_at: updatedAt,
          },
        });
      }

      const offerPublishMatch = pathname.match(/^\/offers\/([^/]+)\/publish$/);
      if (offerPublishMatch && method === "POST") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const offerId = offerPublishMatch[1]!;
        const offer = db
          .query("SELECT id, recruiter_user_id, status FROM offers WHERE id = ?")
          .get(offerId) as { id: string; recruiter_user_id: string; status: string } | null;
        if (!offer) {
          return error("Offre introuvable.", 404);
        }
        if (offer.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }

        db.query("UPDATE offers SET status = 'published', updated_at = ? WHERE id = ?").run(
          nowIso(),
          offerId,
        );
        return json({ message: "Offre publiée." });
      }

      const offerApplicationsMatch = pathname.match(/^\/offers\/([^/]+)\/applications$/);
      if (offerApplicationsMatch && method === "GET") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const offerId = offerApplicationsMatch[1]!;
        const offer = getOfferForMatch(offerId);
        if (!offer) {
          return error("Offre introuvable.", 404);
        }
        if (offer.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }
        const sort = asString(url.searchParams.get("sort")).toLowerCase();
        const trackMatch = url.searchParams.get("track_match") !== "0";

        const applications = db
          .query(
            `
            SELECT
              a.id,
              a.offer_id,
              a.performer_user_id,
              a.motivation_text,
              a.status,
              a.created_at,
              a.updated_at,
              p.stage_name,
              p.city,
              p.specialty,
              p.completion_score,
              p.bio,
              p.languages_json
            FROM applications a
            LEFT JOIN performer_profiles p ON p.user_id = a.performer_user_id
            WHERE a.offer_id = ?
            ORDER BY a.created_at DESC
            `,
          )
          .all(offerId) as Array<Record<string, unknown>>;

        if (sort === "match") {
          const offerForMatch: MatchOffer = {
            id: offer.id,
            title: offer.title,
            project_type: offer.project_type,
            description: offer.description,
            city: offer.city,
            deadline_at: offer.deadline_at,
          };

          const scored = await Promise.all(
            applications.map(async (app) => {
              const performer: MatchPerformer = {
                user_id: asString(app.performer_user_id),
                stage_name: asString(app.stage_name),
                city: asString(app.city),
                bio: asString(app.bio),
                specialty: asString(app.specialty),
                languages: parseStoredLanguages(app.languages_json),
                completion_score: clampScore(asFiniteNumber(app.completion_score) ?? 0),
              };
              const rule = computeRuleMatch(offerForMatch, performer);
              const features = buildMlFeatures(offerForMatch, performer, rule);
              const ml = await requestMlScore(
                offerForMatch.id,
                performer.user_id,
                rule.rule_score,
                features,
              );
              const finalScore = blendScore(rule.rule_score, ml?.ml_score);

              let impressionId: string | null = null;
              if (trackMatch) {
                impressionId = insertMatchImpression({
                  offer_id: offerForMatch.id,
                  recruiter_user_id: auth.id,
                  performer_user_id: performer.user_id,
                  source: "applications_list",
                  rule_score: rule.rule_score,
                  ml_score: ml?.ml_score,
                  final_score: finalScore,
                  model_version: ml?.model_version,
                });
              }

              return {
                ...app,
                match_score: finalScore,
                match_rule_score: rule.rule_score,
                match_ml_score: ml?.ml_score ?? null,
                match_breakdown: rule.breakdown,
                match_reasons: rule.reasons,
                ml_model_version: ml?.model_version ?? null,
                ml_feature_contributions: ml?.feature_contributions ?? {},
                match_impression_id: impressionId,
              };
            }),
          );

          scored.sort((a, b) => {
            const delta =
              (asFiniteNumber(b.match_score) ?? 0) - (asFiniteNumber(a.match_score) ?? 0);
            if (delta !== 0) {
              return delta;
            }
            const aCreated = Date.parse(asString((a as Record<string, unknown>).created_at));
            const bCreated = Date.parse(asString((b as Record<string, unknown>).created_at));
            return bCreated - aCreated;
          });

          return json({
            applications: scored,
            ranking: {
              mode: "match",
              tracked: trackMatch,
            },
          });
        }

        return json({ applications });
      }

      const offerTalentsMatch = pathname.match(/^\/offers\/([^/]+)\/talents$/);
      if (offerTalentsMatch && method === "GET") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const offerId = offerTalentsMatch[1]!;
        const offer = getOfferForMatch(offerId);
        if (!offer) {
          return error("Offre introuvable.", 404);
        }
        if (offer.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }

        const parsedLimit = asFiniteNumber(url.searchParams.get("limit"));
        const limit =
          parsedLimit === null ? 50 : Math.max(1, Math.min(200, Math.round(parsedLimit)));
        const trackMatch = url.searchParams.get("track_match") !== "0";

        const talents = db
          .query(
            `
            SELECT
              pp.user_id,
              pp.stage_name,
              pp.city,
              pp.specialty,
              pp.phone,
              pp.photo_url,
              pp.bio,
              pp.languages_json,
              pp.completion_score,
              a.id AS application_id,
              a.status AS application_status
            FROM performer_profiles pp
            JOIN users u ON u.id = pp.user_id
            LEFT JOIN applications a
              ON a.offer_id = ? AND a.performer_user_id = pp.user_id
            WHERE u.is_suspended = 0
              AND pp.completion_score >= 60
            `,
          )
          .all(offerId) as Array<Record<string, unknown>>;

        if (talents.length === 0) {
          return json({
            talents: [],
            ranking: {
              mode: "match",
              tracked: trackMatch,
              total: 0,
              limit,
            },
          });
        }

        const offerForMatch: MatchOffer = {
          id: offer.id,
          title: offer.title,
          project_type: offer.project_type,
          description: offer.description,
          city: offer.city,
          deadline_at: offer.deadline_at,
        };

        const scored = await Promise.all(
          talents.map(async (row) => {
            const performer: MatchPerformer = {
              user_id: asString(row.user_id),
              stage_name: asString(row.stage_name),
              city: asString(row.city),
              bio: asString(row.bio),
              specialty: asString(row.specialty),
              languages: parseStoredLanguages(row.languages_json),
              completion_score: clampScore(asFiniteNumber(row.completion_score) ?? 0),
            };

            const rule = computeRuleMatch(offerForMatch, performer);
            const features = buildMlFeatures(offerForMatch, performer, rule);
            const ml = await requestMlScore(
              offerForMatch.id,
              performer.user_id,
              rule.rule_score,
              features,
            );
            const finalScore = blendScore(rule.rule_score, ml?.ml_score);

            let impressionId: string | null = null;
            if (trackMatch) {
              impressionId = insertMatchImpression({
                offer_id: offerForMatch.id,
                recruiter_user_id: auth.id,
                performer_user_id: performer.user_id,
                source: "offer_talents_list",
                rule_score: rule.rule_score,
                ml_score: ml?.ml_score,
                final_score: finalScore,
                model_version: ml?.model_version,
              });
            }

            return {
              performer_user_id: performer.user_id,
              stage_name: performer.stage_name,
              city: performer.city,
              specialty: performer.specialty,
              completion_score: performer.completion_score,
              phone: asString(row.phone),
              photo_url: asString(row.photo_url),
              application_id: asString(row.application_id) || null,
              application_status: asString(row.application_status) || null,
              match_score: finalScore,
              match_rule_score: rule.rule_score,
              match_ml_score: ml?.ml_score ?? null,
              match_reasons: rule.reasons,
              match_impression_id: impressionId,
            };
          }),
        );

        scored.sort((a, b) => {
          const scoreDelta = b.match_score - a.match_score;
          if (scoreDelta !== 0) {
            return scoreDelta;
          }
          const completionDelta = b.completion_score - a.completion_score;
          if (completionDelta !== 0) {
            return completionDelta;
          }
          return a.stage_name.localeCompare(b.stage_name, "fr", { sensitivity: "base" });
        });

        return json({
          talents: scored.slice(0, limit),
          ranking: {
            mode: "match",
            tracked: trackMatch,
            total: scored.length,
            limit,
          },
        });
      }

      const offerApplyMatch = pathname.match(/^\/offers\/([^/]+)\/apply$/);
      if (offerApplyMatch && method === "POST") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }
        const offerId = offerApplyMatch[1]!;
        const offer = db
          .query(
            `
            SELECT id, status, deadline_at
            FROM offers
            WHERE id = ?
            `,
          )
          .get(offerId) as { id: string; status: string; deadline_at: string } | null;
        if (!offer) {
          return error("Offre introuvable.", 404);
        }
        if (offer.status !== "published") {
          return error("Cette offre n'accepte pas de candidatures.", 400);
        }
        if (Date.parse(offer.deadline_at) < Date.now()) {
          return error("Date limite dépassée pour cette offre.", 400);
        }

        ensurePerformerProfile(auth.id);
        const profile = getPerformerProfile(auth.id);
        if (!profile || profile.completion_score < 60) {
          return error(
            "Profil incomplet: score minimum 60% requis avant de candidater.",
            400,
          );
        }

        const body = await readJson<{ motivation_text?: string }>(req);
        const motivationText = asString(body?.motivation_text);

        const appId = crypto.randomUUID();
        const now = nowIso();
        try {
          db.query(
            `
            INSERT INTO applications (id, offer_id, performer_user_id, motivation_text, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'submitted', ?, ?)
            `,
          ).run(appId, offerId, auth.id, motivationText, now, now);
        } catch (err) {
          const message = `${err}`;
          if (message.includes("UNIQUE constraint failed")) {
            return error("Vous avez déjà candidaté à cette offre.", 409);
          }
          throw err;
        }

        return json(
          {
            application: {
              id: appId,
              offer_id: offerId,
              performer_user_id: auth.id,
              motivation_text: motivationText,
              status: "submitted",
              created_at: now,
              updated_at: now,
            },
          },
          201,
        );
      }

      if (method === "GET" && pathname === "/applications/me") {
        const auth = requireAuth(req, ["performer"]);
        if (auth instanceof Response) {
          return auth;
        }
        const applications = db
          .query(
            `
            SELECT
              a.id,
              a.offer_id,
              a.motivation_text,
              a.status,
              a.created_at,
              a.updated_at,
              o.title AS offer_title,
              o.city AS offer_city,
              o.project_type AS offer_project_type
            FROM applications a
            JOIN offers o ON o.id = a.offer_id
            WHERE a.performer_user_id = ?
            ORDER BY a.created_at DESC
            `,
          )
          .all(auth.id) as Array<Record<string, unknown>>;
        return json({ applications });
      }

      const applicationStatusMatch = pathname.match(/^\/applications\/([^/]+)\/status$/);
      if (applicationStatusMatch && method === "PATCH") {
        const auth = requireAuth(req, ["recruiter"]);
        if (auth instanceof Response) {
          return auth;
        }
        const applicationId = applicationStatusMatch[1]!;
        const body = await readJson<{ status?: string }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const nextStatus = asString(body.status);
        const allowed = ["in_review", "shortlisted", "rejected", "selected"];
        if (!allowed.includes(nextStatus)) {
          return error("Statut cible invalide.");
        }

        const application = db
          .query(
            `
            SELECT a.id, a.status, a.offer_id, a.performer_user_id, o.recruiter_user_id
            FROM applications a
            JOIN offers o ON o.id = a.offer_id
            WHERE a.id = ?
            `,
          )
          .get(applicationId) as
          | {
              id: string;
              status: string;
              offer_id: string;
              performer_user_id: string;
              recruiter_user_id: string;
            }
          | null;
        if (!application) {
          return error("Candidature introuvable.", 404);
        }
        if (application.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }
        if (!canTransitionApplicationStatus(application.status, nextStatus)) {
          return error(`Transition non autorisée: ${application.status} -> ${nextStatus}.`);
        }

        db.query("UPDATE applications SET status = ?, updated_at = ? WHERE id = ?").run(
          nextStatus,
          nowIso(),
          applicationId,
        );
        insertMatchAction({
          offer_id: application.offer_id,
          recruiter_user_id: auth.id,
          performer_user_id: application.performer_user_id,
          action: nextStatus as "in_review" | "shortlisted" | "rejected" | "selected",
        });
        return json({ message: "Statut mis à jour." });
      }

      if (method === "POST" && pathname === "/reports") {
        const auth = requireAuth(req);
        if (auth instanceof Response) {
          return auth;
        }
        const body = await readJson<{
          target_type?: string;
          target_id?: string;
          reason?: string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const targetType = asString(body.target_type);
        const targetId = asString(body.target_id);
        const reason = asString(body.reason);
        if (!targetType || !targetId || !reason) {
          return error("Champs requis: target_type, target_id, reason.");
        }

        const reportId = crypto.randomUUID();
        db.query(
          `
          INSERT INTO reports (id, reporter_user_id, target_type, target_id, reason, status, created_at)
          VALUES (?, ?, ?, ?, ?, 'open', ?)
          `,
        ).run(reportId, auth.id, targetType, targetId, reason, nowIso());
        return json({ report_id: reportId }, 201);
      }

      if (method === "GET" && pathname === "/admin/reports") {
        const auth = requireAuth(req, ["admin"]);
        if (auth instanceof Response) {
          return auth;
        }
        const reports = db
          .query(
            `
            SELECT
              r.id,
              r.reporter_user_id,
              u.email AS reporter_email,
              r.target_type,
              r.target_id,
              r.reason,
              r.status,
              r.created_at
            FROM reports r
            JOIN users u ON u.id = r.reporter_user_id
            ORDER BY r.created_at DESC
            `,
          )
          .all() as Array<Record<string, unknown>>;
        return json({ reports });
      }

      const reportActionMatch = pathname.match(/^\/admin\/reports\/([^/]+)\/action$/);
      if (reportActionMatch && method === "POST") {
        const auth = requireAuth(req, ["admin"]);
        if (auth instanceof Response) {
          return auth;
        }
        const reportId = reportActionMatch[1]!;
        const body = await readJson<{ action?: string; note?: string }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const action = asString(body.action);
        const note = asString(body.note);
        if (!["dismiss", "warn", "suspend"].includes(action)) {
          return error("Action admin invalide.");
        }

        const report = db
          .query("SELECT id, target_type, target_id FROM reports WHERE id = ?")
          .get(reportId) as { id: string; target_type: string; target_id: string } | null;
        if (!report) {
          return error("Signalement introuvable.", 404);
        }

        db.query("UPDATE reports SET status = 'resolved' WHERE id = ?").run(reportId);
        db.query(
          `
          INSERT INTO admin_actions (id, admin_user_id, report_id, action, note, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
          `,
        ).run(crypto.randomUUID(), auth.id, reportId, action, note, nowIso());

        if (action === "suspend" && report.target_type === "user") {
          db.query("UPDATE users SET is_suspended = 1 WHERE id = ?").run(report.target_id);
        }

        return json({ message: "Action appliquée." });
      }

      if (method === "GET" && pathname === "/ai/match-score") {
        const auth = requireAuth(req, ["recruiter", "admin"]);
        if (auth instanceof Response) {
          return auth;
        }
        const performerId = asString(url.searchParams.get("performer_id"));
        const offerId = asString(url.searchParams.get("offer_id"));
        if (!performerId || !offerId) {
          return error("Query params requis: performer_id, offer_id.");
        }

        const offer = getOfferForMatch(offerId);
        if (!offer) {
          return error("Offre introuvable.", 404);
        }
        if (auth.role === "recruiter" && offer.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }

        const performer = getPerformerForMatch(performerId);
        if (!performer) {
          return error("Profil performeur introuvable.", 404);
        }

        const offerForMatch: MatchOffer = {
          id: offer.id,
          title: offer.title,
          project_type: offer.project_type,
          description: offer.description,
          city: offer.city,
          deadline_at: offer.deadline_at,
        };

        const rule = computeRuleMatch(offerForMatch, performer);
        const features = buildMlFeatures(offerForMatch, performer, rule);
        const ml = await requestMlScore(offer.id, performer.user_id, rule.rule_score, features);
        const finalScore = blendScore(rule.rule_score, ml?.ml_score);

        const shouldTrack = url.searchParams.get("track") !== "0";
        const impressionId = shouldTrack
          ? insertMatchImpression({
              offer_id: offer.id,
              recruiter_user_id: offer.recruiter_user_id,
              performer_user_id: performer.user_id,
              source: asString(url.searchParams.get("source")) || "match_score_endpoint",
              rule_score: rule.rule_score,
              ml_score: ml?.ml_score,
              final_score: finalScore,
              model_version: ml?.model_version,
            })
          : null;

        return json({
          match: {
            offer_id: offer.id,
            performer_user_id: performer.user_id,
            score: finalScore,
            rule_score: rule.rule_score,
            ml_score: ml?.ml_score ?? null,
            model_version: ml?.model_version ?? null,
            reasons: rule.reasons,
            breakdown: rule.breakdown,
            features,
            ml_feature_contributions: ml?.feature_contributions ?? {},
            impression_id: impressionId,
          },
          ml_available: Boolean(ml),
        });
      }

      if (method === "POST" && pathname === "/ai/match-action") {
        const auth = requireAuth(req, ["recruiter", "admin"]);
        if (auth instanceof Response) {
          return auth;
        }
        const body = await readJson<{
          impression_id?: string;
          offer_id?: string;
          performer_user_id?: string;
          action?: string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }

        const offerId = asString(body.offer_id);
        const performerUserId = asString(body.performer_user_id);
        const action = asString(body.action) as
          | "viewed"
          | "in_review"
          | "shortlisted"
          | "rejected"
          | "selected";
        const impressionId = asString(body.impression_id);
        const allowedActions = ["viewed", "in_review", "shortlisted", "rejected", "selected"];

        if (!offerId || !performerUserId || !action) {
          return error("Champs requis: offer_id, performer_user_id, action.");
        }
        if (!allowedActions.includes(action)) {
          return error("Action de matching invalide.");
        }

        const offer = getOfferForMatch(offerId);
        if (!offer) {
          return error("Offre introuvable.", 404);
        }
        if (auth.role === "recruiter" && offer.recruiter_user_id !== auth.id) {
          return error("Accès interdit.", 403);
        }
        const performer = getPerformerForMatch(performerUserId);
        if (!performer) {
          return error("Profil performeur introuvable.", 404);
        }

        const actionId = insertMatchAction({
          impression_id: impressionId || undefined,
          offer_id: offerId,
          recruiter_user_id: auth.role === "admin" ? offer.recruiter_user_id : auth.id,
          performer_user_id: performer.user_id,
          action,
        });
        return json({ action_id: actionId }, 201);
      }

      if (method === "POST" && pathname === "/ai/suggest-profile-bio") {
        const body = await readJson<{
          stage_name?: string;
          specialty?: string;
          city?: string;
          languages?: string[] | string;
          experience?: string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const stageName = asString(body.stage_name) || "Artiste";
        const specialty = asString(body.specialty) || "performeur";
        const city = asString(body.city) || "Maroc";
        const experience = asString(body.experience) || "une expérience variée";
        const languages = parseLanguages(body.languages).join(", ") || "français";

        return json({
          suggestions: [
            `${stageName} est ${specialty} basé(e) à ${city}, avec ${experience}. Disponible pour des projets audiovisuels et scéniques.`,
            `${stageName}, ${specialty}, intervient sur des productions au ${city}. Langues de travail: ${languages}.`,
            `Professionnel(le) du casting, ${stageName} combine ${experience} et une forte adaptabilité sur des rôles ${specialty}.`,
          ],
        });
      }

      if (method === "POST" && pathname === "/ai/generate-offer-description") {
        const body = await readJson<{
          project_type?: string;
          role_name?: string;
          city?: string;
          constraints?: string;
        }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const projectType = asString(body.project_type) || "projet audiovisuel";
        const roleName = asString(body.role_name) || "rôle principal";
        const city = asString(body.city) || "Maroc";
        const constraints = asString(body.constraints) || "bonne disponibilité et professionnalisme";

        return json({
          description: `Nous recherchons ${roleName} pour un ${projectType} tourné à ${city}. Le profil attendu doit démontrer ${constraints}. Merci d'envoyer une candidature complète (bio, photos, expérience, disponibilité).`,
        });
      }

      if (method === "POST" && pathname === "/ai/moderate-text") {
        const body = await readJson<{ text?: string }>(req);
        if (!body) {
          return error("Body JSON invalide.");
        }
        const text = asString(body.text).toLowerCase();
        if (!text) {
          return error("Champ requis: text.");
        }

        const highRiskKeywords = [
          "arnaque",
          "escroquerie",
          "payez",
          "virement",
          "mineur sex",
          "nudité explicite",
        ];
        const mediumRiskKeywords = ["urgent argent", "sans contrat", "whatsapp uniquement"];

        const highMatches = highRiskKeywords.filter((kw) => text.includes(kw));
        const mediumMatches = mediumRiskKeywords.filter((kw) => text.includes(kw));

        if (highMatches.length > 0) {
          return json({
            risk_level: "high",
            category: "safety",
            recommendation: "block",
            matches: highMatches,
          });
        }
        if (mediumMatches.length > 0) {
          return json({
            risk_level: "medium",
            category: "suspicious",
            recommendation: "review",
            matches: mediumMatches,
          });
        }
        return json({
          risk_level: "low",
          category: "clean",
          recommendation: "allow",
          matches: [],
        });
      }

      return error("Route introuvable.", 404);
    } catch (err) {
      console.error("[api] internal error", err);
      return error("Erreur interne serveur.", 500);
    }
  },
});

console.log(`[api] server running on http://localhost:${port}`);
