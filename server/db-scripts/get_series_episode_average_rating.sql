WITH history AS
(
	SELECT
		a.id AS `key`,
		a.title,
		ep.rating
	FROM episodes AS ep
	JOIN animes AS a ON ep.animeId = a.id
	WHERE
		ep.animeId = :seriesId
		AND
		(a.end IS NULL OR strftime('%Y-%m-%d', ep.date) <= strftime('%Y-%m-%d', a.end))
),
mean AS (
	SELECT h.key, AVG(h.rating) AS 'mean'
	FROM history AS h
),
median AS (
	SELECT key, AVG(rating) AS 'median'
	FROM (SELECT h.key, h.rating
		  FROM history AS h
		  ORDER BY h.rating
		  LIMIT 2 - (SELECT COUNT(*) FROM history) % 2    -- odd 1, even 2
		  OFFSET (SELECT (COUNT(*) - 1) / 2
				  FROM history))
),
mode AS (
	SELECT h.key, h.rating, COUNT(*) AS 'count'
	FROM history AS h
	GROUP BY h.rating
	ORDER BY COUNT(*) DESC
)
SELECT 
	h.key, 
	a.mean AS 'mean',
	e.median AS 'median',
	o.rating AS 'mode', 
	MAX(o.count)
FROM history AS h
JOIN mean AS a ON h.key = a.key
JOIN median AS e ON h.key = e.key
JOIN mode AS o ON h.key = o.key
GROUP BY h.key