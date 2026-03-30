# OpenPassport — Signed Message Envelope Specification

**Version:** 0.1.0
**Status:** Draft

## Overview

A Signed Message Envelope wraps any agent-to-agent communication with cryptographic proof of origin. Every message sent by a passport-holding agent SHOULD be wrapped in an envelope.

## Schema

```json
{
  "openpassport_message": "0.1.0",
  "from": "ap_<sender-uuid>",
  "to": "ap_<recipient-uuid>",
  "passportUrl": "https://acme.ai/.well-known/passport.json",
  "timestamp": "2026-03-30T12:00:00Z",
  "nonce": "<random-hex-string>",
  "body": { },
  "signature": "<base64url-encoded-ed25519-signature>"
}
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `openpassport_message` | string | yes | Spec version. MUST be `"0.1.0"`. |
| `from` | string | yes | Passport ID of the sending agent. |
| `to` | string | no | Passport ID of the intended recipient. |
| `passportUrl` | string | yes | HTTPS URL where the sender's passport can be fetched. |
| `timestamp` | string | yes | ISO 8601 datetime (UTC) when the message was created. |
| `nonce` | string | yes | Random hex string (minimum 16 characters) for replay protection. |
| `body` | any | yes | The message payload. Can be any valid JSON value. |
| `signature` | string | yes | Base64url-encoded Ed25519 signature over the canonical form. |

## Signing

1. Construct the envelope with all fields **except** `signature`.
2. Canonicalize: serialize to JSON with keys sorted alphabetically, no whitespace.
3. Encode the canonical JSON string as UTF-8 bytes.
4. Sign the bytes with the sender's Ed25519 private key (the same key listed in their passport).
5. Base64url-encode the 64-byte signature.
6. Set the `signature` field.

## Verification

1. Parse the JSON and validate all fields against the schema.
2. Fetch the sender's passport from `passportUrl`.
3. Verify the passport itself (see [passport-spec.md](passport-spec.md)).
4. Confirm that `from` matches the passport's `id`.
5. Remove the `signature` field and canonicalize the envelope.
6. Verify the Ed25519 signature using the passport's `publicKey`.
7. Check that `timestamp` is within an acceptable window (recommended: 5 minutes) to prevent replay attacks.
8. Optionally check the `nonce` against a seen-nonce cache for additional replay protection.

## Replay Protection

The combination of `timestamp` and `nonce` provides replay protection:

- **Timestamp:** Verifiers SHOULD reject messages older than 5 minutes.
- **Nonce:** Verifiers MAY maintain a cache of recently seen nonces and reject duplicates within the timestamp window.

## Body

The `body` field carries the actual message content. OpenPassport does not define the structure of the body — it can be any valid JSON value. The body is included in the signature, so tampering is detectable.
