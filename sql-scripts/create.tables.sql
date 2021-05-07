-- Table: public.actions
--SET TRANSACTION READ WRITE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF  EXISTS public.actions;

CREATE TABLE public.actions
(
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    jdata  jsonb not null default '{"item":""}'::jsonb,
	guid UUID NOT NULL DEFAULT uuid_generate_v1() ,
    status  int NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT actions_type_key PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;



COMMENT ON COLUMN public.actions.jdata
    IS 'json additional content {"item":base64}';

-- Table: public.store

DROP TABLE IF EXISTS public.store;

CREATE TABLE public.store
(
   kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    jdata  jsonb not null default '{"item":""}'::jsonb,
	guid UUID NOT NULL DEFAULT uuid_generate_v1() ,
    status  int NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT store_pkey PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;



COMMENT ON COLUMN public.store.jdata
    IS 'json additional content {"item":base64}';

-- Table: public.users
DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users
(
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    jdata  jsonb not null default '{"item":""}'::jsonb,
	guid UUID NOT NULL DEFAULT uuid_generate_v1() ,
    status  int NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT users_pkey PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;


-- Table: public.temp

DROP TABLE IF EXISTS public.temp;

CREATE TABLE public.temp
(
    kind character varying COLLATE pg_catalog."default" NOT NULL,
    key character varying COLLATE pg_catalog."default" NOT NULL,
    jdata  jsonb not null default '{"item":""}'::jsonb,
	guid UUID NOT NULL DEFAULT uuid_generate_v1() ,
    status  int NOT NULL DEFAULT 0,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT to_timestamp('2100-01-02'::text, 'YYYY-MM-DD'::text),
    CONSTRAINT temp_pkey PRIMARY KEY (kind, key)
)

TABLESPACE pg_default;


COMMENT ON COLUMN public.temp.jdata
    IS 'json additional content {"item":base64}';

