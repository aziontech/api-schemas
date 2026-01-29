module.exports = (operation, _opts, paths) => {
  const errors = [];
  const parameters = operation.parameters || [];

  // Verificar se é um list endpoint (GET sem path params)
  const pathString = paths.target.join('.');
  const hasPathParams = /\{[^}]+\}/.test(pathString);

  if (hasPathParams) {
    return []; // Não é list endpoint
  }

  const paramNames = parameters.map(p => p.name);
  const commonFilters = ['page', 'page_size', 'ordering'];

  commonFilters.forEach(filter => {
    if (!paramNames.includes(filter)) {
      errors.push({
        message: `List endpoint should document '${filter}' parameter`
      });
    }
  });

  return errors;
};
