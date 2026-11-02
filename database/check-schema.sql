-- Read-only diagnostic. Select the intended schema in MySQL Workbench first.
SELECT DATABASE() AS selected_database;

-- Expect these seven tables; no output for a table means it is missing.
SELECT TABLE_NAME, ENGINE, TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('body_shape', 'gyms', 'moves', 'pokemon', 'pokemon_moves', 'trainer', 'trainer_pokemon')
ORDER BY TABLE_NAME;

-- Compare names/types/nullability/keys with the retained CREATE TABLE definitions.
SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN ('body_shape', 'gyms', 'moves', 'pokemon', 'pokemon_moves', 'trainer', 'trainer_pokemon')
ORDER BY TABLE_NAME, ORDINAL_POSITION;

SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME, ORDINAL_POSITION;

-- Counts are informational, not a requirement that existing data equal the dump.
SELECT (SELECT COUNT(*) FROM pokemon) AS pokemon,
       (SELECT COUNT(*) FROM trainer) AS trainers,
       (SELECT COUNT(*) FROM trainer_pokemon) AS catches,
       (SELECT COUNT(*) FROM moves) AS moves;
