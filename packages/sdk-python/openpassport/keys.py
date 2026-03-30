"""Ed25519 key operations for OpenPassport."""
from __future__ import annotations

import base64
from nacl.signing import SigningKey, VerifyKey
from nacl.exceptions import BadSignatureError


def generate_keypair() -> tuple[bytes, bytes]:
    """Generate an Ed25519 keypair. Returns (public_key, private_key), each 32 bytes."""
    signing_key = SigningKey.generate()
    return bytes(signing_key.verify_key), bytes(signing_key)


def public_key_to_base64url(key: bytes) -> str:
    """Encode a 32-byte public key as base64url (no padding)."""
    return base64url_encode(key)


def base64url_encode(data: bytes) -> str:
    """Encode bytes as base64url without padding."""
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def base64url_to_bytes(encoded: str) -> bytes:
    """Decode a base64url string (with or without padding) to bytes."""
    padding = 4 - len(encoded) % 4
    if padding != 4:
        encoded += "=" * padding
    return base64.urlsafe_b64decode(encoded)


def sign_bytes(data: bytes, private_key: bytes) -> bytes:
    """Sign data with an Ed25519 private key. Returns 64-byte signature."""
    signing_key = SigningKey(private_key)
    signed = signing_key.sign(data)
    return signed.signature


def verify_signature(signature: bytes, data: bytes, public_key: bytes) -> bool:
    """Verify an Ed25519 signature. Returns True if valid, False otherwise."""
    try:
        verify_key = VerifyKey(public_key)
        verify_key.verify(data, signature)
        return True
    except BadSignatureError:
        return False
