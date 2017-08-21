const chalk = require('chalk');
const Constants = require('../constants');
const { capitalise, padNumber } = require('../utils/common');

const popura = require('popura');
const client = popura(process.env.MAL_USER, process.env.MAL_PASSWORD);
const clientAdult = popura(process.env.MAL_USER_ADULT, process.env.MAL_PASSWORD_ADULT);

const convertUSDateFormat = d => {
	if (!d) return null;
	
	const date = new Date(d);
	return `${padNumber(date.getMonth() + 1, 2)}${padNumber(date.getDate(), 2)}${date.getFullYear()}`;
}

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

const getMalClient = isAdult => isAdult ? clientAdult : client;
const addEntity = (type, isAdult, { id, values }) => getMalClient(isAdult)[`add${capitalise(type)}`](id, values);
const updateEntity = (type, isAdult, { id, values }) => getMalClient(isAdult)[`update${capitalise(type)}`](id, values);

exports.addOnMal = (type, item, secondFailure = false) => {
	const malValues = getMalUpdateObject[type](item);
	addEntity(type, item.isAdult, { id: item.malId, values: malValues })
		.then(successMalEntry('Add'))
		.catch(err => {
			failedEntry(err);
			if (!secondFailure) module.exports.updateOnMal(type, item, true);
		});
}

exports.updateOnMal = (type, item, secondFailure = false) => {
	const malValues = getMalUpdateObject[type](item);
	updateEntity(type, item.isAdult, { id: item.malId, values: malValues })
		.then(successMalEntry('Updat'))
		.catch(err => {
			failedEntry(err);
			if (!secondFailure) module.exports.addOnMal(type, item, true);
		});
}
