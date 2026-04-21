# n8n-nodes-blackbee

n8n community node for the **Blackbee Accounts-Payable API**. Automate vendor onboarding and bill ingestion from any n8n workflow.

[![npm version](https://img.shields.io/npm/v/n8n-nodes-blackbee.svg)](https://www.npmjs.com/package/n8n-nodes-blackbee)

## Prerequisites

- An n8n instance (self-hosted `>= 1.56` or n8n Cloud).
- Node.js `>= 20.15` (for self-hosted).
- A Blackbee account and an API key.

## Compatibility

| | Version |
|---|---|
| n8n | `>= 1.56` |
| Node.js | `>= 20.15` |
| Blackbee API | current |

## Installation

### n8n Cloud / self-hosted UI

Settings → **Community Nodes** → **Install** → enter `n8n-nodes-blackbee` → **Install**.

### Self-hosted via npm

```bash
npm install n8n-nodes-blackbee
```

Then restart your n8n instance.

## Credentials

This node authenticates via an **API key** issued from the Blackbee application.

### Generate an API key

1. Log in to your Blackbee application.
2. Go to **Settings → System → API keys**.
3. Click **Generate** to create a new key.
4. Copy the key immediately — it is shown only once.

### Configure the credential in n8n

Create a **Blackbee API** credential and paste the key:

| Field | Description |
|---|---|
| API Key | Your Blackbee API key. Sent as `Authorization: ApiKey <key>` on every request. |

## Operations

### Vendor

| Operation | HTTP | Path | Purpose |
|---|---|---|---|
| Create | `POST` | `/ap-api/vendor/create` | Create a vendor with contact, remit-to, bank, and attachment details. |
| Get | `GET` | `/ap-api/vendor/{vendorId}` | Fetch a single vendor by ID. |
| Get List | `POST` | `/ap-api/vendor/list` | Fetch a paginated, filtered list of vendors. |

### Bill

| Operation | HTTP | Path | Purpose |
|---|---|---|---|
| Upload | `POST` | `/ap-api/bill/upload` | Upload a bill document (PDF / JPG / JPEG / PNG) — triggers AI line-item extraction. |
| Get | `GET` | `/ap-api/bill/{billUrn}` | Fetch a single bill by URN. |
| Get List | `POST` | `/ap-api/bill/list` | Fetch a paginated, filtered list of bills. |

## Usage

### Example: create a vendor

1. Add a **Blackbee** node, set **Resource** = `Vendor`, **Operation** = `Create`.
2. Select or create a **Blackbee API** credential.
3. Fill the required **Vendor Name**.
4. Open **Additional Fields** to add optional details — address, remit-to info, bank accounts, contact, attachments, `taxId` (exactly 9 digits, no separators), etc.
5. Execute. The vendor ID is returned in the response body.

### Example: upload a bill

1. Fetch a file into the workflow with a node that produces binary data (e.g. **Read Binary File**, **HTTP Request**, **Google Drive**).
2. Add a **Blackbee** node, set **Resource** = `Bill`, **Operation** = `Upload`.
3. Set **Binary Property** to the name of the binary property holding the file (default `data`).
4. Execute. The response contains the bill ID; Blackbee begins AI parsing asynchronously.

## Resources

- [Blackbee website](https://blackbeeai.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Issue tracker](https://github.com/blackbeeofficial/n8n-node/issues)

## Development

```bash
npm install
npm run lint
npm run build
```

To test locally against an n8n dev instance, link the built `dist/` via `N8N_CUSTOM_EXTENSIONS`:

```bash
npm link
cd /path/to/your/n8n-install
npm link n8n-nodes-blackbee
n8n start
```

## License

[MIT](./LICENSE)
