/**
 * Generate test fixtures for cross-language interop testing.
 * Run with: pnpm exec tsx packages/spec/fixtures/generate.ts
 * from the sdk-js directory context.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateKeyPair, createPassport, createEnvelope, base64UrlEncode } from "../../sdk-js/src/index.js";

const fixturesDir = resolve(import.meta.dirname!, ".");

async function main() {
  const { publicKey, privateKey } = await generateKeyPair();

  const passport = await createPassport(
    {
      name: "FixtureBot",
      issuer: "https://fixture.example.com",
      endpoint: "https://fixture.example.com/agent",
      capabilities: ["web-search", "summarize"],
    },
    privateKey,
    publicKey,
  );

  const envelope = await createEnvelope(
    {
      from: passport.id,
      passportUrl: "https://fixture.example.com/.well-known/passport.json",
      body: { text: "Hello from fixture" },
    },
    privateKey,
  );

  const keys = {
    publicKey: base64UrlEncode(publicKey),
    privateKey: base64UrlEncode(privateKey),
  };

  writeFileSync(resolve(fixturesDir, "test-keys.json"), JSON.stringify(keys, null, 2) + "\n");
  writeFileSync(resolve(fixturesDir, "valid-passport.json"), JSON.stringify(passport, null, 2) + "\n");
  writeFileSync(resolve(fixturesDir, "valid-envelope.json"), JSON.stringify(envelope, null, 2) + "\n");

  console.log("Fixtures generated:");
  console.log("  test-keys.json");
  console.log("  valid-passport.json");
  console.log("  valid-envelope.json");
  console.log(`  Passport ID: ${passport.id}`);
}

main().catch(console.error);
