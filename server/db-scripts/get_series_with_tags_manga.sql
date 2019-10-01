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
	from MangaTag
	where 
        :tagIds is null or 
        tagId in (select word from tagId_split where word != '')
	group by mangaId
	having count(mangaId) = (select count(word) from tagId_split where word != '')
)
select *
from mangas as m
join tag_cte as links on m.id = links.mangaId
where
	m.title like :search
order by title
limit :limit
offset :offset