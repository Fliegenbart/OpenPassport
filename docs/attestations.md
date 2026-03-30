# OpenPassport — Attestations Specification

**Version:** 0.1.0
**Status:** Draft

## Overview

Attestations are signed claims made by third parties about an agent. They answer questions like:

- Does this agent belong to organization X?
- Is this agent authorized to perform capability Y?
- Does this agent comply with policy Z?

Attestations are embedded in the `attestations` array of a passport document.

## Schema

```json
{
  "type": "organization",
  "claim": "member-of:acme-corp",
  "attestor": "https://acme.ai/.well-known/passport.json",
  "issuedAt": "2026-03-30T00:00:00Z",
  "expiresAt": "2027-03-30T00:00:00Z",
  "signature": "<base64url-encoded-ed25519-signature>"
}
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | yes | One of: `"organization"`, `"capability"`, `"policy"`. |
| `claim` | string | yes | The specific claim being attested. Freeform string. |
| `attestor` | string | yes | HTTPS URL of the attestor's passport. |
| `issuedAt` | string | yes | ISO 8601 datetime (UTC) when the attestation was created. |
| `expiresAt` | string | yes | ISO 8601 datetime (UTC) when the attestation expires. |
| `signature` | string | yes | Base64url-encoded Ed25519 signature by the attestor. |

## Attestation Types

### `organization`

Claims about organizational membership or ownership.

Examples:
- `member-of:acme-corp`
- `owned-by:openai`
- `department:engineering`

### `capability`

Claims that the agent is authorized to perform specific capabilities.

Examples:
- `authorized:payment.initiate`
- `authorized:code-execution`
- `certified:medical-advice`

### `policy`

Claims about compliance with policies or regulations.

Examples:
- `complies:eu-ai-act`
- `complies:hipaa`
- `audited:2026-q1`

## Signing

The attestor signs over the following data:

1. Construct a signing payload: `{ agentId, type, claim, issuedAt, expiresAt }` where `agentId` is the `id` of the passport being attested.
2. Canonicalize: sort keys alphabetically, no whitespace.
3. Sign the canonical UTF-8 bytes with the attestor's Ed25519 private key.
4. Base64url-encode the signature.

## Verification

1. Fetch the attestor's passport from the `attestor` URL.
2. Verify the attestor's passport.
3. Construct the signing payload with the agent's `id`.
4. Canonicalize and verify the signature using the attestor's public key.
5. Check that `expiresAt` is in the future.

## Trust Chains

Attestations create a trust chain:

```
Agent A's passport
  └── attested by Org B (organization: member-of:acme-corp)
        └── Org B has its own passport
              └── attested by Auditor C (policy: complies:eu-ai-act)
```

Verifiers decide how deep to follow the chain based on their trust requirements.

## Claim Format

Claims are freeform strings. By convention:

- Use lowercase kebab-case
- Use a prefix that matches the type (`member-of:`, `authorized:`, `complies:`)
- Keep claims specific and verifiable
