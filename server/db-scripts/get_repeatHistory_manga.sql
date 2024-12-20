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
FROM series_history AS r
WHERE r.previousRepeatInstanceNumber < r.repeatInstanceNumber
   OR r.nextRepeatInstanceNumber > r.repeatInstanceNumber
   OR r.nextRepeatInstanceNumber = 0
   OR r.series_chapters = r.repeatInstanceNumber -- 2024-08-16 Fix: Required to return 'middle' records when seriesTotalParts are 1
ORDER BY r.repeatInstanceDate -- 2024-09-03 Fix: Partial rewatch with only 1 episode started   