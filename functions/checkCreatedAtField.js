/**
 * Spectral custom function to validate that POST creation endpoints
 * include a 'created_at' field in their response schema.
 *
 * This ensures proper resource tracking for auditing and business rules.
 */

const PREFERRED_FIELD = 'created_at';
const ACCEPTED_VARIATIONS = ['created', 'creation_date', 'date_created'];

// Lista de exceções - adicione operationIds ou paths que não precisam de created_at
const EXCEPTIONS = {
    operationIds: [
        'create_application',
        'clone_application',
        'create_cache_setting',
        'create_device_group',
        'create_application_function_instance',
        'create_application_request_rule',
        'create_application_response_rule',
        'auth_user_login',
        'create_totp_device',
        'auth_user_refresh_token',
        'auth_user_revoke',
        'create_connector',
        'create_custom_page',
        'create_dns_record',
        'create_dns_zone',
        'create_data_stream',
        'create_template',
        'create_certificate_revocation_list',
        'create_certificate_signing_request',
        'create_certificate',
        'request_certificate',
        'create_firewall',
        'clone_firewall',
        'create_firewall_function',
        'create_firewall_rule',
        'create_function',
        'create_network_list',
        'create_purge_request',
        'create_database',
        'create_bucket',
        'create_object_key',
        'copy_object_key',
        'create_waf',
        'clone_waf',
        'create_waf_exception',
        'create_workload',
    ],
    paths: []
};

export default (root, options, context) => {
    const errors = [];
    const warnings = [];
    const endpoints = root.paths || {};
    const schemas = root.components?.schemas || {};

    for (const path in endpoints) {
        const methods = endpoints[path];

        for (const method in methods) {
            // Apenas POST é verificado
            if (method !== 'post') continue;

            const operation = methods[method];
            const operationId = operation.operationId || '';

            // Verifica se é uma exceção
            if (isException(operationId, path)) continue;

            // Verifica se é endpoint de criação
            if (!isCreationEndpoint(operation)) continue;

            // Obtém schema de resposta (201 ou 200)
            const responseSchema = getResponseSchema(operation, schemas);
            if (!responseSchema) {
                // Endpoint sem schema de resposta definido - ignora (outra regra pode capturar)
                continue;
            }

            // Verifica campo created_at
            const fieldCheck = checkCreatedAtField(responseSchema, schemas);

            if (!fieldCheck.hasField && !fieldCheck.hasVariation) {
                errors.push({
                    message: `POST creation endpoint ${path} (${operationId}) must include '${PREFERRED_FIELD}' field in response schema for auditing purposes`,
                    severity: 'error'
                });
            } else if (!fieldCheck.hasField && fieldCheck.hasVariation) {
                warnings.push({
                    message: `POST creation endpoint ${path} (${operationId}) uses '${fieldCheck.variationFound}' instead of preferred '${PREFERRED_FIELD}' - consider standardizing`,
                    severity: 'warn'
                });
            }
        }
    }

    return [...errors, ...warnings];
};

/**
 * Verifica se o endpoint está na lista de exceções
 */
function isException(operationId, path) {
    // Verifica operationId (case-insensitive)
    const opIdLower = operationId.toLowerCase();
    for (const exception of EXCEPTIONS.operationIds) {
        if (opIdLower === exception.toLowerCase()) return true;
    }

    // Verifica path
    for (const exception of EXCEPTIONS.paths) {
        if (path === exception) return true;
    }

    return false;
}

/**
 * Determina se é um endpoint de criação baseado em:
 * 1. Response status 201 (Created)
 * 2. operationId contendo 'create' ou 'new'
 * 3. summary/description contendo padrões de criação
 */
function isCreationEndpoint(operation) {
    // Status 201 é forte indicador de criação
    if (operation.responses?.['201']) return true;

    // Verifica operationId
    const operationId = (operation.operationId || '').toLowerCase();
    if (/create|new/.test(operationId)) return true;

    // Verifica summary
    const summary = (operation.summary || '').toLowerCase();
    if (/create\s+(a|an|new)/i.test(summary)) return true;

    // Verifica description
    const description = (operation.description || '').toLowerCase();
    if (/create\s+(a|an|new)/i.test(description)) return true;

    return false;
}

/**
 * Obtém o schema de resposta do endpoint (201 ou 200)
 */
function getResponseSchema(operation, schemas) {
    // Prioriza 201, depois 200
    const response = operation.responses?.['201'] || operation.responses?.['200'];
    if (!response) return null;

    // Navega pelo content
    const content = response.content;
    if (!content) return null;

    // Tenta diferentes content-types comuns
    const contentTypes = Object.keys(content);
    for (const ct of contentTypes) {
        if (ct.includes('application/json') && content[ct]?.schema) {
            return resolveSchema(content[ct].schema, schemas);
        }
    }

    return null;
}

/**
 * Resolve referências $ref e combina allOf/oneOf
 */
function resolveSchema(schema, allSchemas) {
    if (!schema) return null;

    // Resolve $ref
    if (schema.$ref) {
        const refName = schema.$ref.split('/').pop();
        return allSchemas[refName] || schema;
    }

    // Combina allOf
    if (schema.allOf) {
        const combined = { properties: {}, required: [] };
        for (const s of schema.allOf) {
            const resolved = resolveSchema(s, allSchemas);
            if (resolved?.properties) {
                Object.assign(combined.properties, resolved.properties);
            }
            if (resolved?.required) {
                combined.required.push(...resolved.required);
            }
        }
        return combined;
    }

    return schema;
}

/**
 * Verifica se o schema contém created_at ou variações
 * Busca em nested objects também (results, data, etc.)
 */
function checkCreatedAtField(schema, allSchemas) {
    if (!schema) return { hasField: false, hasVariation: false };

    const resolved = resolveSchema(schema, allSchemas);
    const properties = resolved?.properties || {};

    // Verifica campo preferido
    if (properties[PREFERRED_FIELD]) {
        return { hasField: true, hasVariation: false };
    }

    // Verifica variações aceitas
    for (const variation of ACCEPTED_VARIATIONS) {
        if (properties[variation]) {
            return { hasField: false, hasVariation: true, variationFound: variation };
        }
    }

    // Verifica em nested objects comuns
    const nestedKeys = ['results', 'data', 'item', 'result'];
    for (const key of nestedKeys) {
        if (properties[key]) {
            const nestedSchema = resolveSchema(properties[key], allSchemas);
            const nestedResult = checkCreatedAtField(nestedSchema, allSchemas);
            if (nestedResult.hasField || nestedResult.hasVariation) {
                return nestedResult;
            }
        }
    }

    return { hasField: false, hasVariation: false };
}