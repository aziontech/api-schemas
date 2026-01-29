module.exports = (operation, _opts, paths) => {
  const errors = [];
  const method = paths.target[paths.target.length - 1]; // 'get', 'post', etc.
  const responses = operation.responses || {};
  const statusCodes = Object.keys(responses);

  const rules = {
    get: ['200'],
    post: ['201', '202'],
    put: ['200'],
    patch: ['200', '202'],
    delete: ['200', '202']
  };

  if (rules[method]) {
    const requiredCodes = rules[method];
    const hasRequired = requiredCodes.some(code => statusCodes.includes(code));

    if (!hasRequired) {
      errors.push({
        message: `${method.toUpperCase()} operation must include one of: ${requiredCodes.join(', ')}`
      });
    }
  }

  return errors;
};
