module.exports = (schema, _opts, paths) => {
  const errors = [];

  // Verificar se é um schema de response
  const pathParts = paths.target;
  const isResponseSchema = pathParts.includes('responses');

  if (!isResponseSchema) {
    return []; // Só validar schemas de response
  }

  // Verificar se tem examples ou example
  if (!schema.example && !schema.examples) {
    const schemaName = pathParts[pathParts.length - 1];
    errors.push({
      message: `Response schema should include 'example' or 'examples' for better documentation`
    });
  }

  return errors;
};
