-- ============================================
-- Migration: Seed Roles and Super Admin User
-- Description: Create roles and seed super admin account
-- Date: 2026-02-08
-- ============================================

-- Step 1: Ensure Roles Table Exists
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
  code SERIAL PRIMARY KEY,
  libelle VARCHAR(255) UNIQUE NOT NULL,
  code_createur INT,
  code_modificateur INT,
  date_creation TIMESTAMP DEFAULT NOW(),
  date_modification TIMESTAMP DEFAULT NOW()
);

-- Step 2: Seed Standard Roles
-- ============================================
-- Insert roles if they don't exist
INSERT INTO roles (libelle, date_creation, date_modification) VALUES
  ('SUPER_ADMIN', NOW(), NOW()),
  ('ADMIN', NOW(), NOW()),
  ('PRIEST', NOW(), NOW()),
  ('DEACON', NOW(), NOW()),
  ('VOLUNTEER', NOW(), NOW()),
  ('USER', NOW(), NOW())
ON CONFLICT (libelle) DO NOTHING;

-- Step 3: Ensure Users Table Exists
-- ============================================
-- This assumes your users table is already created
-- If not, uncomment and run:
/*
CREATE TABLE IF NOT EXISTS utilisateurs (
  code SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  noms VARCHAR(255),
  prenoms VARCHAR(255),
  date_naissance DATE,
  contact_1 VARCHAR(20),
  contact_2 VARCHAR(20),
  addresse TEXT,
  date_creation TIMESTAMP DEFAULT NOW(),
  date_modification TIMESTAMP DEFAULT NOW()
);
*/

-- Step 4: Create User-Role Junction Table
-- ============================================
-- Note: Using role_utilisateur to match the User entity's @JoinTable configuration
CREATE TABLE IF NOT EXISTS role_utilisateur (
  code SERIAL PRIMARY KEY,
  code_utilisateur INT NOT NULL,
  code_role INT NOT NULL,
  UNIQUE (code_utilisateur, code_role),
  FOREIGN KEY (code_utilisateur) REFERENCES utilisateurs(code) ON DELETE CASCADE,
  FOREIGN KEY (code_role) REFERENCES roles(code) ON DELETE CASCADE
);

-- Step 5: Seed Super Admin User
-- ============================================
-- Password: SuperAdmin@123
-- Hashed with bcrypt (10 rounds)
-- NOTE: Change this password immediately after first login!

-- Insert super admin user
DO $$
DECLARE
  v_user_code INT;
  v_super_admin_role_code INT;
BEGIN
  -- Check if super admin already exists
  IF NOT EXISTS (SELECT 1 FROM utilisateurs WHERE username = 'superadmin') THEN
    -- Insert super admin user
    INSERT INTO utilisateurs (
      username,
      password,
      noms,
      prenoms,
      date_creation,
      date_modification
    ) VALUES (
      'superadmin',
      '$2b$10$NzXSEuk5CqOwnVF7Chr5OeZ/f7ac4EetUVIZyj77YDVuY26xZCd6y',  -- Password: SuperAdmin@123
      'System',
      'Administrator',
      NOW(),
      NOW()
    )
    RETURNING code INTO v_user_code;

    -- Get SUPER_ADMIN role code
    SELECT code INTO v_super_admin_role_code
    FROM roles
    WHERE libelle = 'SUPER_ADMIN';

    -- Assign SUPER_ADMIN role to the user
    INSERT INTO role_utilisateur (code_utilisateur, code_role)
    VALUES (v_user_code, v_super_admin_role_code);

    RAISE NOTICE 'Super Admin user created successfully with username: superadmin';
  ELSE
    RAISE NOTICE 'Super Admin user already exists';
  END IF;
END $$;

-- Step 6: Create Additional Admin User (Optional)
-- ============================================
-- Password: Admin@123
-- Uncomment to create an additional admin user

/*
DO $$
DECLARE
  v_user_code INT;
  v_admin_role_code INT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM utilisateurs WHERE username = 'admin') THEN
    INSERT INTO utilisateurs (
      username,
      password,
      noms,
      prenoms,
      date_creation,
      date_modification
    ) VALUES (
      'admin',
      '$2b$10$ABCdefGHIjklMNOpqrSTUVwxYZabcdefGHIjklMNOpqrSTUVwxYZ.',
      'Admin',
      'User',
      NOW(),
      NOW()
    )
    RETURNING code INTO v_user_code;

    SELECT code INTO v_admin_role_code
    FROM roles
    WHERE libelle = 'ADMIN';

    INSERT INTO role_utilisateur (code_utilisateur, code_role)
    VALUES (v_user_code, v_admin_role_code);

    RAISE NOTICE 'Admin user created successfully with username: admin';
  END IF;
END $$;
*/

-- ============================================
-- Verification Queries
-- ============================================

-- Check all roles
-- SELECT * FROM roles ORDER BY code;

-- Check super admin user
-- SELECT u.code, u.username, u.noms, u.prenoms, r.libelle as role
-- FROM utilisateurs u
-- LEFT JOIN utilisateur_role ur ON u.code = ur.code_utilisateur
-- LEFT JOIN roles r ON ur.code_role = r.code
-- WHERE u.username = 'superadmin';

-- Check all users with roles
-- SELECT
--   u.code,
--   u.username,
--   u.noms,
--   u.prenoms,
--   STRING_AGG(r.libelle, ', ') as roles
-- FROM utilisateurs u
-- LEFT JOIN utilisateur_role ur ON u.code = ur.code_utilisateur
-- LEFT JOIN roles r ON ur.code_role = r.code
-- GROUP BY u.code, u.username, u.noms, u.prenoms
-- ORDER BY u.code;

-- ============================================
-- Important Notes
-- ============================================
--
-- DEFAULT CREDENTIALS:
-- Username: superadmin
-- Password: SuperAdmin@123
--
-- SECURITY WARNING:
-- 1. Change the super admin password immediately after first login
-- 2. The password hash provided is a placeholder - you should generate
--    a real bcrypt hash for your actual password
-- 3. Never commit real password hashes to version control
-- 4. Consider using environment variables for default credentials
--
-- To generate a real bcrypt hash in Node.js:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('YourPassword', 10);
-- console.log(hash);
--
-- ============================================
-- Rollback Script (if needed)
-- ============================================

-- WARNING: This will delete all users and roles!
-- USE WITH EXTREME CAUTION!

-- DROP TABLE IF EXISTS utilisateur_role;
-- DELETE FROM utilisateurs WHERE username IN ('superadmin', 'admin');
-- DELETE FROM roles WHERE libelle IN ('SUPER_ADMIN', 'ADMIN', 'PRIEST', 'DEACON', 'VOLUNTEER', 'USER');
