import { describe, it, expect } from "vitest";
import { generateKeyPair, createPassport, createEnvelope, verifyMessage } from "../index.js";

describe("createEnvelope + verifyMessage", () => {
  it("creates and verifies a signed message", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "SenderBot",
        issuer: "https://sender.example.com",
        endpoint: "https://sender.example.com/agent",
        capabilities: ["send-message"],
      },
      privateKey,
      publicKey,
    );

    const envelope = await createEnvelope(
      {
        from: passport.id,
        passportUrl: "https://sender.example.com/.well-known/passport.json",
        body: { text: "Hello, world!" },
      },
      privateKey,
    );

    expect(envelope.openpassport_message).toBe("0.1.0");
    expect(envelope.from).toBe(passport.id);
    expect(envelope.nonce).toBeTruthy();
    expect(envelope.signature).toBeTruthy();

    const result = await verifyMessage(envelope, {
      fetchPassport: false,
      passport,
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects a message with tampered body", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "SenderBot",
        issuer: "https://sender.example.com",
        endpoint: "https://sender.example.com/agent",
        capabilities: [],
      },
      privateKey,
      publicKey,
    );

    const envelope = await createEnvelope(
      {
        from: passport.id,
        passportUrl: "https://sender.example.com/.well-known/passport.json",
        body: { text: "Hello" },
      },
      privateKey,
    );

    const tampered = { ...envelope, body: { text: "Hacked!" } };
    const result = await verifyMessage(tampered, {
      fetchPassport: false,
      passport,
    });
    expect(result.valid).toBe(false);
  });

  it("rejects a message signed with wrong key", async () => {
    const keys1 = await generateKeyPair();
    const keys2 = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "SenderBot",
        issuer: "https://sender.example.com",
        endpoint: "https://sender.example.com/agent",
        capabilities: [],
      },
      keys1.privateKey,
      keys1.publicKey,
    );

    // Sign envelope with different key
    const envelope = await createEnvelope(
      {
        from: passport.id,
        passportUrl: "https://sender.example.com/.well-known/passport.json",
        body: { text: "Hello" },
      },
      keys2.privateKey,
    );

    const result = await verifyMessage(envelope, {
      fetchPassport: false,
      passport,
    });
    expect(result.valid).toBe(false);
  });
});
