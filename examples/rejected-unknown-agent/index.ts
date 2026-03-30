/**
 * Demo 2: Unknown Agent Rejected
 *
 * An agent sends a message but its passport cannot be fetched.
 * Result: REJECTED — identity could not be verified.
 */
import {
  generateKeyPair,
  createPassport,
  createEnvelope,
  verifyMessage,
} from "@openpassport/sdk";

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";

async function main() {
  console.log(`\n${BOLD}═══════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Demo: Unknown Agent Rejected${RESET}`);
  console.log(`${BOLD}═══════════════════════════════════════════${RESET}\n`);

  // Step 1: An agent creates a passport but does NOT serve it
  console.log(`${DIM}[1/3]${RESET} Unknown agent creates passport (not served anywhere)...`);
  const keys = await generateKeyPair();
  const passport = await createPassport(
    {
      name: "ShadowAgent",
      issuer: "https://unknown-domain.example.com",
      endpoint: "https://unknown-domain.example.com/agent",
      capabilities: ["data-exfil"],
    },
    keys.privateKey,
    keys.publicKey,
  );
  console.log(`${GREEN}  ✓${RESET} Passport created: ${CYAN}${passport.id}${RESET}`);
  console.log(`${DIM}    (but not served at .well-known — no server running)${RESET}`);

  // Step 2: Agent sends a signed message
  console.log(`${DIM}[2/3]${RESET} Unknown agent sends signed message...`);
  const envelope = await createEnvelope(
    {
      from: passport.id,
      passportUrl: "https://unknown-domain.example.com/.well-known/passport.json",
      body: { action: "transfer", amount: 10000 },
    },
    keys.privateKey,
  );
  console.log(`${GREEN}  ✓${RESET} Message signed and sent`);

  // Step 3: Receiver tries to verify
  console.log(`${DIM}[3/3]${RESET} Receiver attempts verification...\n`);
  const result = await verifyMessage(envelope, { fetchPassport: true });

  console.log(`  ┌─────────────────────────────────────────┐`);
  console.log(`  │  ${RED}${BOLD}✗ ENTRY DENIED${RESET}                         │`);
  console.log(`  │                                         │`);
  console.log(`  │  ${RED}Agent identity could not be verified${RESET}  │`);
  console.log(`  │                                         │`);
  for (const err of result.errors) {
    const truncated = err.length > 39 ? err.slice(0, 36) + "..." : err;
    console.log(`  │  ${DIM}${truncated.padEnd(39)}${RESET}│`);
  }
  console.log(`  │                                         │`);
  console.log(`  │  ${DIM}Unknown agent? No entry.${RESET}               │`);
  console.log(`  └─────────────────────────────────────────┘`);

  console.log();
}

main().catch(console.error);
