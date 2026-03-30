// Re-export spec types
export {
  type Passport,
  type Envelope,
  type Attestation,
  PassportSchema,
  EnvelopeSchema,
  AttestationSchema,
  canonicalize,
} from "@openpassport/spec";

// Keys
export {
  generateKeyPair,
  publicKeyToBase64Url,
  base64UrlToBytes,
  base64UrlEncode,
  type KeyPair,
} from "./keys.js";

// Create
export { createPassport, type CreatePassportOptions } from "./passport.js";
export { createEnvelope, type CreateEnvelopeOptions } from "./envelope.js";

// Verify
export {
  verifyPassport,
  verifyMessage,
  type VerifyPassportResult,
  type VerifyMessageResult,
} from "./verify.js";

// Fetch
export { fetchPassport } from "./fetch.js";

// Errors
export {
  OpenPassportError,
  PassportVerificationError,
  MessageVerificationError,
} from "./errors.js";
