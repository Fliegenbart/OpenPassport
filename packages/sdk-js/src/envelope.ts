/**
 * Create and sign OpenPassport message envelopes.
 *
 * Every agent-to-agent message is wrapped in a signed envelope
 * that includes a timestamp and nonce for replay protection.
 */
import { canonicalize, type Envelope } from "@openpassport/spec";
import { base64UrlEncode, sign } from "./keys.js";

export interface CreateEnvelopeOptions {
  from: string;
  to?: string;
  passportUrl: string;
  body: unknown;
}

export async function createEnvelope(
  options: CreateEnvelopeOptions,
  privateKey: Uint8Array,
): Promise<Envelope> {
  // 128-bit random hex nonce for replay protection
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const unsigned: Omit<Envelope, "signature"> = {
    openpassport_message: "0.1.0",
    from: options.from,
    ...(options.to ? { to: options.to } : {}),
    passportUrl: options.passportUrl,
    timestamp: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    nonce,
    body: options.body,
  };

  const canonical = canonicalize(unsigned as Record<string, unknown>);
  const bytes = new TextEncoder().encode(canonical);
  const sig = await sign(bytes, privateKey);

  return {
    ...unsigned,
    signature: base64UrlEncode(sig),
  };
}
