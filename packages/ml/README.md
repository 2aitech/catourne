# @casting/ml (Python)

Python FastAPI service for match scoring.

## Setup

```bash
cd packages/ml
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
```

## Run

From repo root:

```bash
bun run dev:ml
```

Or directly:

```bash
cd packages/ml
python -m uvicorn src.server:app --reload --host 0.0.0.0 --port 3010
```

## Train

Train from telemetry tables in SQLite:

```bash
cd packages/ml
python src/training/train.py
```

Env vars:
- `DATABASE_PATH` (default `packages/api/data/dev.db`)
- `ML_MODEL_PATH` (default `packages/ml/models/ranker.joblib`)
- `ML_MODEL_VERSION` (used when no trained model is loaded)
