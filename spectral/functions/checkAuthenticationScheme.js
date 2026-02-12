module.exports = (securitySchemes, _opts, paths) => {
  const errors = [];

  if (!securitySchemes || Object.keys(securitySchemes).length === 0) {
    errors.push({
      message: "API must define at least one security scheme in components.securitySchemes"
    });
    return errors;
  }

  // Verificar se tem Bearer token
  let hasBearerAuth = false;

  Object.entries(securitySchemes).forEach(([name, scheme]) => {
    if (scheme.type === 'http' && scheme.scheme === 'bearer') {
      hasBearerAuth = true;

      // Validar formato JWT
      if (scheme.bearerFormat && scheme.bearerFormat !== 'JWT') {
        errors.push({
          message: `Security scheme '${name}' should use bearerFormat: 'JWT'`
        });
      }
    }
  });

  if (!hasBearerAuth) {
    errors.push({
      message: "API should include a Bearer token authentication scheme (type: http, scheme: bearer)"
    });
  }

  return errors;
};
