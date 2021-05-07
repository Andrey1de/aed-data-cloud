INSERT INTO public.actions(
	kind, key, jdata )
VALUES 
('a', 'b', '{"a":"b"}' ),
('a', 'c', '{"a":"c"}' ),
('a', 'd', '{"a":"d"}' )
RETURNING *;
	