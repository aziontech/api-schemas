export default paths => {
    const errors = [];

    for (const currentPath in paths) {
        for (const httpVerb in paths[currentPath]) {
            if (httpVerb != "get") {
                continue;
            }
            
            const endpointOpenAPISections = Object.keys(paths[currentPath][httpVerb])
            if (endpointOpenAPISections.includes('parameters') === false) {
                errors.push({message: `Missing parameters section`});
                break;
            }

            const parameters = paths[currentPath][httpVerb]['parameters']
            const fieldsParamenter = parameters.find(currentParameter => currentParameter.name == "fields");
            if (!fieldsParamenter) {
                errors.push({
                    message: `Missing query string "fields" on ${httpVerb}`,
                    path: ['paths', currentPath],
                });
            }
        }
    }

    return errors;
}
