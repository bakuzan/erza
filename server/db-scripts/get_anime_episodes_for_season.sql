SELECT 
	e.id,
	e.date, 
	e.rating, 
	e.episode, 
	e.animeId,
	a.title, 
	a.start,
	a.end,
	a.series_start,
	a.series_type,
	a._legacyIsSeason, 
	a.image,
	a.malId,
	a.rating AS 'overallRating', 
	a.series_episodes AS 'totalEpisodes'
FROM episodes AS e
JOIN animes AS a ON e.animeId = a.id
WHERE
	a.isAdult = 0
	AND
	e.rating <> 0
	AND
	(a.end IS NULL OR strftime('%Y-%m-%d', e.date) <= strftime('%Y-%m-%d', a.end))
	AND
	a.status IN ('Ongoing', 'Completed')
	AND
	(a._legacyIsSeason = 1
	 OR (strftime('%Y-%m', a.start) = strftime('%Y-%m', a.series_start)
		 AND
		 (a.end IS NULL OR strftime('%Y-%m', a.start) <> strftime('%Y-%m', a.end))
		 AND
		 a.series_type IN ('TV', 'ONA')
	    )	 
	)
	AND
	e.date >= :start AND e.date < :end
ORDER BY e.date ASC