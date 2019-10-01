select 
	t.id, 
	t.name, 
	count(links.animeId) as 'timesUsed', 
    printf("%.2f", avg(series.rating)) as 'averageRating'
from tags as t
join AnimeTag as links on t.id = links.tagId
join animes as series on links.animeId = series.id
where t.isAdult = :isAdult
group by t.id
order by timesUsed desc