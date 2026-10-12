import path from "node:path";
import { fileURLToPath } from "node:url";
const KNOWN = new Map([
  ["5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d", "mainnet"],
  ["EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG", "devnet"]
]);
export function identifyNetwork(hash) { return KNOWN.get(hash) || "unknown"; }
export async function checkNetwork(endpoint = "https://api.devnet.solana.com", fetchFn = fetch) {
  const url = new URL(endpoint);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("Provide an HTTP(S) RPC URL without credentials");
  const response = await fetchFn(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getGenesisHash" }),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error("RPC HTTP " + response.status);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error.message || "RPC error");
  if (typeof payload.result !== "string") throw new Error("RPC did not return a genesis hash");
  // Do not print the URL: provider API keys may be embedded in its path or query.
  return { network: identifyNetwork(payload.result), genesisHash: payload.result };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await checkNetwork(process.argv[2]), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
