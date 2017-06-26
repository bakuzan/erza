const chalk = require('chalk');
const Constants = require('../constants');
const { capitalise } = require('../utils/common');

const popura = require('popura');
const client = popura(process.env.MAL_USER, process.env.MAL_PASSWORD);


const convertUSDateFormat = date => date.getMonth() + 1 + '' + date.getDate() + '' + date.getFullYear();

const getMalAnime = animeitem => ({
	episode: animeitem.episode,
	date_start: convertUSDateFormat(animeitem.start),
	date_finish: animeitem.end ? convertUSDateFormat(animeitem.end) : null,
	status: animeitem.status,
	enable_rewatching: animeitem.isRepeat ? 1 : 0,
	score: animeitem.rating || 0
})

const getMalManga = mangaitem => ({
	chapter: mangaitem.chapter,
	volume: mangaitem.volume,
	date_start: convertUSDateFormat(mangaitem.start),
	date_finish: mangaitem.end ? convertUSDateFormat(mangaitem.end) : null,
	status: mangaitem.status,
	enable_rereading: mangaitem.isRepeat ? 1 : 0,
	score: mangaitem.rating || 0
})

const getMalUpdateObject = {
	[Constants.type.anime] : getMalAnime,
	[Constants.type.manga] : getMalManga,
}

const successMalEntry = t => result => console.log(chalk.cyan.bold(`${t}ed mal entry`));
const failedEntry = err => console.log(chalk.bgWhite.red.bold('Mal entry error : '), err);

const addEntity = (type, id, values) => client[`add${capitalise(type)}`](id, values);
const updateEntity = (type, id, values) => client[`update${capitalise(type)}`](id, values);

exports.addOnMal = (type, item) => {
	const malValues = getMalUpdateObject[type](item);
	addEntity(type, item.malId, malValues)
		.then(successMalEntry('Add'))
		.catch(err => {
			failedEntry(err);
			module.exports.updateOnMal(type, item);
		});
}

exports.updateOnMal = (type, item) => {
	const malValues = getMalUpdateObject[type](item);
	updateEntity(type, item.malId, malValues)
		.then(successMalEntry('Update'))
		.catch(failedEntry);
}
