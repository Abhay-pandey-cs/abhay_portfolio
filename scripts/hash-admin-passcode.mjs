import { randomBytes, scryptSync } from 'node:crypto';
import { emitKeypressEvents } from 'node:readline';

if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== 'function') {
  console.error('Run this command in an interactive terminal so the passcode stays hidden.');
  process.exit(1);
}

const passcode = await new Promise((resolve, reject) => {
  let value = '';
  const stdin = process.stdin;
  const finish = (error) => {
    stdin.setRawMode(false);
    stdin.pause();
    process.stdout.write('\n');
    if (error) reject(error);
    else resolve(value);
  };

  process.stdout.write('New admin passcode (minimum 12 characters): ');
  emitKeypressEvents(stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('keypress', (character, key) => {
    if (key.ctrl && key.name === 'c') {
      finish(new Error('Passcode generation cancelled.'));
      return;
    }
    if (key.name === 'return') {
      finish();
      return;
    }
    if (key.name === 'backspace') {
      if (value.length) {
        value = value.slice(0, -1);
        process.stdout.write('\b \b');
      }
      return;
    }
    if (character && !key.ctrl && !key.meta) {
      value += character;
      process.stdout.write('*');
    }
  });
});

if (passcode.length < 12 || passcode.length > 1024) {
  console.error('Passcode must be between 12 and 1024 characters.');
  process.exit(1);
}

const salt = randomBytes(16);
const derived = scryptSync(passcode, salt, 64, {
  N: 16384,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
});
console.log(`ADMIN_PASSCODE_HASH=scrypt$${salt.toString('hex')}$${derived.toString('hex')}`);
console.log(`JWT_SECRET=${randomBytes(32).toString('base64')}`);
