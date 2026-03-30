import { z } from "zod";
import { AttestationSchema } from "./attestation.js";

export const PassportSchema = z.object({
  openpassport: z.literal("0.1.0"),
  id: z.string().regex(/^ap_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, "Must be ap_ followed by a UUID v4"),
  name: z.string().min(1).max(128),
  issuer: z.string().url(),
  publicKey: z.string().min(1),
  endpoint: z.string().url(),
  capabilities: z.array(z.string()),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  attestations: z.array(AttestationSchema).default([]),
  signature: z.string().min(1),
});

export type Passport = z.infer<typeof PassportSchema>;
