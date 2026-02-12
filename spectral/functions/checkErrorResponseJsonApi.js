module.exports = (response, _opts, paths) => {
  const errors = [];

  if (!response.content) {
    return []; // Sem content (ex: 204)
  }

  const contentTypes = Object.keys(response.content);
  const jsonApiContent = response.content['application/vnd.api+json'] ||
                         response.content['application/json'];

  if (!jsonApiContent) {
    return []; // Não é JSON
  }

  const schema = jsonApiContent.schema;
  if (!schema || !schema.properties) {
    errors.push({
      message: "Error response is missing schema definition"
    });
    return errors;
  }

  // Verificar estrutura JSON:API
  if (!schema.properties.errors) {
    errors.push({
      message: "Error response must have 'errors' array following JSON:API format"
    });
  } else if (schema.properties.errors.type !== 'array') {
    errors.push({
      message: "'errors' must be an array"
    });
  }

  return errors;
};
