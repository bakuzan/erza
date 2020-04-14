select 
	t.id, 
	t.name, 
	count(links.mangaId) as 'timesUsed', 
    printf("%.2f", avg(case when series.rating <> 0 then series.rating else null end)) as 'averageRating'
from tags as t
join MangaTag as links on t.id = links.tagId
join mangas as series on links.mangaId = series.id
where t.isAdult = :isAdult
group by t.id
order by timesUsed desc