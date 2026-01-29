export default paths => {
    const errors = [];
    for (const pathName of Object.keys(paths)) {
        const path = paths[pathName];
        for (const method in path) {
            if (method === 'get' &&
                path[method]?.responses?.['200']?.content?.['application/json']?.schema?.properties?.results?.type
              ) {
                if (!pathName.endsWith('s')) {
                    errors.push({
                        message: `GET method from ${pathName} returns a list, but its name is not plural`,
                        path: ['paths', pathName],
                    });
                }
            }
        }
    }
    return errors;
};
