module.exports = (info, _opts, paths) => {
  const errors = [];

  if (!info.contact) {
    errors.push({
      message: "API must have 'info.contact' with support information"
    });
    return errors;
  }

  // Validar campos obrigatórios do contact
  if (!info.contact.name) {
    errors.push({
      message: "info.contact must have 'name' field"
    });
  }

  if (!info.contact.email) {
    errors.push({
      message: "info.contact must have 'email' field"
    });
  }

  if (!info.contact.url) {
    errors.push({
      message: "info.contact should have 'url' field pointing to documentation or support"
    });
  }

  return errors;
};
