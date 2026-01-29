module.exports = (schema, _opts, paths) => {
  const errors = [];

  // Verificar se é um schema polimórfico (tem oneOf, anyOf, ou allOf)
  const isPolymorphic = schema.oneOf || schema.anyOf || schema.allOf;

  if (!isPolymorphic) {
    return []; // Não é polimórfico
  }

  // Schemas polimórficos devem ter discriminator
  if (!schema.discriminator) {
    const schemaName = paths.target[paths.target.length - 1];
    errors.push({
      message: `Polymorphic schema '${schemaName}' should have 'discriminator' for better SDK generation`
    });
  } else {
    // Validar estrutura do discriminator
    if (!schema.discriminator.propertyName) {
      errors.push({
        message: "Discriminator must have 'propertyName' field"
      });
    }

    // Recomendar mapping
    if (!schema.discriminator.mapping) {
      errors.push({
        message: "Discriminator should include 'mapping' for explicit type references"
      });
    }
  }

  return errors;
};
