BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS links_name_unique_index ON links (lower(name));

COMMIT;
