#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DB_PATH="${1:-$ROOT_DIR/data/imdb.duckdb}"
NAME_BASICS_FILE="$ROOT_DIR/data/raw/name.basics.tsv.gz"
TITLE_PRINCIPALS_FILE="$ROOT_DIR/data/raw/title.principals.tsv.gz"
SQL_FILE="$ROOT_DIR/sql/clean_imdb.sql"

if ! command -v duckdb >/dev/null 2>&1; then
  echo "duckdb CLI is not installed or not in PATH."
  echo "Install: https://duckdb.org/docs/installation/"
  exit 1
fi

if [[ ! -f "$NAME_BASICS_FILE" ]]; then
  echo "Missing required input: $NAME_BASICS_FILE"
  echo "Add name.basics.tsv.gz to packages/ml/data/raw/, then rerun."
  exit 1
fi

if [[ ! -f "$TITLE_PRINCIPALS_FILE" ]]; then
  echo "Missing required input: $TITLE_PRINCIPALS_FILE"
  echo "Add title.principals.tsv.gz to packages/ml/data/raw/, then rerun."
  exit 1
fi

mkdir -p "$ROOT_DIR/data/processed"

echo "Running IMDb cleaning into: $DB_PATH"
duckdb "$DB_PATH" -f "$SQL_FILE"

echo "Done. Outputs:"
echo "- $ROOT_DIR/data/processed/imdb_talents.parquet"
echo "- $ROOT_DIR/data/processed/imdb_talents.csv"
