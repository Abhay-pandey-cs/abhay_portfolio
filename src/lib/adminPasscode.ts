import { scrypt, timingSafeEqual } from 'node:crypto';

const HASH_ALGORITHM = 'scrypt';
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export function isValidAdminPasscodeHash(value: string): boolean {
  const [algorithm, salt, hash, extra] = value.split('$');
  return (
    extra === undefined &&
    algorithm === HASH_ALGORITHM &&
    new RegExp(`^[a-f\\d]{${SALT_BYTES * 2}}$`, 'i').test(salt ?? '') &&
    new RegExp(`^[a-f\\d]{${KEY_BYTES * 2}}$`, 'i').test(hash ?? '')
  );
}

export async function verifyAdminPasscode(passcode: string, encodedHash: string): Promise<boolean> {
  if (!isValidAdminPasscodeHash(encodedHash) || passcode.length > 1024) return false;

  const [, saltHex, hashHex] = encodedHash.split('$');
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const derived = await new Promise<Buffer>((resolve, reject) => {
    scrypt(passcode, salt, KEY_BYTES, SCRYPT_OPTIONS, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });

  return timingSafeEqual(derived, expected);
}
