select 
	t.id, 
	t.name, 
	count(links.animeId) as 'timesUsed', 
    printf("%.2f", avg(case when series.rating <> 0 then series.rating else null end)) as 'averageRating'
from tags as t
join AnimeTag as links on t.id = links.tagId
join animes as series on links.animeId = series.id
where t.isAdult = :isAdult
group by t.id
order by timesUsed desc