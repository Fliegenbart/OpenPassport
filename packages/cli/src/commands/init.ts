import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import pc from "picocolors";
import { generateKeyPair, createPassport, base64UrlEncode } from "@openpassport/sdk";
import { box, field, STAMP } from "../ui.js";

export interface InitOptions {
  name: string;
  issuer: string;
  endpoint: string;
  capabilities: string;
  output?: string;
}

export async function init(options: InitOptions): Promise<void> {
  const capabilities = options.capabilities
    ? options.capabilities.split(",").map((c) => c.trim()).filter(Boolean)
    : [];

  console.log(pc.dim("\nGenerating Ed25519 keypair..."));
  const { publicKey, privateKey } = await generateKeyPair();

  console.log(pc.dim("Creating passport..."));
  const passport = await createPassport(
    {
      name: options.name,
      issuer: options.issuer,
      endpoint: options.endpoint,
      capabilities,
    },
    privateKey,
    publicKey,
  );

  const outDir = options.output ?? ".";
  const passportPath = resolve(outDir, "passport.json");
  const keyPath = resolve(outDir, "passport.key");

  writeFileSync(passportPath, JSON.stringify(passport, null, 2) + "\n");
  writeFileSync(keyPath, base64UrlEncode(privateKey) + "\n", { mode: 0o600 });

  console.log();
  console.log(box("PASSPORT CREATED", [
    field("ID", passport.id),
    field("Name", passport.name),
    field("Issuer", passport.issuer),
    field("Endpoint", passport.endpoint),
    field("Capabilities", capabilities.join(", ") || pc.dim("none")),
    field("Expires", passport.expiresAt),
    "",
    STAMP.verified + pc.dim(" — signature valid"),
  ]));

  console.log();
  console.log(pc.dim("Files written:"));
  console.log(`  ${pc.green("passport.json")}  → ${passportPath}`);
  console.log(`  ${pc.yellow("passport.key")}   → ${keyPath} ${pc.red("(keep secret!)")}`);

  console.log();
  console.log(pc.dim("Next steps:"));
  console.log(`  1. Serve ${pc.bold("passport.json")} at ${pc.cyan(options.issuer + "/.well-known/passport.json")}`);
  console.log(`  2. Use ${pc.bold("passport.key")} to sign messages with the SDK`);
  console.log(`  3. Verify with: ${pc.cyan("openpassport verify " + options.issuer)}`);
  console.log();
}
