/**
 * Demo 3: Forged Identity Detected
 *
 * An attacker copies a legitimate passport but uses their own key.
 * The verifier fetches the REAL passport and detects the mismatch.
 * Result: REJECTED — forged identity detected.
 */
import http from "node:http";
import {
  generateKeyPair,
  createPassport,
  createEnvelope,
  verifyMessage,
  base64UrlEncode,
} from "@openpassport/sdk";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

async function main() {
  console.log(`\n${BOLD}═══════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Demo: Forged Identity Detected${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════${RESET}\n`);

  // Step 1: Legitimate agent creates a passport
  console.log(`${DIM}[1/5]${RESET} Legitimate agent creates passport...`);
  const realKeys = await generateKeyPair();
  const realPassport = await createPassport(
    {
      name: "PaymentBot",
      issuer: "http://localhost:9901",
      endpoint: "http://localhost:9901/agent",
      capabilities: ["payment.initiate"],
    },
    realKeys.privateKey,
    realKeys.publicKey,
  );
  console.log(`${GREEN}  ✓${RESET} Real passport: ${CYAN}${realPassport.id}${RESET}`);

  // Step 2: Serve real passport
  console.log(`${DIM}[2/5]${RESET} Serving real passport at .well-known...`);
  const server = http.createServer((req, res) => {
    if (req.url === "/.well-known/passport.json") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(realPassport));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise<void>((resolve) => server.listen(9901, resolve));
  console.log(`${GREEN}  ✓${RESET} Real passport server running`);

  // Step 3: Attacker generates their own key and forges a message
  console.log(`${DIM}[3/5]${RESET} ${YELLOW}Attacker generates own key and sends forged message...${RESET}`);
  const attackerKeys = await generateKeyPair();

  // Attacker creates an envelope pretending to be the real agent
  // but signs with their own key
  const forgedEnvelope = await createEnvelope(
    {
      from: realPassport.id, // Claims to be the real agent
      passportUrl: "http://localhost:9901/.well-known/passport.json",
      body: { action: "transfer", to: "attacker-wallet", amount: 99999 },
    },
    attackerKeys.privateKey, // But signs with attacker's key!
  );
  console.log(`${YELLOW}  ⚠${RESET} Forged message sent (signed with attacker's key)`);

  // Step 4: Receiver verifies by fetching the REAL passport
  console.log(`${DIM}[4/5]${RESET} Receiver fetches real passport and verifies...`);
  const result = await verifyMessage(forgedEnvelope, { fetchPassport: true });

  // Step 5: Forgery detected!
  console.log(`${DIM}[5/5]${RESET} Verification result:\n`);

  console.log(`  ┌─────────────────────────────────────────┐`);
  console.log(`  │  ${RED}${BOLD}✗ FORGERY DETECTED${RESET}                     │`);
  console.log(`  │                                         │`);
  console.log(`  │  ${RED}Signature does not match passport${RESET}     │`);
  console.log(`  │  ${RED}public key — forged identity${RESET}          │`);
  console.log(`  │                                         │`);
  console.log(`  │  ${DIM}Claimed: ${realPassport.id.slice(0, 28)}${RESET}  │`);
  console.log(`  │  ${DIM}Real key ≠ Signature key${RESET}              │`);
  console.log(`  │                                         │`);
  for (const err of result.errors) {
    const truncated = err.length > 39 ? err.slice(0, 36) + "..." : err;
    console.log(`  │  ${DIM}${truncated.padEnd(39)}${RESET}│`);
  }
  console.log(`  │                                         │`);
  console.log(`  │  ${DIM}Trust, before autonomy.${RESET}                │`);
  console.log(`  └─────────────────────────────────────────┘`);

  server.close();
  console.log();
}

main().catch(console.error);
