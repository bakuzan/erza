WITH series_history AS
(
	SELECT
		a.*,
		h.id AS repeatInstanceId,
		h.date AS repeatInstanceDate, 
		h.episode AS repeatInstanceNumber,
		LAG(h.episode, 1, 0) OVER (ORDER BY h.date DESC) previousRepeatInstanceNumber,
		LEAD(h.episode, 1, 0) OVER (ORDER BY h.date DESC) nextRepeatInstanceNumber
	FROM animes AS a
	LEFT JOIN episodes AS h
	WHERE 
		a.id = :seriesId
		AND a.id = h.animeId
		AND strftime('%Y-%m-%d', h.date) > strftime('%Y-%m-%d', a.end)
	ORDER BY h.date DESC
)
SELECT 
	r.id,
	r.title,
	r.isRepeat,
	r.timesCompleted,
	r.series_episodes AS seriesTotalParts,
	r.repeatInstanceId,
	r.repeatInstanceDate,
	r.repeatInstanceNumber
FROM series_history AS r
WHERE r.previousRepeatInstanceNumber < r.repeatInstanceNumber
   OR r.nextRepeatInstanceNumber > r.repeatInstanceNumber
   OR r.nextRepeatInstanceNumber = 0