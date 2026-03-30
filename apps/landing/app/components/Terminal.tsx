"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "motion/react";

interface TerminalLine {
  text: string;
  type: "command" | "output" | "success" | "error" | "dim" | "blank";
  delay?: number;
}

const DEMOS: { title: string; lines: TerminalLine[] }[] = [
  {
    title: "Unknown Agent Rejected",
    lines: [
      { text: "$ openpassport verify https://unknown-agent.io", type: "command" },
      { text: "Fetching passport from https://unknown-agent.io...", type: "dim", delay: 400 },
      { text: "", type: "blank", delay: 800 },
      { text: "✗ REJECTED — agent identity could not be verified", type: "error", delay: 1200 },
      { text: "  Passport not found at /.well-known/passport.json", type: "dim", delay: 1400 },
      { text: "", type: "blank", delay: 1600 },
      { text: "  Unknown agent? No entry.", type: "dim", delay: 1800 },
    ],
  },
  {
    title: "Forged Identity Detected",
    lines: [
      { text: "$ openpassport verify https://impersonator.io", type: "command" },
      { text: "Fetching passport...", type: "dim", delay: 400 },
      { text: "Verifying signature...", type: "dim", delay: 800 },
      { text: "", type: "blank", delay: 1200 },
      { text: "✗ FORGERY DETECTED", type: "error", delay: 1400 },
      { text: "  Signature does not match passport public key", type: "error", delay: 1600 },
      { text: "  Real key ≠ Claimed key", type: "dim", delay: 1800 },
      { text: "", type: "blank", delay: 2000 },
      { text: "  Trust, before autonomy.", type: "dim", delay: 2200 },
    ],
  },
  {
    title: "Trusted Agent Verified",
    lines: [
      { text: "$ openpassport verify https://acme.ai", type: "command" },
      { text: "Fetching passport from https://acme.ai...", type: "dim", delay: 400 },
      { text: "Verifying Ed25519 signature...", type: "dim", delay: 800 },
      { text: "Checking expiration...", type: "dim", delay: 1000 },
      { text: "Validating attestations...", type: "dim", delay: 1200 },
      { text: "", type: "blank", delay: 1500 },
      { text: "✓ VERIFIED — identity confirmed", type: "success", delay: 1700 },
      { text: "  Name:         ResearchBot", type: "output", delay: 1900 },
      { text: "  Issuer:       https://acme.ai", type: "output", delay: 2000 },
      { text: "  Capabilities: web-search, summarize", type: "output", delay: 2100 },
      { text: "  Attested by:  acme-corp (organization)", type: "output", delay: 2200 },
    ],
  },
];

export function Terminal() {
  const [activeDemo, setActiveDemo] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    setVisibleLines(0);
    setIsTyping(true);

    const lines = DEMOS[activeDemo].lines;
    const timeouts: NodeJS.Timeout[] = [];

    lines.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(i + 1);
        if (i === lines.length - 1) {
          setIsTyping(false);
        }
      }, line.delay ?? i * 200);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [activeDemo, inView]);

  const lines = DEMOS[activeDemo].lines;

  return (
    <div ref={ref} className="w-full max-w-2xl mx-auto">
      {/* Tab bar */}
      <div className="flex gap-0 border-b border-border">
        {DEMOS.map((demo, i) => (
          <button
            key={i}
            onClick={() => setActiveDemo(i)}
            className={`px-4 py-2.5 text-xs tracking-wide transition-colors cursor-pointer ${
              i === activeDemo
                ? "text-fg border-b-2 border-fg -mb-px"
                : "text-muted hover:text-fg/70"
            }`}
          >
            {demo.title}
          </button>
        ))}
      </div>

      {/* Terminal body */}
      <div className="bg-surface border border-border border-t-0 p-6 min-h-[280px] scanline relative">
        <div className="space-y-1 font-mono text-sm">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={`${activeDemo}-${i}`}>
              {line.type === "blank" ? (
                <div className="h-4" />
              ) : line.type === "command" ? (
                <span className="text-fg">{line.text}</span>
              ) : line.type === "success" ? (
                <span className="text-verified font-bold">{line.text}</span>
              ) : line.type === "error" ? (
                <span className="text-rejected font-bold">{line.text}</span>
              ) : line.type === "dim" ? (
                <span className="text-muted">{line.text}</span>
              ) : (
                <span className="text-fg/80">{line.text}</span>
              )}
            </div>
          ))}
          {isTyping && (
            <span className="inline-block w-2 h-4 bg-fg/70 cursor-blink ml-0.5 align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
