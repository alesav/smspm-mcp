#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_URL = "https://api.smspm.com";

// These come from env vars set in claude_desktop_config.json
const HASH = process.env.SMSPM_HASH;
const TOKEN = process.env.SMSPM_TOKEN;

if (!HASH || !TOKEN) {
  process.stderr.write(
    "Error: SMSPM_HASH and SMSPM_TOKEN environment variables are required.\n"
  );
  process.exit(1);
}

const server = new McpServer({
  name: "smspm",
  version: "1.0.0",
});

// ─── Tool: send_sms ───────────────────────────────────────────────────────────
server.tool(
  "send_sms",
  "Send an SMS message via SMSPM. Requires a recipient phone number (international format), message text, and optional sender name.",
  {
    toNumber: z
      .string()
      .describe("Recipient phone number in international format, e.g. 37256789045"),
    text: z
      .string()
      .describe("The SMS message text to send"),
    fromNumber: z
      .string()
      .optional()
      .default("smspm.com")
      .describe("Sender name or number shown to recipient (default: smspm.com)"),
  },
  async ({ toNumber, text, fromNumber }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hash: HASH,
          token: TOKEN,
          toNumber,
          text,
          fromNumber,
        }),
      });

      const body = await response.text();
      let data: unknown;
      try {
        data = JSON.parse(body);
      } catch {
        data = body;
      }

      if (!response.ok) {
        return {
          content: [
            {
              type: "text",
              text: `❌ SMS failed (HTTP ${response.status})\n${JSON.stringify(data, null, 2)}`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `✅ SMS sent to ${toNumber}\n${JSON.stringify(data, null, 2)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Network error: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ─── Start server ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
process.stderr.write("SMSPM MCP server running\n");
