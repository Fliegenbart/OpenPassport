# OpenPassport

**The passport standard for AI agents.**

> Agents need passports. No more anonymous agents.

Agents can already call tools, move money, and trigger workflows.
What they often still cannot do is **prove who they are**.

OpenPassport is a simple open standard that gives software agents a passport:
a signed identity document, a capability declaration, and optional trust attestations.

**Others govern what agents do. OpenPassport establishes who they are.**

---

## The Problem

Today, AI agents can:

- Call tools and APIs
- Execute tasks and workflows
- Move data between systems
- Talk to other agents

But they often **cannot prove their identity**. No credentials, no signatures, no verifiable claims.

We taught agents to act before we taught them to introduce themselves.

## The Solution

OpenPassport is exactly four things:

| Primitive | What it does |
|---|---|
| **Passport Document** | A signed JSON identity served at `/.well-known/passport.json` |
| **Signed Message Envelope** | Every agent message is cryptographically signed |
| **Attestations** | Third parties can vouch for an agent's org, capabilities, or compliance |
| **Verification SDK** | A tiny SDK to verify passports, messages, and trust chains |

That's it. No orchestrator, no workflow engine, no marketplace, no control plane.

## Quick Start

### Create a passport

```bash
npx openpassport init \
  --name "MyAgent" \
  --issuer "https://mycompany.com" \
  --endpoint "https://mycompany.com/agent" \
  --capabilities "web-search,summarize"
```

Output:
```
✓ VERIFIED — signature valid

Files written:
  passport.json  → ./passport.json
  passport.key   → ./passport.key (keep secret!)
```

### Use the SDK (TypeScript)

```typescript
import {
  generateKeyPair,
  createPassport,
  createEnvelope,
  verifyPassport,
  verifyMessage,
} from "@openpassport/sdk";

// Create a passport
const { publicKey, privateKey } = await generateKeyPair();
const passport = await createPassport(
  {
    name: "ResearchBot",
    issuer: "https://acme.ai",
    endpoint: "https://acme.ai/agent",
    capabilities: ["web-search", "summarize"],
  },
  privateKey,
  publicKey,
);

// Sign a message
const envelope = await createEnvelope(
  {
    from: passport.id,
    passportUrl: "https://acme.ai/.well-known/passport.json",
    body: { task: "summarize", url: "https://example.com" },
  },
  privateKey,
);

// Verify
const result = await verifyPassport(passport);
console.log(result.valid); // true
```

### Use the SDK (Python)

```python
from openpassport import (
    generate_keypair,
    create_passport,
    create_envelope,
    verify_passport,
    verify_message,
)

public_key, private_key = generate_keypair()
passport = create_passport(
    name="ResearchBot",
    issuer="https://acme.ai",
    endpoint="https://acme.ai/agent",
    capabilities=["web-search", "summarize"],
    private_key=private_key,
    public_key=public_key,
)

result = verify_passport(passport)
assert result.valid
```

## Demos

### Unknown agent rejected

```
✗ ENTRY DENIED
Agent identity could not be verified.
Unknown agent? No entry.
```

### Forged identity detected

```
✗ FORGERY DETECTED
Signature does not match passport public key.
Real key ≠ Signature key.
```

### Trusted agent accepted

```
✓ ENTRY GRANTED
Agent: ResearchBot
Message verified, agent is trusted.
```

Run the demos yourself:

```bash
git clone https://github.com/Fliegenbart/OpenPassport.git
cd OpenPassport && pnpm install && pnpm build

pnpm exec tsx examples/basic-handshake/index.ts
pnpm exec tsx examples/rejected-unknown-agent/index.ts
pnpm exec tsx examples/trusted-agent/index.ts
```

## How It Works

```
Agent A                                          Agent B
  │                                                │
  │  1. Create passport (Ed25519 keypair)          │
  │  2. Serve at /.well-known/passport.json        │
  │                                                │
  │  3. Sign message with private key              │
  │ ─────────── signed envelope ──────────────────>│
  │                                                │
  │                4. Fetch passport from .well-known
  │                5. Verify signature with public key
  │                6. Check expiration, capabilities
  │                                                │
  │                7. ✓ VERIFIED or ✗ REJECTED     │
```

## Passport Document

A passport is a JSON document served at `https://<issuer>/.well-known/passport.json`:

```json
{
  "openpassport": "0.1.0",
  "id": "ap_951173aa-cf55-464d-8aa5-c29ceeee993c",
  "name": "ResearchBot",
  "issuer": "https://acme.ai",
  "publicKey": "base64url-encoded-ed25519-public-key",
  "endpoint": "https://acme.ai/agents/research",
  "capabilities": ["web-search", "summarize"],
  "issuedAt": "2026-03-30T00:00:00Z",
  "expiresAt": "2027-03-30T00:00:00Z",
  "attestations": [],
  "signature": "base64url-encoded-ed25519-signature"
}
```

## Specification

- [Passport Spec](docs/passport-spec.md) — identity document schema and signing
- [Message Envelope](docs/envelope-spec.md) — signed agent-to-agent messages
- [Attestations](docs/attestations.md) — third-party trust claims
- [Threat Model](docs/threat-model.md) — security analysis and mitigations

## Packages

| Package | Language | Description |
|---|---|---|
| [`@openpassport/spec`](packages/spec) | TypeScript | Zod schemas and canonical serialization |
| [`@openpassport/sdk`](packages/sdk-js) | TypeScript | Create, sign, and verify passports and messages |
| [`openpassport`](packages/cli) | TypeScript | CLI tool (`init`, `verify`, `inspect`) |
| [`openpassport`](packages/sdk-python) | Python | Python SDK with full parity |

## OpenPassport is NOT

- An orchestrator
- A workflow engine
- A marketplace
- A central control plane
- An agent operating system
- A policy runtime

The less we try to be, the bigger this can become.

## FAQ

**Why Ed25519?**
Small keys (32 bytes), fast, deterministic signatures, no nonce reuse vulnerability, widely audited implementations.

**Why not JWT?**
JWTs are overloaded, have a history of algorithm confusion attacks, and carry unnecessary overhead. A simple Ed25519 signature over canonical JSON is cleaner and harder to misuse.

**Why not DID?**
DIDs are powerful but complex. OpenPassport is deliberately minimal — a passport, not an identity framework. DID support can be layered on top.

**How is this different from OAuth?**
OAuth is for delegated user authorization. OpenPassport is for agent-to-agent identity. They solve different problems and can coexist.

**Why `.well-known`?**
It's an established web standard (RFC 8615). No central registry needed — identity is discoverable by convention.

**Is there a central registry?**
No. Passports are self-hosted. Trust is established through cryptographic signatures and attestations, not a central authority.

## Contributing

OpenPassport is open source under the MIT license. Contributions are welcome.

```bash
git clone https://github.com/Fliegenbart/OpenPassport.git
cd OpenPassport
pnpm install
pnpm build
pnpm test
```

## License

MIT
