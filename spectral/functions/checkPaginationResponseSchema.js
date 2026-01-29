module.exports = (schema, _opts, paths) => {
  const errors = [];
  const requiredFields = ['count', 'total_pages', 'page', 'page_size', 'next', 'previous', 'results'];

  if (!schema.properties) {
    return []; // Não é um schema de objeto
  }

  // Verificar se parece ser uma resposta paginada
  // (se tem 'results', assume que é paginada)
  if (!schema.properties.results) {
    return []; // Não é paginada
  }

  requiredFields.forEach(field => {
    if (!schema.properties[field]) {
      errors.push({
        message: `Paginated response is missing required field: '${field}'`
      });
    }
  });

  // Validar tipos
  if (schema.properties.count && schema.properties.count.type !== 'integer') {
    errors.push({
      message: "'count' must be of type 'integer'"
    });
  }

  if (schema.properties.results && schema.properties.results.type !== 'array') {
    errors.push({
      message: "'results' must be of type 'array'"
    });
  }

  return errors;
};
