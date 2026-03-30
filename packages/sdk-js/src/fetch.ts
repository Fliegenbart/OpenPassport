import { PassportSchema, type Passport } from "@openpassport/spec";

export async function fetchPassport(urlOrIssuer: string): Promise<Passport> {
  let url = urlOrIssuer;

  // If it looks like a domain/issuer URL without .well-known, append it
  if (!url.endsWith(".json") && !url.includes("/.well-known/")) {
    url = url.replace(/\/$/, "") + "/.well-known/passport.json";
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const parsed = PassportSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(
      `Invalid passport at ${url}: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
    );
  }

  return parsed.data;
}
