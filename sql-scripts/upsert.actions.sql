INSERT INTO public.actions(
	 kind, key, store_to, jdata)
	VALUES ( 'aa', '22', '2100-01-01','{"bb":"kgj"}')
ON CONFLICT(kind, key) DO UPDATE SET
	stored = now(),
	jdata = EXCLUDED.jdata,
	store_to = EXCLUDED.store_to,
	status = 1
RETURNING *;