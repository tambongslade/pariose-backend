-- ChurchNow Database Schema for PostgreSQL
-- Generated: 2026-02-07

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: utilisateurs (Users)
CREATE TABLE utilisateurs (
    code SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    noms VARCHAR(255),
    prenoms VARCHAR(255),
    date_naissance DATE,
    contact_1 VARCHAR(255),
    contact_2 VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    addresse VARCHAR(255),
    code_createur INTEGER,
    code_modificateur INTEGER,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: roles
CREATE TABLE roles (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL UNIQUE,
    code_createur INTEGER,
    code_modificateur INTEGER,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: permissions
CREATE TABLE permissions (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL UNIQUE,
    code_createur INTEGER,
    code_modificateur INTEGER,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: role_permission
CREATE TABLE role_permission (
    code SERIAL PRIMARY KEY,
    code_role INTEGER REFERENCES roles(code) ON DELETE CASCADE,
    code_permission INTEGER REFERENCES permissions(code) ON DELETE CASCADE,
    UNIQUE(code_role, code_permission)
);

-- Table: role_utilisateur
CREATE TABLE role_utilisateur (
    code SERIAL PRIMARY KEY,
    code_utilisateur INTEGER REFERENCES utilisateurs(code) ON DELETE CASCADE,
    code_role INTEGER REFERENCES roles(code) ON DELETE CASCADE,
    UNIQUE(code_utilisateur, code_role)
);

-- Table: unite_ecclesiale (Ecclesiastical Units - Parish, Diocese, etc.)
CREATE TABLE unite_ecclesiale (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    titre VARCHAR(255),
    adresse VARCHAR(255),
    code_type INTEGER,
    longitude DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    altitude DECIMAL(10, 2),
    fidele VARCHAR(255),
    date_creation_unite TIMESTAMP,
    statut_canonique VARCHAR(255),
    code_unite_parent INTEGER REFERENCES unite_ecclesiale(code) ON DELETE SET NULL,
    activite VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    code_createur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL,
    code_modificateur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL
);

-- Table: abonnement_unite_ecclesiale (Subscriptions to ecclesiastical units)
CREATE TABLE abonnement_unite_ecclesiale (
    code SERIAL PRIMARY KEY,
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    code_utilisateur INTEGER REFERENCES utilisateurs(code) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code_unite_ecclesiale, code_utilisateur)
);

-- Table: type_activite (Activity Types)
CREATE TABLE type_activite (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    code_createur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL,
    code_modificateur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL
);

-- Table: activite (Activities/Events)
CREATE TABLE activite (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    date_activite TIMESTAMP,
    description TEXT,
    frequence VARCHAR(255),
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    statut INTEGER DEFAULT 1,
    lieu VARCHAR(255),
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    code_type_activite INTEGER REFERENCES type_activite(code) ON DELETE SET NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: celebration_eucharistique (Eucharistic Celebrations/Masses)
CREATE TABLE celebration_eucharistique (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    granularite VARCHAR(255),
    code_horaire VARCHAR(255),
    code_type VARCHAR(255),
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: intention_messe (Mass Intentions)
CREATE TABLE intention_messe (
    code SERIAL PRIMARY KEY,
    intention_messe TEXT NOT NULL,
    code_celebration_eucharistique INTEGER REFERENCES celebration_eucharistique(code) ON DELETE CASCADE,
    montant_verse DECIMAL(10, 2),
    date_versement DATE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    code_createur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL,
    code_modificateur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL
);

-- Table: confessions (Confession Schedules)
CREATE TABLE confessions (
    code SERIAL PRIMARY KEY,
    lieu VARCHAR(255),
    horaire_debut TIME,
    horaire_fin TIME,
    granularite VARCHAR(255),
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: type_communique (Announcement Types)
CREATE TABLE type_communique (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT
);

-- Table: communiques_paroissiaux (Parish Announcements)
CREATE TABLE communiques_paroissiaux (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    contenu TEXT,
    code_type INTEGER REFERENCES type_communique(code) ON DELETE SET NULL,
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    date_publication TIMESTAMP,
    date_expiration TIMESTAMP,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    code_createur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL
);

-- Table: programme_paroissial (Parish Programs)
CREATE TABLE programme_paroissial (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    date_debut DATE,
    date_fin DATE,
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: programme_celebration_eucharistique (Eucharistic Celebration Programs)
CREATE TABLE programme_celebration_eucharistique (
    code SERIAL PRIMARY KEY,
    code_programme INTEGER REFERENCES programme_paroissial(code) ON DELETE CASCADE,
    code_celebration_eucharistique INTEGER REFERENCES celebration_eucharistique(code) ON DELETE CASCADE,
    description TEXT,
    code_createur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL,
    code_modificateur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: lieux_saint (Holy Places)
CREATE TABLE lieux_saint (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    adresse VARCHAR(255),
    photo VARCHAR(255),
    longitude DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: langue_liturgique (Liturgical Languages)
CREATE TABLE langue_liturgique (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL UNIQUE,
    description TEXT
);

-- Table: objets_sacres (Sacred Objects)
CREATE TABLE objets_sacres (
    code SERIAL PRIMARY KEY,
    libelle VARCHAR(255) NOT NULL,
    description TEXT,
    photo VARCHAR(255),
    code_unite_ecclesiale INTEGER REFERENCES unite_ecclesiale(code) ON DELETE CASCADE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    code_createur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL,
    code_modificateur INTEGER REFERENCES utilisateurs(code) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_utilisateurs_username ON utilisateurs(username);
CREATE INDEX idx_activite_date ON activite(date_activite);
CREATE INDEX idx_activite_unite ON activite(code_unite_ecclesiale);
CREATE INDEX idx_celebration_unite ON celebration_eucharistique(code_unite_ecclesiale);
CREATE INDEX idx_unite_parent ON unite_ecclesiale(code_unite_parent);
CREATE INDEX idx_communiques_date ON communiques_paroissiaux(date_publication);
CREATE INDEX idx_intention_celebration ON intention_messe(code_celebration_eucharistique);

-- Insert default roles
INSERT INTO roles (libelle, date_creation) VALUES
    ('SUPER_ADMIN', CURRENT_TIMESTAMP),
    ('ADMIN', CURRENT_TIMESTAMP),
    ('PRIEST', CURRENT_TIMESTAMP),
    ('DEACON', CURRENT_TIMESTAMP),
    ('VOLUNTEER', CURRENT_TIMESTAMP),
    ('USER', CURRENT_TIMESTAMP);

-- Insert default permissions
INSERT INTO permissions (libelle, date_creation) VALUES
    ('CREATE_USER', CURRENT_TIMESTAMP),
    ('UPDATE_USER', CURRENT_TIMESTAMP),
    ('DELETE_USER', CURRENT_TIMESTAMP),
    ('VIEW_USER', CURRENT_TIMESTAMP),
    ('MANAGE_ROLES', CURRENT_TIMESTAMP),
    ('MANAGE_PERMISSIONS', CURRENT_TIMESTAMP),
    ('MANAGE_ECCLESIASTICAL_UNITS', CURRENT_TIMESTAMP),
    ('MANAGE_ACTIVITIES', CURRENT_TIMESTAMP),
    ('MANAGE_CELEBRATIONS', CURRENT_TIMESTAMP),
    ('MANAGE_ANNOUNCEMENTS', CURRENT_TIMESTAMP),
    ('VIEW_REPORTS', CURRENT_TIMESTAMP);
