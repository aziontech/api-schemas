module.exports = function (context) {
  const parameter = context.get('value');

  if (parameter.schema.type !== 'string') {
    return {
      message: 'The "search" parameter must be of type string.',
    };
  }

  return null;
};
