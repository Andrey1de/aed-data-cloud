-- 2021-05-09 changed btext and append passive unique key id

---------------- ACTIONS  -------------------
DROP TABLE IF EXISTS public.actions;
DROP SEQUENCE IF  EXISTS public.actions_id_seq1;
CREATE  SEQUENCE IF NOT EXISTS public.actions_id_seq1;
CREATE TABLE public.actions
(
    id integer NOT NULL DEFAULT nextval('actions_id_seq1'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT actions_type_key PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;

---------------- STORE  -------------------
DROP TABLE IF EXISTS public.store;
DROP SEQUENCE IF EXISTS public.store_id_seq1;
CREATE SEQUENCE IF NOT EXISTS public.store_id_seq1;
CREATE TABLE public.store
(
    id integer NOT NULL DEFAULT nextval('store_id_seq1'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT store_type_key PRIMARY KEY (kind, key)
)
TABLESPACE pg_default;

---------------- TEMP  -------------------

DROP TABLE IF EXISTS public.temp;
DROP SEQUENCE IF EXISTS public.temp_id_seq1;
CREATE SEQUENCE IF NOT EXISTS public.temp_id_seq1;
CREATE TABLE public.temp
(
    id integer NOT NULL DEFAULT nextval('temp_id_seq1'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT temp_type_key PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;

---------------- TEMP  -------------------

DROP TABLE IF EXISTS public.temp;
DROP SEQUENCE IF EXISTS public.temp_id_seq1;
CREATE SEQUENCE IF NOT EXISTS public.temp_id_seq1;
CREATE TABLE public.temp
(
    id integer NOT NULL DEFAULT nextval('temp_id_seq1'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT temp_type_key PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;


---------------- USERS  -------------------

DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq1;
CREATE SEQUENCE IF NOT EXISTS public.users_id_seq1;
CREATE TABLE public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq1'::regclass),
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    btext text COLLATE pg_catalog."default",
    status integer NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT users_type_key PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;



