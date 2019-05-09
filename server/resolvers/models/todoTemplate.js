module.exports = {
  instances(template) {
    if (template.todoInstances) {
      return template.todoInstances;
    }

    return template.getTodoInstances().then((instances) => instances || []);
  }
};
