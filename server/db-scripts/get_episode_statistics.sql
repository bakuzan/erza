SELECT
	animeId AS `key`,
	AVG(rating) AS `average`,
	MAX(rating) AS `highest`,
	MIN(rating) AS `lowest`,
   (SELECT rating
    FROM episodes AS eps
    WHERE eps.animeId = ep.animeId
    GROUP BY rating
    ORDER BY COUNT(*) DESC
    LIMIT 1) AS `mode`
FROM episodes AS ep
WHERE animeId IN (:seriesIds)
GROUP BY animeId
