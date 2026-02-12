// Define extract_id_from_path function
function extractIdFromPath(path) {
  // Extract the last parameter from path and check if it looks like an ID
  // Only match parameters that contain 'id' or 'uuid' in their name (case insensitive)
  const match = path.match(/\/{([^}]*(?:id|uuid)[^}]*)}$/i);
  return match ? match[1] : null;
}

module.exports = function checkResourceIDUsage(value) {
  const errors = [];
  const paths = Object.getOwnPropertyNames(value)
  for (const path of paths) {
    const methods = Object.getOwnPropertyNames(value[path]);
    const extractedId = extractIdFromPath(path)

    for (const method of methods) {
      if (method === 'post' && extractedId) {
        errors.push({
          message: `Resource ID should not be used for POST method. ID found in path: ${path}`,
        });
      }
    }
  };
  return errors;
}
