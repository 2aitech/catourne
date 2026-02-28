from __future__ import annotations

import os
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error

ACTION_LABELS = {
    "viewed": 0.1,
    "in_review": 0.3,
    "shortlisted": 0.7,
    "selected": 1.0,
    "rejected": 0.0,
}

FEATURE_ORDER = [
    "rule_score_norm",
    "final_score_norm",
    "ml_score_norm",
]


@dataclass
class TrainConfig:
    database_path: Path
    output_path: Path


def default_database_path() -> Path:
    return Path(__file__).resolve().parents[4] / "api" / "data" / "dev.db"


def default_output_path() -> Path:
    return Path(__file__).resolve().parents[2] / "models" / "ranker.joblib"


def load_dataset(database_path: Path) -> pd.DataFrame:
    conn = sqlite3.connect(database_path)
    try:
        query = """
        SELECT
          mi.id AS impression_id,
          mi.rule_score,
          mi.ml_score,
          mi.final_score,
          labels.label_score
        FROM match_impressions mi
        JOIN (
          SELECT
            impression_id,
            MAX(
              CASE action
                WHEN 'selected' THEN 1.0
                WHEN 'shortlisted' THEN 0.7
                WHEN 'in_review' THEN 0.3
                WHEN 'viewed' THEN 0.1
                WHEN 'rejected' THEN 0.0
                ELSE NULL
              END
            ) AS label_score
          FROM match_actions
          WHERE impression_id IS NOT NULL
          GROUP BY impression_id
        ) AS labels ON labels.impression_id = mi.id
        WHERE labels.label_score IS NOT NULL
        """
        return pd.read_sql_query(query, conn)
    finally:
        conn.close()


def build_feature_matrix(df: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
    frame = df.copy()
    frame["rule_score_norm"] = frame["rule_score"].clip(lower=0, upper=100) / 100
    frame["final_score_norm"] = frame["final_score"].clip(lower=0, upper=100) / 100
    frame["ml_score_norm"] = frame["ml_score"].fillna(frame["rule_score"]).clip(lower=0, upper=100) / 100
    features = frame[FEATURE_ORDER].astype(float).to_numpy()
    labels = frame["label_score"].astype(float).to_numpy()
    return features, labels


def train_model(features: np.ndarray, labels: np.ndarray) -> Ridge:
    model = Ridge(alpha=1.0, random_state=42)
    model.fit(features, labels)
    return model


def evaluate_model(model: Ridge, features: np.ndarray, labels: np.ndarray) -> float:
    predictions = model.predict(features)
    return float(mean_squared_error(labels, predictions))


def save_artifact(model: Ridge, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    version = f"ridge-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    payload = {
        "model": model,
        "feature_order": FEATURE_ORDER,
        "model_version": version,
        "calibrated": False,
    }
    joblib.dump(payload, output_path)
    print(f"[ml-train] saved model to {output_path} (version={version})")


def main() -> None:
    config = TrainConfig(
        database_path=Path(os.getenv("DATABASE_PATH", str(default_database_path()))),
        output_path=Path(os.getenv("ML_MODEL_PATH", str(default_output_path()))),
    )

    if not config.database_path.exists():
        raise SystemExit(f"[ml-train] database not found: {config.database_path}")

    df = load_dataset(config.database_path)
    if df.empty:
        raise SystemExit(
            "[ml-train] no labeled rows found in match_impressions/match_actions. "
            "Log impressions/actions first."
        )

    features, labels = build_feature_matrix(df)
    model = train_model(features, labels)
    mse = evaluate_model(model, features, labels)
    print(f"[ml-train] samples={len(df)} mse={mse:.4f}")
    save_artifact(model, config.output_path)


if __name__ == "__main__":
    main()
