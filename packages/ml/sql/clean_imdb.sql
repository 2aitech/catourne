PRAGMA threads=4;

-- 1) Load IMDb people dataset exactly as downloaded.
CREATE OR REPLACE TABLE raw_name_basics AS
SELECT *
FROM read_csv_auto(
  'packages/ml/data/raw/name.basics.tsv.gz',
  delim='\t',
  header=true,
  all_varchar=true
);

-- 1b) Load IMDb principal credits for credit-based talent signals.
CREATE OR REPLACE TABLE raw_title_principals AS
SELECT *
FROM read_csv_auto(
  'packages/ml/data/raw/title.principals.tsv.gz',
  delim='\t',
  header=true,
  all_varchar=true
);

-- 2) Normalize null markers and base fields.
CREATE OR REPLACE TABLE staging_imdb_people AS
SELECT
  NULLIF(trim(nconst), '') AS imdb_id,
  NULLIF(trim(primaryName), '\\N') AS stage_name,
  TRY_CAST(NULLIF(trim(birthYear), '\\N') AS INTEGER) AS birth_year,
  TRY_CAST(NULLIF(trim(deathYear), '\\N') AS INTEGER) AS death_year,
  lower(replace(COALESCE(NULLIF(trim(primaryProfession), '\\N'), ''), ' ', '')) AS profession_csv,
  COALESCE(NULLIF(trim(knownForTitles), '\\N'), '') AS known_for_titles_csv
FROM raw_name_basics
WHERE NULLIF(trim(nconst), '') IS NOT NULL
  AND NULLIF(trim(primaryName), '\\N') IS NOT NULL;

-- 3) Split profession CSV to one row per profession.
CREATE OR REPLACE TABLE staging_imdb_professions AS
SELECT
  imdb_id,
  stage_name,
  birth_year,
  death_year,
  known_for_titles_csv,
  profession
FROM (
  SELECT
    imdb_id,
    stage_name,
    birth_year,
    death_year,
    known_for_titles_csv,
    unnest(string_split(profession_csv, ',')) AS profession
  FROM staging_imdb_people
) p
WHERE profession IS NOT NULL
  AND profession <> '';

-- 3b) Normalize principal credits and keep talent-oriented rows.
CREATE OR REPLACE TABLE staging_principal_talent_rows AS
SELECT
  NULLIF(trim(nconst), '') AS imdb_id,
  lower(COALESCE(NULLIF(trim(category), '\\N'), '')) AS category_norm,
  lower(COALESCE(NULLIF(trim(job), '\\N'), '')) AS job_norm
FROM raw_title_principals
WHERE NULLIF(trim(nconst), '') IS NOT NULL;

CREATE OR REPLACE TABLE staging_principal_talent_credits AS
SELECT
  imdb_id,
  count(*) AS principal_credits_count,
  sum(CASE WHEN regexp_matches(category_norm, '(actor|actress|self)') THEN 1 ELSE 0 END) AS actor_credits_count,
  sum(CASE WHEN regexp_matches(category_norm, 'stunt') OR regexp_matches(job_norm, 'stunt') THEN 1 ELSE 0 END) AS stunt_credits_count,
  sum(CASE WHEN regexp_matches(job_norm, 'voice') THEN 1 ELSE 0 END) AS voice_credits_count,
  string_agg(DISTINCT category_norm, ',') FILTER (WHERE category_norm <> '') AS principal_categories_csv
FROM staging_principal_talent_rows
WHERE regexp_matches(category_norm, '(actor|actress|self|stunt)')
   OR regexp_matches(job_norm, '(stunt|voice)')
GROUP BY imdb_id;

-- 4) Keep only cinema talent-oriented professions and/or principal credits.
CREATE OR REPLACE TABLE marts_talent_profiles AS
WITH filtered_professions AS (
  SELECT *
  FROM staging_imdb_professions
  WHERE regexp_matches(profession, '(actor|actress|stunt|stunts|voice)')
),
with_unique_professions AS (
  SELECT DISTINCT
    imdb_id,
    stage_name,
    birth_year,
    death_year,
    known_for_titles_csv,
    profession
  FROM filtered_professions
  ),
aggregated AS (
  SELECT
    imdb_id,
    min(stage_name) AS stage_name,
    min(birth_year) AS birth_year,
    min(death_year) AS death_year,
    min(known_for_titles_csv) AS known_for_titles_csv,
    string_agg(profession, ',') AS professions_csv
  FROM with_unique_professions
  GROUP BY imdb_id
)
SELECT
  p.imdb_id,
  p.stage_name,
  p.birth_year,
  p.death_year,
  CASE
    WHEN regexp_matches(COALESCE(p.professions_csv, ''), 'stunt')
      OR COALESCE(c.stunt_credits_count, 0) > 0 THEN 'stunt'
    WHEN regexp_matches(COALESCE(p.professions_csv, ''), 'voice')
      OR COALESCE(c.voice_credits_count, 0) > 0 THEN 'voice'
    WHEN regexp_matches(COALESCE(p.professions_csv, ''), '(actor|actress)')
      OR COALESCE(c.actor_credits_count, 0) > 0 THEN 'actor'
    ELSE 'other_talent'
  END AS talent_family,
  p.professions_csv,
  p.known_for_titles_csv,
  CASE
    WHEN p.known_for_titles_csv = '' THEN 0
    ELSE 1 + length(p.known_for_titles_csv) - length(replace(p.known_for_titles_csv, ',', ''))
  END AS known_for_count,
  COALESCE(c.principal_credits_count, 0) AS principal_credits_count,
  COALESCE(c.actor_credits_count, 0) AS actor_credits_count,
  COALESCE(c.stunt_credits_count, 0) AS stunt_credits_count,
  COALESCE(c.voice_credits_count, 0) AS voice_credits_count,
  COALESCE(c.principal_categories_csv, '') AS principal_categories_csv
FROM aggregated p
LEFT JOIN staging_principal_talent_credits c ON c.imdb_id = p.imdb_id;

-- 5) Export cleaned files for downstream app/ML usage.
COPY (
  SELECT *
  FROM marts_talent_profiles
  ORDER BY stage_name
) TO 'packages/ml/data/processed/imdb_talents.parquet' (FORMAT PARQUET, COMPRESSION ZSTD);

COPY (
  SELECT *
  FROM marts_talent_profiles
  ORDER BY stage_name
) TO 'packages/ml/data/processed/imdb_talents.csv' (HEADER, DELIMITER ',');

-- 6) Quick QA summaries.
SELECT count(*) AS raw_rows FROM raw_name_basics;
SELECT count(*) AS raw_principal_rows FROM raw_title_principals;
SELECT count(*) AS cleaned_talent_rows FROM marts_talent_profiles;
SELECT talent_family, count(*) AS count
FROM marts_talent_profiles
GROUP BY 1
ORDER BY 2 DESC;
