SELECT 
	t2.id,
	t2.name, 
	t.id AS 'relatedTagId',
	t.name AS 'relatedTagName',
	COUNT(DISTINCT tb2.mangaId) AS 'relatedLinkCount'
FROM tags t2
JOIN MangaTag tb2 ON t2.id = tb2.tagId
JOIN MangaTag tb1 ON tb2.mangaId = tb1.mangaId
JOIN tags t ON t.id = tb1.tagId
WHERE t2.id <= t.id AND t2.isAdult = :isAdult
GROUP BY t2.id, t.id