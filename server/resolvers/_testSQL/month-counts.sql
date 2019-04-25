SELECT 
	strftime('%Y-%m', `end`) AS `key`, 
	COUNT(`id`) AS `value` 
FROM `animes` AS `anime` 
WHERE 
	`anime`.`isAdult` = 0 
	AND 
	`anime`.`status` = 'Completed' 
GROUP BY strftime('%Y-%m', `end`);