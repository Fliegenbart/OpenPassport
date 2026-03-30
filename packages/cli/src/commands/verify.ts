import pc from "picocolors";
import { fetchPassport, verifyPassport, type Passport } from "@openpassport/sdk";
import { box, field, STAMP } from "../ui.js";

export async function verify(url: string): Promise<void> {
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
    return; // unreachable but helps TS narrow
  }

  console.log(pc.dim("Verifying..."));
  const result = await verifyPassport(passport);

  console.log();
  if (result.valid) {
    console.log(box("PASSPORT VERIFIED", [
      field("ID", passport.id),
      field("Name", passport.name),
      field("Issuer", passport.issuer),
      field("Endpoint", passport.endpoint),
      field("Capabilities", passport.capabilities.join(", ") || pc.dim("none")),
      field("Issued", passport.issuedAt),
      field("Expires", passport.expiresAt),
      field("Attestations", String(passport.attestations.length)),
      "",
      STAMP.verified + pc.dim(" — identity confirmed"),
    ]));
  } else {
    console.log(box("VERIFICATION FAILED", [
      field("ID", passport.id),
      field("Name", passport.name),
      "",
      ...result.errors.map((e) => pc.red(`  ✗ ${e}`)),
      "",
      STAMP.rejected,
    ]));
  }

  if (result.warnings.length > 0) {
    for (const w of result.warnings) {
      console.log(STAMP.warning + ` ${w}`);
    }
  }

  console.log();
  process.exit(result.valid ? 0 : 1);
}
