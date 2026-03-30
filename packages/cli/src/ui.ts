import pc from "picocolors";

export const STAMP = {
  verified: pc.green("✓ VERIFIED"),
  rejected: pc.red("✗ REJECTED"),
  warning: pc.yellow("⚠ WARNING"),
  unknown: pc.dim("? UNKNOWN"),
};

export function box(title: string, lines: string[]): string {
  const maxLen = Math.max(title.length, ...lines.map((l) => stripAnsi(l).length));
  const width = maxLen + 4;
  const hr = "─".repeat(width);

  const out: string[] = [];
  out.push(pc.dim(`┌${hr}┐`));
  out.push(pc.dim("│") + ` ${pc.bold(title)}${" ".repeat(width - title.length - 1)}` + pc.dim("│"));
  out.push(pc.dim(`├${hr}┤`));
  for (const line of lines) {
    const padding = width - stripAnsi(line).length - 1;
    out.push(pc.dim("│") + ` ${line}${" ".repeat(Math.max(0, padding))}` + pc.dim("│"));
  }
  out.push(pc.dim(`└${hr}┘`));
  return out.join("\n");
}

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, "");
}

export function field(label: string, value: string): string {
  return `${pc.dim(label + ":")} ${value}`;
}
