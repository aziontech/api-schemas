module.exports = (openapi, _opts, paths) => {
  const errors = [];

  if (!openapi.servers || openapi.servers.length === 0) {
    errors.push({
      message: "API must define at least one server in 'servers' array"
    });
    return errors;
  }

  // Validar cada servidor
  openapi.servers.forEach((server, index) => {
    if (!server.url) {
      errors.push({
        message: `Server at index ${index} must have 'url' field`
      });
    }

    if (!server.description) {
      errors.push({
        message: `Server at index ${index} should have 'description' field`
      });
    }

    // Validar formato da URL
    if (server.url && !server.url.startsWith('http') && !server.url.startsWith('{')) {
      errors.push({
        message: `Server URL '${server.url}' should be a valid HTTP(S) URL or use variables`
      });
    }
  });

  return errors;
};
