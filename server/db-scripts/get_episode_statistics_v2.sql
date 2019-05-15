WITH d_cte as (
	SELECT
		ep.animeId AS `key`,
		AVG(ep.rating) AS `average`,
		MAX(ep.rating) AS `highest`,
		MIN(ep.rating) AS `lowest`
	FROM episodes AS ep
	JOIN animes AS a ON ep.animeId = a.id
	WHERE
		ep.animeId IN (:seriesIds)
		AND
		(a.end IS NULL OR ep.date < DATETIME(a.end, '+60 minutes'))
	GROUP BY ep.animeId
), 
e_cte as (
	SELECT a.id as 'key', ep.rating, COUNT(*) as 'count'
	FROM episodes AS ep
	JOIN animes AS a ON ep.animeId = a.id
	WHERE
		ep.animeId IN (:seriesIds)
		AND
		(a.end IS NULL OR ep.date < DATETIME(a.end, '+60 minutes'))
	GROUP BY a.id, ep.rating
	ORDER BY COUNT(*) DESC
)
SELECT d.*, e.rating as 'mode', MAX(e.count)
FROM d_cte as d
JOIN e_cte as e on d.key = e.key
GROUP BY d.key