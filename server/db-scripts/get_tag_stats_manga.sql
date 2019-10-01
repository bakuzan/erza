select 
	t.id, 
	t.name, 
	count(links.mangaId) as 'timesUsed', 
    printf("%.2f", avg(series.rating)) as 'averageRating'
from tags as t
join ManagaTag as links on t.id = links.tagId
join mangas as series on links.mangaId = series.id
where t.isAdult = :isAdult
group by t.id
order by timesUsed desc