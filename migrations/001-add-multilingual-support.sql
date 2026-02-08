-- ============================================
-- Migration: Add Multilingual Support
-- Description: Create languages and translation tables
-- Date: 2026-02-08
-- ============================================

-- Step 1: Create Languages Table
-- ============================================
CREATE TABLE IF NOT EXISTS languages (
  code VARCHAR(5) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default languages
INSERT INTO languages (code, name, is_default, is_active) VALUES
  ('en', 'English', true, true),
  ('fr', 'Français', false, true)
ON CONFLICT (code) DO NOTHING;

-- Step 2: Create Ecclesiastical Unit Translations Table
-- ============================================
CREATE TABLE IF NOT EXISTS ecclesiastical_unit_translations (
  id SERIAL PRIMARY KEY,
  ecclesiastical_unit_code INT NOT NULL,
  language_code VARCHAR(5) NOT NULL,
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  adresse TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (ecclesiastical_unit_code) REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
  FOREIGN KEY (language_code) REFERENCES languages(code),
  UNIQUE(ecclesiastical_unit_code, language_code)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ecc_unit_trans_unit
  ON ecclesiastical_unit_translations(ecclesiastical_unit_code);
CREATE INDEX IF NOT EXISTS idx_ecc_unit_trans_lang
  ON ecclesiastical_unit_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_ecc_unit_trans_unit_lang
  ON ecclesiastical_unit_translations(ecclesiastical_unit_code, language_code);

-- Step 3: Migrate Existing Data (if any)
-- ============================================
-- This migrates existing ecclesiastical units data to English translations
-- Only run if you have existing data in unite_ecclesiale table

INSERT INTO ecclesiastical_unit_translations
  (ecclesiastical_unit_code, language_code, nom, description, adresse)
SELECT
  code,
  'en',  -- Assuming existing data is in English
  COALESCE(libelle, titre, 'Untitled'),  -- Use libelle or titre as name
  description,
  adresse
FROM unite_ecclesiale
WHERE code NOT IN (
  SELECT DISTINCT ecclesiastical_unit_code
  FROM ecclesiastical_unit_translations
  WHERE language_code = 'en'
)
ON CONFLICT (ecclesiastical_unit_code, language_code) DO NOTHING;

-- Step 4: Create function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for ecclesiastical_unit_translations
DROP TRIGGER IF EXISTS update_ecclesiastical_unit_translations_updated_at
  ON ecclesiastical_unit_translations;

CREATE TRIGGER update_ecclesiastical_unit_translations_updated_at
  BEFORE UPDATE ON ecclesiastical_unit_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Verification Queries
-- ============================================

-- Check languages
-- SELECT * FROM languages;

-- Check translation tables
-- SELECT COUNT(*) as total_translations FROM ecclesiastical_unit_translations;

-- Check units with translations
-- SELECT
--   eu.code,
--   eu.libelle,
--   COUNT(eut.id) as translation_count
-- FROM unite_ecclesiale eu
-- LEFT JOIN ecclesiastical_unit_translations eut ON eu.code = eut.ecclesiastical_unit_code
-- GROUP BY eu.code, eu.libelle
-- ORDER BY eu.code;

-- Find units missing translations
-- SELECT
--   eu.code,
--   eu.libelle,
--   l.code as missing_language
-- FROM unite_ecclesiale eu
-- CROSS JOIN languages l
-- LEFT JOIN ecclesiastical_unit_translations eut
--   ON eu.code = eut.ecclesiastical_unit_code
--   AND l.code = eut.language_code
-- WHERE eut.id IS NULL AND l.is_active = true
-- ORDER BY eu.code, l.code;

-- ============================================
-- Rollback Script (if needed)
-- ============================================

-- DROP TRIGGER IF EXISTS update_ecclesiastical_unit_translations_updated_at
--   ON ecclesiastical_unit_translations;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS ecclesiastical_unit_translations;
-- DROP TABLE IF EXISTS languages;
