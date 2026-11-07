# Security

## Supported versions

Only the latest release receives fixes. Historical releases are hidden.

## Security model

- The plugin is client-only; the host half is a no-op.
- It does not run shell commands, read local files, start services, or collect telemetry.
- External navigation is limited to the hardcoded official DeepSeek usage/top-up pages.
- Manual usage entries can only click navigation entries inside the DSH sidebar/header; arbitrary URLs and free-form redirects are rejected.
- Balance is read through the host account remote and is not persisted.

## Reporting

Please report security issues privately through GitHub Security Advisories on this repository. Do not open a public issue with exploit details.
