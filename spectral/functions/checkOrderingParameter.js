module.exports = function checkOrderingParameter(context) {
  const parameter = context.get('value');
  const pattern = /^(?:(?:-|)([a-zA-Z0-9_]+)(?:,)?)+$/;

  if (!pattern.test(parameter)) {
    return {
      message: `The ordering parameter must follow the pattern '-<field>,<field>,...'. Each field must be a valid field name.`,
      path: context.path
    };
  }
};
