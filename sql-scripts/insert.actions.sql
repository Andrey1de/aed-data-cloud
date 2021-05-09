INSERT INTO public.actions(
	kind, key, btext )
VALUES 
('a', 'b', '{"a":"b"}' ),
('a', 'c', '{"a":"c"}' ),
('a', 'd', '{"a":"d"}' )
RETURNING *;
	