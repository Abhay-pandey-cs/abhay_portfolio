const MIN_JWT_SECRET_BYTES = 32;

export function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  const encoded = new TextEncoder().encode(secret);
  return encoded.byteLength >= MIN_JWT_SECRET_BYTES ? encoded : null;
}
