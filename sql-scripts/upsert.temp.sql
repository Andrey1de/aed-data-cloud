INSERT INTO public.temp(
	 kind, key, store_to, btext)
	VALUES ( 'aa', 'bb', '2100-01-01','{"aa":"bb":{"refs":[1,2,3]}}')
ON CONFLICT(kind, key) DO UPDATE SET
	stored = now(),
	btext = EXCLUDED.btext,
	store_to = EXCLUDED.store_to,
	status = 1
RETURNING *;
