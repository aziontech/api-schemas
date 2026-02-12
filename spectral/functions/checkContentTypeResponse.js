module.exports = function (context) {
    const errors = [];
    const mimeTypeList = Object.getOwnPropertyNames(context);
    for (const mimeType of mimeTypeList){
      if (!mimeType.match(/^(application\/(json|octet-stream))$/)) {
        errors.push({
          message: `The content type of the "${mimeType}" response must be "application/json" or "application/octet-stream".`,
          severity: 'error',
        });
      }
    }
    return errors;
  };
