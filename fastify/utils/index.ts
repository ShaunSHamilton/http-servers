import { ObjectId } from "@fastify/mongodb";
import { randomBytes, createHash } from "crypto";

export function base64URLEncode(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}
export const verifier = base64URLEncode(randomBytes(32));

function sha256(buf: Buffer) {
  return createHash("sha256").update(buf).digest();
}
export const challenge = base64URLEncode(sha256(Buffer.from(verifier)));

export function mineBitcoin() {
  // A computationally expensive operation (summing the first 10_000 primes)
  let sum = 0;
  for (let i = 2; i < 10_000; i++) {
    if (isPrime(i)) {
      sum += i;
    }
  }

  return sum;
}
function isPrime(n: number) {
  for (let i = 2; i < n; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

export interface User {
  _id: ObjectId;
  email: string;
  challengeFiles: ChallengeFile[];
}

export interface ChallengeFile {
  id: string;
  solution?: string;
  challengeType?: number;
  completedDate: number;
  files?: any[];
}
