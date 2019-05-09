module.exports = function validateTodoTemplate(template) {
  if (!template.name.trim()) {
    return {
      success: false,
      errorMessages: ['Todo requires alphanumeric characters for a name.']
    };
  }

  return { success: true };
};
