"""Verify OpenPassport passports and message envelopes."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from openpassport.canonical import canonicalize
from openpassport.keys import base64url_to_bytes, verify_signature


@dataclass
class VerifyResult:
    valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)


def verify_passport(passport: dict[str, Any]) -> VerifyResult:
    """Verify a passport document's signature and validity."""
    errors: list[str] = []
    warnings: list[str] = []

    # Check required fields
    required = ["openpassport", "id", "name", "issuer", "publicKey", "endpoint",
                "capabilities", "issuedAt", "expiresAt", "signature"]
    for f in required:
        if f not in passport:
            errors.append(f"Missing required field: {f}")
    if errors:
        return VerifyResult(valid=False, errors=errors)

    # Check spec version
    if passport["openpassport"] != "0.1.0":
        errors.append(f"Unsupported spec version: {passport['openpassport']}")

    # Check ID format
    if not passport["id"].startswith("ap_"):
        errors.append(f"Invalid ID format: {passport['id']}")

    # Verify signature
    try:
        public_key = base64url_to_bytes(passport["publicKey"])
        signature = base64url_to_bytes(passport["signature"])
        canonical = canonicalize(passport)
        data = canonical.encode("utf-8")

        if not verify_signature(signature, data, public_key):
            errors.append("Signature verification failed: signature does not match public key")
    except Exception as e:
        errors.append(f"Signature verification error: {e}")

    # Check expiration
    now = datetime.now(timezone.utc)
    try:
        expires_at = datetime.fromisoformat(passport["expiresAt"].replace("Z", "+00:00"))
        if expires_at <= now:
            errors.append(f"Passport expired at {passport['expiresAt']}")
    except ValueError:
        errors.append(f"Invalid expiresAt format: {passport['expiresAt']}")

    # Check issuedAt
    try:
        issued_at = datetime.fromisoformat(passport["issuedAt"].replace("Z", "+00:00"))
        if issued_at > now:
            warnings.append(f"Passport issuedAt is in the future: {passport['issuedAt']}")
    except ValueError:
        pass

    return VerifyResult(valid=len(errors) == 0, errors=errors, warnings=warnings)


def verify_message(
    envelope: dict[str, Any],
    passport: dict[str, Any],
    max_age_seconds: int = 300,
) -> VerifyResult:
    """Verify a signed message envelope against a passport."""
    errors: list[str] = []

    # Check required fields
    required = ["openpassport_message", "from", "passportUrl", "timestamp", "nonce", "body", "signature"]
    for f in required:
        if f not in envelope:
            errors.append(f"Missing required field: {f}")
    if errors:
        return VerifyResult(valid=False, errors=errors)

    # Verify the passport itself
    passport_result = verify_passport(passport)
    if not passport_result.valid:
        return VerifyResult(
            valid=False,
            errors=[f"Passport: {e}" for e in passport_result.errors],
        )

    # Check from matches passport id
    if envelope["from"] != passport["id"]:
        errors.append(f"Envelope 'from' ({envelope['from']}) does not match passport id ({passport['id']})")

    # Verify envelope signature
    try:
        public_key = base64url_to_bytes(passport["publicKey"])
        signature = base64url_to_bytes(envelope["signature"])
        canonical = canonicalize(envelope)
        data = canonical.encode("utf-8")

        if not verify_signature(signature, data, public_key):
            errors.append("Message signature verification failed")
    except Exception as e:
        errors.append(f"Message signature error: {e}")

    # Check timestamp freshness
    try:
        msg_time = datetime.fromisoformat(envelope["timestamp"].replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        age = (now - msg_time).total_seconds()
        if age > max_age_seconds:
            errors.append(f"Message is {int(age)}s old, exceeds max age of {max_age_seconds}s")
        if age < -30:
            errors.append(f"Message timestamp is in the future by {int(-age)}s")
    except ValueError:
        errors.append(f"Invalid timestamp format: {envelope['timestamp']}")

    return VerifyResult(valid=len(errors) == 0, errors=errors)
