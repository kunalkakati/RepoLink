BEGIN;

ALTER TABLE links
  ALTER COLUMN tag DROP NOT NULL;

ALTER TABLE links
  ALTER COLUMN tag TYPE jsonb USING (
    CASE
      WHEN trim(tag) = '' THEN '[]'::jsonb
      WHEN trim(tag) ~ '^\[.*\]$' THEN tag::jsonb
      ELSE to_jsonb(array_remove(regexp_split_to_array(tag, '\\s*,\\s*'), ''))
    END
  );

ALTER TABLE links
  ALTER COLUMN tag SET DEFAULT '[]'::jsonb;

ALTER TABLE links
  ALTER COLUMN tag SET NOT NULL;

COMMIT;
