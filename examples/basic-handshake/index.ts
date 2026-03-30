/**
 * Demo 1: Basic Handshake — Trusted Agent Accepted
 *
 * Agent A creates a passport and sends a signed message to Agent B.
 * Agent B verifies the message. Result: TRUSTED.
 */
import http from "node:http";
import {
  generateKeyPair,
  createPassport,
  createEnvelope,
  verifyMessage,
  fetchPassport,
} from "@openpassport/sdk";

const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

async function main() {
  console.log(`\n${BOLD}═══════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Demo: Basic Handshake${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════${RESET}\n`);

  // Step 1: Agent A creates a passport
  console.log(`${DIM}[1/5]${RESET} Agent A generates keypair and creates passport...`);
  const keysA = await generateKeyPair();
  const passportA = await createPassport(
    {
      name: "ResearchBot",
      issuer: "http://localhost:9900",
      endpoint: "http://localhost:9900/agent",
      capabilities: ["web-search", "summarize"],
    },
    keysA.privateKey,
    keysA.publicKey,
  );
  console.log(`${GREEN}  ✓${RESET} Passport created: ${CYAN}${passportA.id}${RESET}`);

  // Step 2: Serve passport at .well-known
  console.log(`${DIM}[2/5]${RESET} Serving passport at ${CYAN}http://localhost:9900/.well-known/passport.json${RESET}...`);
  const server = http.createServer((req, res) => {
    if (req.url === "/.well-known/passport.json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(passportA));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise<void>((resolve) => server.listen(9900, resolve));
  console.log(`${GREEN}  ✓${RESET} Passport server running`);

  // Step 3: Agent A sends a signed message
  console.log(`${DIM}[3/5]${RESET} Agent A sends signed message...`);
  const envelope = await createEnvelope(
    {
      from: passportA.id,
      passportUrl: "http://localhost:9900/.well-known/passport.json",
      body: { task: "summarize", url: "https://example.com/article" },
    },
    keysA.privateKey,
  );
  console.log(`${GREEN}  ✓${RESET} Message signed and sent`);

  // Step 4: Agent B receives and verifies
  console.log(`${DIM}[4/5]${RESET} Agent B receives message, fetching sender's passport...`);
  const result = await verifyMessage(envelope, { fetchPassport: true });

  // Step 5: Result
  console.log(`${DIM}[5/5]${RESET} Verification result:\n`);

  if (result.valid) {
    console.log(`  ┌─────────────────────────────────────────┐`);
    console.log(`  │  ${GREEN}${BOLD}✓ ENTRY GRANTED${RESET}                        │`);
    console.log(`  │                                         │`);
    console.log(`  │  Agent: ${result.passport?.name?.padEnd(32)}│`);
    console.log(`  │  ID:    ${result.passport?.id?.padEnd(32)}│`);
    console.log(`  │  Issuer: ${result.passport?.issuer?.padEnd(31)}│`);
    console.log(`  │                                         │`);
    console.log(`  │  ${DIM}Message verified, agent is trusted${RESET}    │`);
    console.log(`  └─────────────────────────────────────────┘`);
  }

  server.close();
  console.log();
}

main().catch(console.error);
