SELECT 
	t2.id,
	t2.name, 
	t.id AS 'relatedTagId',
	t.name AS 'relatedTagName',
	COUNT(DISTINCT tb2.animeId) AS 'relatedLinkCount'
FROM tags t2
JOIN AnimeTag tb2 ON t2.id = tb2.tagId
JOIN AnimeTag tb1 ON tb2.animeId = tb1.animeId
JOIN tags t ON t.id = tb1.tagId
WHERE t2.id <= t.id AND t2.isAdult = :isAdult
GROUP BY t2.id, t.id