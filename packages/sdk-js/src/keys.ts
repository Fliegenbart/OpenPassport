import * as ed from "@noble/ed25519";

// Configure ed25519 to use Web Crypto SHA-512
ed.etc.sha512Async = async (...messages: Uint8Array[]): Promise<Uint8Array> => {
  const merged = concatBytes(...messages);
  const hash = await globalThis.crypto.subtle.digest("SHA-512", merged as unknown as BufferSource);
  return new Uint8Array(hash);
};

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const privateKey = ed.utils.randomPrivateKey();
  const publicKey = await ed.getPublicKeyAsync(privateKey);
  return { publicKey, privateKey };
}

export function publicKeyToBase64Url(key: Uint8Array): string {
  return base64UrlEncode(key);
}

export function base64UrlToBytes(encoded: string): Uint8Array {
  const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
  const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sign(data: Uint8Array, privateKey: Uint8Array): Promise<Uint8Array> {
  return ed.signAsync(data, privateKey);
}

export async function verify(
  signature: Uint8Array,
  data: Uint8Array,
  publicKey: Uint8Array,
): Promise<boolean> {
  try {
    return await ed.verifyAsync(signature, data, publicKey);
  } catch {
    return false;
  }
}
