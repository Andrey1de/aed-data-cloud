DELETE FROM public.actions
	WHERE kind='a' and key='b'
RETURNING *;