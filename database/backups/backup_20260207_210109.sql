--
-- PostgreSQL database dump
--

\restrict rRH0JEEr3RKjfm0YMLrTQVXBleMIGGI7c0gW7kcn6fN06FzQcNcceeuLvmpxTWY

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: abonnement_unite_ecclesiale; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.abonnement_unite_ecclesiale (
    code integer NOT NULL,
    code_unite_ecclesiale integer,
    code_utilisateur integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.abonnement_unite_ecclesiale OWNER TO pariose_user;

--
-- Name: abonnement_unite_ecclesiale_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.abonnement_unite_ecclesiale_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.abonnement_unite_ecclesiale_code_seq OWNER TO pariose_user;

--
-- Name: abonnement_unite_ecclesiale_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.abonnement_unite_ecclesiale_code_seq OWNED BY public.abonnement_unite_ecclesiale.code;


--
-- Name: activite; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.activite (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    date_activite timestamp without time zone,
    description text,
    frequence character varying(255),
    date_debut timestamp without time zone,
    date_fin timestamp without time zone,
    statut integer DEFAULT 1,
    lieu character varying(255),
    code_unite_ecclesiale integer,
    code_type_activite integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activite OWNER TO pariose_user;

--
-- Name: activite_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.activite_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activite_code_seq OWNER TO pariose_user;

--
-- Name: activite_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.activite_code_seq OWNED BY public.activite.code;


--
-- Name: celebration_eucharistique; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.celebration_eucharistique (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    granularite character varying(255),
    code_horaire character varying(255),
    code_type character varying(255),
    code_unite_ecclesiale integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.celebration_eucharistique OWNER TO pariose_user;

--
-- Name: celebration_eucharistique_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.celebration_eucharistique_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.celebration_eucharistique_code_seq OWNER TO pariose_user;

--
-- Name: celebration_eucharistique_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.celebration_eucharistique_code_seq OWNED BY public.celebration_eucharistique.code;


--
-- Name: communiques_paroissiaux; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.communiques_paroissiaux (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    contenu text,
    code_type integer,
    code_unite_ecclesiale integer,
    date_publication timestamp without time zone,
    date_expiration timestamp without time zone,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    code_createur integer
);


ALTER TABLE public.communiques_paroissiaux OWNER TO pariose_user;

--
-- Name: communiques_paroissiaux_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.communiques_paroissiaux_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.communiques_paroissiaux_code_seq OWNER TO pariose_user;

--
-- Name: communiques_paroissiaux_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.communiques_paroissiaux_code_seq OWNED BY public.communiques_paroissiaux.code;


--
-- Name: confessions; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.confessions (
    code integer NOT NULL,
    lieu character varying(255),
    horaire_debut time without time zone,
    horaire_fin time without time zone,
    granularite character varying(255),
    code_unite_ecclesiale integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.confessions OWNER TO pariose_user;

--
-- Name: confessions_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.confessions_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.confessions_code_seq OWNER TO pariose_user;

--
-- Name: confessions_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.confessions_code_seq OWNED BY public.confessions.code;


--
-- Name: intention_messe; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.intention_messe (
    code integer NOT NULL,
    intention_messe text NOT NULL,
    code_celebration_eucharistique integer,
    montant_verse numeric(10,2),
    date_versement date,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    code_createur integer,
    code_modificateur integer
);


ALTER TABLE public.intention_messe OWNER TO pariose_user;

--
-- Name: intention_messe_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.intention_messe_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intention_messe_code_seq OWNER TO pariose_user;

--
-- Name: intention_messe_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.intention_messe_code_seq OWNED BY public.intention_messe.code;


--
-- Name: langue_liturgique; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.langue_liturgique (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.langue_liturgique OWNER TO pariose_user;

--
-- Name: langue_liturgique_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.langue_liturgique_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.langue_liturgique_code_seq OWNER TO pariose_user;

--
-- Name: langue_liturgique_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.langue_liturgique_code_seq OWNED BY public.langue_liturgique.code;


--
-- Name: lieux_saint; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.lieux_saint (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    adresse character varying(255),
    photo character varying(255),
    longitude numeric(10,7),
    latitude numeric(10,7),
    code_unite_ecclesiale integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.lieux_saint OWNER TO pariose_user;

--
-- Name: lieux_saint_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.lieux_saint_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lieux_saint_code_seq OWNER TO pariose_user;

--
-- Name: lieux_saint_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.lieux_saint_code_seq OWNED BY public.lieux_saint.code;


--
-- Name: objets_sacres; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.objets_sacres (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    description text,
    photo character varying(255),
    code_unite_ecclesiale integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    code_createur integer,
    code_modificateur integer
);


ALTER TABLE public.objets_sacres OWNER TO pariose_user;

--
-- Name: objets_sacres_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.objets_sacres_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.objets_sacres_code_seq OWNER TO pariose_user;

--
-- Name: objets_sacres_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.objets_sacres_code_seq OWNED BY public.objets_sacres.code;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.permissions (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    code_createur integer,
    code_modificateur integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.permissions OWNER TO pariose_user;

--
-- Name: permissions_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.permissions_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_code_seq OWNER TO pariose_user;

--
-- Name: permissions_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.permissions_code_seq OWNED BY public.permissions.code;


--
-- Name: programme_celebration_eucharistique; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.programme_celebration_eucharistique (
    code integer NOT NULL,
    code_programme integer,
    code_celebration_eucharistique integer,
    description text,
    code_createur integer,
    code_modificateur integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.programme_celebration_eucharistique OWNER TO pariose_user;

--
-- Name: programme_celebration_eucharistique_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.programme_celebration_eucharistique_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programme_celebration_eucharistique_code_seq OWNER TO pariose_user;

--
-- Name: programme_celebration_eucharistique_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.programme_celebration_eucharistique_code_seq OWNED BY public.programme_celebration_eucharistique.code;


--
-- Name: programme_paroissial; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.programme_paroissial (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    description text,
    date_debut date,
    date_fin date,
    code_unite_ecclesiale integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.programme_paroissial OWNER TO pariose_user;

--
-- Name: programme_paroissial_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.programme_paroissial_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programme_paroissial_code_seq OWNER TO pariose_user;

--
-- Name: programme_paroissial_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.programme_paroissial_code_seq OWNED BY public.programme_paroissial.code;


--
-- Name: role_permission; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.role_permission (
    code integer NOT NULL,
    code_role integer,
    code_permission integer
);


ALTER TABLE public.role_permission OWNER TO pariose_user;

--
-- Name: role_permission_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.role_permission_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permission_code_seq OWNER TO pariose_user;

--
-- Name: role_permission_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.role_permission_code_seq OWNED BY public.role_permission.code;


--
-- Name: role_utilisateur; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.role_utilisateur (
    code integer NOT NULL,
    code_utilisateur integer,
    code_role integer
);


ALTER TABLE public.role_utilisateur OWNER TO pariose_user;

--
-- Name: role_utilisateur_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.role_utilisateur_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_utilisateur_code_seq OWNER TO pariose_user;

--
-- Name: role_utilisateur_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.role_utilisateur_code_seq OWNED BY public.role_utilisateur.code;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.roles (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    code_createur integer,
    code_modificateur integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO pariose_user;

--
-- Name: roles_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.roles_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_code_seq OWNER TO pariose_user;

--
-- Name: roles_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.roles_code_seq OWNED BY public.roles.code;


--
-- Name: type_activite; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.type_activite (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    description text,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    code_createur integer,
    code_modificateur integer
);


ALTER TABLE public.type_activite OWNER TO pariose_user;

--
-- Name: type_activite_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.type_activite_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_activite_code_seq OWNER TO pariose_user;

--
-- Name: type_activite_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.type_activite_code_seq OWNED BY public.type_activite.code;


--
-- Name: type_communique; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.type_communique (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    description text
);


ALTER TABLE public.type_communique OWNER TO pariose_user;

--
-- Name: type_communique_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.type_communique_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.type_communique_code_seq OWNER TO pariose_user;

--
-- Name: type_communique_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.type_communique_code_seq OWNED BY public.type_communique.code;


--
-- Name: unite_ecclesiale; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.unite_ecclesiale (
    code integer NOT NULL,
    libelle character varying(255) NOT NULL,
    description text,
    titre character varying(255),
    adresse character varying(255),
    code_type integer,
    longitude numeric(10,7),
    latitude numeric(10,7),
    altitude numeric(10,2),
    fidele character varying(255),
    date_creation_unite timestamp without time zone,
    statut_canonique character varying(255),
    code_unite_parent integer,
    activite character varying(255),
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    code_createur integer,
    code_modificateur integer
);


ALTER TABLE public.unite_ecclesiale OWNER TO pariose_user;

--
-- Name: unite_ecclesiale_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.unite_ecclesiale_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unite_ecclesiale_code_seq OWNER TO pariose_user;

--
-- Name: unite_ecclesiale_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.unite_ecclesiale_code_seq OWNED BY public.unite_ecclesiale.code;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: pariose_user
--

CREATE TABLE public.utilisateurs (
    code integer NOT NULL,
    username character varying(255),
    noms character varying(255),
    prenoms character varying(255),
    date_naissance date,
    contact_1 character varying(255),
    contact_2 character varying(255),
    password character varying(255) NOT NULL,
    addresse character varying(255),
    code_createur integer,
    code_modificateur integer,
    date_creation timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    date_modification timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utilisateurs OWNER TO pariose_user;

--
-- Name: utilisateurs_code_seq; Type: SEQUENCE; Schema: public; Owner: pariose_user
--

CREATE SEQUENCE public.utilisateurs_code_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_code_seq OWNER TO pariose_user;

--
-- Name: utilisateurs_code_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pariose_user
--

ALTER SEQUENCE public.utilisateurs_code_seq OWNED BY public.utilisateurs.code;


--
-- Name: abonnement_unite_ecclesiale code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.abonnement_unite_ecclesiale ALTER COLUMN code SET DEFAULT nextval('public.abonnement_unite_ecclesiale_code_seq'::regclass);


--
-- Name: activite code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.activite ALTER COLUMN code SET DEFAULT nextval('public.activite_code_seq'::regclass);


--
-- Name: celebration_eucharistique code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.celebration_eucharistique ALTER COLUMN code SET DEFAULT nextval('public.celebration_eucharistique_code_seq'::regclass);


--
-- Name: communiques_paroissiaux code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.communiques_paroissiaux ALTER COLUMN code SET DEFAULT nextval('public.communiques_paroissiaux_code_seq'::regclass);


--
-- Name: confessions code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.confessions ALTER COLUMN code SET DEFAULT nextval('public.confessions_code_seq'::regclass);


--
-- Name: intention_messe code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.intention_messe ALTER COLUMN code SET DEFAULT nextval('public.intention_messe_code_seq'::regclass);


--
-- Name: langue_liturgique code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.langue_liturgique ALTER COLUMN code SET DEFAULT nextval('public.langue_liturgique_code_seq'::regclass);


--
-- Name: lieux_saint code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.lieux_saint ALTER COLUMN code SET DEFAULT nextval('public.lieux_saint_code_seq'::regclass);


--
-- Name: objets_sacres code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.objets_sacres ALTER COLUMN code SET DEFAULT nextval('public.objets_sacres_code_seq'::regclass);


--
-- Name: permissions code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.permissions ALTER COLUMN code SET DEFAULT nextval('public.permissions_code_seq'::regclass);


--
-- Name: programme_celebration_eucharistique code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_celebration_eucharistique ALTER COLUMN code SET DEFAULT nextval('public.programme_celebration_eucharistique_code_seq'::regclass);


--
-- Name: programme_paroissial code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_paroissial ALTER COLUMN code SET DEFAULT nextval('public.programme_paroissial_code_seq'::regclass);


--
-- Name: role_permission code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_permission ALTER COLUMN code SET DEFAULT nextval('public.role_permission_code_seq'::regclass);


--
-- Name: role_utilisateur code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_utilisateur ALTER COLUMN code SET DEFAULT nextval('public.role_utilisateur_code_seq'::regclass);


--
-- Name: roles code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.roles ALTER COLUMN code SET DEFAULT nextval('public.roles_code_seq'::regclass);


--
-- Name: type_activite code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.type_activite ALTER COLUMN code SET DEFAULT nextval('public.type_activite_code_seq'::regclass);


--
-- Name: type_communique code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.type_communique ALTER COLUMN code SET DEFAULT nextval('public.type_communique_code_seq'::regclass);


--
-- Name: unite_ecclesiale code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.unite_ecclesiale ALTER COLUMN code SET DEFAULT nextval('public.unite_ecclesiale_code_seq'::regclass);


--
-- Name: utilisateurs code; Type: DEFAULT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN code SET DEFAULT nextval('public.utilisateurs_code_seq'::regclass);


--
-- Data for Name: abonnement_unite_ecclesiale; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.abonnement_unite_ecclesiale (code, code_unite_ecclesiale, code_utilisateur, date_creation) FROM stdin;
\.


--
-- Data for Name: activite; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.activite (code, libelle, date_activite, description, frequence, date_debut, date_fin, statut, lieu, code_unite_ecclesiale, code_type_activite, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: celebration_eucharistique; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.celebration_eucharistique (code, libelle, granularite, code_horaire, code_type, code_unite_ecclesiale, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: communiques_paroissiaux; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.communiques_paroissiaux (code, libelle, contenu, code_type, code_unite_ecclesiale, date_publication, date_expiration, date_creation, date_modification, code_createur) FROM stdin;
\.


--
-- Data for Name: confessions; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.confessions (code, lieu, horaire_debut, horaire_fin, granularite, code_unite_ecclesiale, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: intention_messe; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.intention_messe (code, intention_messe, code_celebration_eucharistique, montant_verse, date_versement, date_creation, date_modification, code_createur, code_modificateur) FROM stdin;
\.


--
-- Data for Name: langue_liturgique; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.langue_liturgique (code, libelle, description) FROM stdin;
\.


--
-- Data for Name: lieux_saint; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.lieux_saint (code, libelle, adresse, photo, longitude, latitude, code_unite_ecclesiale, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: objets_sacres; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.objets_sacres (code, libelle, description, photo, code_unite_ecclesiale, date_creation, date_modification, code_createur, code_modificateur) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.permissions (code, libelle, code_createur, code_modificateur, date_creation, date_modification) FROM stdin;
1	CREATE_USER	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
2	UPDATE_USER	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
3	DELETE_USER	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
4	VIEW_USER	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
5	MANAGE_ROLES	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
6	MANAGE_PERMISSIONS	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
7	MANAGE_ECCLESIASTICAL_UNITS	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
8	MANAGE_ACTIVITIES	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
9	MANAGE_CELEBRATIONS	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
10	MANAGE_ANNOUNCEMENTS	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
11	VIEW_REPORTS	\N	\N	2026-02-07 19:48:48.224562	2026-02-07 19:48:48.224562
\.


--
-- Data for Name: programme_celebration_eucharistique; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.programme_celebration_eucharistique (code, code_programme, code_celebration_eucharistique, description, code_createur, code_modificateur, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: programme_paroissial; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.programme_paroissial (code, libelle, description, date_debut, date_fin, code_unite_ecclesiale, date_creation, date_modification) FROM stdin;
\.


--
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.role_permission (code, code_role, code_permission) FROM stdin;
\.


--
-- Data for Name: role_utilisateur; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.role_utilisateur (code, code_utilisateur, code_role) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.roles (code, libelle, code_createur, code_modificateur, date_creation, date_modification) FROM stdin;
1	SUPER_ADMIN	\N	\N	2026-02-07 19:48:48.222581	2026-02-07 19:48:48.222581
2	ADMIN	\N	\N	2026-02-07 19:48:48.222581	2026-02-07 19:48:48.222581
3	PRIEST	\N	\N	2026-02-07 19:48:48.222581	2026-02-07 19:48:48.222581
4	DEACON	\N	\N	2026-02-07 19:48:48.222581	2026-02-07 19:48:48.222581
5	VOLUNTEER	\N	\N	2026-02-07 19:48:48.222581	2026-02-07 19:48:48.222581
6	USER	\N	\N	2026-02-07 19:48:48.222581	2026-02-07 19:48:48.222581
\.


--
-- Data for Name: type_activite; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.type_activite (code, libelle, description, date_creation, code_createur, code_modificateur) FROM stdin;
\.


--
-- Data for Name: type_communique; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.type_communique (code, libelle, description) FROM stdin;
\.


--
-- Data for Name: unite_ecclesiale; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.unite_ecclesiale (code, libelle, description, titre, adresse, code_type, longitude, latitude, altitude, fidele, date_creation_unite, statut_canonique, code_unite_parent, activite, date_creation, date_modification, code_createur, code_modificateur) FROM stdin;
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: pariose_user
--

COPY public.utilisateurs (code, username, noms, prenoms, date_naissance, contact_1, contact_2, password, addresse, code_createur, code_modificateur, date_creation, date_modification) FROM stdin;
\.


--
-- Name: abonnement_unite_ecclesiale_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.abonnement_unite_ecclesiale_code_seq', 1, false);


--
-- Name: activite_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.activite_code_seq', 1, false);


--
-- Name: celebration_eucharistique_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.celebration_eucharistique_code_seq', 1, false);


--
-- Name: communiques_paroissiaux_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.communiques_paroissiaux_code_seq', 1, false);


--
-- Name: confessions_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.confessions_code_seq', 1, false);


--
-- Name: intention_messe_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.intention_messe_code_seq', 1, false);


--
-- Name: langue_liturgique_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.langue_liturgique_code_seq', 1, false);


--
-- Name: lieux_saint_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.lieux_saint_code_seq', 1, false);


--
-- Name: objets_sacres_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.objets_sacres_code_seq', 1, false);


--
-- Name: permissions_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.permissions_code_seq', 11, true);


--
-- Name: programme_celebration_eucharistique_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.programme_celebration_eucharistique_code_seq', 1, false);


--
-- Name: programme_paroissial_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.programme_paroissial_code_seq', 1, false);


--
-- Name: role_permission_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.role_permission_code_seq', 1, false);


--
-- Name: role_utilisateur_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.role_utilisateur_code_seq', 1, false);


--
-- Name: roles_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.roles_code_seq', 6, true);


--
-- Name: type_activite_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.type_activite_code_seq', 1, false);


--
-- Name: type_communique_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.type_communique_code_seq', 1, false);


--
-- Name: unite_ecclesiale_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.unite_ecclesiale_code_seq', 1, false);


--
-- Name: utilisateurs_code_seq; Type: SEQUENCE SET; Schema: public; Owner: pariose_user
--

SELECT pg_catalog.setval('public.utilisateurs_code_seq', 1, false);


--
-- Name: abonnement_unite_ecclesiale abonnement_unite_ecclesiale_code_unite_ecclesiale_code_util_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.abonnement_unite_ecclesiale
    ADD CONSTRAINT abonnement_unite_ecclesiale_code_unite_ecclesiale_code_util_key UNIQUE (code_unite_ecclesiale, code_utilisateur);


--
-- Name: abonnement_unite_ecclesiale abonnement_unite_ecclesiale_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.abonnement_unite_ecclesiale
    ADD CONSTRAINT abonnement_unite_ecclesiale_pkey PRIMARY KEY (code);


--
-- Name: activite activite_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.activite
    ADD CONSTRAINT activite_pkey PRIMARY KEY (code);


--
-- Name: celebration_eucharistique celebration_eucharistique_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.celebration_eucharistique
    ADD CONSTRAINT celebration_eucharistique_pkey PRIMARY KEY (code);


--
-- Name: communiques_paroissiaux communiques_paroissiaux_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.communiques_paroissiaux
    ADD CONSTRAINT communiques_paroissiaux_pkey PRIMARY KEY (code);


--
-- Name: confessions confessions_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.confessions
    ADD CONSTRAINT confessions_pkey PRIMARY KEY (code);


--
-- Name: intention_messe intention_messe_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.intention_messe
    ADD CONSTRAINT intention_messe_pkey PRIMARY KEY (code);


--
-- Name: langue_liturgique langue_liturgique_libelle_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.langue_liturgique
    ADD CONSTRAINT langue_liturgique_libelle_key UNIQUE (libelle);


--
-- Name: langue_liturgique langue_liturgique_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.langue_liturgique
    ADD CONSTRAINT langue_liturgique_pkey PRIMARY KEY (code);


--
-- Name: lieux_saint lieux_saint_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.lieux_saint
    ADD CONSTRAINT lieux_saint_pkey PRIMARY KEY (code);


--
-- Name: objets_sacres objets_sacres_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.objets_sacres
    ADD CONSTRAINT objets_sacres_pkey PRIMARY KEY (code);


--
-- Name: permissions permissions_libelle_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_libelle_key UNIQUE (libelle);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (code);


--
-- Name: programme_celebration_eucharistique programme_celebration_eucharistique_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_celebration_eucharistique
    ADD CONSTRAINT programme_celebration_eucharistique_pkey PRIMARY KEY (code);


--
-- Name: programme_paroissial programme_paroissial_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_paroissial
    ADD CONSTRAINT programme_paroissial_pkey PRIMARY KEY (code);


--
-- Name: role_permission role_permission_code_role_code_permission_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_code_role_code_permission_key UNIQUE (code_role, code_permission);


--
-- Name: role_permission role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_pkey PRIMARY KEY (code);


--
-- Name: role_utilisateur role_utilisateur_code_utilisateur_code_role_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_utilisateur
    ADD CONSTRAINT role_utilisateur_code_utilisateur_code_role_key UNIQUE (code_utilisateur, code_role);


--
-- Name: role_utilisateur role_utilisateur_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_utilisateur
    ADD CONSTRAINT role_utilisateur_pkey PRIMARY KEY (code);


--
-- Name: roles roles_libelle_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_libelle_key UNIQUE (libelle);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (code);


--
-- Name: type_activite type_activite_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.type_activite
    ADD CONSTRAINT type_activite_pkey PRIMARY KEY (code);


--
-- Name: type_communique type_communique_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.type_communique
    ADD CONSTRAINT type_communique_pkey PRIMARY KEY (code);


--
-- Name: unite_ecclesiale unite_ecclesiale_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.unite_ecclesiale
    ADD CONSTRAINT unite_ecclesiale_pkey PRIMARY KEY (code);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (code);


--
-- Name: utilisateurs utilisateurs_username_key; Type: CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_username_key UNIQUE (username);


--
-- Name: idx_activite_date; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_activite_date ON public.activite USING btree (date_activite);


--
-- Name: idx_activite_unite; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_activite_unite ON public.activite USING btree (code_unite_ecclesiale);


--
-- Name: idx_celebration_unite; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_celebration_unite ON public.celebration_eucharistique USING btree (code_unite_ecclesiale);


--
-- Name: idx_communiques_date; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_communiques_date ON public.communiques_paroissiaux USING btree (date_publication);


--
-- Name: idx_intention_celebration; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_intention_celebration ON public.intention_messe USING btree (code_celebration_eucharistique);


--
-- Name: idx_unite_parent; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_unite_parent ON public.unite_ecclesiale USING btree (code_unite_parent);


--
-- Name: idx_utilisateurs_username; Type: INDEX; Schema: public; Owner: pariose_user
--

CREATE INDEX idx_utilisateurs_username ON public.utilisateurs USING btree (username);


--
-- Name: abonnement_unite_ecclesiale abonnement_unite_ecclesiale_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.abonnement_unite_ecclesiale
    ADD CONSTRAINT abonnement_unite_ecclesiale_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: abonnement_unite_ecclesiale abonnement_unite_ecclesiale_code_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.abonnement_unite_ecclesiale
    ADD CONSTRAINT abonnement_unite_ecclesiale_code_utilisateur_fkey FOREIGN KEY (code_utilisateur) REFERENCES public.utilisateurs(code) ON DELETE CASCADE;


--
-- Name: activite activite_code_type_activite_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.activite
    ADD CONSTRAINT activite_code_type_activite_fkey FOREIGN KEY (code_type_activite) REFERENCES public.type_activite(code) ON DELETE SET NULL;


--
-- Name: activite activite_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.activite
    ADD CONSTRAINT activite_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: celebration_eucharistique celebration_eucharistique_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.celebration_eucharistique
    ADD CONSTRAINT celebration_eucharistique_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: communiques_paroissiaux communiques_paroissiaux_code_createur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.communiques_paroissiaux
    ADD CONSTRAINT communiques_paroissiaux_code_createur_fkey FOREIGN KEY (code_createur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: communiques_paroissiaux communiques_paroissiaux_code_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.communiques_paroissiaux
    ADD CONSTRAINT communiques_paroissiaux_code_type_fkey FOREIGN KEY (code_type) REFERENCES public.type_communique(code) ON DELETE SET NULL;


--
-- Name: communiques_paroissiaux communiques_paroissiaux_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.communiques_paroissiaux
    ADD CONSTRAINT communiques_paroissiaux_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: confessions confessions_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.confessions
    ADD CONSTRAINT confessions_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: intention_messe intention_messe_code_celebration_eucharistique_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.intention_messe
    ADD CONSTRAINT intention_messe_code_celebration_eucharistique_fkey FOREIGN KEY (code_celebration_eucharistique) REFERENCES public.celebration_eucharistique(code) ON DELETE CASCADE;


--
-- Name: intention_messe intention_messe_code_createur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.intention_messe
    ADD CONSTRAINT intention_messe_code_createur_fkey FOREIGN KEY (code_createur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: intention_messe intention_messe_code_modificateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.intention_messe
    ADD CONSTRAINT intention_messe_code_modificateur_fkey FOREIGN KEY (code_modificateur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: lieux_saint lieux_saint_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.lieux_saint
    ADD CONSTRAINT lieux_saint_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: objets_sacres objets_sacres_code_createur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.objets_sacres
    ADD CONSTRAINT objets_sacres_code_createur_fkey FOREIGN KEY (code_createur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: objets_sacres objets_sacres_code_modificateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.objets_sacres
    ADD CONSTRAINT objets_sacres_code_modificateur_fkey FOREIGN KEY (code_modificateur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: objets_sacres objets_sacres_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.objets_sacres
    ADD CONSTRAINT objets_sacres_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: programme_celebration_eucharistique programme_celebration_euchari_code_celebration_eucharistiq_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_celebration_eucharistique
    ADD CONSTRAINT programme_celebration_euchari_code_celebration_eucharistiq_fkey FOREIGN KEY (code_celebration_eucharistique) REFERENCES public.celebration_eucharistique(code) ON DELETE CASCADE;


--
-- Name: programme_celebration_eucharistique programme_celebration_eucharistique_code_createur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_celebration_eucharistique
    ADD CONSTRAINT programme_celebration_eucharistique_code_createur_fkey FOREIGN KEY (code_createur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: programme_celebration_eucharistique programme_celebration_eucharistique_code_modificateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_celebration_eucharistique
    ADD CONSTRAINT programme_celebration_eucharistique_code_modificateur_fkey FOREIGN KEY (code_modificateur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: programme_celebration_eucharistique programme_celebration_eucharistique_code_programme_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_celebration_eucharistique
    ADD CONSTRAINT programme_celebration_eucharistique_code_programme_fkey FOREIGN KEY (code_programme) REFERENCES public.programme_paroissial(code) ON DELETE CASCADE;


--
-- Name: programme_paroissial programme_paroissial_code_unite_ecclesiale_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.programme_paroissial
    ADD CONSTRAINT programme_paroissial_code_unite_ecclesiale_fkey FOREIGN KEY (code_unite_ecclesiale) REFERENCES public.unite_ecclesiale(code) ON DELETE CASCADE;


--
-- Name: role_permission role_permission_code_permission_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_code_permission_fkey FOREIGN KEY (code_permission) REFERENCES public.permissions(code) ON DELETE CASCADE;


--
-- Name: role_permission role_permission_code_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_code_role_fkey FOREIGN KEY (code_role) REFERENCES public.roles(code) ON DELETE CASCADE;


--
-- Name: role_utilisateur role_utilisateur_code_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_utilisateur
    ADD CONSTRAINT role_utilisateur_code_role_fkey FOREIGN KEY (code_role) REFERENCES public.roles(code) ON DELETE CASCADE;


--
-- Name: role_utilisateur role_utilisateur_code_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.role_utilisateur
    ADD CONSTRAINT role_utilisateur_code_utilisateur_fkey FOREIGN KEY (code_utilisateur) REFERENCES public.utilisateurs(code) ON DELETE CASCADE;


--
-- Name: type_activite type_activite_code_createur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.type_activite
    ADD CONSTRAINT type_activite_code_createur_fkey FOREIGN KEY (code_createur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: type_activite type_activite_code_modificateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.type_activite
    ADD CONSTRAINT type_activite_code_modificateur_fkey FOREIGN KEY (code_modificateur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: unite_ecclesiale unite_ecclesiale_code_createur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.unite_ecclesiale
    ADD CONSTRAINT unite_ecclesiale_code_createur_fkey FOREIGN KEY (code_createur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: unite_ecclesiale unite_ecclesiale_code_modificateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.unite_ecclesiale
    ADD CONSTRAINT unite_ecclesiale_code_modificateur_fkey FOREIGN KEY (code_modificateur) REFERENCES public.utilisateurs(code) ON DELETE SET NULL;


--
-- Name: unite_ecclesiale unite_ecclesiale_code_unite_parent_fkey; Type: FK CONSTRAINT; Schema: public; Owner: pariose_user
--

ALTER TABLE ONLY public.unite_ecclesiale
    ADD CONSTRAINT unite_ecclesiale_code_unite_parent_fkey FOREIGN KEY (code_unite_parent) REFERENCES public.unite_ecclesiale(code) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict rRH0JEEr3RKjfm0YMLrTQVXBleMIGGI7c0gW7kcn6fN06FzQcNcceeuLvmpxTWY

