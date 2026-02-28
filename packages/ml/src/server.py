from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import joblib
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

FEATURE_ORDER = [
    "city_match",
    "specialty_exact",
    "language_overlap",
    "profile_completion_norm",
    "text_similarity",
    "deadline_urgency",
    "rule_score_norm",
]

MODEL_PATH = Path(
    os.getenv(
        "ML_MODEL_PATH",
        str(Path(__file__).resolve().parents[1] / "models" / "ranker.joblib"),
    )
)
ENV_MODEL_VERSION = os.getenv("ML_MODEL_VERSION", "baseline-linear-v0")


class ScoreContext(BaseModel):
    offer_id: str | None = None
    performer_user_id: str | None = None


class ScoreRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    rule_score: float = 0
    features: dict[str, float] = Field(default_factory=dict)
    context: ScoreContext | None = None


class LoadedModel(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    estimator: Any
    feature_order: list[str]
    model_version: str
    calibrated: bool = False


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(maximum, value))


def normalize_feature(value: Any) -> float:
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        numeric = 0.0
    return clamp(numeric, 0.0, 1.0)


def baseline_score(features: dict[str, float]) -> tuple[int, dict[str, float]]:
    weights = {
        "city_match": 0.2,
        "specialty_exact": 0.25,
        "language_overlap": 0.15,
        "profile_completion_norm": 0.15,
        "text_similarity": 0.1,
        "deadline_urgency": 0.05,
        "rule_score_norm": 0.1,
    }
    weighted: dict[str, float] = {}
    for name, weight in weights.items():
        weighted[name] = normalize_feature(features.get(name, 0.0)) * weight
    raw_norm = sum(weighted.values())
    ml_score = int(round(clamp(raw_norm * 100, 0.0, 100.0)))
    contributions = {name: round(value * 100, 2) for name, value in weighted.items()}
    return ml_score, contributions


def load_model() -> LoadedModel | None:
    if not MODEL_PATH.exists():
        return None
    try:
        payload = joblib.load(MODEL_PATH)
    except Exception:
        return None

    if isinstance(payload, dict):
        estimator = payload.get("model")
        feature_order = payload.get("feature_order") or FEATURE_ORDER
        model_version = payload.get("model_version") or ENV_MODEL_VERSION
        calibrated = bool(payload.get("calibrated", False))
        if estimator is None:
            return None
        return LoadedModel(
            estimator=estimator,
            feature_order=list(feature_order),
            model_version=str(model_version),
            calibrated=calibrated,
        )
    return LoadedModel(
        estimator=payload,
        feature_order=FEATURE_ORDER,
        model_version=ENV_MODEL_VERSION,
        calibrated=False,
    )


def vectorize(features: dict[str, float], feature_order: list[str]) -> np.ndarray:
    vector = [normalize_feature(features.get(name, 0.0)) for name in feature_order]
    return np.array(vector, dtype=np.float64).reshape(1, -1)


def model_predict(model: LoadedModel, features: dict[str, float]) -> int:
    row = vectorize(features, model.feature_order)
    estimator = model.estimator

    if hasattr(estimator, "predict_proba"):
        proba = float(estimator.predict_proba(row)[0][1])
        return int(round(clamp(proba * 100, 0.0, 100.0)))

    value = estimator.predict(row)[0]
    return int(round(clamp(float(value) * 100, 0.0, 100.0)))


loaded_model = load_model()

app = FastAPI(title="casting-ml", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    model_version = loaded_model.model_version if loaded_model else ENV_MODEL_VERSION
    return {
        "ok": True,
        "service": "casting-ml",
        "model_version": model_version,
        "model_loaded": loaded_model is not None,
        "model_path": str(MODEL_PATH),
        "time": datetime.now(timezone.utc).isoformat(),
    }


@app.post("/score")
def score(payload: ScoreRequest) -> dict[str, Any]:
    rule_score = clamp(payload.rule_score, 0.0, 100.0)
    merged_features: dict[str, float] = {
        **payload.features,
        "rule_score_norm": normalize_feature(payload.features.get("rule_score_norm", rule_score / 100)),
    }
    baseline_value, baseline_contrib = baseline_score(merged_features)

    if loaded_model is None:
        return {
            "ml_score": baseline_value,
            "model_version": ENV_MODEL_VERSION,
            "calibrated": False,
            "feature_contributions": baseline_contrib,
        }

    predicted = model_predict(loaded_model, merged_features)
    return {
        "ml_score": predicted,
        "model_version": loaded_model.model_version,
        "calibrated": loaded_model.calibrated,
        "feature_contributions": baseline_contrib,
    }
