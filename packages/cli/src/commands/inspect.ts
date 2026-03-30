import pc from "picocolors";
import { fetchPassport, verifyPassport, type Passport } from "@openpassport/sdk";
import { box, field, STAMP } from "../ui.js";

export async function inspect(url: string): Promise<void> {
  console.log(pc.dim(`\nFetching passport from ${url}...`));

  let passport: Passport;
  try {
    passport = await fetchPassport(url);
  } catch (err) {
    console.log();
    console.log(STAMP.rejected + ` Could not fetch passport from ${url}`);
    console.log(pc.red(`  ${err instanceof Error ? err.message : String(err)}`));
    console.log();
    process.exit(1);
    return;
  }

  const result = await verifyPassport(passport);
  const status = result.valid ? STAMP.verified : STAMP.rejected;

  console.log();
  console.log(box("PASSPORT INSPECTION", [
    field("Spec Version", passport.openpassport),
    field("ID", passport.id),
    field("Name", pc.bold(passport.name)),
    field("Issuer", pc.cyan(passport.issuer)),
    field("Endpoint", pc.cyan(passport.endpoint)),
    field("Public Key", passport.publicKey.slice(0, 20) + "..."),
    "",
    field("Capabilities", ""),
    ...(passport.capabilities.length > 0
      ? passport.capabilities.map((c) => `  ${pc.green("•")} ${c}`)
      : [pc.dim("  (none)")]),
    "",
    field("Issued At", passport.issuedAt),
    field("Expires At", passport.expiresAt),
    "",
    field("Attestations", String(passport.attestations.length)),
    ...passport.attestations.map((a) =>
      `  ${pc.blue("•")} [${a.type}] ${a.claim} (by ${a.attestor})`
    ),
    "",
    field("Signature", passport.signature.slice(0, 20) + "..."),
    "",
    `Status: ${status}`,
    ...(result.errors.length > 0
      ? result.errors.map((e) => pc.red(`  ✗ ${e}`))
      : []),
    ...(result.warnings.length > 0
      ? result.warnings.map((w) => pc.yellow(`  ⚠ ${w}`))
      : []),
  ]));
  console.log();
}
