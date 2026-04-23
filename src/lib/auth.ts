import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set.");
  }
  return secret;
}

const COOKIE_NAME = "session";

export interface UserSession {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: UserSession): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserSession | null {
  try {
    const secret = getJwtSecret();
    return jwt.verify(token, secret) as UserSession;
  } catch (error) {
    return null;
  }
}

export function setSessionCookie(payload: UserSession) {
  const token = signToken(payload);
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export function removeSessionCookie() {
  return serialize(COOKIE_NAME, "", {
    maxAge: -1,
    path: "/",
  });
}
