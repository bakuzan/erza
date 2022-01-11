WITH recurrent_cte AS 
(
	SELECT 
		a.id,
		e.date,
		date(e.date) day,
		cast(strftime('%w', e.date) as integer) dayOfWeekNumber
	FROM animes a
	JOIN episodes e ON a.id = e.animeId AND a.episode = e.episode
	WHERE a.isAdult = 0
	  AND a.status = 'Ongoing'
	  AND dayOfWeekNumber = :dayOfWeekNumber
	  AND day <> date('now')
)
SELECT a.*
FROM animes a
JOIN recurrent_cte r ON a.id = r.id
ORDER BY r.date