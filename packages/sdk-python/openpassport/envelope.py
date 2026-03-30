"""Create signed message envelopes."""
from __future__ import annotations

import secrets
from datetime import datetime, timezone
from typing import Any

from openpassport.canonical import canonicalize
from openpassport.keys import base64url_encode, sign_bytes


def create_envelope(
    from_id: str,
    passport_url: str,
    body: Any,
    private_key: bytes,
    to_id: str | None = None,
) -> dict[str, Any]:
    """Create a signed message envelope."""
    nonce = secrets.token_hex(16)
    now = datetime.now(timezone.utc)

    unsigned: dict[str, Any] = {
        "openpassport_message": "0.1.0",
        "from": from_id,
        "passportUrl": passport_url,
        "timestamp": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "nonce": nonce,
        "body": body,
    }

    if to_id is not None:
        unsigned["to"] = to_id

    canonical = canonicalize(unsigned)
    data = canonical.encode("utf-8")
    sig = sign_bytes(data, private_key)

    return {**unsigned, "signature": base64url_encode(sig)}
