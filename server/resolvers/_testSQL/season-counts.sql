SELECT 
	strftime('%Y-%m', `start`) AS `key`, 
	COUNT(`id`) AS `value`
FROM `animes` AS `anime` 
WHERE (
	`anime`.`_legacyIsSeason` = 1 
	OR 
	(strftime('%Y-%m', `start`) = strftime('%Y-%m', `series_start`) 
	 AND 
	 (strftime('%Y-%m', `start`) != strftime('%Y-%m', `end`) OR `anime`.`end` IS NULL) 
	 AND 
	 `anime`.`series_type` IN ('TV', 'ONA'))) 
	 AND 
	 `anime`.`isAdult` = 0 
	 AND 
	 `anime`.`status` IN ('Ongoing', 'Completed') 
GROUP BY strftime('%Y-%m', `start`);