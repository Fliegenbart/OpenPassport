#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./commands/init.js";
import { verify } from "./commands/verify.js";
import { inspect } from "./commands/inspect.js";

const program = new Command();

program
  .name("openpassport")
  .description("The passport standard for AI agents")
  .version("0.1.0");

program
  .command("init")
  .description("Create a new agent passport")
  .requiredOption("-n, --name <name>", "Agent name")
  .requiredOption("-i, --issuer <url>", "Issuer URL (your domain)")
  .requiredOption("-e, --endpoint <url>", "Agent endpoint URL")
  .option("-c, --capabilities <list>", "Comma-separated capabilities", "")
  .option("-o, --output <dir>", "Output directory", ".")
  .action(init);

program
  .command("verify <url>")
  .description("Fetch and verify an agent passport")
  .action(verify);

program
  .command("inspect <url>")
  .description("Fetch and display detailed passport information")
  .action(inspect);

program.parse();
