# casting

To install dependencies:

```bash
bun install
```

To run the API (MVP):

```bash
bun run dev:api
```

API URL: `http://localhost:3001`

To run the ML scoring service (optional but recommended for match scoring):

```bash
# one-time setup
cd packages/ml
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip setuptools wheel
python -m pip install -r requirements.txt
cd ../..

# start service
bun run dev:ml
```

ML URL: `http://localhost:3010`

To run the web app (prototype UI):

```bash
bun run dev:app
```

App URL: `http://localhost:3000`
UI stack: React + React Router (`HashRouter`)

Default admin account (seeded on first API start):
- email: `admin@casting.ma`
- password: `admin12345`

Important: change credentials before any non-local environment.

## Matching (scaffold)

- `GET /ai/match-score?performer_id=&offer_id=`: compute a blended score (`rule + ml`) and optionally log an impression.
- `GET /offers/:id/applications?sort=match`: rank applications by match score.
- `POST /ai/match-action`: log recruiter action labels (`viewed`, `in_review`, `shortlisted`, `rejected`, `selected`).

Environment variables:
- `ML_SERVICE_URL` (API, default `http://localhost:3010`)
- `ML_TIMEOUT_MS` (API, default `700`)
- `ML_PORT` (ML service, default `3010`)
- `ML_MODEL_VERSION` (ML service, default `baseline-linear-v0`)
- `ML_MODEL_PATH` (ML service model artifact path, default `packages/ml/models/ranker.joblib`)
