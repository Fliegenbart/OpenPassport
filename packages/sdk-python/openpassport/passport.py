"""Create and sign OpenPassport passport documents."""
from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from openpassport.canonical import canonicalize
from openpassport.keys import public_key_to_base64url, base64url_encode, sign_bytes


def create_passport(
    name: str,
    issuer: str,
    endpoint: str,
    capabilities: list[str],
    private_key: bytes,
    public_key: bytes,
    expires_in_days: int = 365,
) -> dict[str, Any]:
    """Create a signed passport document."""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(days=expires_in_days)

    passport_id = f"ap_{uuid.uuid4()}"

    unsigned: dict[str, Any] = {
        "openpassport": "0.1.0",
        "id": passport_id,
        "name": name,
        "issuer": issuer,
        "publicKey": public_key_to_base64url(public_key),
        "endpoint": endpoint,
        "capabilities": capabilities,
        "issuedAt": _format_datetime(now),
        "expiresAt": _format_datetime(expires_at),
        "attestations": [],
    }

    canonical = canonicalize(unsigned)
    data = canonical.encode("utf-8")
    sig = sign_bytes(data, private_key)

    return {**unsigned, "signature": base64url_encode(sig)}


def _format_datetime(dt: datetime) -> str:
    """Format datetime as ISO 8601 without milliseconds."""
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")
