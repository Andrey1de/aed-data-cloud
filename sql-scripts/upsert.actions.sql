INSERT INTO public.actions(
	 kind, key, store_to, btext)
	VALUES ( 'aa', '22', '2100-01-01','{"bb":"kgj"}')
ON CONFLICT(kind, key) DO UPDATE SET
	stored = now(),
	btext = EXCLUDED.btext,
	store_to = EXCLUDED.store_to,
	status = 1
RETURNING *;