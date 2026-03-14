# SMSPM MCP Server

Send SMS messages from Claude Desktop (or any MCP client) using your [SMSPM](https://smspm.com) account.

## Prerequisites

- Node.js 18+
- An SMSPM account with a **Hash** and **API Token**

## Installation

### Option A — Install from npm (once published)

```bash
npm install -g smspm-mcp
```

### Option B — Install from source

```bash
git clone https://github.com/YOUR_ORG/smspm-mcp.git
cd smspm-mcp
npm install
npm run build
```

Note the full path to the built file — you'll need it in the next step:
```
/path/to/smspm-mcp/dist/index.js
```

---

## Configure Claude Desktop

Open your Claude Desktop config file:

| Platform | Path |
|----------|------|
| macOS    | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows  | `%APPDATA%\Claude\claude_desktop_config.json` |

Add the `smspm` entry inside `mcpServers`:

```json
{
  "mcpServers": {
    "smspm": {
      "command": "node",
      "args": ["/path/to/smspm-mcp/dist/index.js"],
      "env": {
        "SMSPM_HASH": "your-hash-here",
        "SMSPM_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

> **If installed via npm globally**, replace the path with: `"npx"` as command and `["smspm-mcp"]` as args.

Restart Claude Desktop after saving the config.

---

## Getting your Hash and Token

1. Log in to [smspm.com](https://smspm.com)
2. Go to **Settings → API**
3. Copy your **Hash** (looks like `e3dbe013-6f66-4fae-8ae2-96c364cb6b61`)
4. Copy or generate your **API Token**

---

## Usage

Once configured, just ask Claude:

> "Send an SMS to +37256789045 saying Hello from Claude"

> "Text +447911123456 — your order has shipped"

Claude will use the `send_sms` tool automatically.

### Tool parameters

| Parameter    | Required | Description |
|-------------|----------|-------------|
| `toNumber`   | ✅       | Recipient phone in international format (e.g. `37256789045`) |
| `text`       | ✅       | Message content |
| `fromNumber` | ❌       | Sender name/number shown to recipient (default: `smspm.com`) |

---

## Security

- Your `SMSPM_HASH` and `SMSPM_TOKEN` live only in your local config file
- They are **never** sent to Anthropic or Claude — only to `api.smspm.com`
- Never commit your config file to version control

---

## License

MIT
