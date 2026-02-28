export type MatchOffer = {
  id: string;
  title: string;
  project_type: string;
  description: string;
  city: string;
  deadline_at: string;
};

export type MatchPerformer = {
  user_id: string;
  stage_name: string;
  city: string;
  bio: string;
  specialty: string;
  languages: string[];
  completion_score: number;
};

export type RuleMatchBreakdown = {
  specialty: number;
  languages: number;
  city: number;
  completion: number;
  text_similarity: number;
};

export type RuleMatchResult = {
  rule_score: number;
  breakdown: RuleMatchBreakdown;
  reasons: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function tokenize(value: string): Set<string> {
  const words = normalize(value)
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
  return new Set(words);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) {
    return 0;
  }
  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) {
      intersection += 1;
    }
  }
  const union = a.size + b.size - intersection;
  return union <= 0 ? 0 : intersection / union;
}

function detectLanguagesFromOffer(offer: MatchOffer): string[] {
  const text = normalize(`${offer.title} ${offer.description}`);
  const tokens = new Set(text.split(/[^a-z0-9]+/).filter(Boolean));
  const rules: Array<[string, string[]]> = [
    ["francais", ["francais", "fr", "french"]],
    ["arabe", ["arabe", "arabic", "darija"]],
    ["anglais", ["anglais", "english", "en"]],
    ["amazigh", ["amazigh", "tamazight"]],
    ["espagnol", ["espagnol", "spanish", "espanol"]],
  ];
  return rules
    .filter(([, aliases]) => aliases.some((alias) => tokens.has(alias)))
    .map(([canonical]) => canonical);
}

function languageOverlapScore(offer: MatchOffer, performer: MatchPerformer): number {
  const required = detectLanguagesFromOffer(offer);
  const performerLangs = new Set(performer.languages.map(normalize));
  if (required.length === 0) {
    return performerLangs.size > 0 ? 70 : 40;
  }
  const matches = required.filter((lang) => performerLangs.has(lang)).length;
  return Math.round((matches / required.length) * 100);
}

function specialtyScore(offer: MatchOffer, performer: MatchPerformer): number {
  const performerSpecialty = normalize(performer.specialty);
  if (!performerSpecialty) {
    return 0;
  }
  const offerText = normalize(`${offer.title} ${offer.project_type} ${offer.description}`);
  if (offerText.includes(performerSpecialty)) {
    return 100;
  }
  const performerTokens = tokenize(performer.specialty);
  const offerTokens = tokenize(offerText);
  return Math.round(jaccard(performerTokens, offerTokens) * 100);
}

function cityScore(offer: MatchOffer, performer: MatchPerformer): number {
  const offerCity = normalize(offer.city);
  const performerCity = normalize(performer.city);
  if (!offerCity || !performerCity) {
    return 40;
  }
  if (offerCity === performerCity) {
    return 100;
  }
  return 35;
}

function textSimilarityScore(offer: MatchOffer, performer: MatchPerformer): number {
  const offerTokens = tokenize(`${offer.title} ${offer.description} ${offer.project_type}`);
  const performerTokens = tokenize(`${performer.bio} ${performer.specialty}`);
  return Math.round(jaccard(offerTokens, performerTokens) * 100);
}

export function computeRuleMatch(offer: MatchOffer, performer: MatchPerformer): RuleMatchResult {
  const specialty = specialtyScore(offer, performer);
  const languages = languageOverlapScore(offer, performer);
  const city = cityScore(offer, performer);
  const completion = clamp(Math.round(performer.completion_score || 0), 0, 100);
  const textSimilarity = textSimilarityScore(offer, performer);

  const weighted =
    specialty * 0.3 +
    languages * 0.2 +
    city * 0.2 +
    completion * 0.15 +
    textSimilarity * 0.15;
  const ruleScore = Math.round(clamp(weighted, 0, 100));

  const reasons: string[] = [];
  if (specialty >= 80) {
    reasons.push("Specialite tres proche du role");
  }
  if (city >= 80) {
    reasons.push("Ville identique a l'offre");
  }
  if (languages >= 70) {
    reasons.push("Langues pertinentes pour l'offre");
  }
  if (completion >= 80) {
    reasons.push("Profil fortement complete");
  }
  if (textSimilarity >= 25) {
    reasons.push("Description et bio partagent des mots-cles");
  }

  return {
    rule_score: ruleScore,
    breakdown: {
      specialty,
      languages,
      city,
      completion,
      text_similarity: textSimilarity,
    },
    reasons,
  };
}

export function buildMlFeatures(
  offer: MatchOffer,
  performer: MatchPerformer,
  rule: RuleMatchResult,
): Record<string, number> {
  const deadlineMs = Date.parse(offer.deadline_at);
  const nowMs = Date.now();
  const daysUntilDeadline =
    Number.isFinite(deadlineMs) && deadlineMs > nowMs
      ? (deadlineMs - nowMs) / (1000 * 60 * 60 * 24)
      : 0;

  return {
    city_match: rule.breakdown.city >= 80 ? 1 : 0,
    specialty_exact: rule.breakdown.specialty >= 80 ? 1 : 0,
    language_overlap: clamp(rule.breakdown.languages / 100, 0, 1),
    profile_completion_norm: clamp((performer.completion_score || 0) / 100, 0, 1),
    text_similarity: clamp(rule.breakdown.text_similarity / 100, 0, 1),
    deadline_urgency: clamp(1 - daysUntilDeadline / 30, 0, 1),
  };
}
