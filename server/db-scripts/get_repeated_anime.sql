WITH h_cte AS (
	SELECT h.animeId, MAX(h.date) as 'date'
	FROM episodes AS h
	JOIN animes AS a on h.animeId = a.id
	WHERE strftime('%Y-%m-%d', h.date) > strftime('%Y-%m-%d', a.end)	
	GROUP BY h.animeId
)
SELECT 
	s.*,
	h.date AS 'lastRepeatDate'
FROM animes AS s
LEFT JOIN h_cte AS h ON s.id = h.animeId
WHERE
	s.isAdult = :isAdult
	AND
	s.status = 'Completed'
	AND
	s.title LIKE :search
	AND
	(s.isRepeat = 1 OR
	 s.timesCompleted >= :minTimesCompleted)
ORDER BY s.timesCompleted DESC, s.title ASC