-- 2021-05-18 added jsonb and append passive unique key id
-- 2021-05-09 changed btext and append passive unique key id
SET TRANSACTION READ WRITE;
---------------- ACTIONS  -------------------
DROP TABLE IF EXISTS public.actions;
DROP SEQUENCE IF EXISTS public.actions_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.actions_id_seq;
CREATE TABLE public.actions
(
    id integer NOT NULL DEFAULT nextval('actions_id_seq'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    jsonb jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT actions_type_key PRIMARY KEY (kind, key)
);


---------------- STORE  -------------------
DROP TABLE IF EXISTS public.store;
DROP SEQUENCE IF EXISTS public.store_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.store_id_seq;
CREATE TABLE public.store
(
    id integer NOT NULL DEFAULT nextval('store_id_seq'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    jsonb jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT store_type_key PRIMARY KEY (kind, key)
);


---------------- TEMP  -------------------
DROP TABLE IF EXISTS public.temp;
DROP SEQUENCE IF EXISTS public.temp_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.temp_id_seq;
CREATE TABLE public.temp
(
    id integer NOT NULL DEFAULT nextval('temp_id_seq'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    jsonb jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT temp_type_key PRIMARY KEY (kind, key)
);


---------------- USERS  -------------------
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.users_id_seq;
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    jsonb jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT users_type_key PRIMARY KEY (kind, key)
);
---------------- companies  -------------------
DROP TABLE IF EXISTS public.companies;
DROP SEQUENCE IF EXISTS public.companies_id_seq;
CREATE SEQUENCE IF NOT EXISTS public.companies_id_seq;
CREATE TABLE public.companies
(
    id integer NOT NULL DEFAULT nextval('companies_id_seq'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    jsonb jsonb,
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT companies_type_key PRIMARY KEY (kind, key)
);

INSERT INTO public.store(
	 kind, key, store_to, jsonb)
	VALUES 
	( 'money', 'ILS', '2100-01-01','{"code":"ILS","name": "New Israeli shekel","rate": 3.3,"bid": 3.4,"ask": 3.2}'),
	( 'money', 'JPY', '2100-01-01','{"code":"JPY","name": "Japan Yen","rate": 103,"bid": 104,"ask": 102}'),
	( 'money', 'CAD', '2100-01-01','{"code":"CAD","name": "Canadian Dollar","rate": 1.3,"bid": 1.4,"ask": 1.2}')

ON CONFLICT(kind, key) DO UPDATE SET
	stored = now(),
	jsonb = EXCLUDED.jsonb,
	store_to = EXCLUDED.store_to,
	status = 1 
RETURNING *;
