const async = require('async');
const fs = require('fs');

// To get data, run command in folder with mongoexport.exe
// mongoexport -d <db-name> -c <collection> -o /path/to/project/data/<collection>.json

const statuses = [
  'Planned',
  'Ongoing',
  'Completed',
  'Onhold',
  'Dropped',
  'Planned'
];

const enums = new Map([
  [
    'status',
    {
      animeId: statuses,
      mangaId: statuses
    }
  ],
  [
    'series_type',
    {
      animeId: ['Unknown', 'TV', 'OVA', 'Movie', 'Special', 'ONA', 'Music'],
      mangaId: [
        'Unknown',
        'Manga',
        'Novel',
        'Oneshot',
        'Doujinshi',
        'Manhwa',
        'Manhua'
      ]
    }
  ]
]);

async function insertTags({ items, model, callback }) {
  const tagMap = new Map([]);

  return await async.eachSeries(
    items,
    async ({ _id, name, isAdult }) => {
      const newTag = await model.create({ name, isAdult });
      return tagMap.set(_id.$oid, newTag.id);
    },
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      callback(null, tagMap);
    }
  );
}

const renamed = {
  createdDate: 'createdAt',
  updatedDate: 'updatedAt'
};
const mapKey = (k) => renamed[k] || k;

function processProperties({ parentAttr, _id, parent, ...instance }) {
  return Object.keys(instance).reduce((p, k) => {
    let value = instance[k];

    // Handle type issues for dates/numbers
    if (['isRepeat', 'owned'].includes(k)) {
      value = !!value;
    } else if (k === 'timesCompleted' && !value) {
      value = 0;
    } else if (typeof value === 'object') {
      value = value ? value.$date : null;
    } else if (typeof value === 'number') {
      const num = Number(value);

      if (num > new Date('2000-01-01').getTime()) {
        value = new Date(num).toISOString();
      } else {
        value = num || 0;
      }
    } else if (['series_start', 'series_end'].includes(k)) {
      value = null; // Fix empty string dates.
    }

    if (enums.has(k)) {
      const enumObj = enums.get(k)[parentAttr];
      value = enumObj[value] || enumObj[0];
    }

    p[mapKey(k)] = value;
    return p;
  }, {});
}

async function insertItemData({
  db,
  items,
  historyItems,
  tagMap,
  model,
  historyModel,
  parentAttr,
  callback
}) {
  async.eachSeries(
    items,
    async function iteratee(instance) {
      const { tags, ...props } = instance;
      const oldSeriesId = props._id.$oid;
      const data = processProperties({ parentAttr, ...props });
      const newTagIds = tags
        .map((t) => tagMap.get(t.$oid))
        .filter((x, i, arr) => arr.indexOf(x) === i);

      return await db.transaction(async (transaction) => {
        const newSeries = await model.create(
          { ...data },
          { transaction, silent: true }
        );
        await newSeries.setTags(newTagIds, { transaction });

        const history = historyItems
          .filter((x) => x.parent.$oid === oldSeriesId)
          .map((x) => processProperties({ ...x, [parentAttr]: newSeries.id }));

        return await historyModel.bulkCreate(history, { transaction });
      });
    },
    (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      callback();
    }
  );
}

async function readSafe(filename) {
  try {
    fs.accessSync(filename, fs.constants.R_OK);
    return await fs.readFileSync(filename, 'utf-8');
  } catch (e) {
    console.log(`Failed to read ${filename}`);
    return false;
  }
}

module.exports = async function initialDataInsert(db) {
  const {
    anime: Anime,
    manga: Manga,
    episode: Episode,
    chapter: Chapter,
    tag: Tag
  } = db.models;
  const start = new Date().toISOString();

  const animes = readSafe('./data/anime.json');
  const mangas = readSafe('./data/manga.json');
  const episodes = readSafe('./data/episode.json');
  const chapters = readSafe('./data/chapter.json');
  const tags = readSafe('./data/tag.json');
  const dataList = [animes, mangas, episodes, chapters, tags];

  if (dataList.some((x) => !x)) {
    // If any of the files don't exists, quit out
    console.warn(
      `One or more data files do not exist.\n\rCancelling data insert.`
    );
    return;
  }

  async.waterfall(
    [
      (callback) => insertTags({ items: tags, model: Tag, callback }),
      (tagMap, callback) =>
        insertItemData({
          db,
          tagMap,
          items: animes,
          historyItems: episodes,
          model: Anime,
          historyModel: Episode,
          parentAttr: 'animeId',
          callback: () => callback(null, tagMap)
        }),
      (tagMap, callback) =>
        insertItemData({
          db,
          tagMap,
          items: mangas,
          historyItems: chapters,
          model: Manga,
          historyModel: Chapter,
          parentAttr: 'mangaId',
          callback: () => callback(null)
        })
    ],
    function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }

      const finish = new Date().toISOString();
      console.log(`Started @ ${start}`);
      console.log(`Finished @ ${finish}`);
    }
  );
};
