"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

interface DecoStamp {
  text: string;
  rotate: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export function DecoStamps({ stamps }: { stamps: DecoStamp[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {stamps.map((stamp, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 1.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute border border-fg/[0.04] text-fg/[0.04] px-2 py-1 text-[9px] tracking-[0.25em] uppercase font-[family-name:var(--font-mono)]"
          style={{
            rotate: `${stamp.rotate}deg`,
            top: stamp.top,
            left: stamp.left,
            right: stamp.right,
            bottom: stamp.bottom,
          }}
        >
          {stamp.text}
        </motion.span>
      ))}
    </div>
  );
}
