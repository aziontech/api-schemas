module.exports = (property, _opts, paths) => {
  const errors = [];

  if (!property.description || property.description.trim() === '') {
    const propertyName = paths.target[paths.target.length - 1];
    errors.push({
      message: `Property '${propertyName}' is missing 'description'`
    });
  }

  return errors;
};
