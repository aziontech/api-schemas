module.exports = (schema, _opts, paths) => {
  const errors = [];
  const schemaName = paths.target[paths.target.length - 1];

  // Padrões válidos
  const patterns = [
    /^[A-Z][a-zA-Z0-9]+Request$/,      // ApplicationRequest
    /^[A-Z][a-zA-Z0-9]+Response$/,     // AsyncOperationResponse
    /^Paginated[A-Z][a-zA-Z0-9]+List$/, // PaginatedApplicationList
    /^[A-Z][a-zA-Z0-9]+$/,             // Application
    /^JSONAPI[A-Z][a-zA-Z0-9]+$/,      // JSONAPIErrorObject
  ];

  const isValid = patterns.some(pattern => pattern.test(schemaName));

  if (!isValid) {
    errors.push({
      message: `Schema name '${schemaName}' doesn't follow naming conventions (Resource, ResourceRequest, PaginatedResourceList, ResourceResponse)`
    });
  }

  return errors;
};
