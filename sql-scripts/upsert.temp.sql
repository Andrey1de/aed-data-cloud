SELECT uuid_in(md5(random()::text || clock_timestamp()::text)::cstring);

INSERT INTO public.store(
	kind, key, base64, item,  life_seconds,status , guid)
	VALUES ('aa', 'ee', NULL, '{"aa":[1,2,3,4]}',   1000, 0,
			uuid_in(md5(random()::text || clock_timestamp()::text)::cstring))
ON CONFLICT(kind, key) DO UPDATE SET
	item = EXCLUDED.item,
	base64 = EXCLUDED.base64,
	life_seconds = EXCLUDED.life_seconds,
	status = 1 
RETURNING key,status ;
SELECT * from public.store;