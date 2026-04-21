# Changelog

All notable changes to `n8n-nodes-blackbee` are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [0.2.0] - 2026-04-21

### Added
- `Base URL` field on the Blackbee API credential so the same node can target any Blackbee environment without a new release. Defaults to `https://api-dev.blackbeeai.com`.
- GitHub Actions workflow (`.github/workflows/publish.yml`) that publishes to npm with a signed provenance statement on every `v*.*.*` tag push.
- `publishConfig.provenance` and `publishConfig.access: public` in `package.json`.
- `engines.node: >=20.15` and `files: ["dist"]` in `package.json`.
- Expanded `README.md` with Prerequisites, Compatibility, Credentials, Operations, and Usage sections per the n8n verified-community-node guidelines.

### Changed
- Node `requestDefaults.baseURL`, credential test request, and internal helpers all now read the base URL from the credential instead of a hardcoded constant.

### Removed
- Runtime dependency on `form-data`. Bill uploads now use the Node 18+ built-in `FormData` / `Blob` globals, which is required for the package to qualify as a verified community node (no runtime `dependencies` allowed).

## [0.1.0] - 2026-04-17

### Added
- Initial release.
- `Blackbee API` credential (API key, `Authorization: ApiKey <key>` header).
- Vendor resource: `Create`, `Get`, `Get List`.
- Bill resource: `Upload`, `Get`.

[0.2.0]: https://github.com/blackbeeofficial/n8n-node/releases/tag/v0.2.0
[0.1.0]: https://github.com/blackbeeofficial/n8n-node/releases/tag/v0.1.0
