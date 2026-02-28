# Match Scoring Overview

This document explains how match scoring works today in the `casting` project, what the score relies on, and how to explain it clearly to others.

## 1. What the score is for

The score estimates how well a performer matches an offer (0 to 100).  
It is used to rank applications and support recruiter decisions.

The system combines:
- A deterministic rule-based score (business logic).
- A machine-learning score (when the ML service is available).

## 2. High-level formula

Final score:

```text
final_score = 0.6 * rule_score + 0.4 * ml_score
```

If ML is unavailable, the API falls back to:

```text
final_score = rule_score
```

## 3. What the rule score relies on

The rule score is a weighted blend of 5 components:

- `specialty` (30%): how close performer specialty is to offer title/type/description.
- `languages` (20%): overlap between offer language requirements and performer languages.
- `city` (20%): exact city match gets a high score.
- `completion` (15%): performer profile completeness.
- `text_similarity` (15%): keyword overlap between offer text and performer bio/specialty.

Rule formula:

```text
rule_score =
  0.30 * specialty +
  0.20 * languages +
  0.20 * city +
  0.15 * completion +
  0.15 * text_similarity
```

All components are normalized to 0..100 before weighting.

## 4. What the ML score relies on

The API builds normalized ML features per offer-performer pair:

- `city_match` (0 or 1)
- `specialty_exact` (0 or 1)
- `language_overlap` (0..1)
- `profile_completion_norm` (0..1)
- `text_similarity` (0..1)
- `deadline_urgency` (0..1, higher when deadline is near)

The ML service also injects:

- `rule_score_norm` (0..1)

### ML behavior by scenario

- If a trained model file is loaded, the model predicts `ml_score` (0..100).
- If no model is loaded, the service returns a weighted baseline score from the features above.

Baseline fallback weights:

- `city_match`: 20%
- `specialty_exact`: 25%
- `language_overlap`: 15%
- `profile_completion_norm`: 15%
- `text_similarity`: 10%
- `deadline_urgency`: 5%
- `rule_score_norm`: 10%

## 5. Data loop (how it improves over time)

When matching is requested, the API can log a `match_impression` with:
- rule score
- ML score
- final score
- model version

Recruiter actions can then be logged as labels:
- `viewed` (0.1)
- `in_review` (0.3)
- `shortlisted` (0.7)
- `selected` (1.0)
- `rejected` (0.0)

Training uses these logged impressions + actions to fit a Ridge regression model and save a new artifact.

## 6. How to explain this to non-technical people

Use this short version:

1. "We score each candidate from 0 to 100."
2. "60% comes from transparent matching rules (specialty, language, city, profile quality, text fit)."
3. "40% comes from ML when available, so the ranking can learn from recruiter behavior over time."
4. "If ML is down, the system still works with rule-based scoring."

## 7. Important current notes

- The system is robust to ML downtime (automatic fallback).
- The ML service returns feature contribution values from its baseline weighting for explainability.
- Training currently learns from historical score columns and action labels in telemetry tables.

## 8. Quick example

If:
- `rule_score = 80`
- `ml_score = 70`

Then:

```text
final_score = 0.6*80 + 0.4*70 = 76
```

If ML is unavailable, final score would stay `80`.

