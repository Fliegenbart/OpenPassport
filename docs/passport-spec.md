# OpenPassport — Passport Document Specification

**Version:** 0.1.0
**Status:** Draft

## Overview

A Passport is a signed JSON document that represents the identity of a software agent. It declares who the agent is, who issued it, what it can do, and provides a cryptographic proof of authenticity.

## Serving

A Passport MUST be served at:

```
https://<issuer-domain>/.well-known/passport.json
```

The response MUST have `Content-Type: application/json`.

## Schema

```json
{
  "openpassport": "0.1.0",
  "id": "ap_<uuid-v4>",
  "name": "ResearchBot",
  "issuer": "https://acme.ai",
  "publicKey": "<base64url-encoded-ed25519-public-key>",
  "endpoint": "https://acme.ai/agents/research",
  "capabilities": ["web-search", "summarize"],
  "issuedAt": "2026-03-30T00:00:00Z",
  "expiresAt": "2027-03-30T00:00:00Z",
  "attestations": [],
  "signature": "<base64url-encoded-ed25519-signature>"
}
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `openpassport` | string | yes | Spec version. MUST be `"0.1.0"`. |
| `id` | string | yes | Unique agent ID. MUST start with `ap_` followed by a UUID v4. |
| `name` | string | yes | Human-readable agent name. 1–128 characters. |
| `issuer` | string | yes | HTTPS URL of the issuing organization's domain. |
| `publicKey` | string | yes | Base64url-encoded Ed25519 public key (32 bytes → 43 characters). |
| `endpoint` | string | yes | HTTPS URL where the agent receives requests. |
| `capabilities` | string[] | yes | List of capability tags the agent declares. May be empty. |
| `issuedAt` | string | yes | ISO 8601 datetime (UTC) when the passport was created. |
| `expiresAt` | string | yes | ISO 8601 datetime (UTC) when the passport expires. |
| `attestations` | Attestation[] | yes | Third-party attestations. May be empty. See [attestations.md](attestations.md). |
| `signature` | string | yes | Base64url-encoded Ed25519 signature over the canonical form. |

## Signing

1. Construct the passport object with all fields **except** `signature`.
2. Canonicalize: serialize to JSON with keys sorted alphabetically (by Unicode code point), no whitespace.
3. Encode the canonical JSON string as UTF-8 bytes.
4. Sign the bytes with the issuer's Ed25519 private key.
5. Base64url-encode the 64-byte signature (no padding).
6. Set the `signature` field.

## Verification

1. Parse the JSON and validate all fields against the schema.
2. Remove the `signature` field and canonicalize the remaining object.
3. Decode the `publicKey` from base64url.
4. Decode the `signature` from base64url.
5. Verify the Ed25519 signature over the canonical UTF-8 bytes.
6. Check that `expiresAt` is in the future.
7. Optionally warn if `issuedAt` is in the future (clock skew).

## Canonical JSON

The canonical form is produced by:

1. Removing the `signature` key from the object.
2. Sorting all remaining keys alphabetically by Unicode code point.
3. Serializing with `JSON.stringify(obj, sortedKeys)` — no whitespace, no trailing newline.

This ensures deterministic byte output across implementations.

## Capability Tags

Capability tags are freeform strings. By convention, they use lowercase kebab-case:

- `web-search`
- `code-execution`
- `file-read`
- `translate.text`
- `payment.initiate`

There is no central registry of capability tags in v0.1.0. Attestations can be used to add trust to capability claims.
