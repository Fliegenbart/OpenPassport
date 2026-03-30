import { z } from "zod";

export const AttestationType = z.enum(["organization", "capability", "policy"]);

export const AttestationSchema = z.object({
  type: AttestationType,
  claim: z.string().min(1),
  attestor: z.string().url(),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  signature: z.string().min(1),
});

export type Attestation = z.infer<typeof AttestationSchema>;
