module.exports = (operation, _opts, paths) => {
  const errors = [];
  const method = paths.target[paths.target.length - 1]; // 'get', 'post', etc.

  // POST, PUT, PATCH devem ter requestBody
  const methodsRequiringBody = ['post', 'put', 'patch'];

  if (methodsRequiringBody.includes(method)) {
    if (!operation.requestBody) {
      errors.push({
        message: `${method.toUpperCase()} operation must have requestBody defined`
      });
    } else if (!operation.requestBody.content) {
      errors.push({
        message: `${method.toUpperCase()} operation requestBody must have content`
      });
    } else if (!operation.requestBody.content['application/json']) {
      errors.push({
        message: `${method.toUpperCase()} operation requestBody must include 'application/json' content type`
      });
    }
  }

  return errors;
};
