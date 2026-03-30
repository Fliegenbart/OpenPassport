/**
 * Deterministic JSON serialization for signing.
 * Produces identical bytes across JS and Python implementations.
 *
 * Rules:
 * 1. Remove excluded keys (default: "signature")
 * 2. Sort remaining keys alphabetically by Unicode code point
 * 3. Serialize with no whitespace
 * 4. Nested objects are also sorted recursively
 */
export function canonicalize(
  obj: Record<string, unknown>,
  excludeKeys: string[] = ["signature"],
): string {
  return JSON.stringify(sortKeys(obj, excludeKeys));
}

function sortKeys(
  value: unknown,
  excludeKeys: string[],
): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sortKeys(item, excludeKeys));
  }

  const obj = value as Record<string, unknown>;
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj)
    .filter((k) => !excludeKeys.includes(k))
    .sort();

  for (const key of keys) {
    sorted[key] = sortKeys(obj[key], []);
  }

  return sorted;
}
