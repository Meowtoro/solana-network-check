import test from "node:test";
import assert from "node:assert/strict";
import { identifyNetwork, checkNetwork } from "./network-check.js";
test("network identity comes from genesis, not the endpoint's name", async () => {
  const result = await checkNetwork("https://devnet.example", async () => ({ ok: true, json: async () => ({ result: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d" }) }));
  assert.equal(result.network, "mainnet");
  assert.equal(identifyNetwork("custom-local-genesis"), "unknown");
});
test("invalid endpoints and malformed RPC responses are rejected", async () => {
  await assert.rejects(() => checkNetwork("file:///secret"), /HTTP/);
  await assert.rejects(() => checkNetwork("https://example.com", async () => ({ ok: true, json: async () => ({ result: null }) })), /genesis hash/);
});
