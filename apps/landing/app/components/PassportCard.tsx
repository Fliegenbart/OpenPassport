"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

export function PassportCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Passport outer */}
      <div className="border border-dashed border-border bg-surface rounded-sm overflow-hidden relative">
        {/* Faint diagonal watermark */}
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[25deg] text-fg/[0.02] text-4xl tracking-[0.3em] uppercase font-[family-name:var(--font-display)] pointer-events-none select-none whitespace-nowrap">
          OpenPassport
        </span>

        {/* Header bar */}
        <div className="border-b border-dashed border-border px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-verified/50" />
            <span className="text-xs text-muted tracking-widest uppercase">
              Agent Passport
            </span>
          </div>
          <span className="text-xs text-verified tracking-wider font-bold">
            VERIFIED
          </span>
        </div>

        {/* Passport body */}
        <div className="p-5 font-mono text-sm space-y-0.5 relative z-10">
          <Line k='"openpassport"' v='"0.1.0"' />
          <Line k='"id"' v='"ap_951173aa-cf55-464d..."' />
          <Line k='"name"' v='"ResearchBot"' highlight />
          <Line k='"issuer"' v='"https://acme.ai"' />
          <Line
            k='"publicKey"'
            v='"dGhpcyBpcyBhIGJhc2U2NC..."'
          />
          <Line k='"endpoint"' v='"https://acme.ai/agent"' />
          <Line k='"capabilities"' v='["web-search", "summarize"]' accent />
          <Line k='"issuedAt"' v='"2026-03-30T00:00:00Z"' />
          <Line k='"expiresAt"' v='"2027-03-30T00:00:00Z"' />
          <Line k='"attestations"' v="[...]" />
          <Line k='"signature"' v='"Ed25519..."' dim />
        </div>

        {/* Footer with MRZ */}
        <div className="border-t border-dashed border-border px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted tracking-widest uppercase">
              /.well-known/passport.json
            </span>
            <span className="text-[10px] text-muted">Ed25519</span>
          </div>
          <div className="text-[7px] text-fg/[0.08] tracking-[0.12em] font-mono leading-relaxed overflow-hidden whitespace-nowrap">
            P&lt;OPN&lt;RESEARCHBOT&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br />
            AP951173AACF55&lt;&lt;&lt;&lt;&lt;&lt;&lt;2026033020270330&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
          </div>
        </div>
      </div>

      {/* Stamp overlay */}
      {inView && (
        <motion.div
          initial={{ scale: 3, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: -6, opacity: 0.9 }}
          transition={{
            duration: 0.4,
            delay: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute top-6 right-6 px-4 py-2 font-bold text-sm tracking-widest uppercase rounded-sm pointer-events-none"
          style={{
            border: "3px solid rgba(34, 197, 94, 0.8)",
            color: "rgba(34, 197, 94, 0.8)",
            textShadow: "0 0 15px rgba(34, 197, 94, 0.4)",
            boxShadow: "0 0 25px rgba(34, 197, 94, 0.08), inset 0 0 0 1px rgba(34, 197, 94, 0.3)",
          }}
        >
          SIGNED
        </motion.div>
      )}
    </motion.div>
  );
}

function Line({
  k,
  v,
  highlight,
  accent,
  dim,
}: {
  k: string;
  v: string;
  highlight?: boolean;
  accent?: boolean;
  dim?: boolean;
}) {
  return (
    <div className="flex">
      <span className="text-muted mr-2">{k}:</span>
      <span
        className={
          highlight
            ? "text-fg font-bold"
            : accent
              ? "text-verified/80"
              : dim
                ? "text-muted/50"
                : "text-fg/70"
        }
      >
        {v}
      </span>
    </div>
  );
}
