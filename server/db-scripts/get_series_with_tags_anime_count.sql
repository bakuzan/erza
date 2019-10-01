with 
tagId_split(word, str) as (
	select '', :tagIds || ','
    union all
	select
		substr(str, 0, instr(str, ',')),
		substr(str, instr(str, ',')+1)
    from tagId_split 
	where str != ''
),
tag_cte as
(
	select *
	from AnimeTag
	where 
        :tagIds is null or 
        tagId in (select word from tagId_split where word != '')
	group by animeId
	having count(animeId) = (select count(word) from tagId_split where word != '')
)
select count(a.id) as 'total'
from animes as a
join tag_cte as links on a.id = links.animeId
where
	a.title like :search