"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

export function VerifiedStamp({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative inline-block">
      {inView && (
        <motion.div
          initial={{ scale: 3, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: -4, opacity: 0.9 }}
          transition={{
            duration: 0.4,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="px-6 py-3 font-bold text-lg tracking-widest uppercase rounded-sm"
          style={{
            border: "3px solid rgba(34, 197, 94, 0.8)",
            boxShadow: "0 0 30px rgba(34, 197, 94, 0.1), inset 0 0 0 1px rgba(34, 197, 94, 0.3)",
            color: "rgba(34, 197, 94, 0.85)",
            textShadow: "0 0 20px rgba(34, 197, 94, 0.3)",
          }}
        >
          ENTRY GRANTED
        </motion.div>
      )}
    </div>
  );
}

export function RejectedStamp({ delay = 0 }: { delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative inline-block">
      {inView && (
        <motion.div
          initial={{ scale: 3, rotate: 8, opacity: 0 }}
          animate={{ scale: 1, rotate: 3, opacity: 0.9 }}
          transition={{
            duration: 0.4,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="px-6 py-3 font-bold text-lg tracking-widest uppercase rounded-sm"
          style={{
            border: "3px solid rgba(239, 68, 68, 0.8)",
            boxShadow: "0 0 30px rgba(239, 68, 68, 0.1), inset 0 0 0 1px rgba(239, 68, 68, 0.3)",
            color: "rgba(239, 68, 68, 0.85)",
            textShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
          }}
        >
          ENTRY DENIED
        </motion.div>
      )}
    </div>
  );
}

export function StampMark({
  children,
  color = "verified",
  rotate = -4,
  delay = 0,
}: {
  children: React.ReactNode;
  color?: "verified" | "rejected" | "warning";
  rotate?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const colorMap = {
    verified: {
      border: "rgba(34, 197, 94, 0.7)",
      text: "rgba(34, 197, 94, 0.75)",
      glow: "rgba(34, 197, 94, 0.15)",
      inner: "rgba(34, 197, 94, 0.25)",
    },
    rejected: {
      border: "rgba(239, 68, 68, 0.7)",
      text: "rgba(239, 68, 68, 0.75)",
      glow: "rgba(239, 68, 68, 0.15)",
      inner: "rgba(239, 68, 68, 0.25)",
    },
    warning: {
      border: "rgba(234, 179, 8, 0.7)",
      text: "rgba(234, 179, 8, 0.75)",
      glow: "rgba(234, 179, 8, 0.15)",
      inner: "rgba(234, 179, 8, 0.25)",
    },
  };

  const c = colorMap[color];

  return (
    <div ref={ref} className="inline-block">
      {inView && (
        <motion.span
          initial={{ scale: 2.5, rotate: rotate * 2, opacity: 0 }}
          animate={{ scale: 1, rotate, opacity: 0.9 }}
          transition={{
            duration: 0.35,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-sm"
          style={{
            border: `2px solid ${c.border}`,
            boxShadow: `0 0 20px ${c.glow}, inset 0 0 0 1px ${c.inner}`,
            color: c.text,
          }}
        >
          {children}
        </motion.span>
      )}
    </div>
  );
}
