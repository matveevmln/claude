import bcrypt from "bcryptjs";
import crypto from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Readable temp password for new-account emails — avoids ambiguous chars (0/O, 1/l/I). */
export function generateTempPassword(length = 10): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(length);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
