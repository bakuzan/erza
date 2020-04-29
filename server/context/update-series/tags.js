const Op = require('sequelize').Op;

const { db, Tag } = require('../../connectors');

module.exports = async function updateSeriesTags(model, args) {
  const newTags = args.newTags
    .map((x) => x.toLowerCase().trim())
    .filter((x) => !!x);

  return db.transaction(async function (transaction) {
    const series = await model.findByPk(args.seriesId, {
      include: [Tag],
      transaction
    });

    const warningMessages = [];
    const isAdult = series.get('isAdult');

    const currentTags = await Tag.findAll({
      raw: true,
      where: {
        isAdult: { [Op.eq]: isAdult },
        [Op.or]: [
          { id: { [Op.in]: args.addTagIds } },
          { name: { [Op.in]: newTags } }
        ]
      },
      transaction
    });

    const removedExistingTagIds = series.tags
      .filter((x) => args.removeTagIds.some((tId) => tId === x.id))
      .map((x) => x.id);

    if (removedExistingTagIds.length !== args.removeTagIds.length) {
      warningMessages.push(
        `Some remove tag ids were not already linked to the series and have been ignored.`
      );
    }

    const validAddIds = args.addTagIds.filter(
      (tId) =>
        !series.tags.some((x) => x.id === tId) &&
        currentTags.some((x) => x.id === tId)
    );

    if (validAddIds.length !== args.addTagIds.length) {
      warningMessages.push(
        `Some add tag ids either did not exist or were already linked to the series and have been ignored.`
      );
    }

    const newTagsThatExistAlready = currentTags
      .filter((x) => newTags.includes(x.name))
      .map((x) => x.id);

    const newTagsThatExistAlreadyNotAdded = newTagsThatExistAlready.filter(
      (tId) => !series.tags.some((x) => x.id === tId)
    );

    if (newTagsThatExistAlreadyNotAdded.length) {
      warningMessages.push(
        `Some new tags already exist. Those that are not already linked to the series have been linked.`
      );
    }

    const addedExistingTagIds = [
      ...validAddIds,
      ...newTagsThatExistAlreadyNotAdded
    ].filter((x, i, a) => a.indexOf(x) === i);

    // Actual updating begins here...

    if (removedExistingTagIds.length) {
      await series.removeTags(removedExistingTagIds, {
        transaction
      });
    }

    if (addedExistingTagIds.length) {
      await series.addTags(addedExistingTagIds, {
        transaction
      });
    }

    const actualNewTags = newTags.filter(
      (name) => !currentTags.some((x) => x.name === name)
    );

    if (actualNewTags.length) {
      const createdAt = Date.now();
      const tagModels = actualNewTags.map((name) => ({ name, isAdult }));

      await Tag.bulkCreate(tagModels, {
        transaction
      });

      const createdTags = await Tag.findAll({
        where: { createdAt: { [Op.gte]: createdAt } },
        transaction
      });

      await series.addTags(createdTags, { transaction });

      actualNewTags.forEach((name) =>
        warningMessages.push(`Created new tag: '${name}' and linked to series.`)
      );
    }

    return { success: true, errorMessages: [], warningMessages };
  });
};
