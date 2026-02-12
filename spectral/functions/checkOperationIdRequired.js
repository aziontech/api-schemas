module.exports = (operation, _opts, paths) => {
  const errors = [];

  if (!operation.operationId || operation.operationId.trim() === '') {
    errors.push({
      message: `Operation is missing required 'operationId'`
    });
  }

  return errors;
};
