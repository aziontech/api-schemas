module.exports = (response, _opts, paths) => {
  const errors = [];

  if (!response.content) {
    errors.push({
      message: "202 response must have content with AsyncOperationResponse schema"
    });
    return errors;
  }

  const schema = response.content['application/json']?.schema;
  if (!schema || !schema.properties) {
    errors.push({
      message: "202 response is missing schema"
    });
    return errors;
  }

  const requiredFields = ['operation_id', 'status', 'status_url'];

  requiredFields.forEach(field => {
    if (!schema.properties[field]) {
      errors.push({
        message: `202 response must have '${field}' field`
      });
    }
  });

  // Validar enum do status
  if (schema.properties.status && !schema.properties.status.enum) {
    errors.push({
      message: "'status' field must have enum: ['pending', 'running', 'completed', 'failed']"
    });
  }

  return errors;
};
