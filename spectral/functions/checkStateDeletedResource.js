module.exports = function checkStateDeletedResource(context) {
    const { path, value } = context;
    if (path && path.includes("delete") && value.hasOwnProperty("content")) {
      const content = value.content;
      if (!content.hasOwnProperty("application/json") || !content["application/json"].schema.hasOwnProperty("properties") || !content["application/json"].schema.properties.hasOwnProperty("state")) {
        return {
          message: "DELETE response must contain the 'state' key in JSON schema",
          path: path,
        };
      }
      const stateSchema = content["application/json"].schema.properties.state;
      const allowedTypes = ["string", "integer", "boolean"];
      if (!allowedTypes.includes(stateSchema.type)) {
        return {
          message: "The data type of the 'state' field in the DELETE response must be 'string', 'integer', or 'boolean'",
          path: path,
        };
      }
    }
  };
