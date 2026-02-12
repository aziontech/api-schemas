export default path => {
    const errors = [];

    const requiredStatusCodes = {
        "post": ["201", "400", "401", "403", "404", "429"],
        "get": ["200", "400", "401", "403", "404", "429"],
        "patch": ["200", "400", "401", "403", "404", "429"],
        "put": ["200", "400", "401", "403", "404", "429"],
        "delete": ["202", "200", "400", "401", "403", "404", "429"]
    };

    for (const method in path) {
        if (requiredStatusCodes[method] && path[method].responses) {
            const statusCodes = Object.keys(path[method].responses);
            const missingStatusCodes = requiredStatusCodes[method].filter(code => !statusCodes.includes(code));

            if (missingStatusCodes.length > 0) {
                errors.push({
                    message: `Missing status codes ${missingStatusCodes.join(', ')} for ${method.toUpperCase()} endpoint`
                });
            }
        }
    }

    return errors;
}
