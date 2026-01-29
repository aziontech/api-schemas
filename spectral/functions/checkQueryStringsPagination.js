export default paths => {
    const errors = [];
    for (const currentPath in paths) {
        // if the path accepts a parameter at the end of the URI (Ex: /domains/{id}), then it's NOT a GET/List
        const lastChar = currentPath.slice(-1)
        if (lastChar === '}')
            continue;
        for (const httpVerb in paths[currentPath]) {
            // query strings for pagination and ordering data can only exist in GET List
            if (httpVerb  === 'get') {
                const list = Object.keys(paths[currentPath][httpVerb])
                if (list.includes('parameters') === false) {
                    errors.push({message: `Missing parameters section`});
                    break;
                }
                const parameters = paths[currentPath][httpVerb]['parameters']
                const parameterNameList = [];
                for (const currentParameter of parameters) {
                    parameterNameList.push(currentParameter.name);
                }
                const expectedNames = ["page_size", "page", "ordering"];
                for (const currentName of expectedNames) {
                    if (parameterNameList.includes(currentName) === false) {
                        errors.push({
                            message: `Missing query string ${currentName} on GET List`,
                            path: ['paths', currentPath],
                        });
                    } else {
                        // Check the data type of the parameter
                        const parameter = parameters.find(p => p.name === currentName);
                        if (currentName === "page_size" || currentName === "page") {
                            if (parameter.schema.type !== 'integer') {
                                errors.push({
                                    message: `Query string parameter "${currentName}" must have type "integer" on GET List`,
                                    path: ['paths', currentPath, 'parameters', parameter.name],
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return errors;
}
