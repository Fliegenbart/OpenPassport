import { z } from "zod";

export const EnvelopeSchema = z.object({
  openpassport_message: z.literal("0.1.0"),
  from: z.string().startsWith("ap_"),
  to: z.string().startsWith("ap_").optional(),
  passportUrl: z.string().url(),
  timestamp: z.string().datetime(),
  nonce: z.string().min(16),
  body: z.unknown(),
  signature: z.string().min(1),
});

export type Envelope = z.infer<typeof EnvelopeSchema>;
