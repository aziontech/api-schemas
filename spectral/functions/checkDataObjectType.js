module.exports = function checkDataObjectType(context) {
    const schema = context.get('content.application/json.schema');
    if (!schema) {
      return;
    }
  
    const dataSchema = schema.properties.data;
    if (!dataSchema) {
      context.message = 'The "data" object is missing from the response schema.';
      context.path = ['responses', '[*]', 'content', 'application/json', 'schema', 'properties', 'data'];
      return;
    }
  
    if (dataSchema.type !== 'object') {
      context.message = 'The "data" object should have a type of "object".';
      context.path = ['responses', '[*]', 'content', 'application/json', 'schema', 'properties', 'data'];
    }
  };
