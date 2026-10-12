# Solana Network Check

Identify whether an RPC endpoint serves Solana Mainnet or Devnet by reading its genesis hash. The hostname alone is not proof of a network. Unknown/custom networks are reported as `unknown` instead of being guessed.

## Run

Requires Node.js 22 or newer. No external dependencies, keys or transactions.

```sh
node network-check.js
node network-check.js https://api.mainnet-beta.solana.com
npm test
```

The default endpoint is Devnet. The utility does not print the RPC URL, because custom provider URLs can contain API keys. It makes only a read-only `getGenesisHash` request.

[Solana getGenesisHash documentation](https://solana.com/docs/rpc/http/getgenesishash).
