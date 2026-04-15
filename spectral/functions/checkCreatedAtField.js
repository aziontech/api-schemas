/**
 * Spectral custom function to validate that POST creation endpoints
 * include a 'created_at' field in their response schema.
 *
 * Rule: If operationId contains 'create', 'clone', or 'request',
 * the response must include 'created_at' field.
 *
 * EXCEPTIONS contains endpoints that match the pattern but:
 * - Don't have created_at (e.g., create_bucket)
 * - Have a non-standard field name that needs to be fixed (e.g., 'created')
 */

const PREFERRED_FIELD = 'created_at';
const CREATION_PATTERNS = ['create', 'clone', 'request'];

// Endpoints that match creation pattern but don't have created_at
const EXCEPTIONS = [
    // Don't have created_at
    'create_application',
    'clone_application',
    'create_waf',
    'clone_waf',
    'create_favorite',
    'CreateGrant',
    'create_row',
    'create_dns_record',
    'create_dns_zone',
    'create_function',
    'create_purge_request',
    'create_database',
    'create_bucket',
    'create_object_key',
    'copy_object_key',
    'create_waf_exception',
    'create_totp_device',
    'create_descendant_account',

    // AI/LLM endpoints - don't have created_at
    'create chat thread',
    'create document',
    'create knowledge base',
    'create message',
    'create tool',

    // Has timestamp data but with non-standard name (needs fixing)
    'create_data_stream',  // uses 'created' instead of 'created_at'
];

export default (root, options, context) => {
    const errors = [];
    const endpoints = root.paths || {};
    const schemas = root.components?.schemas || {};

    for (const path in endpoints) {
        const methods = endpoints[path];

        for (const method in methods) {
            if (method !== 'post') continue;

            const operation = methods[method];
            const operationId = operation.operationId || '';
            const opIdLower = operationId.toLowerCase();

            // Check if operationId contains create, clone, or request
            const isCreationEndpoint = CREATION_PATTERNS.some(pattern => 
                opIdLower.includes(pattern)
            );

            if (!isCreationEndpoint) continue;

            // Check if it's an exception
            if (isException(operationId)) continue;

            // Get response schema (201 or 200)
            const responseSchema = getResponseSchema(operation, schemas);
            if (!responseSchema) continue;

            // Check created_at field
            const hasField = checkCreatedAtField(responseSchema, schemas);

            if (!hasField) {
                errors.push({
                    message: `POST creation endpoint ${path} (${operationId}) must include '${PREFERRED_FIELD}' field in response schema for auditing purposes`,
                    path: ['paths', path, method],
                    severity: 0 // error
                });
            }
        }
    }

    return errors;
};

/**
 * Check if the endpoint is in the exceptions list
 */
function isException(operationId) {
    const opIdLower = operationId.toLowerCase();
    return EXCEPTIONS.some(exception => 
        opIdLower === exception.toLowerCase()
    );
}

/**
 * Get the response schema from the endpoint (201 or 200)
 */
function getResponseSchema(operation, schemas) {
    const response = operation.responses?.['201'] || operation.responses?.['200'];
    if (!response) return null;

    const content = response.content;
    if (!content) return null;

    const contentTypes = Object.keys(content);
    for (const ct of contentTypes) {
        if (ct.includes('application/json') && content[ct]?.schema) {
            return resolveSchema(content[ct].schema, schemas);
        }
    }

    return null;
}

/**
 * Resolve $ref references and combine allOf/oneOf
 */
function resolveSchema(schema, allSchemas) {
    if (!schema) return null;

    if (schema.$ref) {
        const refName = schema.$ref.split('/').pop();
        return allSchemas[refName] || schema;
    }

    if (schema.allOf) {
        const combined = { properties: {}, required: [] };
        for (const s of schema.allOf) {
            const resolved = resolveSchema(s, allSchemas);
            if (resolved?.properties) Object.assign(combined.properties, resolved.properties);
            if (resolved?.required) combined.required.push(...resolved.required);
        }
        return combined;
    }

    if (schema.oneOf) {
        const combined = { properties: {}, required: [] };
        for (const s of schema.oneOf) {
            const resolved = resolveSchema(s, allSchemas);
            if (resolved?.properties) Object.assign(combined.properties, resolved.properties);
            if (resolved?.required) combined.required.push(...resolved.required);
        }
        return combined;
    }

    return schema;
}

/**
 * Check if the schema contains created_at
 */
function checkCreatedAtField(schema, allSchemas) {
    if (!schema) return false;

    const resolved = resolveSchema(schema, allSchemas);
    const properties = resolved?.properties || {};

    if (properties[PREFERRED_FIELD]) {
        return true;
    }

    // Check nested data structures
    const nestedKeys = ['results', 'data', 'item', 'result'];
    for (const key of nestedKeys) {
        if (properties[key]) {
            const nestedSchema = resolveSchema(properties[key], allSchemas);
            if (checkCreatedAtField(nestedSchema, allSchemas)) return true;
        }
    }

    return false;
}
