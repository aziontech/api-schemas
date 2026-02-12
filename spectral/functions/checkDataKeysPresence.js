module.exports = function checkDataKeysPresence(context) {
    const schema = context.get('content.application/json.schema');
    if (!schema) {
      return;
    }
  
    const dataSchema = schema.properties.data;
    if (!dataSchema) {
      return;
    }
  
    const idKey = dataSchema.properties.id;
    const nameKey = dataSchema.properties.name;
  
    if (!idKey || !nameKey) {
      context.message = 'The "data" object should contain "id" and "name" properties.';
      context.path = ['responses', '[*]', 'content', 'application/json', 'schema', 'properties', 'data'];
    }
  };
