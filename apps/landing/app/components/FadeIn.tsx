"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

export function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const directionMap = {
    up: { y: 25, x: 0 },
    down: { y: -25, x: 0 },
    left: { y: 0, x: 25 },
    right: { y: 0, x: -25 },
    none: { y: 0, x: 0 },
  };

  const d = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: d.y, x: d.x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
