import { canonicalize, type Passport } from "@openpassport/spec";
import { generateKeyPair, publicKeyToBase64Url, base64UrlEncode, sign } from "./keys.js";

export interface CreatePassportOptions {
  name: string;
  issuer: string;
  endpoint: string;
  capabilities: string[];
  expiresInDays?: number;
}

export async function createPassport(
  options: CreatePassportOptions,
  privateKey: Uint8Array,
  publicKey: Uint8Array,
): Promise<Passport> {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + (options.expiresInDays ?? 365));

  const id = `ap_${crypto.randomUUID()}`;

  const unsigned: Omit<Passport, "signature"> = {
    openpassport: "0.1.0",
    id,
    name: options.name,
    issuer: options.issuer,
    publicKey: publicKeyToBase64Url(publicKey),
    endpoint: options.endpoint,
    capabilities: options.capabilities,
    issuedAt: now.toISOString().replace(/\.\d{3}Z$/, "Z"),
    expiresAt: expiresAt.toISOString().replace(/\.\d{3}Z$/, "Z"),
    attestations: [],
  };

  const canonical = canonicalize(unsigned as Record<string, unknown>);
  const bytes = new TextEncoder().encode(canonical);
  const sig = await sign(bytes, privateKey);

  return {
    ...unsigned,
    signature: base64UrlEncode(sig),
  };
}
