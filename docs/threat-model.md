# OpenPassport — Threat Model

**Version:** 0.1.0
**Status:** Draft

## Overview

This document describes the security threats that OpenPassport is designed to address and the mitigations it provides.

## Threat Categories

### 1. Identity Spoofing

**Threat:** An attacker creates a passport claiming to be a trusted agent.

**Mitigation:**
- Passports are signed with Ed25519 private keys. Without the private key, a valid signature cannot be produced.
- Verifiers fetch the passport from the declared `issuer` URL (`/.well-known/passport.json`), so the passport must be served from a domain the issuer controls.
- An attacker would need to compromise both the private key AND the issuer's domain.

### 2. Key Compromise

**Threat:** An agent's Ed25519 private key is stolen.

**Mitigation:**
- Passports have an `expiresAt` field, limiting the window of damage.
- The issuer can replace the passport at `/.well-known/passport.json` with a new one using a fresh keypair.
- **Limitation:** There is no revocation mechanism in v0.1.0. Key rotation is the primary response.

**Recommendation:** Treat private keys as secrets. Never include them in source control or logs.

### 3. Replay Attacks

**Threat:** An attacker intercepts a signed message and re-sends it.

**Mitigation:**
- Message envelopes include a `timestamp` field. Verifiers SHOULD reject messages older than 5 minutes.
- Message envelopes include a `nonce` field. Verifiers MAY cache seen nonces to detect duplicates.
- The combination of timestamp + nonce provides robust replay protection.

### 4. Passport URL Spoofing

**Threat:** An attacker points `passportUrl` in a message envelope to a malicious server that serves a fake passport.

**Mitigation:**
- Passports MUST be served over HTTPS, ensuring transport-level authenticity.
- Verifiers SHOULD check that the `passportUrl` matches the passport's `issuer` field.
- Verifiers SHOULD pin or cache known passports for trusted agents.

### 5. Attestation Forgery

**Threat:** An attacker creates a fake attestation claiming a trusted third party vouches for them.

**Mitigation:**
- Attestations are signed by the attestor's private key. The attestor's passport (and public key) is fetched independently.
- Verification requires: (1) valid attestor passport, (2) valid attestor signature over the claim.
- An attacker cannot forge an attestation without the attestor's private key.

### 6. Man-in-the-Middle

**Threat:** An attacker intercepts communication between agents and modifies messages.

**Mitigation:**
- All messages are signed. Any modification invalidates the signature.
- All passport URLs use HTTPS.
- **Limitation:** OpenPassport does not provide encryption. It provides authentication and integrity. For confidentiality, use TLS or an encryption layer on top.

### 7. Denial of Service on Passport URLs

**Threat:** An attacker makes the passport URL unavailable, preventing verification.

**Mitigation:**
- Verifiers SHOULD cache passports with a reasonable TTL.
- Verifiers MAY fall back to a cached passport if the URL is temporarily unavailable, as long as the passport has not expired.

## What OpenPassport Does NOT Protect Against

- **Compromised issuer domains:** If an attacker gains control of the issuer's domain, they can serve any passport.
- **Malicious agents with valid passports:** A passport proves identity, not intent. An agent with a valid passport can still behave maliciously.
- **Confidentiality:** OpenPassport does not encrypt messages. Use TLS for transport security.
- **Key management:** OpenPassport does not dictate how private keys are stored or managed.

## Security Recommendations

1. **Rotate keys regularly.** Issue passports with short expiration windows (e.g., 90 days).
2. **Pin trusted passports.** Cache and verify known passports rather than fetching every time.
3. **Use HTTPS everywhere.** Never serve passports or accept messages over plain HTTP.
4. **Monitor passport URLs.** Alert on unexpected changes to served passports.
5. **Validate all fields.** Don't skip schema validation — malformed passports may be attack vectors.
