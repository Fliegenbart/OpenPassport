from openpassport import generate_keypair, create_passport, create_envelope, verify_message


def test_create_and_verify_message():
    public_key, private_key = generate_keypair()
    passport = create_passport(
        name="SenderBot",
        issuer="https://sender.example.com",
        endpoint="https://sender.example.com/agent",
        capabilities=["send-message"],
        private_key=private_key,
        public_key=public_key,
    )
    envelope = create_envelope(
        from_id=passport["id"],
        passport_url="https://sender.example.com/.well-known/passport.json",
        body={"text": "Hello, world!"},
        private_key=private_key,
    )
    assert envelope["openpassport_message"] == "0.1.0"
    assert envelope["from"] == passport["id"]
    assert envelope["nonce"]
    assert envelope["signature"]

    result = verify_message(envelope, passport)
    assert result.valid
    assert len(result.errors) == 0


def test_reject_tampered_body():
    public_key, private_key = generate_keypair()
    passport = create_passport(
        name="SenderBot",
        issuer="https://sender.example.com",
        endpoint="https://sender.example.com/agent",
        capabilities=[],
        private_key=private_key,
        public_key=public_key,
    )
    envelope = create_envelope(
        from_id=passport["id"],
        passport_url="https://sender.example.com/.well-known/passport.json",
        body={"text": "Hello"},
        private_key=private_key,
    )
    envelope["body"] = {"text": "Hacked!"}
    result = verify_message(envelope, passport)
    assert not result.valid


def test_reject_wrong_key():
    pk1, sk1 = generate_keypair()
    pk2, sk2 = generate_keypair()
    passport = create_passport(
        name="SenderBot",
        issuer="https://sender.example.com",
        endpoint="https://sender.example.com/agent",
        capabilities=[],
        private_key=sk1,
        public_key=pk1,
    )
    # Sign with different key
    envelope = create_envelope(
        from_id=passport["id"],
        passport_url="https://sender.example.com/.well-known/passport.json",
        body={"text": "Hello"},
        private_key=sk2,
    )
    result = verify_message(envelope, passport)
    assert not result.valid
