WITH h_cte AS (
	SELECT h.mangaId, MAX(h.date) as 'date'
	FROM chapters AS h
	JOIN mangas AS m on h.mangaId = m.id
	WHERE strftime('%Y-%m-%d', h.date) > strftime('%Y-%m-%d', m.end)	
	GROUP BY h.mangaId
)
SELECT 
	s.*,
	h.date AS 'lastRepeatDate'
FROM mangas AS s
LEFT JOIN h_cte AS h ON s.id = h.mangaId
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