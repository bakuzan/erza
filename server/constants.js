const appName = 'erza';

const seasons = {
	winter: 'Winter',
	spring: 'Spring',
	summer: 'Summer',
	fall: 'Fall'
}

const seasonMonths = ["01", "04", "07", "10"];

const seasonalTypes = [1, 5] // tv, ona

const type = {
	anime: 'anime',
	manga: 'manga'
}

const breakdown = {
	months: 'months',
	season: 'season'
}

const status = {
	ongoing: 1,
	completed: 2,
	onhold: 3,
	dropped: 4,
	planned: 6,
}

const environment = {
	development: 'development',
	production: 'production'
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const paths = {
	imgur: {
		postFile: "/api/image-upload/file"
	}
}

const Constants = {
	appName,
	seasons,
  seasonMonths,
  seasonalTypes,
	type,
	status,
	environment,
	breakdown,
	dayNames,
	paths
}

module.exports = Constants;
