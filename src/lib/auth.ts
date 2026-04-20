import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-use-env";
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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
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
