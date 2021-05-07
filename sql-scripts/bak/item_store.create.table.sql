
DROP TABLE IF EXISTS public.item_store;

DROP SEQUENCE IF EXISTS public.item_store_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.item_store_id_seq;

--DROP TABLE IF EXISTS public.users;

CREATE TABLE public.item_store
(
    id integer NOT NULL DEFAULT nextval('item_store_id_seq'::regclass),
    type text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    key text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    stored timestamp(3) with time zone NOT NULL DEFAULT now(),
    store_to timestamp(3) with time zone NOT NULL DEFAULT timezone('utc'::text, ('2100-01-01'::date)::timestamp with time zone),
    jdata text COLLATE pg_catalog."default",
    CONSTRAINT item_store_id_key UNIQUE (id),
    CONSTRAINT item_store_type_key UNIQUE (type, key)
)

TABLESPACE pg_default;

ALTER TABLE public.item_store
    OWNER to andrey1de;

COMMENT ON COLUMN public.item_store.jdata
    IS 'json additional content';