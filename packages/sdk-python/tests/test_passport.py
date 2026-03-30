from openpassport import generate_keypair, create_passport, verify_passport, base64url_encode


def test_create_valid_passport():
    public_key, private_key = generate_keypair()
    passport = create_passport(
        name="TestBot",
        issuer="https://example.com",
        endpoint="https://example.com/agent",
        capabilities=["web-search", "summarize"],
        private_key=private_key,
        public_key=public_key,
    )
    assert passport["openpassport"] == "0.1.0"
    assert passport["id"].startswith("ap_")
    assert passport["name"] == "TestBot"
    assert passport["signature"]


def test_verify_valid_passport():
    public_key, private_key = generate_keypair()
    passport = create_passport(
        name="TestBot",
        issuer="https://example.com",
        endpoint="https://example.com/agent",
        capabilities=["web-search"],
        private_key=private_key,
        public_key=public_key,
    )
    result = verify_passport(passport)
    assert result.valid
    assert len(result.errors) == 0


def test_reject_tampered_passport():
    public_key, private_key = generate_keypair()
    passport = create_passport(
        name="TestBot",
        issuer="https://example.com",
        endpoint="https://example.com/agent",
        capabilities=[],
        private_key=private_key,
        public_key=public_key,
    )
    passport["name"] = "EvilBot"
    result = verify_passport(passport)
    assert not result.valid
    assert any("Signature" in e for e in result.errors)


def test_reject_wrong_public_key():
    pk1, sk1 = generate_keypair()
    pk2, sk2 = generate_keypair()
    passport = create_passport(
        name="TestBot",
        issuer="https://example.com",
        endpoint="https://example.com/agent",
        capabilities=[],
        private_key=sk1,
        public_key=pk1,
    )
    passport["publicKey"] = base64url_encode(pk2)
    result = verify_passport(passport)
    assert not result.valid


def test_reject_expired_passport():
    public_key, private_key = generate_keypair()
    passport = create_passport(
        name="TestBot",
        issuer="https://example.com",
        endpoint="https://example.com/agent",
        capabilities=[],
        private_key=private_key,
        public_key=public_key,
        expires_in_days=-1,
    )
    result = verify_passport(passport)
    assert not result.valid
    assert any("expired" in e for e in result.errors)
