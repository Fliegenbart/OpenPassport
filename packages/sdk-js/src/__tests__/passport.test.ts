import { describe, it, expect } from "vitest";
import { generateKeyPair, createPassport, verifyPassport, base64UrlToBytes, base64UrlEncode } from "../index.js";

describe("createPassport", () => {
  it("creates a valid signed passport", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "TestBot",
        issuer: "https://example.com",
        endpoint: "https://example.com/agent",
        capabilities: ["web-search", "summarize"],
      },
      privateKey,
      publicKey,
    );

    expect(passport.openpassport).toBe("0.1.0");
    expect(passport.id).toMatch(/^ap_/);
    expect(passport.name).toBe("TestBot");
    expect(passport.issuer).toBe("https://example.com");
    expect(passport.capabilities).toEqual(["web-search", "summarize"]);
    expect(passport.signature).toBeTruthy();
  });
});

describe("verifyPassport", () => {
  it("verifies a correctly signed passport", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "TestBot",
        issuer: "https://example.com",
        endpoint: "https://example.com/agent",
        capabilities: ["web-search"],
      },
      privateKey,
      publicKey,
    );

    const result = await verifyPassport(passport);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects a passport with tampered name", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "TestBot",
        issuer: "https://example.com",
        endpoint: "https://example.com/agent",
        capabilities: [],
      },
      privateKey,
      publicKey,
    );

    const tampered = { ...passport, name: "EvilBot" };
    const result = await verifyPassport(tampered);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("Signature"))).toBe(true);
  });

  it("rejects a passport with wrong public key", async () => {
    const keys1 = await generateKeyPair();
    const keys2 = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "TestBot",
        issuer: "https://example.com",
        endpoint: "https://example.com/agent",
        capabilities: [],
      },
      keys1.privateKey,
      keys1.publicKey,
    );

    // Replace public key with a different one
    const forged = { ...passport, publicKey: base64UrlEncode(keys2.publicKey) };
    const result = await verifyPassport(forged);
    expect(result.valid).toBe(false);
  });

  it("rejects an expired passport", async () => {
    const { publicKey, privateKey } = await generateKeyPair();

    const passport = await createPassport(
      {
        name: "TestBot",
        issuer: "https://example.com",
        endpoint: "https://example.com/agent",
        capabilities: [],
        expiresInDays: -1, // already expired
      },
      privateKey,
      publicKey,
    );

    const result = await verifyPassport(passport);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("expired"))).toBe(true);
  });

  it("rejects invalid schema", async () => {
    const result = await verifyPassport({ foo: "bar" });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
