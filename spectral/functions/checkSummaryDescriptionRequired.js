module.exports = (operation, _opts, paths) => {
  const errors = [];

  if (!operation.summary || operation.summary.trim() === '') {
    errors.push({
      message: "Operation is missing 'summary'"
    });
  }

  if (!operation.description || operation.description.trim() === '') {
    errors.push({
      message: "Operation is missing 'description'"
    });
  }

  if (operation.summary && operation.summary.length > 100) {
    errors.push({
      message: `Operation summary is too long (${operation.summary.length} chars). Keep it under 100 characters.`
    });
  }

  return errors;
};
