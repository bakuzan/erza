const { RepeatPatterns } = require('../../constants/enums');

module.exports = {
  isRepeated(instance) {
    if (instance.todoTemplate) {
      return instance.todoTemplate.repeatPattern !== RepeatPatterns.None;
    }

    return instance
      .getTodoTemplate()
      .then((template) => template.repeatPattern !== RepeatPatterns.None);
  },
  isLast(instance) {
    const queryArgs = { order: [['date', 'DESC']], limit: 1 };

    if (instance.todoTemplate) {
      return instance.todoTemplate
        .getTodoInstances(queryArgs)
        .then(([lastInstance]) => lastInstance.id === instance.id);
    }

    return instance
      .getTodoTemplate()
      .then((template) =>
        template
          .getTodoInstances(queryArgs)
          .then(([lastInstance]) => lastInstance.id === instance.id)
      );
  },
  template(instance) {
    if (instance.todoTemplate) {
      return instance.todoTemplate;
    }

    return instance.getTodoTemplate().then((template) => template);
  }
};
