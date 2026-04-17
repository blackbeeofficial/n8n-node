# n8n-nodes-blackbee

n8n community node for the **Blackbee Accounts-Payable API**.

This is the real node. The sibling `n8n-nodes-blackbee-sample` is the reference sample.

## Scope (v0.1.0)

Single resource **Vendors** with two operations:

| Operation | HTTP | Path |
|---|---|---|
| Create | POST | `/ap-api/vendor/create` |
| Get | GET | `/ap-api/vendor/{vendorId}` |

Base URL is hardcoded to the dev gateway (`https://api-dev.blackbeeai.com`).

## Auth

API key only. It is sent as the `Authorization: ApiKey <key>` header on every request. The gateway injects tenant/company/user context from the key.

## Install (local dev)

```bash
npm install
npm run build
npm link
```

Then inside your n8n install:

```bash
npm link n8n-nodes-blackbee
n8n start
```

Search **Blackbee** in the n8n node panel.
