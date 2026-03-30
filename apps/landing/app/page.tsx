import { FadeIn } from "./components/FadeIn";
import { PassportCard } from "./components/PassportCard";
import { Terminal } from "./components/Terminal";
import { StampMark } from "./components/Stamp";
import { DecoStamps } from "./components/DecoStamps";

function SectionNumber({ page, total = 9 }: { page: number; total?: number }) {
  return (
    <span className="absolute top-6 right-6 text-[9px] text-fg/[0.08] tracking-[0.3em] uppercase font-[family-name:var(--font-mono)] pointer-events-none select-none">
      Page {String(page).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </span>
  );
}

function Checkpoint({ label }: { label: string }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="checkpoint-divider">
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Watermark */}
        <span className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[8deg]">
          Passport
        </span>

        <SectionNumber page={1} />

        <FadeIn className="text-center max-w-3xl relative z-10">
          {/* Tiny label */}
          <div className="mb-8">
            <span className="text-[10px] tracking-[0.35em] uppercase text-muted border border-border px-4 py-1.5 rounded-sm">
              Open Standard &mdash; v0.1.0
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight mb-6 font-[family-name:var(--font-display)]">
            Open
            <span className="text-verified">Passport</span>
          </h1>

          <p className="text-xl sm:text-2xl text-fg/80 mb-4 font-light">
            The passport standard for AI agents.
          </p>

          <p className="text-base text-muted max-w-md mx-auto mb-12">
            Before an agent can act, it should identify itself.
            <br />
            <span className="text-fg/70 font-medium">
              No more anonymous agents.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/Fliegenbart/OpenPassport"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-3 bg-fg text-bg font-bold text-sm tracking-wider uppercase hover:bg-verified transition-colors duration-200"
            >
              Get Started
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </a>
            <a
              href="https://github.com/Fliegenbart/OpenPassport/blob/main/docs/passport-spec.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-border text-fg/70 text-sm tracking-wider uppercase hover:border-fg/40 hover:text-fg transition-colors duration-200"
            >
              Read the Spec
            </a>
          </div>
        </FadeIn>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <FadeIn delay={1}>
            <div className="flex flex-col items-center gap-2 text-muted">
              <span className="text-[10px] tracking-widest uppercase">
                Scroll
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-muted to-transparent" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ PROBLEM ═══════════════ */}
      <section className="py-32 px-6 relative">
        <SectionNumber page={2} />
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug text-fg/90">
              We taught agents to{" "}
              <span className="text-fg font-medium">act</span> before we taught
              them to{" "}
              <span className="text-fg font-medium">introduce themselves</span>.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-12 space-y-4 text-base text-muted max-w-xl mx-auto">
              <p>
                AI agents can call tools, execute workflows, move data, and talk
                to other agents.
              </p>
              <p>
                What they often cannot do is{" "}
                <span className="text-fg/80">prove who they are</span>.
              </p>
              <p>No credentials. No signatures. No verifiable claims.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-12">
            <StampMark color="rejected" rotate={3}>
              Identity Gap
            </StampMark>
          </FadeIn>
        </div>
      </section>

      <Checkpoint label="Checkpoint" />

      {/* ═══════════════ SOLUTION — 4 PRIMITIVES ═══════════════ */}
      <section className="py-32 px-6 relative">
        <SectionNumber page={3} />
        <DecoStamps
          stamps={[
            { text: "ENTRY 2026-03-15", rotate: -12, top: "8%", left: "3%" },
            { text: "TRANSIT APPROVED", rotate: 8, top: "65%", right: "2%" },
          ]}
        />
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-20">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              The Standard
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-[family-name:var(--font-display)]">
              Four primitives. Nothing more.
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: "01",
                title: "Passport Document",
                desc: "A signed JSON identity served at a well-known URL. Contains agent ID, name, issuer, public key, capabilities, and signature.",
                tag: "/.well-known/passport.json",
              },
              {
                num: "02",
                title: "Signed Envelope",
                desc: "Every agent message is cryptographically signed. Timestamp and nonce prevent replay. Body is tamper-proof.",
                tag: "Ed25519 signature",
              },
              {
                num: "03",
                title: "Attestations",
                desc: "Third parties vouch for an agent: org membership, authorized capabilities, policy compliance. Trust chains, not trust assumptions.",
                tag: "organization · capability · policy",
              },
              {
                num: "04",
                title: "Verification SDK",
                desc: "A tiny SDK to verify everything. Is this passport real? Is this message authentic? Is this agent known? What can it do?",
                tag: "TypeScript · Python",
              },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1}>
                <div className="group border border-border bg-surface p-6 hover:border-fg/20 transition-colors duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] text-muted tracking-widest">
                      {item.num}
                    </span>
                    <span className="text-[10px] text-muted/60 tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-verified transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Checkpoint label="Document Check" />

      {/* ═══════════════ PASSPORT CARD ═══════════════ */}
      <section className="py-24 px-6 relative">
        <SectionNumber page={4} />
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              The Document
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-[family-name:var(--font-display)]">
              Machine-readable identity
            </h2>
          </FadeIn>

          <PassportCard />
        </div>
      </section>

      <Checkpoint label="Border Control" />

      {/* ═══════════════ TERMINAL DEMO ═══════════════ */}
      <section className="py-32 px-6 bg-surface/50 relative overflow-hidden">
        <SectionNumber page={5} />
        {/* Watermark */}
        <span className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[5deg]">
          Border Control
        </span>
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              See It Work
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-[family-name:var(--font-display)]">
              Verify. Reject. Trust.
            </h2>
          </FadeIn>

          <Terminal />
        </div>
      </section>

      <Checkpoint label="Processing" />

      {/* ═══════════════ QUICK START ═══════════════ */}
      <section className="py-32 px-6 relative">
        <SectionNumber page={6} />
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              3 Minutes
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-[family-name:var(--font-display)]">
              Try it now
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-4">
              <CodeBlock
                label="Create a passport"
                code={`npx openpassport init \\
  --name "MyAgent" \\
  --issuer "https://mycompany.com" \\
  --endpoint "https://mycompany.com/agent" \\
  --capabilities "web-search,summarize"`}
              />
              <CodeBlock
                label="Verify an agent"
                code="npx openpassport verify https://acme.ai"
              />
              <CodeBlock
                label="Inspect a passport"
                code="npx openpassport inspect https://acme.ai"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section className="py-32 px-6 bg-surface/50 relative overflow-hidden">
        <SectionNumber page={7} />
        <DecoStamps
          stamps={[
            { text: "EXIT CLEARED", rotate: 15, top: "12%", right: "4%" },
            { text: "VERIFIED 2026", rotate: -6, top: "75%", left: "2%" },
          ]}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              Protocol
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal font-[family-name:var(--font-display)]">
              How it works
            </h2>
          </FadeIn>

          <FadeIn>
            <pre className="text-xs sm:text-sm text-muted leading-relaxed overflow-x-auto p-6 border border-border bg-bg">
              {`  Agent A                                    Agent B
    │                                          │
    │  1. Create passport (Ed25519 keypair)    │
    │  2. Serve at /.well-known/passport.json  │
    │                                          │
    │  3. Sign message with private key        │
    │ ──────── signed envelope ───────────────>│
    │                                          │
    │            4. Fetch passport from issuer  │
    │            5. Verify Ed25519 signature    │
    │            6. Check expiry & capabilities │
    │                                          │
    │            7. ✓ VERIFIED  or  ✗ REJECTED │`}
            </pre>
          </FadeIn>
        </div>
      </section>

      <Checkpoint label="Clearance" />

      {/* ═══════════════ DIFFERENTIATOR ═══════════════ */}
      <section className="py-32 px-6 relative">
        <SectionNumber page={8} />
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-2xl sm:text-3xl md:text-4xl font-light leading-snug font-[family-name:var(--font-display)]">
              Others govern what agents{" "}
              <span className="text-muted italic">do</span>.
            </p>
            <p className="text-2xl sm:text-3xl md:text-4xl font-normal mt-2 font-[family-name:var(--font-display)]">
              OpenPassport establishes who they{" "}
              <span className="text-verified">are</span>.
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="mt-12">
            <StampMark color="verified" rotate={-3} delay={0.1}>
              Before policy comes identity
            </StampMark>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ NOT ═══════════════ */}
      <section className="py-24 px-6 bg-surface/50 relative">
        <div className="max-w-2xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-xl font-normal font-[family-name:var(--font-display)]">
              OpenPassport is <em>not</em>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              {[
                "an orchestrator",
                "a workflow engine",
                "a marketplace",
                "a control plane",
                "an agent OS",
                "a policy runtime",
              ].map((item) => (
                <div
                  key={item}
                  className="border border-border/50 px-4 py-3 text-sm text-muted"
                >
                  <span className="text-rejected/60 mr-1.5">&#x2715;</span>
                  {item}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="text-center mt-8">
            <p className="text-sm text-muted italic font-[family-name:var(--font-display)]">
              The less we try to be, the bigger this can become.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ PACKAGES ═══════════════ */}
      <section className="py-32 px-6 relative">
        <SectionNumber page={9} />
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[10px] tracking-[0.35em] uppercase text-muted mb-4">
              Ecosystem
            </p>
            <h2 className="text-3xl font-normal font-[family-name:var(--font-display)]">
              Packages
            </h2>
          </FadeIn>

          <FadeIn>
            <div className="border border-border divide-y divide-border">
              {[
                {
                  name: "@openpassport/spec",
                  lang: "TypeScript",
                  desc: "Zod schemas & canonical serialization",
                },
                {
                  name: "@openpassport/sdk",
                  lang: "TypeScript",
                  desc: "Create, sign, and verify passports & messages",
                },
                {
                  name: "openpassport",
                  lang: "CLI",
                  desc: "init · verify · inspect",
                },
                {
                  name: "openpassport",
                  lang: "Python",
                  desc: "Full SDK parity — create, sign, verify",
                },
              ].map((pkg) => (
                <div
                  key={pkg.name + pkg.lang}
                  className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors"
                >
                  <div>
                    <span className="text-sm font-bold text-fg">
                      {pkg.name}
                    </span>
                    <span className="text-xs text-muted ml-3">{pkg.desc}</span>
                  </div>
                  <span className="text-[10px] text-muted/60 tracking-widest uppercase">
                    {pkg.lang}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Watermark */}
        <span className="watermark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[4deg]">
          Cleared
        </span>
        <DecoStamps
          stamps={[
            { text: "APPROVED", rotate: -18, top: "15%", left: "5%" },
            { text: "ENTRY 2026", rotate: 10, top: "70%", right: "3%" },
          ]}
        />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl font-normal font-[family-name:var(--font-display)] mb-6">
              Every agent should
              <br />
              carry a passport.
            </h2>
            <p className="text-muted mb-12">
              The agent ecosystem has tools, memory, and workflows.
              <br />
              It still lacks passports.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <a
              href="https://github.com/Fliegenbart/OpenPassport"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block px-10 py-4 bg-fg text-bg font-bold text-sm tracking-wider uppercase hover:bg-verified transition-colors duration-200"
            >
              Star on GitHub
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </a>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-16">
            <StampMark color="verified" rotate={-2} delay={0.2}>
              No More Anonymous Agents
            </StampMark>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ MRZ BAND ═══════════════ */}
      <div className="py-4 px-6 overflow-hidden select-none pointer-events-none">
        <div className="text-[8px] text-fg/[0.06] tracking-[0.15em] font-[family-name:var(--font-mono)] leading-relaxed text-center whitespace-nowrap">
          P&lt;OPN&lt;OPENPASSPORT&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          <br />
          AP951173AACF55464D&lt;&lt;&lt;&lt;&lt;&lt;&lt;8AA5C29CEEEE993C&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
        </div>
      </div>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold">OpenPassport</span>
            <a
              href="https://github.com/Fliegenbart/OpenPassport"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-fg transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com/Fliegenbart/OpenPassport/blob/main/docs/passport-spec.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-fg transition-colors"
            >
              Spec
            </a>
            <a
              href="https://github.com/Fliegenbart/OpenPassport/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-fg transition-colors"
            >
              MIT License
            </a>
          </div>
          <p className="text-xs text-muted">No more anonymous agents.</p>
        </div>
      </footer>
    </main>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="border border-border bg-surface">
      <div className="border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-muted tracking-widest uppercase">
          {label}
        </span>
        <span className="text-[10px] text-muted/50">bash</span>
      </div>
      <pre className="p-4 text-sm text-fg/80 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
