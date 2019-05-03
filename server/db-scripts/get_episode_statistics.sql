SELECT
	ep.animeId AS `key`,
	AVG(ep.rating) AS `average`,
	MAX(ep.rating) AS `highest`,
	MIN(ep.rating) AS `lowest`,
   (SELECT rating
    FROM episodes AS eps
    WHERE 
		eps.animeId = ep.animeId
		AND
		(a.end IS NULL OR eps.date < DATETIME(a.end, '+60 minutes'))
    GROUP BY rating
    ORDER BY COUNT(*) DESC
    LIMIT 1) AS `mode`
FROM episodes AS ep
JOIN animes AS a ON ep.animeId = a.id
WHERE 
	ep.animeId IN (:seriesIds) 
	AND 
	(a.end IS NULL OR ep.date < DATETIME(a.end, '+60 minutes'))
GROUP BY ep.animeId
