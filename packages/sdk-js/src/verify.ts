import { canonicalize, PassportSchema, EnvelopeSchema, type Passport, type Envelope } from "@openpassport/spec";
import { base64UrlToBytes, verify } from "./keys.js";
import { fetchPassport } from "./fetch.js";

export interface VerifyPassportResult {
  valid: boolean;
  passport: Passport | null;
  errors: string[];
  warnings: string[];
}

export async function verifyPassport(input: unknown): Promise<VerifyPassportResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Schema validation
  const parsed = PassportSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      passport: null,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      warnings: [],
    };
  }

  const passport = parsed.data;

  // 2. Verify signature
  try {
    const publicKey = base64UrlToBytes(passport.publicKey);
    const signature = base64UrlToBytes(passport.signature);
    const canonical = canonicalize(passport as unknown as Record<string, unknown>);
    const data = new TextEncoder().encode(canonical);

    const isValid = await verify(signature, data, publicKey);
    if (!isValid) {
      errors.push("Signature verification failed: signature does not match public key");
    }
  } catch (err) {
    errors.push(`Signature verification error: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 3. Check expiration
  const now = new Date();
  const expiresAt = new Date(passport.expiresAt);
  if (expiresAt <= now) {
    errors.push(`Passport expired at ${passport.expiresAt}`);
  }

  // 4. Check issuedAt
  const issuedAt = new Date(passport.issuedAt);
  if (issuedAt > now) {
    warnings.push(`Passport issuedAt is in the future: ${passport.issuedAt} (possible clock skew)`);
  }

  return {
    valid: errors.length === 0,
    passport,
    errors,
    warnings,
  };
}

export interface VerifyMessageResult {
  valid: boolean;
  envelope: Envelope | null;
  passport: Passport | null;
  errors: string[];
}

export async function verifyMessage(
  input: unknown,
  options?: { fetchPassport?: boolean; passport?: Passport; maxAgeSeconds?: number },
): Promise<VerifyMessageResult> {
  const errors: string[] = [];

  // 1. Schema validation
  const parsed = EnvelopeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      valid: false,
      envelope: null,
      passport: null,
      errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    };
  }

  const envelope = parsed.data;

  // 2. Get passport
  let passport: Passport | null = options?.passport ?? null;

  if (!passport && options?.fetchPassport !== false) {
    try {
      passport = await fetchPassport(envelope.passportUrl);
    } catch (err) {
      return {
        valid: false,
        envelope,
        passport: null,
        errors: [`Could not fetch passport from ${envelope.passportUrl}: ${err instanceof Error ? err.message : String(err)}`],
      };
    }
  }

  if (!passport) {
    return {
      valid: false,
      envelope,
      passport: null,
      errors: ["No passport provided and fetchPassport is disabled"],
    };
  }

  // 3. Verify passport itself
  const passportResult = await verifyPassport(passport);
  if (!passportResult.valid) {
    return {
      valid: false,
      envelope,
      passport,
      errors: passportResult.errors.map((e) => `Passport: ${e}`),
    };
  }

  // 4. Check from matches passport id
  if (envelope.from !== passport.id) {
    errors.push(`Envelope 'from' (${envelope.from}) does not match passport id (${passport.id})`);
  }

  // 5. Verify envelope signature
  try {
    const publicKey = base64UrlToBytes(passport.publicKey);
    const signature = base64UrlToBytes(envelope.signature);
    const canonical = canonicalize(envelope as unknown as Record<string, unknown>);
    const data = new TextEncoder().encode(canonical);

    const isValid = await verify(signature, data, publicKey);
    if (!isValid) {
      errors.push("Message signature verification failed");
    }
  } catch (err) {
    errors.push(`Message signature error: ${err instanceof Error ? err.message : String(err)}`);
  }

  // 6. Check timestamp freshness
  const maxAge = options?.maxAgeSeconds ?? 300; // 5 minutes
  const msgTime = new Date(envelope.timestamp);
  const age = (Date.now() - msgTime.getTime()) / 1000;
  if (age > maxAge) {
    errors.push(`Message is ${Math.round(age)}s old, exceeds max age of ${maxAge}s`);
  }
  if (age < -30) {
    errors.push(`Message timestamp is in the future by ${Math.round(-age)}s`);
  }

  return {
    valid: errors.length === 0,
    envelope,
    passport,
    errors,
  };
}
