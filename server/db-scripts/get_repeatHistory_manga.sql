WITH series_history AS
(
	SELECT
		a.*,
		h.id AS repeatInstanceId,
		h.date AS repeatInstanceDate, 
		h.chapter AS repeatInstanceNumber,
		LAG(h.chapter, 1, 0) OVER (ORDER BY h.date DESC) previousRepeatInstanceNumber,
		LEAD(h.chapter, 1, 0) OVER (ORDER BY h.date DESC) nextRepeatInstanceNumber
	FROM mangas AS a
	LEFT JOIN chapters AS h
	WHERE 
		a.id = :seriesId
		AND a.id = h.mangaId
		AND strftime('%Y-%m-%d', h.date) > strftime('%Y-%m-%d', a.end)
	ORDER BY h.date DESC
),
repeat_history AS (
	SELECT 
		s.*,
		s.previousRepeatInstanceNumber - s.repeatInstanceNumber AS repeatDifference
	FROM series_history AS s
)
SELECT 
	r.id,
	r.title,
	r.isRepeat,
	r.timesCompleted,
	r.series_chapters AS seriesTotalParts,
	r.repeatInstanceId,
	r.repeatInstanceDate,
	r.repeatInstanceNumber
FROM repeat_history AS r
WHERE r.nextRepeatInstanceNumber = 0
   OR r.repeatDifference < 1