#### Basic Spectral Guide for OpenAPI

This is a quick guide on how to use Spectral, a tool for validating and linting OpenAPI specifications. It helps ensure consistency, quality, and compliance within OpenAPI definitions.

For a complete guide, refer to [here](https://docs.google.com/document/d/1nTX3SIufCRktpixwGXwwLuSM_IiM9467btCbQUQTNYI/edit).

## Basic Usage

### Installation

If you haven't installed Spectral yet, use npm (Node Package Manager) with the following command:
```
npm install -g @stoplight/spectral
```
Execution
To run Spectral on an OpenAPI file (e.g., a YAML file), use the following command:
```
spectral lint your_openapi_file.yaml
```
This command will analyze your OpenAPI file and return any problems or errors found, including details on what's incorrect and where.

## Customizing Rules

Spectral allows rule customization to fit your validation needs. You can create or use custom rules by defining them in a .spectral.yaml file in your project.

For more details and specific examples, refer to the complete document.

---

## Azion Custom Rules

This document describes all custom Spectral rules configured in `spectral/spectral.yaml`.

**Total Rules**: 61 (26 original + 35 new)  
**Custom Functions**: 16 (all implemented)

---

## Rules by Category

### 1. Operation IDs

#### `azion-operation-id-required`
- **Severity**: error
- **Description**: Every operation must have an explicit operationId

#### `azion-operation-id-pattern`
- **Severity**: error
- **Description**: operationId must follow snake_case convention
- **Pattern**: `^[a-z][a-z0-9]*(_[a-z0-9]+)*$`

#### `azion-operation-id-crud-convention`
- **Severity**: warn
- **Description**: CRUD operations should follow naming conventions (list_*, get_*, create_*, update_*, patch_*, delete_*)

### 2. Path Parameters

#### `azion-path-parameter-type-required`
- **Severity**: error
- **Description**: Path parameters must have explicit type

#### `azion-path-parameter-required`
- **Severity**: error
- **Description**: Path parameters must be marked as required

#### `azion-path-parameter-description-required`
- **Severity**: error
- **Description**: Path parameters must have a description

### 3. Query Parameters - Pagination

#### `azion-mandatory-query-string-pagination`
- **Severity**: error
- **Description**: Validates that list endpoints implement pagination correctly with query strings
- **Function**: `checkQueryStringsPagination`

### 4. Query Parameters - Filters

#### `azion-query-param-fields-rule`
- **Severity**: error
- **Description**: Validates correct usage of the `fields` parameter in query strings
- **Function**: `checkFieldsQueryParam`

#### `azion-filter-description-required`
- **Severity**: error
- **Description**: Query parameters (filters) must have a description

### 5. Search and Ordering

#### `azion-match-search-parameter`
- **Severity**: error
- **Description**: Validates that the `search` query parameter follows the expected pattern
- **Function**: `checkSearchParameter`

#### `azion-match-ordering-parameter`
- **Severity**: error
- **Description**: Validates that the `ordering` query parameter follows the expected pattern
- **Function**: `checkOrderingParameter`

#### `azion-ordering-enum-required`
- **Severity**: warn
- **Description**: Ordering parameter must have enum with valid field names

### 6. Status Codes

#### `azion-sps-invalid-status-code`
- **Severity**: error
- **Description**: Validates that only allowed status codes are used
- **Allowed values**: 200, 201, 202, 204, 400, 401, 403, 404, 405, 406, 409, 422, 429, 500

#### `azion-mandatory-status-codes`
- **Severity**: error
- **Description**: Validates that endpoints return appropriate mandatory status codes
- **Function**: `checkEndpointStatusCodes`

#### `azion-delete-response-codes`
- **Severity**: error
- **Description**: DELETE operations must return 204 or 202, and must not return 200
- **Validation**: Requires 204 or 202, prohibits 200

#### `azion-204-no-response-body`
- **Severity**: error
- **Description**: Responses with status 204 must not have a response body

#### `azion-get-response-200`
- **Severity**: error
- **Description**: GET operations must return 200 status code

#### `azion-post-response-codes`
- **Severity**: error
- **Description**: POST operations must return 201 (sync) or 202 (async)

#### `azion-put-response-200`
- **Severity**: error
- **Description**: PUT operations must return 200 status code

#### `azion-patch-response-codes`
- **Severity**: error
- **Description**: PATCH operations must return 200 (sync) or 202 (async)

### 7. Error Responses - JSON:API Format

#### `azion-has-key-error-response`
- **Severity**: error
- **Description**: Error responses must contain the `detail` property

#### `azion-match-type-error-response`
- **Severity**: error
- **Description**: The `detail` property in error responses must be of type string

#### `azion-auth-error-responses-required`
- **Severity**: error
- **Description**: Endpoints with security must document 401 and 403 error responses

### 8. Async Operations (202 Accepted)

#### `azion-async-operation-id-required`
- **Severity**: warn
- **Description**: Async operation response must have operation_id field

#### `azion-async-status-url-required`
- **Severity**: warn
- **Description**: Async operation response must have status_url field

### 9. Schemas - Naming Conventions

#### `azion-boolean-naming-convention`
- **Severity**: error
- **Description**: Boolean property names must not start with the 'is' prefix
- **Pattern**: Must not start with `is[A-Z]`

### 10. Constraints

#### `azion-number-minimum-limit-rule`
- **Severity**: error
- **Description**: Validates minimum limits for numeric properties
- **Function**: `checkNumberMinimumLimit`

#### `azion-number-maximum-limit-rule`
- **Severity**: error
- **Description**: Validates maximum limits for numeric properties
- **Function**: `checkNumberMaximumLimit`

#### `azion-string-minlength-properties-rule`
- **Severity**: error
- **Description**: Validates minimum length for string properties
- **Function**: `checkStringMinLength`

#### `azion-string-maxlength-properties-rule`
- **Severity**: error
- **Description**: Validates maximum length for string properties
- **Function**: `checkStringMaxLength`

#### `azion-string-pattern-properties-rule`
- **Severity**: error
- **Description**: Validates regex patterns for string properties
- **Function**: `checkStringPattern`

#### `azion-date-time-format-rule`
- **Severity**: error
- **Description**: Validates that `last_modified` properties follow ISO 8601 format
- **Pattern**: `^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`

### 11. Descriptions

#### `azion-operation-description-required`
- **Severity**: error
- **Description**: Operations must have a detailed description

#### `azion-operation-summary-length`
- **Severity**: warn
- **Description**: Operation summary should be concise (max 100 characters)

#### `azion-field-description-required`
- **Severity**: error
- **Description**: Schema properties must have descriptions

#### `azion-schema-description-required`
- **Severity**: error
- **Description**: Schemas must have descriptions

### 12. Examples

#### `azion-request-examples-required`
- **Severity**: warn
- **Description**: POST and PUT operations should have request examples

### 13. Content-Type

#### `azion-match-content-type-response`
- **Severity**: error
- **Description**: Validates that response content-type is appropriate
- **Function**: `checkContentTypeResponse`

### 14. Path Naming

#### `azion-sps-paths-valid-uri`
- **Severity**: warn
- **Description**: Validates that path URIs do not contain invalid patterns
- **Pattern (notMatch)**: `api|v4|^[^/]*\/[^/]*$|/$`

#### `azion-endpoint-ddd-and-snake`
- **Severity**: error
- **Description**: Endpoints must follow DDD and snake_case convention
- **Pattern**: `^(/[a-z][a-z0-9]+(_[a-z][a-z0-9]+)*){2}($|/({[a-z][a-z0-9]+[a-zA-Z0-9]*}|[a-z][a-z0-9]+(_[a-z0-9]+)*)+)+`

#### `azion-path-naming-convention`
- **Severity**: warn
- **Description**: Validates path naming convention (plural for list endpoints)
- **Function**: `checkPathEndsWithSForList`

#### `azion-endpoint-uri-method-validation`
- **Severity**: error
- **Description**: Endpoint URIs must not contain HTTP method names
- **Pattern (notMatch)**: `/.*(GET|POST|PUT|PATCH|DELETE).*/i`

#### `azion-validate-resource-id-usage`
- **Severity**: error
- **Description**: Validates correct usage of resource IDs in paths
- **Function**: `checkResourceIDUsage`

### 15. Authorization

#### `azion-authorization-header`
- **Severity**: error
- **Description**: Endpoints must have security configuration (security)

#### `azion-security-scheme-bearer`
- **Severity**: error
- **Description**: Security schemes should use Bearer token with JWT

### 16. Request Body

#### `azion-request-body-required`
- **Severity**: error
- **Description**: POST, PUT, and PATCH operations must have requestBody

#### `azion-request-body-required-flag`
- **Severity**: warn
- **Description**: requestBody should be marked as required

### 17. Headers

#### `azion-header-disallowed`
- **Severity**: error
- **Description**: Authorization, Content-Type, and Accept headers must not be explicitly defined as parameters
- **Pattern (notMatch)**: `/^(authorization|content-type|accept)$/i`

### 18. Metadata Global

#### `azion-service-name-pattern`
- **Severity**: error
- **Description**: Service title (info.title) must end with `-api`
- **Pattern**: `.*-api$`

#### `azion-version-semantic`
- **Severity**: error
- **Description**: API version should follow semantic versioning
- **Pattern**: `^\\d+\\.\\d+\\.\\d+$`

### 19. Response Bodies

#### `azion-validate-count-and-results`
- **Severity**: error
- **Description**: Validates paginated response structure with `count` (integer) and `results` (array)

#### `azion-data-object-type-rule`
- **Severity**: error
- **Description**: Validates the type of the `data` object in responses
- **Function**: `checkDataObjectType`

#### `azion-data-keys-presence-rule`
- **Severity**: error
- **Description**: Validates the presence of required keys in the `data` object
- **Function**: `checkDataKeysPresence`

### 20. Deleted Resources

#### `azion-deleted-resource-state-validation`
- **Severity**: error
- **Description**: Validates the state of deleted resources
- **Function**: `checkStateDeletedResource`

### 21. Business Naming

#### `azion-no-technical-schema-names`
- **Severity**: error
- **Description**: Schema names must use business terminology, not technical implementation details
- **Examples**: Use 'Database' instead of 'OpenAPISchema', 'PaginatedDatabaseList' instead of 'PaginatedOpenAPISchemaList'
- **Pattern (notMatch)**: `^.*(OpenAPI|Schema(?!Enum$)|DTO|Entity|Model(?!$)|RESTful|Swagger).*$`

### 22. Extensible Enums

#### `x-extensible-enum-required`
- **Severity**: error
- **Description**: Enums must include x-extensible-enum to ensure forward compatibility
- **Purpose**: Allows clients to handle unknown enum values gracefully without breaking

---

## Summary

All rules are documented organized into 22 categories covering:
- Operation IDs and naming conventions
- Path and query parameters
- Status codes and error handling
- Async operations
- Schema validation and naming
- Content-type and examples
- Security and authorization
- Business domain naming
- Extensible enums for forward compatibility

For implementation details, see `spectral/spectral.yaml`.
