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

# Validate OpenAPI
npx @redocly/cli lint openapi.yaml

# Generate client SDKs
openapi-generator-cli generate -i openapi.yaml -g python -o ./client
```

## 🔄 Synchronization

The `openapi.yaml` file is automatically synchronized from [azionapi-v4-openapi](https://github.com/aziontech/azionapi-v4-openapi) when changes are merged to the main branch.

## License

This repository is licensed under the terms of the [MIT](LICENSE.md) license.
