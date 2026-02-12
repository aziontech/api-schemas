module.exports = (pathItem, _opts, paths) => {
  const errors = [];
  const pathString = paths.target.join('.');

  // Extrair parâmetros da URL: /workspace/{app_id}/{conn_id}
  const urlParams = (pathString.match(/\{([^}]+)\}/g) || [])
    .map(param => param.slice(1, -1)); // Remove {}

  if (urlParams.length === 0) {
    return []; // Sem parâmetros na URL
  }

  // Verificar cada operação (get, post, put, etc.)
  const operations = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

  operations.forEach(method => {
    if (pathItem[method]) {
      const operation = pathItem[method];
      const definedParams = (operation.parameters || [])
        .filter(p => p.in === 'path')
        .map(p => p.name);

      urlParams.forEach(urlParam => {
        if (!definedParams.includes(urlParam)) {
          errors.push({
            message: `Declared path parameter '${urlParam}' needs to be defined as a parameter in ${method.toUpperCase()} operation`
          });
        }
      });
    }
  });

  return errors;
};
