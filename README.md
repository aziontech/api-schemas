# Azion API Specification
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.md)

OpenAPI 3.0 specification for Azion APIs.

## 📄 OpenAPI Files

### API v4 (Current)
- **[openapi.yaml](openapi.yaml)** - Complete Azion API v4 specification

### API v3 (Legacy)
Legacy API specifications are available in the `v3/` directory for backward compatibility.

## 🚀 Quick Start

```bash
# View with Swagger UI
npx @redocly/cli preview-docs openapi.yaml

# Generate client SDKs
openapi-generator-cli generate -i openapi.yaml -g python -o ./client
```

Validation runs in the [azionapi-v4-processor](https://github.com/aziontech/azionapi-v4-processor) sync, which lints `openapi.yaml` with its v4 Spectral ruleset and reports the result as the `Validate OpenAPI` status on the sync PR.

## 🔄 Synchronization

The `openapi.yaml` file is synchronized by two sources:

- The [azionapi-v4-processor](https://github.com/aziontech/azionapi-v4-processor) sync, which opens a PR after each production promotion that publishes v4, or after a manual run, and posts the `Validate OpenAPI` status on it
- The `sync-v4.yml` workflow, dispatched from [azionapi-v4-openapi](https://github.com/aziontech/azionapi-v4-openapi) or run by hand, which commits straight to `main`

Only the processor sync posts the `Validate OpenAPI` status.

## License

This repository is licensed under the terms of the [MIT](LICENSE.md) license.
