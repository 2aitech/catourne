# @casting/ml (Python)

Python FastAPI service for match scoring.

## Data folders (IMDb ETL)

```
packages/ml/data/raw/        # original .tsv.gz files from IMDb
packages/ml/data/processed/  # cleaned parquet/csv outputs
packages/ml/data/imdb.duckdb # local DuckDB database file (generated)
packages/ml/sql/             # SQL pipelines
packages/ml/scripts/         # runnable shell helpers
```

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

## Clean IMDb `name.basics.tsv.gz` + `title.principals.tsv.gz`

1. Put your downloaded files here:

```bash
packages/ml/data/raw/name.basics.tsv.gz
packages/ml/data/raw/title.principals.tsv.gz
```

2. Run the cleaning pipeline from repo root:

```bash
bash packages/ml/scripts/run_imdb_clean.sh
```

Optional custom DB path:

```bash
bash packages/ml/scripts/run_imdb_clean.sh /tmp/imdb.duckdb
```

3. Output files:
- `packages/ml/data/processed/imdb_talents.parquet`
- `packages/ml/data/processed/imdb_talents.csv`

This pipeline:
- converts IMDb `\\N` values to null/empty values,
- filters to talent-focused professions (`actor`, `actress`, `stunt`, `voice`),
- uses `title.principals` to add credit-based counts (`actor_credits_count`, `stunt_credits_count`, `voice_credits_count`),
- creates `talent_family` for quick filtering,
- exports cleaned files for app/ML use.

Main SQL file:
- `packages/ml/sql/clean_imdb.sql`

Env vars:
- `DATABASE_PATH` (default `packages/api/data/dev.db`)
- `ML_MODEL_PATH` (default `packages/ml/models/ranker.joblib`)
- `ML_MODEL_VERSION` (used when no trained model is loaded)
