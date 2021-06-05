-- 2021-06-01 + guid - id
-- 2021-05-18 added jsonb and append passive unique key id
-- 2021-05-09 changed btext and append passive unique key id
SET TRANSACTION READ WRITE;
---------------- ACTIONS  -------------------
DROP TABLE IF EXISTS public.actions;
DROP SEQUENCE IF EXISTS public.actions_id_seq;
CREATE TABLE public.actions
(
    kind character varying(50) COLLATE pg_catalog."default" NOT NULL,
    key character varying(50) COLLATE pg_catalog."default" NOT NULL,
    base64 text COLLATE pg_catalog."default",
    item jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone DEFAULT now(),
    life_seconds integer,
    guid uuid,
    CONSTRAINT actions_type_key PRIMARY KEY (kind, key)
);

---------------- STORE  -------------------
DROP TABLE IF EXISTS public.store;
DROP SEQUENCE IF EXISTS public.store_id_seq;
CREATE TABLE public.store
(
    kind character varying(50) COLLATE pg_catalog."default" NOT NULL,
    key character varying(50) COLLATE pg_catalog."default" NOT NULL,
    base64 text COLLATE pg_catalog."default",
    item jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone DEFAULT now(),
    life_seconds integer,
    guid uuid,
    CONSTRAINT store_type_key PRIMARY KEY (kind, key)
);

---------------- OPTIONS  -------------------
DROP TABLE IF EXISTS public.temp;
DROP SEQUENCE IF EXISTS public.temp_id_seq;
DROP TABLE IF EXISTS public.options;
CREATE TABLE public.options
(
    kind character varying(50) COLLATE pg_catalog."default" NOT NULL,
    key character varying(50) COLLATE pg_catalog."default" NOT NULL,
    base64 text COLLATE pg_catalog."default",
    item jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone DEFAULT now(),
    life_seconds integer,
    guid uuid,
    CONSTRAINT options_type_key PRIMARY KEY (kind, key)
);

---------------- USERS  -------------------
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE public.users
(
    kind character varying(50) COLLATE pg_catalog."default" NOT NULL,
    key character varying(50) COLLATE pg_catalog."default" NOT NULL,
    base64 text COLLATE pg_catalog."default",
    item jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone DEFAULT now(),
    life_seconds integer,
    guid uuid,
    CONSTRAINT users_type_key PRIMARY KEY (kind, key)
);

---------------- companies  -------------------
DROP TABLE IF EXISTS public.companies;
DROP SEQUENCE IF EXISTS public.companies_id_seq;
CREATE TABLE public.companies
(
    kind character varying(50) COLLATE pg_catalog."default" NOT NULL,
    key character varying(50) COLLATE pg_catalog."default" NOT NULL,
    base64 text COLLATE pg_catalog."default",
    item jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone DEFAULT now(),
    life_seconds integer,
    guid uuid,
    CONSTRAINT companies_type_key PRIMARY KEY (kind, key)
);



---------------- SITES  -------------------
DROP TABLE IF EXISTS public.sites;
CREATE TABLE public.sites
(
    kind character varying(50) COLLATE pg_catalog."default" NOT NULL,
    key character varying(50) COLLATE pg_catalog."default" NOT NULL,
    base64 text COLLATE pg_catalog."default",
    item jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone DEFAULT now(),
    life_seconds integer,
    guid uuid,
    CONSTRAINT sites_type_key PRIMARY KEY (kind, key)
);


