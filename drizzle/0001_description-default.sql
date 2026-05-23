BEGIN;

UPDATE links
SET description = ''
WHERE description IS NULL;

ALTER TABLE links
  ALTER COLUMN description SET DEFAULT '';

ALTER TABLE links
  ALTER COLUMN description SET NOT NULL;

COMMIT;
