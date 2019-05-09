const { db, TodoInstance, TodoTemplate } = require('../connectors');
const generateTodoInstances = require('../utils/generateTodoInstances');

module.exports = {
  async updateTodoInstance(fakeTemplate) {
    const { id, name, date } = fakeTemplate;
    const instance = { id, name, date };
    return await processResolver(
      TodoInstance.update(instance, { where: { id: instance.id } })
    );
  },
  async updateTodoTemplate(templateId, sudoTemplate) {
    return await processResolver(
      db.transaction(async (transaction) => {
        const { template, isSimpleUpdate } = await applyTemplateUpdates(
          templateId,
          sudoTemplate,
          transaction
        );

        // If only the name changed, update it
        if (isSimpleUpdate) {
          return await TodoInstance.update(
            { name: template.name },
            { where: { todoTemplateId: template.id }, transaction }
          );
        }

        // Delete existing instances.
        await TodoInstance.destroy({
          where: { todoTemplateId: template.id },
          transaction
        });

        // Create new instances
        const todoInstances = generateTodoInstances(template);
        return await TodoInstance.bulkCreate(todoInstances, { transaction });
      })
    );
  }
};

// Helpers

async function processResolver(asyncProcess) {
  return await asyncProcess
    .then(() => ({ success: true, errorMessages: [] }))
    .catch((error) => ({ success: false, errorMessages: [error.message] }));
}

async function applyTemplateUpdates(templateId, sudoT, transaction) {
  const { id, ...newT } = sudoT;
  const oldTemplate = await TodoTemplate.findByPk(templateId, {
    transaction,
    raw: true
  });

  const template = { ...oldTemplate, ...newT };

  const isSimpleUpdate = Object.keys(oldTemplate).every((k) => {
    const ov = oldTemplate[k];
    const nv = template[k];
    return ov === nv || k === 'name';
  });

  return await TodoTemplate.update(template, {
    where: { id: template.id },
    transaction
  }).then(() => ({
    template,
    isSimpleUpdate
  }));
}
